import {StyleSheet, Text, View} from 'react-native';
import {useNavigation, useTheme} from '@react-navigation/native';
import StandardButton from '../../components/StandardButton';
import React, {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Props {
  ifAuth: () => void;
}

const EntrypointHome: React.FC<Props> = ({ifAuth}) => {
  const {colors} = useTheme();
  const navigation = useNavigation();

  useEffect(() => {
    AsyncStorage.getItem('authenticated').then(r => {
      if (r) {
        console.log('Login page redirecting to Scout Report...');
        console.log(r);
        // navigation.navigate('Scout Report');
        ifAuth();
      }
    });
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgb(0,0,25)',
    },
    title: {
      color: 'rgb(191, 219, 247)',
      fontSize: 40,
      fontWeight: 'bold',
    },
    subtitle: {
      color: 'gray',
      fontSize: 20,
      fontWeight: 'bold',
    },
  });
  return (
    <View style={styles.container}>
      {/*    logo*/}
      <View style={{alignItems: 'center', flex: 0.5}}>
        <Text style={styles.title}>Eaglescout</Text>
        <Text style={styles.subtitle}>The future of scouting is now.</Text>
      </View>
      <View style={{width: '100%', position: 'absolute', bottom: '10%'}}>
        <StandardButton
          textColor={'white'}
          color={'rgb(0,0,25)'}
          isLoading={false}
          onPress={() => {
            navigation.navigate('Login');
          }}
          text={'Login'}
        />
        <StandardButton
          textColor={colors.primary}
          color={'rgb(0,0,25)'}
          isLoading={false}
          onPress={() => {
            navigation.navigate('Sign');
          }}
          text={'Sign Up'}
        />
      </View>
    </View>
  );
};

export default EntrypointHome;
