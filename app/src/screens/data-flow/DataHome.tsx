import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {CaretRight} from '../../SVGIcons';
import MinimalSectionHeader from '../../components/MinimalSectionHeader';
import AddCompetitionModal from '../../components/modals/AddCompetitionModal';
import PicklistsDB from '../../database/Picklists';
import ListItem from '../../components/ListItem';
import ListItemContainer from '../../components/ListItemContainer';

enum InternetStatus {
  NOT_ATTEMPTED,
  CONNECTED,
  ATTEMPTING_TO_CONNECT,
  FAILED,
}

const DataHome = ({navigation}) => {
  const {colors} = useTheme();
  const [addCompetitionModalVisible, setAddCompetitionModalVisible] =
    useState(false);

  const [internetStatus, setInternetStatus] = useState<InternetStatus>(
    InternetStatus.NOT_ATTEMPTED,
  );

  const testConnection = () => {
    // attempt connection to picklist table
    setInternetStatus(InternetStatus.ATTEMPTING_TO_CONNECT);
    PicklistsDB.getPicklists()
      .then(() => {
        setInternetStatus(InternetStatus.CONNECTED);
      })
      .catch(() => {
        setInternetStatus(InternetStatus.FAILED);
      });
  };

  useEffect(() => {
    testConnection();
  }, []);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      alignItems: 'center',
      borderRadius: 10,
      // construct padding from debugPadding
      padding: '2%',
    },
    nav_link: {
      backgroundColor: colors.card,
      padding: '4%',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    nav_link_text: {
      color: colors.text,
    },
    title: {
      fontSize: 34,
      fontWeight: '600',
      color: colors.text,
      padding: '3%',
      paddingLeft: '5%',
      marginTop: '5%',
    },
  });

  return (
    <View
      style={{
        marginTop: '10%',
        paddingHorizontal: '2%',
      }}>
      <Text style={styles.title}>Data</Text>
      {internetStatus === InternetStatus.FAILED && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginHorizontal: '4%',
            marginBottom: '4%',
          }}>
          <Text style={{flex: 1, color: 'grey'}}>
            Failed to establish connection to server.
          </Text>
          <Pressable onPress={testConnection}>
            <Text style={{flex: 1, color: colors.primary, fontWeight: 'bold'}}>
              Try again?
            </Text>
          </Pressable>
        </View>
      )}
      <ListItemContainer title={'Data Analysis'}>
        <ListItem
          text={'Picklist'}
          onPress={() => {
            navigation.navigate('Picklist');
          }}
          caretVisible={true}
          disabled={internetStatus !== InternetStatus.CONNECTED}
        />
        <ListItem
          text={'Team Rank'}
          onPress={() => {
            navigation.navigate('Team Rank');
          }}
          caretVisible={true}
          disabled={internetStatus !== InternetStatus.CONNECTED}
        />
      </ListItemContainer>
      <View style={{height: 20}} />

      <ListItemContainer title={'Administrative'}>
        <ListItem
          text={'Manage Competitions'}
          onPress={() => {
            navigation.navigate('Manage Competitions');
          }}
          caretVisible={true}
          disabled={internetStatus !== InternetStatus.CONNECTED}
        />
        <ListItem
          text={'Create Competition'}
          onPress={() => {
            setAddCompetitionModalVisible(true);
          }}
          caretVisible={false}
          disabled={internetStatus !== InternetStatus.CONNECTED}
        />
        <ListItem
          text={'Manage Users'}
          onPress={() => {
            navigation.navigate('Manage Users');
          }}
          caretVisible={true}
          disabled={internetStatus !== InternetStatus.CONNECTED}
        />
      </ListItemContainer>
      <AddCompetitionModal
        visible={addCompetitionModalVisible}
        setVisible={setAddCompetitionModalVisible}
        onRefresh={() => {}}
      />
    </View>
  );
};

export default DataHome;
