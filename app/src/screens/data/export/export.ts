import { Alert } from "react-native";
import { CSVBuilder } from "../../../lib/csv";
import RNFS from "react-native-fs";
import Share from "react-native-share";
import { type MatchReportReturnData, MatchReportsDB } from "../../../database/ScoutMatchReports";
import type { CompetitionReturnData } from "../../../database/Competitions";
import { type PitReportReturnData, PitReportsDB } from "../../../database/ScoutPitReports";

export async function exportScoutReportsToCsv(comp: CompetitionReturnData) {
    let reports: MatchReportReturnData[];
    try {
        reports = await MatchReportsDB.getReportsForCompetition(comp.id, true);
    } catch (error) {
        console.error(error);
        Alert.alert(
            "Error",
            "An error occurred while fetching the reports for the competition. Try reloading the app."
        );
        return;
    }

    const csvBuilder = new CSVBuilder();

    csvBuilder.addHeader("user id", "user name", "match number", "team number");
    comp.form.forEach((q) => {
        if (q.type === "radio" || q.type === "textbox" || q.type === "number" || q.type === "checkboxes") {
            csvBuilder.addHeader(q.question);
        }
    });

    reports.forEach((report) => {
        const row = [];
        row.push(report.userId);
        row.push(report.userName);
        row.push(report.matchNumber);
        row.push(report.teamNumber);
        comp.form.forEach((q, i) => {
            if (q.type === "radio") {
                row.push(q.options[report.data[i]]);
            } else if (q.type === "number") {
                row.push(report.data[i]);
            } else if (q.type === "textbox") {
                row.push(`"${report.data[i]}"`);
            } else if (q.type === "checkboxes") {
                row.push('"' + report.data[i].join(",") + '"');
            }
        });
        csvBuilder.addRow(row);
    });

    return csvBuilder.build();
}

export async function exportPitReportsToCsv(comp: CompetitionReturnData) {
    let reports: PitReportReturnData[];
    try {
        reports = await PitReportsDB.getReportsForCompetition(comp.id);
    } catch (error) {
        console.error(error);
        Alert.alert(
            "Error",
            "An error occurred while fetching the reports for the competition. Try reloading the app."
        );
        return;
    }

    const csvBuilder = new CSVBuilder();

    csvBuilder.addHeader("user id", "user name", "team number");
    comp.pitScoutFormStructure.forEach((q) => {
        if (q.type === "radio" || q.type === "textbox" || q.type === "number" || q.type === "checkboxes") {
            csvBuilder.addHeader(q.question);
        }
    });
    csvBuilder.addHeader("images");

    reports.forEach((report) => {
        const row = [];
        row.push(report.submittedId);
        row.push(report.submittedName);
        row.push(report.teamNumber);
        comp.pitScoutFormStructure.forEach((q, i) => {
            if (q.type === "radio") {
                row.push(q.options[report.data[i]]);
            } else if (q.type === "number") {
                row.push(report.data[i]);
            } else if (q.type === "textbox") {
                row.push(`"${report.data[i]}"`);
            } else if (q.type === "checkboxes") {
                if (report.data[i]) {
                    row.push('"' + report.data[i].join(",") + '"');
                } else {
                    row.push('""');
                }
            }
        });
        row.push(report.imageUrls!.join(","));
        csvBuilder.addRow(row);
    });

    return csvBuilder.build();
}

export async function writeToFile(name: string, content: string) {
    let path = RNFS.CachesDirectoryPath + `/${name}`;
    try {
        await RNFS.writeFile(path, content, "utf8");
        try {
            await Share.open({
                url: `file://${path}`,
            });
            try {
                await RNFS.unlink(path);
                console.log("Deleted file");
            } catch (err) {
                console.error("Error deleting file: " + err);
            }
        } catch {
            try {
                await RNFS.unlink(path);
                console.log("Deleted file");
            } catch (err) {
                console.error("Error deleting file: " + err);
            }
        }
    } catch (err) {
        Alert.alert(
            "Error",
            "An error occurred while writing the export file. Please make sure the app has the necessary permissions."
        );
        console.log(err);
    }
}
