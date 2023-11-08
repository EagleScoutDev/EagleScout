import {View, Text} from 'react-native';
import ReportList from '../../components/ReportList';
import {useTheme} from '@react-navigation/native';

const DEBUG = false;

function ReportsForTeam({route}) {
  // const [team, setTeam] = useState('');
  const {team_number} = route.params;
  const {colors} = useTheme();

  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1}}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 25,
            paddingLeft: '5%',
            color: colors.text,
            marginTop: '5%',
          }}>
          Reports for Team #{team_number}
        </Text>
        <ReportList team_number={team_number} isOffline={false} />
      </View>
    </View>
  );
}

export default ReportsForTeam;
