import { supabase } from "@/lib/supabase";
import { decode } from "base64-arraybuffer";
import { UserAttributesDB } from "./UserAttributes";

export interface PitReport {
    reportId: number;
    teamNumber: number;
    data: any[];
    competitionId: number;
}

export type PitReportWithoutId = Omit<PitReport, "reportId">;

export interface PitReportWithDate extends PitReport {
    createdAt: Date;
}

export interface PitReportReturnData extends PitReportWithDate {
    formStructure: any[];
    competitionName: string;
    submittedId: string;
    submittedName: string;
    imageUrls?: string[];
}

export type PitReportWithoutIdWithDate = Omit<PitReportWithDate, "reportId">;

export class PitReportsDB {
    /**
     * Upload images for a pit scout report
     * @param teamId
     * @param reportId
     * @param images
     */
    static async uploadImages(teamId: number, reportId: number, images: string[]) {
        const orgId = (await UserAttributesDB.getCurrentUserAttribute()).organization_id;
        const bucket = supabase.storage.from("organizations");
        for (let i = 0; i < images.length; i++) {
            // https://github.com/NiketanG/instaclone/blob/main/src/app/utils/uploadToSupabase.ts
            const base64Image = images[i];
            const base64Str = base64Image.includes("base64,")
                ? base64Image.substring(base64Image.indexOf("base64,") + "base64,".length)
                : base64Image;
            const res = decode(base64Str);

            const { error } = await bucket.upload(
                `${orgId}/${teamId}/pit_images/${reportId}/${i}.jpg`,
                res,
                {
                    contentType: "image/jpg",
                },
            );
            if (error) {
                throw error;
            }
        }
    }

    /**
     * Creates a new pit scout report
     * @param report
     * @param images - an array of base64 encoded images
     */
    static async createOnlinePitScoutReport(report: PitReportWithoutId, images: string[]) {
        const { data: user } = await supabase.auth.getUser();
        const { data: returnData, error } = await supabase
            .from("pit_scout_reports")
            .insert({
                team_id: report.teamNumber,
                user_id: user.user?.id,
                data: report.data,
                competition_id: report.competitionId,
                online: true,
            })
            .select("id")
            .single();
        if (error) {
            throw error;
        }
        await this.uploadImages(report.teamNumber, returnData.id, images);
    }

    /**
     * Creates a new pit scout report
     */
    static async createOfflinePitScoutReport(report: PitReportWithoutIdWithDate, images: string[]) {
        const { data: user } = await supabase.auth.getUser();
        const { data: returnData, error } = await supabase
            .from("pit_scout_reports")
            .insert({
                team_id: report.teamNumber,
                user_id: user.user?.id,
                data: report.data,
                competition_id: report.competitionId,
                created_at: report.createdAt,
                online: false,
            })
            .select("id")
            .single();
        if (error) {
            throw error;
        }
        await this.uploadImages(report.teamNumber, returnData.id, images);
    }

    /**
     * Gets all pit scout reports for a team
     * @param teamId
     * @param competitionId
     */
    static async getReportsForTeamAtCompetition(
        teamId: number,
        competitionId: number,
    ): Promise<PitReportReturnData[]> {
        const { data, error } = await supabase
            .from("pit_scout_reports")
            .select(
                "id, data, created_at, competitions(forms!competitions_pit_scout_form_id_fkey(form_structure), id, name), profiles(name, id)",
            )
            .eq("team_id", teamId)
            .eq("competition_id", competitionId);
        if (error) {
            throw error;
        }
        return data.map((report) => ({
            reportId: report.id,
            teamNumber: teamId,
            data: report.data,
            competitionId: report.competitions.id,
            createdAt: new Date(report.created_at),
            formStructure: report.competitions.forms.form_structure,
            competitionName: report.competitions.name,
            submittedName: report.profiles.name,
            submittedId: report.profiles.id,
        }));
    }

    /**
     * Gets images for a pit scout report
     * @param teamId
     * @param reportId
     */
    static async getImagesForReport(teamId: number, reportId: number) {
        const orgId = (await UserAttributesDB.getCurrentUserAttribute()).organization_id;
        const bucket = supabase.storage.from("organizations");
        const { data: images, error } = await bucket.list(
            `${orgId}/${teamId}/pit_images/${reportId}`,
        );
        if (error) {
            throw error;
        }
        console.log("images", images);
        const resultingImages: string[] = [];
        for (let i = 0; i < images.length; i++) {
            const { data, error } = await bucket.download(
                `${orgId}/${teamId}/pit_images/${reportId}/${images[i].name}`,
            );
            if (error) {
                throw error;
            }
            const reader = new FileReader();
            reader.readAsDataURL(data as Blob);
            reader.onloadend = () => {
                const base64data = reader.result;
                resultingImages.push(base64data as string);
            };
        }
        return resultingImages;
    }

    static async getImageUrlsForReport(orgId: number, teamId: number, reportId: number) {
        const bucket = supabase.storage.from("organizations");
        const { data: images, error } = await bucket.list(
            `${orgId}/${teamId}/pit_images/${reportId}`,
        );
        if (error) {
            throw error;
        }
        if (images.length === 0) {
            return [];
        }
        const { data: urls, error: urlError } = await bucket.createSignedUrls(
            images.map((image) => `${orgId}/${teamId}/pit_images/${reportId}/${image.name}`),
            60 * 60 * 24,
        );
        if (urlError) {
            throw urlError;
        }
        return urls.map((url) => url.signedUrl);
    }

    static async getReportsForCompetition(competitionId: number): Promise<PitReportReturnData[]> {
        const { data, error } = await supabase
            .from("pit_scout_reports")
            .select(
                "id, team_id, data, created_at, competitions(forms!competitions_pit_scout_form_id_fkey(form_structure), id, name), profiles(name, id)",
            )
            .eq("competition_id", competitionId);
        if (error) {
            throw error;
        }
        const imageUrls = await Promise.all(
            data.map(async (report) =>
                this.getImageUrlsForReport(
                    (await UserAttributesDB.getCurrentUserAttribute()).organization_id,
                    report.team_id,
                    report.id,
                ),
            ),
        );
        return data.map((report) => ({
            reportId: report.id,
            teamNumber: report.team_id,
            data: report.data,
            competitionId: report.competitions.id,
            createdAt: new Date(report.created_at),
            formStructure: report.competitions.forms.form_structure,
            competitionName: report.competitions.name,
            submittedName: report.profiles.name,
            submittedId: report.profiles.id,
            imageUrls: imageUrls.shift(),
        }));
    }
}
