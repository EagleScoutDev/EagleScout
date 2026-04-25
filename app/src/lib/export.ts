import { Alert } from "react-native";
import { type MatchReportReturnData } from "@/lib/db/models/ScoutMatchReport";
import type { CompetitionReturnData } from "@/lib/db/models/Competition";
import { type PitReportReturnData } from "@/lib/db/models/ScoutPitReport";
import Sharing from "expo-sharing";
import FS, { Paths } from "expo-file-system";
import { CSVBuilder } from "@/lib/csv";
import { Form } from "@/lib/forms";
import { queryClient } from "@/lib/queryClient";
import { queries } from "@/lib/queries";

export async function exportScoutReportsToCsv(comp: CompetitionReturnData) {
    let reports: MatchReportReturnData[];
    try {
        reports = await queryClient.fetchQuery(queries.matchReports.forComp({ id: comp.id }));
    } catch (error) {
        console.error(error);
        Alert.alert(
            "Error",
            "An error occurred while fetching the reports for the competition. Try reloading the app.",
        );
        return;
    }

    return new CSVBuilder()
        .header("user id", "user name", "match number", "team number")
        .header(...comp.form.filter(Form.Item.isQuestion).map((q) => q.question))
        .map(reports, (report) => [
            report.userId,
            report.userName,
            report.matchNumber,
            report.teamNumber,
            ...comp.form.map((q, i) => {
                switch (q.type) {
                    case Form.ItemType.radio:
                        return q.options[report.data[i]];
                    case Form.ItemType.number:
                        return report.data[i];
                    case Form.ItemType.textbox:
                        return `"${report.data[i]}"`;
                    case Form.ItemType.checkbox:
                        return `"${report.data[i].join(",")}"`;
                }
            }),
        ])
        .build();
}

export async function exportPitReportsToCsv(comp: CompetitionReturnData) {
    let reports: PitReportReturnData[];
    try {
        reports = await queryClient.fetchQuery(queries.pitReports.forComp({ compId: comp.id }));
    } catch (error) {
        console.error(error);
        Alert.alert(
            "Error",
            "An error occurred while fetching the reports for the competition. Try reloading the app.",
        );
        return;
    }

    return new CSVBuilder()
        .header("user id", "user name", "team number")
        .header(...comp.pitScoutFormStructure.filter(Form.Item.isQuestion).map((q) => q.question))
        .header("images")
        .map(reports, (report) => [
            report.submittedId,
            report.submittedName,
            report.teamNumber,
            ...comp.pitScoutFormStructure.map((q, i) => {
                switch (q.type) {
                    case Form.ItemType.radio:
                        return q.options[report.data[i]];
                    case Form.ItemType.number:
                        return report.data[i];
                    case Form.ItemType.textbox:
                        return `"${report.data[i]}"`;
                    case Form.ItemType.checkbox:
                        return `"${report.data[i].join(",")}"`;
                }
            }),
            report.imageUrls!.join(","),
        ])
        .build();
}

export async function writeToFile(name: string, content: string) {
    let f = new FS.File(Paths.cache, name);
    try {
        f.create();
        try {
            f.write(content);
            await Sharing.shareAsync(f.uri);
            try {
                f.delete();
                console.log("Deleted file");
            } catch (err) {
                console.error("Error deleting file: " + err);
            }
        } catch {
            try {
                f.delete();
                console.log("Deleted file");
            } catch (err) {
                console.error("Error deleting file: " + err);
            }
        }
    } catch (err) {
        Alert.alert(
            "Error",
            "An error occurred while writing the export file. Please make sure the app has the necessary permissions.",
        );
        console.log(err);
    }
}
