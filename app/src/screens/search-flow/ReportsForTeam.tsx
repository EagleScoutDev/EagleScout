import {View, Text, Pressable, FlatList, TextInput} from 'react-native';
import ReportList from '../../components/ReportList';
import {useTheme} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import CompetitionsDB from '../../database/Competitions';
import ScoutReportsDB, {
  ScoutReportReturnData,
} from '../../database/ScoutReports';
import NotesDB, {NoteStructureWithMatchNumber} from '../../database/Notes';
import {Tabs} from '../../components/Tabs';
import {NoteList} from '../../components/NoteList';
import PitScoutReports, {
  PitScoutReportReturnData,
} from '../../database/PitScoutReports';
import {PitScoutReportList} from '../../components/PitScoutReportList';

function ReportsForTeam({route}) {
  // const [team, setTeam] = useState('');
  const {team_number, competitionId} = route.params;
  const {colors} = useTheme();
  const [tab, setTab] = useState<string>('Scout Reports');
  const [scoutReports, setScoutReports] = useState<
    ScoutReportReturnData[] | null
  >(null);
  const [notes, setNotes] = useState<NoteStructureWithMatchNumber[]>([]);
  const [pitResponses, setPitResponses] = useState<
    PitScoutReportReturnData[] | null
  >(null);

  useEffect(() => {
    CompetitionsDB.getCompetitionById(competitionId).then(competition => {
      if (!competition) {
        return;
      }
      ScoutReportsDB.getReportsForTeamAtCompetition(
        team_number,
        competition.id,
      ).then(reports => {
        setScoutReports(reports);
        console.log('scout reports for team ' + team_number + ' : ' + reports);
        console.log('no reports? ' + (reports.length === 0));
      });
      PitScoutReports.getReportsForTeamAtCompetition(
        team_number,
        competition.id,
      ).then(reports => {
        console.log('pit reports for team ' + team_number + ' : ' + reports);
        setPitResponses(reports);
      });
      NotesDB.getNotesForTeamAtCompetition(team_number, competition.id).then(
        n => {
          console.log(
            'notes for team ' + team_number + ' : ' + JSON.stringify(n),
          );
          setNotes(n);
        },
      );
    });
  }, [team_number]);

  return (
    <View style={{flex: 1}}>
      <Tabs
        tabs={['Scout Reports', 'Notes', 'Pit Reports']}
        selectedTab={tab}
        setSelectedTab={setTab}
      />
      {tab === 'Scout Reports' && (
        <View style={{flex: 1}}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 25,
              paddingLeft: '5%',
              color: colors.text,
              marginVertical: '5%',
            }}>
            Reports for Team #{team_number}
          </Text>
          <ReportList
            reports={scoutReports}
            isOffline={false}
            expandable={false}
            displayHeaders={false}
          />
        </View>
      )}
      {tab === 'Notes' && (
        <View style={{flex: 1}}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 25,
              paddingLeft: '5%',
              color: colors.text,
              marginTop: '5%',
            }}>
            Notes for Team #{team_number}
          </Text>
          <NoteList notes={notes} />
        </View>
      )}
      {tab === 'Pit Reports' && (
        <View style={{flex: 1}}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 25,
              paddingLeft: '5%',
              color: colors.text,
              marginTop: '5%',
            }}>
            Pit Scouting Reports for Team #{team_number}
          </Text>
          <PitScoutReportList reports={pitResponses} isOffline={false} />
        </View>
      )}
    </View>
  );
}

export default ReportsForTeam;
