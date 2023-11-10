export interface SimpleEvent {
  rank: number | null;
  key: string;
  name: string;
  event_code: string;
  event_type: number;
  district: {
    abbreviation: string;
    display_name: string;
    key: string;
    year: number;
  };
  city: string;
  state_prov: string;
  country: string;
  start_date: string;
  end_date: string;
  year: number;
}

export interface SimpleTeam {
  key: string;
  team_number: number;
  nickname: string;
  name: string;
  city: string;
  state_prov: string;
  country: string;
}

export interface SimpleEvent {
  key: string;
  name: string;
  event_code: string;
  event_type: number;
  district: {
    abbreviation: string;
    display_name: string;
    key: string;
    year: number;
  };
  city: string;
  state_prov: string;
  country: string;
  start_date: string;
  end_date: string;
  year: number;
}

export class TBA {
  constructor() {
    // TODO
  }

  static async getEventsForYear(year: number): Promise<SimpleEvent[]> {
    const response = await fetch(
      `https://www.thebluealliance.com/api/v3/events/${year}/simple`,
      {
        headers: {
          'X-TBA-Auth-Key':
            'mJ3UfsR5M1wWACNoathXjF9U3FJZgSCArPNzHmdiB0olLTYItAUbvGiVB6L1XSjq',
        },
      },
    );

    return await response.json();
  }

  static async getTeamsAtCompetition(comp_id: string): Promise<SimpleTeam[]> {
    const response = await fetch(
      `https://www.thebluealliance.com/api/v3/event/${comp_id}/teams/simple`,
      {
        headers: {
          'X-TBA-Auth-Key':
            'mJ3UfsR5M1wWACNoathXjF9U3FJZgSCArPNzHmdiB0olLTYItAUbvGiVB6L1XSjq',
        },
      },
    );
    return await response.json();
  }

  /**
   * Returns the rank of the team at the competition
   * @param comp_id the competition id
   * @param team_number the team number
   * @returns the rank of the team at the competition, or -1 if the competition has not taken place yet, or -2 if the team is not ranked
   */
  static async getTeamRank(
    comp_id: string,
    team_number: number,
  ): Promise<number> {
    const response = await fetch(
      `https://www.thebluealliance.com/api/v3/team/frc${team_number}/event/${comp_id}/status`,

      {
        headers: {
          'X-TBA-Auth-Key':
            'mJ3UfsR5M1wWACNoathXjF9U3FJZgSCArPNzHmdiB0olLTYItAUbvGiVB6L1XSjq',
        },
      },
    );

    // looks sketch, but it's not
    if (!response.ok) {
      console.error('Network response was not ok:', response.status);
      return -1;
    }
    const data = await response.json();
    console.log('data response', data);

    // this means that the competition has not taken place yet
    if (data === null) {
      return -1;
    }

    // if the qualification ranking is null, then the team is not ranked
    if (data.qual == null) {
      return -2;
    }

    return data.qual.ranking.rank;
  }

  static async getCurrentCompetitionForTeam(
    team_number: number,
  ): Promise<SimpleEvent> {
    const current_year = new Date().getFullYear();
    const response = await fetch(
      `https://www.thebluealliance.com/api/v3/team/frc${team_number}/events/${current_year}/simple`,
      {
        headers: {
          'X-TBA-Auth-Key':
            'mJ3UfsR5M1wWACNoathXjF9U3FJZgSCArPNzHmdiB0olLTYItAUbvGiVB6L1XSjq',
        },
      },
    );
    const data = await response.json();
    const current_date = new Date();
    for (let i = 0; i < data.length; i++) {
      const start_date = new Date(data[i].start_date);
      const end_date = new Date(data[i].end_date);
      if (current_date > start_date && current_date < end_date) {
        return data[i];
      }
    }
    // else, return the last one
    return data[data.length - 1];
  }

  static async getAllCompetitionsForTeam(
    team_number: number,
  ): Promise<SimpleEvent[]> {
    const current_year = new Date().getFullYear();
    const response = await fetch(
      `https://www.thebluealliance.com/api/v3/team/frc${team_number}/events/${current_year}/simple`,
      {
        headers: {
          'X-TBA-Auth-Key':
            'mJ3UfsR5M1wWACNoathXjF9U3FJZgSCArPNzHmdiB0olLTYItAUbvGiVB6L1XSjq',
        },
      },
    );
    const data = await response.json();

    // sort by start date
    data.sort((a: SimpleEvent, b: SimpleEvent) => {
      const a_date = new Date(a.start_date);
      const b_date = new Date(b.start_date);
      return a_date.getTime() - b_date.getTime();
    });
    return data;
  }
}
