import * as SQLite from "expo-sqlite";
import { type MatchReport, ScoutMatchReports } from "@/lib/db/models/ScoutMatchReport";

const DB_NAME = "sync";
let instance: Promise<SQLite.SQLiteDatabase> | SQLite.SQLiteDatabase = init();
async function init(): Promise<SQLite.SQLiteDatabase> {
    const db = await SQLite.openDatabaseAsync(DB_NAME);
    const { user_version } = (await db.getFirstAsync("PRAGMA user_version;")) as {
        user_version: number;
    };

    switch (user_version) {
        case 0:
            console.log(db.getAllSync("SELECT * FROM sqlite_master;"))
            await db.execAsync(`
                BEGIN TRANSACTION;
                CREATE TABLE match_reports
                (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    data TEXT NOT NULL
                ) STRICT;
                CREATE TABLE pit_reports
                (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    data TEXT NOT NULL
                ) STRICT;
                CREATE TABLE notes
                (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    data TEXT NOT NULL
                ) STRICT;
                COMMIT TRANSACTION;
            `);
            await db.execAsync("PRAGMA user_version = 1;");
        case 1:
            break;
        default:
            console.warn(`Unrecognized user_version ${user_version}; resetting database`);
            await db.closeAsync();
            await SQLite.deleteDatabaseAsync(DB_NAME);
            return init();
    }

    return (instance = db);
}

export namespace SyncStore {
    export async function createMatchReport(report: MatchReport) {
        const stmt = await (
            await instance
        ).prepareAsync("INSERT INTO match_reports(data) VALUES (?);");
        await stmt.executeAsync(JSON.stringify(report));
    }
    export async function deleteMatchReport(id: number) {
        const stmt = await (await instance).prepareAsync("DELETE FROM match_reports WHERE id = ?;");
        await stmt.executeAsync(id);
    }
    export async function getMatchReports(): Promise<{ id: number; report: MatchReport }[]> {
        const rows = await (
            await instance
        ).getAllAsync<{ id: number; data: string }>("SELECT * FROM match_reports;");
        return rows.map(({ id, data }) => ({
            id,
            report: JSON.parse(data),
        }));
    }
    export async function flushMatchReports() {
        for (let { id, report } of await getMatchReports()) {
            await ScoutMatchReports.submit(report);
            await deleteMatchReport(id);
        }
    }

    export async function clear() {
        console.log("clearing")
        await (await instance).closeAsync();
        await SQLite.deleteDatabaseAsync(DB_NAME);
        instance = await init();
    }
}
