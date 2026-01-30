import createClient from "openapi-fetch";
import type { components, paths } from "./schema.generated";

export namespace Statbotics {
    const BASE_URL = "https://api.statbotics.io/v3";
    const YEAR: YearNumber = new Date().getFullYear() as YearNumber;

    export type TeamYear = components["schemas"]["TeamYear"];
    export type TeamEvent = components["schemas"]["TeamEvent"];
    export type YearNumber =
        | 2002
        | 2003
        | 2004
        | 2005
        | 2006
        | 2007
        | 2008
        | 2009
        | 2010
        | 2011
        | 2012
        | 2013
        | 2014
        | 2015
        | 2016
        | 2017
        | 2018
        | 2019
        | 2020
        | 2021
        | 2022
        | 2023
        | 2024
        | 2025;

    const client = createClient<paths>({ baseUrl: BASE_URL });

    export async function getTeamYear(team: number): Promise<TeamYear | null> {
        const { error, data } = await client.GET(`/team_year/{team}/${YEAR}`, { params: { path: { team } } });
        if (error) {
            console.error(error);
            return null;
        }
        return data ?? null;
    }

    export async function getTeamEvents(team: number): Promise<TeamEvent[] | null> {
        const { error, data } = await client.GET(`/team_events`, { params: { query: { team, year: YEAR } } });
        if (error) {
            console.error(error);
            return null;
        }
        return data;
    }
}
