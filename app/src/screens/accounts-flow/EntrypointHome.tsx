import {StyleSheet, Text, View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import StandardButton from '../../components/StandardButton';
import React, { useContext, useEffect } from 'react';
import { AccountsScreenProps } from '.';
import { AccountContext } from '../../lib/contexts/AccountContext';
import { recallAccount } from '../../lib/account';

export interface EntrypointProps extends AccountsScreenProps<'Entrypoint'> {
  
}
export const EntrypointHome = ({ route, navigation }: EntrypointProps) => {
  const {colors} = useTheme();
  const {account, setAccount} = useContext(AccountContext);

  useEffect(() => {
    if(account === null) {
      recallAccount().then(r => {
        console.log("account loaded:", r)
        if(r !== null) setAccount(r)
      })
    }
  }, [])
  
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
            navigation.navigate('Signup');
          }}
          text={'Sign Up'}
        />
      </View>
    </View>
  );
};
