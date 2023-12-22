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
    list_item: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
      backgroundColor: colors.card,
      padding: 15,
    },
    list_container: {
      margin: '3%',
      borderRadius: 10,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
      minWidth: '90%',
    },
    title: {
      fontSize: 34,
      fontWeight: '600',
      color: colors.text,
      padding: '3%',
      paddingLeft: '5%',
      marginTop: '5%',
    },
    disabled_list_item: {
      fontSize: 15,
      fontWeight: '600',
      color: 'gray',
      backgroundColor: colors.card,
      padding: 15,
    },
  });

  const ListItem = (text, onPress, caretVisible = true, disabled = false) => (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={{
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}>
      <Text style={disabled ? styles.disabled_list_item : styles.list_item}>
        {text}
      </Text>
      {caretVisible && CaretRight()}
    </TouchableOpacity>
  );

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
      <MinimalSectionHeader title={'Data Analysis'} />
      <View style={styles.list_container}>
        {ListItem(
          'Picklist',
          () => {
            navigation.navigate('Picklist');
          },
          true,
          internetStatus !== InternetStatus.CONNECTED,
        )}
        {ListItem(
          'Team Rank',
          () => {
            navigation.navigate('Team Rank');
          },
          true,
          internetStatus !== InternetStatus.CONNECTED,
        )}
      </View>
      <View style={{height: 20}} />

      <MinimalSectionHeader title={'Administrative'} />
      <View style={styles.list_container}>
        {ListItem(
          'Manage Competitions',
          () => {
            navigation.navigate('Manage Competitions');
          },
          true,
          internetStatus !== InternetStatus.CONNECTED,
        )}
        {ListItem(
          'Create Competition',
          () => {
            setAddCompetitionModalVisible(true);
          },
          false,
          internetStatus !== InternetStatus.CONNECTED,
        )}
        {ListItem(
          'Manage Users',
          () => {
            navigation.navigate('Manage Users');
          },
          true,
          internetStatus !== InternetStatus.CONNECTED,
        )}
      </View>
      <AddCompetitionModal
        visible={addCompetitionModalVisible}
        setVisible={setAddCompetitionModalVisible}
        onRefresh={() => {}}
      />
    </View>
  );
};

export default DataHome;
