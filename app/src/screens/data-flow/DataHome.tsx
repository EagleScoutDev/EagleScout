import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {CaretRight} from '../../SVGIcons';
import MinimalSectionHeader from '../../components/MinimalSectionHeader';
import AddCompetitionModal from '../../components/modals/AddCompetitionModal';

const DataHome = ({navigation}) => {
  const {colors} = useTheme();
  const [addCompetitionModalVisible, setAddCompetitionModalVisible] =
    useState(false);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      alignItems: 'center',
      padding: '4%',
      borderRadius: 10,
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
      fontSize: 20,
      fontWeight: '600',
      color: colors.text,
      padding: 15,
    },
  });

  const ListItem = (text, onPress, caretVisible = true) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}>
      <Text style={styles.list_item}>{text}</Text>
      {caretVisible && CaretRight()}
    </TouchableOpacity>
  );

  return (
    <View
      style={{
        alignItems: 'center',
        marginTop: '10%',
      }}>
      <Text style={styles.title}>Data</Text>
      <MinimalSectionHeader title={'Data Analysis'} />
      <View style={styles.list_container}>
        {ListItem('Picklist', () => {
          navigation.navigate('Picklist');
        })}
        {ListItem('Team Rank', () => {
          navigation.navigate('Team Rank');
        })}
      </View>
      <View style={{height: 20}} />

      <MinimalSectionHeader title={'Administrative'} />
      <View style={styles.list_container}>
        {ListItem('Manage Competitions', () => {
          navigation.navigate('Manage Competitions');
        })}
        {ListItem('Create Competition', () => {
          setAddCompetitionModalVisible(true);
        })}
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
