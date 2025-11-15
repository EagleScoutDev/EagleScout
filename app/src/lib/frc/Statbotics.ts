export class StatboticsAPI {
    private static readonly APIv3 = "https://api.statbotics.io/v3";
    private static readonly APIv2 = "https://api.statbotics.io/v2";
    private static readonly YEAR = new Date().getFullYear();

    public static async getTeam(team: number) {
        return await fetch(`${this.APIv3}/team/${team}`)
            .then((res) => res.json())
            .catch((err) => {
                console.error("Error fetching statbotics team:", err);
                return undefined;
            });
    }

    public static async getTeamYear(team: number) {
        return await fetch(`${this.APIv3}/team_year/${team}/${this.YEAR}`)
            .then((res) => res.json())
            .catch((err) => {
                console.error("Error fetching statbotics team year:", err);
                return undefined;
            });
    }

    public static async getTeamCompetitions(team: number) {
        return await fetch(`${this.APIv2}/team_events/team/${team}/year/${this.YEAR}`)
            .then((res) => res.json())
            .catch((err) => {
                console.error("Error fetching statbotics team events:", err);
                return undefined;
            });
    }

    public static async getTeamEvent(team: number, event: string) {
        return await fetch(`${this.APIv3}/team_event/${team}/${event}`).then((res) => res.json());
    }

    public static async getTeamEvents(team: number) {
        return await fetch(`${this.APIv3}/team_events?team=${team}&year=${this.YEAR}`)
            .then((res) => res.json())
            .then((res) => res.map((evt: any) => evt));
    }
}
