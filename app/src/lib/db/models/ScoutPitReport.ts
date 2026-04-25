import { supabase } from "@/lib/supabase";
import { Account } from "@/lib/db/account";
import { decode } from "base64-arraybuffer";

export interface PitReport {
    teamNumber: number;
    data: any[];
    competitionId: number;

    createdAt: Date;
}

export interface PitReportReturnData extends PitReport {
    reportId: number;

    formStructure: any[];
    competitionName: string;
    submittedId: string;
    submittedName: string;
    imageUrls?: string[];
}

export namespace ScoutPitReports {
    const reportQuery = () =>
        supabase.from("pit_scout_reports").select(`
            reportId:   id,
            teamNumber: team_id,
            data,
            createdAt:  created_at,
            ...competitions(
                competitionId:      id,
                competitionName:    name,
                ...forms!competitions_pit_scout_form_id_fkey(
                    formStructure:  form_structure
                )
            ),
            ...profiles(
                submittedName:  name,
                submittedId:    id
            )
        `);

    export async function getAllForTeam(
        teamNumber: number,
        competitionId: number,
    ): Promise<PitReportReturnData[]> {
        const { data, error } = await reportQuery()
            .eq("team_id", teamNumber)
            .eq("competition_id", competitionId);
        if (error) throw error;

        return data.map((report) => ({
            ...report,
            createdAt: new Date(report.createdAt),
        }));
    }

    // FIXME: impure queries are below

    export async function getImageUrls(
        organizationId: number,
        teamNumber: number,
        reportId: number,
    ): Promise<string[]> {
        const bucket = supabase.storage.from("organizations");
        const { data: images, error } = await bucket.list(
            `${organizationId}/${teamNumber}/pit_images/${reportId}`,
        );
        if (error) throw error;
        if (images.length === 0) return [];

        const { data: urls, error: urlError } = await bucket.createSignedUrls(
            images.map(
                (img) =>
                    `${organizationId}/${teamNumber}/pit_images/${reportId}/${img.name}`,
            ),
            60 * 60 * 24,
        );
        if (urlError) throw urlError;

        return urls.map((u) => u.signedUrl);
    }

    export async function getAllForComp(
        competitionId: number,
    ): Promise<PitReportReturnData[]> {
        const { data, error } = await reportQuery().eq(
            "competition_id",
            competitionId,
        );
        if (error) throw error;

        const { orgId } = await Account.ensure();

        return await Promise.all(
            data.map(async (report) => ({
                ...report,
                createdAt: new Date(report.createdAt),
                imageUrls: await getImageUrls(
                    orgId,
                    report.teamNumber,
                    report.reportId,
                ),
            })),
        );
    }

    export async function getImages(
        teamNumber: number,
        reportId: number,
    ): Promise<string[]> {
        const { orgId } = await Account.ensure();
        const bucket = supabase.storage.from("organizations");
        const { data: images, error } = await bucket.list(
            `${orgId}/${teamNumber}/pit_images/${reportId}`,
        );
        if (error) throw error;

        const { data: urls, error: signedError } =
            await bucket.createSignedUrls(
                images.map(
                    (img) =>
                        `${orgId}/${teamNumber}/pit_images/${reportId}/${img.name}`,
                ),
                60 * 5,
            );
        if (signedError) throw signedError;

        return urls?.map((u) => u.signedUrl) ?? [];
    }

    async function uploadImages(teamId: number, reportId: number, images: string[]): Promise<void> {
        const { orgId } = await Account.ensure();
        const bucket = supabase.storage.from("organizations");
        for (let i = 0; i < images.length; i++) {
            const base64Image = images[i];
            const base64Str = base64Image.includes("base64,")
                ? base64Image.substring(base64Image.indexOf("base64,") + "base64,".length)
                : base64Image;
            const res = decode(base64Str);

            const { error } = await bucket.upload(
                `${orgId}/${teamId}/pit_images/${reportId}/${i}.jpg`,
                res,
                { contentType: "image/jpg" },
            );
            if (error) throw error;
        }
    }

    export async function create(report: PitReport, images: string[]): Promise<number> {
        const { data: user } = await supabase.auth.getUser();
        const { data: returnData, error } = await supabase
            .from("pit_scout_reports")
            .insert({
                team_id: report.teamNumber,
                user_id: user.user?.id,
                data: report.data,
                competition_id: report.competitionId,
            })
            .select("id")
            .single();
        if (error) throw error;
        await uploadImages(report.teamNumber, returnData.id, images);

        return returnData.id;
    }
}
