import {CompetitionReturnData} from '../../database/Competitions';
import {Alert} from 'react-native';
import ScoutReports, {ScoutReportReturnData} from '../../database/ScoutReports';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import PitScoutReports, {
  PitScoutReportReturnData,
} from '../../database/PitScoutReports';
import {CsvBuilder} from './CsvBuilder';

export const exportScoutReportsToCsv = async (comp: CompetitionReturnData) => {
  let reports: ScoutReportReturnData[];
  try {
    reports = await ScoutReports.getReportsForCompetition(comp.id, true);
  } catch (error) {
    console.error(error);
    Alert.alert(
      'Error',
      'An error occurred while fetching the reports for the competition. Try reloading the app.',
    );
    return;
  }

  const csvBuilder = new CsvBuilder();

  csvBuilder.addHeader('user id', 'user name', 'match number', 'team number');
  comp.form.forEach(q => {
    if (
      q.type === 'radio' ||
      q.type === 'textbox' ||
      q.type === 'number' ||
      q.type === 'checkboxes'
    ) {
      csvBuilder.addHeader(q.question);
    }
  });

  reports.forEach(report => {
    const row = [];
    row.push(report.userId);
    row.push(report.userName);
    row.push(report.matchNumber);
    row.push(report.teamNumber);
    comp.form.forEach((q, i) => {
      if (q.type === 'radio') {
        row.push(q.options[report.data[i]]);
      } else if (q.type === 'number') {
        row.push(report.data[i]);
      } else if (q.type === 'textbox') {
        row.push(`"${report.data[i]}"`);
      } else if (q.type === 'checkboxes') {
        row.push('"' + report.data[i].join(',') + '"');
      }
    });
    csvBuilder.addRow(row);
  });

  return csvBuilder.build();
};

export const exportPitReportsToCsv = async (comp: CompetitionReturnData) => {
  let reports: PitScoutReportReturnData[];
  try {
    reports = await PitScoutReports.getReportsForCompetition(comp.id);
  } catch (error) {
    console.error(error);
    Alert.alert(
      'Error',
      'An error occurred while fetching the reports for the competition. Try reloading the app.',
    );
    return;
  }

  const csvBuilder = new CsvBuilder();

  csvBuilder.addHeader('user id', 'user name', 'team number');
  comp.pitScoutFormStructure.forEach(q => {
    if (
      q.type === 'radio' ||
      q.type === 'textbox' ||
      q.type === 'number' ||
      q.type === 'checkboxes'
    ) {
      csvBuilder.addHeader(q.question);
    }
  });
  csvBuilder.addHeader('images');

  reports.forEach(report => {
    const row = [];
    row.push(report.submittedId);
    row.push(report.submittedName);
    row.push(report.teamNumber);
    comp.pitScoutFormStructure.forEach((q, i) => {
      if (q.type === 'radio') {
        row.push(q.options[report.data[i]]);
      } else if (q.type === 'number') {
        row.push(report.data[i]);
      } else if (q.type === 'textbox') {
        row.push(`"${report.data[i]}"`);
      } else if (q.type === 'checkboxes') {
        row.push('"' + report.data[i].join(',') + '"');
      }
    });
    row.push(report.imageUrls!.join(','));
    csvBuilder.addRow(row);
  });

  return csvBuilder.build();
};

export const writeToFile = async (name: string, content: string) => {
  let path = RNFS.CachesDirectoryPath + `/${name}`;
  try {
    await RNFS.writeFile(path, content, 'utf8');
    try {
      await Share.open({
        url: `file://${path}`,
      });
      try {
        await RNFS.unlink(path);
        console.log('Deleted file');
      } catch (err) {
        console.error('Error deleting file: ' + err);
      }
    } catch {
      try {
        await RNFS.unlink(path);
        console.log('Deleted file');
      } catch (err) {
        console.error('Error deleting file: ' + err);
      }
    }
  } catch (err) {
    Alert.alert(
      'Error',
      'An error occurred while writing the export file. Please make sure the app has the necessary permissions.',
    );
    console.log(err);
  }
};
