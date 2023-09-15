import {View, Text, TextInput} from 'react-native';
import Statbotics from '../components/Statbotics';
import {useEffect, useState} from 'react';
import ReportList from '../components/ReportList';
import {useTheme} from '@react-navigation/native';
import MinimalSectionHeader from '../components/MinimalSectionHeader';
import SegmentedOption from '../components/pickers/SegmentedOption';
import DBManager from '../DBManager';
import Svg, {Path} from 'react-native-svg';

const DEBUG = false;

function SearchScreen() {
  const [team, setTeam] = useState('');
  const [forms, setForms] = useState([]);
  const {colors} = useTheme();
  const [selectedTheme, setSelectedTheme] = useState('Statistics');

  useEffect(() => {
    DBManager.getReportsForTeam(team).then(results => {
      if (DEBUG) {
        console.log('results: ' + JSON.stringify(results));
      }
      setForms(results);
    });
  }, [team]);

  return (
    <View style={{flex: 1}}>
      <MinimalSectionHeader title={'Search'} />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginLeft: '4%',
          marginTop: '3%',
        }}>
        <Svg width={'6%'} height="50%" viewBox="0 0 16 16">
          <Path
            fill={'gray'}
            d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
          />
        </Svg>
        <TextInput
          style={{
            marginHorizontal: 20,
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            borderRadius: 25,
            paddingLeft: 20,
            color: colors.text,
            flex: 1,
          }}
          onChangeText={text => setTeam(text)}
          value={team}
          keyboardType={'number-pad'}
          placeholder={'Team Number'}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          margin: 20,
          backgroundColor: colors.border,
          padding: 2,
          borderRadius: 10,
          alignContent: 'center',
        }}>
        <SegmentedOption
          colors={colors}
          title="Statistics"
          selected={selectedTheme}
          onPress={() => setSelectedTheme('Statistics')}
        />
        <SegmentedOption
          colors={colors}
          title="Observations"
          selected={selectedTheme}
          onPress={() => setSelectedTheme('Observations')}
        />
      </View>
      {selectedTheme === 'Statistics' && <Statbotics team={team} />}
      {selectedTheme === 'Observations' && (
        <View style={{flex: 1}}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 25,
              paddingLeft: '5%',
              color: colors.text,
            }}>
            Scout Reports
          </Text>
          <ReportList forms={forms} />
        </View>
      )}
    </View>
  );
}

export default SearchScreen;
