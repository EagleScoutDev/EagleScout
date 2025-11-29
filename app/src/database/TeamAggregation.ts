/**
 * This class is responsible for aggregating data for a team at a competition.
 * It does not make database calls, but rather, processes data retrieved from other APIs.
 *
 * */
import { Alliance } from "../frc/reefscape/field";
import { MatchReportsDB } from "./ScoutMatchReports";

interface TeamWithData {
    team_number: number;
    mean: number;
    stdev: number;
}

interface AlliancePrediction {
    alliance: Alliance;
    probability: number;
    mean: number;
    stdev: number;
}

// alias
export type MatchPredictionResults = AlliancePrediction[];

export class TeamAggregation {
    /**
     * This function calculates the average value of a given array.
     * @param array The array to calculate the average of.
     * @returns The average value of the array.
     */
    // from: https://stackoverflow.com/questions/7343890/standard-deviation-javascript
    static getStandardDeviation(array: number[]) {
        if (array.length === 0 || array.length === 1) {
            console.log("get standard deviation called with empty array");
            return 0;
        }
        const n = array.length;
        const mean = this.getMean(array);
        return Math.sqrt(array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / n);
    }

    static getMean(array: number[]) {
        if (array.length === 0) {
            console.warn("get mean called with empty array");
            return 0;
        }
        let sum = 0;

        for (let i = 0; i < array.length; i++) {
            sum += array[i];
        }

        console.log("calculated mean: ", sum / array.length, "from array:", array);
        return sum / array.length;
    }

    /**
     * Given a list of teams, a competition, and a list of questions, return the probability of each alliance winning.
     * @param teams
     * @param compId
     * @param chosenQuestionIndices
     */
    static async getWinPrediction(teams: number[], compId: number, chosenQuestionIndices: number[]) {
        let teamsWithData: TeamWithData[] = await this.getProcessedDataForTeams(teams, compId, chosenQuestionIndices);

        return this.finalWinnerCalculation(teams, teamsWithData);
    }

    static getNumReportsPerTeam = async (teams: number[], compId: number) => {
        let tempNumReports: number[] = [];
        for (let i = 0; i < teams.length; i++) {
            const reports = await MatchReportsDB.getReportsForTeamAtCompetition(teams[i], compId);
            tempNumReports.push(reports.length);
        }
        return tempNumReports;
    };

    /**
     * This function returns a sum.
     * @param reports an array of arrays of numbers to process
     * @param indices an array of indices to include in the calculation
     * @returns a sum of the values at the given indices
     */
    private static createArrayFromIndices(reports: number[][], indices: number[]) {
        if (reports.length === 0) {
            console.warn("createArrayFromIndices called with empty reports array");
        }
        const matches: number[] = [];
        for (let i = 0; i < reports.length; i += 1) {
            let sum = 0;
            for (let j = 0; j < reports[i].length; j += 1) {
                if (indices.includes(j)) {
                    sum += reports[i][j];
                }
            }
            matches.push(sum);
        }

        console.log("matches:", matches);

        return matches;
    }

    // given a z-score, return the probability of the value being less than that z-score
    private static poz(z: number) {
        const p: number = 0.3275911;
        const a1: number = 0.254829592;
        const a2: number = -0.284496736;
        const a3: number = 1.421413741;
        const a4: number = -1.453152027;
        const a5: number = 1.061405429;

        // Save the sign of z
        const sign = z >= 0 ? 1 : -1;
        z = Math.abs(z) / Math.sqrt(2.0);

        // Calculate A&S formula 7.1.26
        const t = 1.0 / (1.0 + p * z);
        const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-z * z);

        return 0.5 * (1.0 + sign * y);
    }

    /**
     * Given some statistics about the alliance, determine the winner.
     * @param blueMean average score of blue alliance
     * @param blueStdev sum of squares of the stdev per team in the blue alliance
     * @param redMean average score of red alliance
     * @param redStdev sum of squares of the stdev per team in the red alliance
     * @return an array of objects with the alliance and the probability of winning
     */
    private static determineWinner(
        blueMean: number,
        blueStdev: number,
        redMean: number,
        redStdev: number
    ): MatchPredictionResults {
        if (blueMean === 0) {
            // console.warn('determineWinner called with blueMean of 0');
            return [
                {
                    alliance: Alliance.blue,
                    probability: 0,
                    mean: 0,
                    stdev: blueStdev,
                },
                {
                    alliance: Alliance.red,
                    probability: 1,
                    mean: redMean,
                    stdev: redStdev,
                },
            ];
        }
        if (redMean === 0) {
            // console.warn('determineWinner called with redMean of 0');
            return [
                {
                    alliance: Alliance.blue,
                    probability: 1,
                    mean: blueMean,
                    stdev: blueStdev,
                },
                {
                    alliance: Alliance.red,
                    probability: 0,
                    mean: 0,
                    stdev: redStdev,
                },
            ];
        }

        if (blueMean === redMean && blueStdev === redStdev) {
            return [
                {
                    alliance: Alliance.blue,
                    probability: 0.5,
                    mean: blueMean,
                    stdev: blueStdev,
                },
                {
                    alliance: Alliance.red,
                    probability: 0.5,
                    mean: redMean,
                    stdev: redStdev,
                },
            ];
        }

        const meanDiff = blueMean - redMean;
        const diffVariance = blueStdev + redStdev;
        const stdevVariance = diffVariance ** 0.5;

        if (stdevVariance === 0) {
            // console.warn('determineWinner called with stdevVariance of 0');
            return [
                {
                    alliance: Alliance.blue,
                    probability: 0.0,
                    mean: blueMean,
                    stdev: blueStdev,
                },
                {
                    alliance: Alliance.red,
                    probability: 0.0,
                    mean: redMean,
                    stdev: redStdev,
                },
            ];
        }
        const zScore = meanDiff / stdevVariance;

        const probBlue = this.poz(zScore);

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

    private static finalWinnerCalculation = (teamsWithoutData: number[], teamsWithData: TeamWithData[]) => {
        let blueMean = 0;
        let redMean = 0;

        let blueStdev = 0;
        let redStdev = 0;

        for (let i = 0; i < teamsWithoutData.length; i++) {
            let foundTeam = teamsWithData.find((a) => a.team_number === teamsWithoutData[i]);
            console.log("found team: " + foundTeam);
            if (i < 3) {
                redMean += foundTeam?.mean || 0;
                redStdev += (foundTeam?.stdev || 0) ** 2;
            } else {
                blueMean += foundTeam?.mean || 0;
                blueStdev += (foundTeam?.stdev || 0) ** 2;
            }
        }

        return TeamAggregation.determineWinner(blueMean, blueStdev, redMean, redStdev);
    };

    private static getProcessedDataForTeams = async (
        teamsWithoutData: number[],
        compId: number,
        chosenQuestionIndices: number[]
    ): Promise<TeamWithData[]> => {
        let temp: TeamWithData[] = [];
        let tempNumReports: number[] = [];
        for (let i = 0; i < teamsWithoutData.length; i++) {
            const reports = await MatchReportsDB.getReportsForTeamAtCompetition(teamsWithoutData[i], compId);
            if (reports.length !== 0) {
                let data = TeamAggregation.createArrayFromIndices(
                    reports.map((a) => a.data),
                    chosenQuestionIndices
                );
                temp.push({
                    team_number: teamsWithoutData[i],
                    mean: TeamAggregation.getMean(data),
                    stdev: TeamAggregation.getStandardDeviation(data),
                });
            }
            tempNumReports.push(reports.length);
        }
        console.log("temp: " + temp);
        return temp;
    };
}
