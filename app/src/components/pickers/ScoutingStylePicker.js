import {View} from 'react-native';
import SegmentedOption from './SegmentedOption';
import MinimalSectionHeader from '../MinimalSectionHeader';
import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FormHelper from '../../FormHelper';

function ScoutingStylePicker({colors, setScoutingStyle}) {
  const [selected, setSelected] = useState('Paginated');

  useEffect(() => {
    FormHelper.readAsyncStorage(FormHelper.SCOUTING_STYLE).then(r => {
      if (r !== null) {
        setSelected(r);
      }
    });
  }, []);

  const saveScoutingStyle = async value => {
    try {
      await AsyncStorage.setItem(FormHelper.SCOUTING_STYLE, value);
      console.log('[] data: ' + value);
    } catch (e) {
      // saving error
      console.log('[saveScoutingStyle] error: ' + e);
    }
  };

  return (
    <View>
      <MinimalSectionHeader title="Scouting Style" />
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
          title="Scrolling"
          selected={selected}
          colors={colors}
          onPress={() => {
            console.log('scrolling pressed');
            setSelected('Scrolling');
            saveScoutingStyle('Scrolling').then(r => {
              setScoutingStyle('Scrolling');
            });
          }}
        />
        <SegmentedOption
          title="Paginated"
          selected={selected}
          colors={colors}
          onPress={() => {
            console.log('paginated pressed');
            setSelected('Paginated');
            saveScoutingStyle('Paginated').then(r => {
              setScoutingStyle('Paginated');
            });
          }}
        />
      </View>
    </View>
  );
}

export default ScoutingStylePicker;
