import { ScoutMatchReports } from "@/lib/db/models/ScoutMatchReport";
import { Alliance } from "@/frc/common/common";

export interface TeamData {
    teamNumber: number;
    mean: number;
    standardDeviation: number;
}

export interface AlliancePrediction {
    alliance: Alliance;
    probability: number;
    mean: number;
    stdev: number;
}

export type MatchPredictionResults = AlliancePrediction[];

export namespace TeamAggregation {
    export function getStandardDeviation(array: number[]): number {
        if (array.length <= 1) {
            return 0;
        }
        const mean = getMean(array);
        const variance =
            array.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / array.length;
        return Math.sqrt(variance);
    }

    export function getMean(array: number[]): number {
        if (array.length === 0) {
            return 0;
        }
        const sum = array.reduce((acc, val) => acc + val, 0);
        return sum / array.length;
    }

    export async function getWinPrediction(
        teams: number[],
        competitionId: number,
        chosenQuestionIndices: number[],
    ): Promise<MatchPredictionResults> {
        const teamsWithData = await getProcessedDataForTeams(
            teams,
            competitionId,
            chosenQuestionIndices,
        );
        return calculateFinalWinner(teams, teamsWithData);
    }

    export async function getNumReportsPerTeam(
        teams: number[],
        competitionId: number,
    ): Promise<number[]> {
        const reportCounts = await Promise.all(
            teams.map(async (team) => {
                const reports = await ScoutMatchReports.getAllForTeam(team, competitionId);
                return reports.length;
            }),
        );
        return reportCounts;
    }

    function createArrayFromIndices(reports: number[][], indices: number[]): number[] {
        return reports.map((report) => {
            return indices.reduce((sum, index) => sum + (report[index] || 0), 0);
        });
    }

    function poz(z: number): number {
        const p = 0.3275911;
        const a1 = 0.254829592;
        const a2 = -0.284496736;
        const a3 = 1.421413741;
        const a4 = -1.453152027;
        const a5 = 1.061405429;

        const sign = z >= 0 ? 1 : -1;
        const absZ = Math.abs(z) / Math.sqrt(2.0);

        const t = 1.0 / (1.0 + p * absZ);
        const y =
            1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-absZ * absZ);

        return 0.5 * (1.0 + sign * y);
    }

    function determineWinner(
        blueMean: number,
        blueStdev: number,
        redMean: number,
        redStdev: number,
    ): MatchPredictionResults {
        if (blueMean === 0) {
            return [
                { alliance: Alliance.blue, probability: 0, mean: 0, stdev: blueStdev },
                { alliance: Alliance.red, probability: 100, mean: redMean, stdev: redStdev },
            ];
        }
        if (redMean === 0) {
            return [
                { alliance: Alliance.blue, probability: 100, mean: blueMean, stdev: blueStdev },
                { alliance: Alliance.red, probability: 0, mean: 0, stdev: redStdev },
            ];
        }

        if (blueMean === redMean && blueStdev === redStdev) {
            return [
                { alliance: Alliance.blue, probability: 50, mean: blueMean, stdev: blueStdev },
                { alliance: Alliance.red, probability: 50, mean: redMean, stdev: redStdev },
            ];
        }

        const meanDiff = blueMean - redMean;
        const stdevVariance = Math.sqrt(Math.pow(blueStdev, 2) + Math.pow(redStdev, 2));

        if (stdevVariance === 0) {
            return [
                { alliance: Alliance.blue, probability: 0, mean: blueMean, stdev: blueStdev },
                { alliance: Alliance.red, probability: 0, mean: redMean, stdev: redStdev },
            ];
        }

        const zScore = meanDiff / stdevVariance;
        const probBlue = poz(zScore);

        return [
            {
                alliance: Alliance.blue,
                probability: Math.round(probBlue * 100),
                mean: blueMean,
                stdev: blueStdev,
            },
            {
                alliance: Alliance.red,
                probability: Math.round((1 - probBlue) * 100),
                mean: redMean,
                stdev: redStdev,
            },
        ];
    }

    function calculateFinalWinner(
        teams: number[],
        teamsWithData: TeamData[],
    ): MatchPredictionResults {
        let blueMean = 0;
        let redMean = 0;
        let blueStdevSquared = 0;
        let redStdevSquared = 0;

        for (let i = 0; i < teams.length; i++) {
            const foundTeam = teamsWithData.find((t) => t.teamNumber === teams[i]);
            if (i < 3) {
                redMean += foundTeam?.mean || 0;
                redStdevSquared += Math.pow(foundTeam?.standardDeviation || 0, 2);
            } else {
                blueMean += foundTeam?.mean || 0;
                blueStdevSquared += Math.pow(foundTeam?.standardDeviation || 0, 2);
            }
        }

        return determineWinner(
            blueMean,
            Math.sqrt(blueStdevSquared),
            redMean,
            Math.sqrt(redStdevSquared),
        );
    }

    async function getProcessedDataForTeams(
        teams: number[],
        competitionId: number,
        chosenQuestionIndices: number[],
    ): Promise<TeamData[]> {
        const processedData = await Promise.all(
            teams.map(async (team) => {
                const reports = await ScoutMatchReports.getAllForTeam(team, competitionId);
                if (reports.length === 0) return null;

                const data = createArrayFromIndices(
                    reports.map((r) => r.data),
                    chosenQuestionIndices,
                );
                return {
                    teamNumber: team,
                    mean: getMean(data),
                    standardDeviation: getStandardDeviation(data),
                };
            }),
        );

        return processedData.filter((d): d is TeamData => d !== null);
    }
}
