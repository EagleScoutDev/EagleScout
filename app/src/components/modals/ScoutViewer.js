import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import RadioButtons from '../form/RadioButtons';
import StandardButton from '../StandardButton';
import Checkbox from '../form/Checkbox';
import {supabase} from '../../lib/supabase';

const DEBUG = false;

/**
 * This component displays the scout data in a modal.
 * @param visible - whether the modal is visible
 * @param setVisible - function to set the visibility of the modal
 * @param data - the data to display
 * @param chosenComp - the competition that the data is from
 * @returns {JSX.Element} - the scout viewer
 */
function ScoutViewer({visible, setVisible, data, chosenComp}) {
  const {colors} = useTheme();
  const [userName, setUserName] = useState('');

  // variables for editing forms
  const [editingActive, setEditingActive] = useState(false);

  // this only holds the data of the form, since the form questions should remain the same
  const [tempData, setTempData] = useState({});

  const styles = StyleSheet.create({
    modal_container: {
      alignSelf: 'center',
      backgroundColor: colors.background,
      padding: '5%',
      // marginTop: '8%',
      height: '100%',
      width: '100%',
    },
    breadcrumbs: {
      color: 'gray',
      fontSize: 12,
      fontStyle: 'italic',
      textAlign: 'center',
      marginTop: '10%',
    },
    close: {
      color: 'red',
      fontWeight: 'bold',
      fontSize: 17,
      padding: '2%',
    },
    team_title: {
      fontSize: 30,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
      marginTop: 10,
      marginBottom: 5,
    },
    report_info: {
      textAlign: 'center',
      color: colors.text,
    },
    section_title: {
      // set the color to be the opposite of the background
      color: colors.text,
      fontSize: 18,
      textAlign: 'center',
      fontWeight: 'bold',
      margin: '6%',
      textDecorationLine: 'underline',
    },
    no_info: {
      color: colors.notification,
      fontWeight: 'bold',
      flexWrap: 'wrap',
      fontSize: 15,
      flex: 1,
    },
    question: {
      color: editingActive ? colors.primary : colors.text,
      fontSize: 15,
      fontWeight: '600',
      // wrap text if it's too long
      flex: 1,
      flexWrap: 'wrap',
      paddingBottom: 5,
    },
  });

  useEffect(() => {
    if (data != null) {
      console.log('updating temp data!');
      setTempData(data.data);
      console.log('finished updating temp data!');
      console.log('printing out temp data: ');
      console.log(tempData);
    }
  }, [data]);

  useEffect(() => {
    console.log('printing out temp data: ');
    console.log(tempData);
    // convert each object in tempData to an array of the values
  }, [tempData]);

  useEffect(() => {
    /**
     * This function gets the user's name from the database
     * allowing it to be displayed in the scout viewer.
     * @returns {Promise<void>}
     */
    const getUserName = async () => {
      const res = await supabase
        .from('profiles')
        .select('name')
        .eq('id', data.userId)
        .single();
      if (res.error) {
        console.error(res.error);
      } else if (data) {
        setUserName(res.data.name);
      } else {
        console.error('data is null, cannot get username');
      }
    };
    getUserName().then(r => {
      if (DEBUG) {
        console.log('creator of scout report found');
      }
    });
  }, [data]);

  useEffect(() => {
    if (DEBUG) {
      console.log('printing out individual scout report data: ');
      console.log(data);
      console.log('finished printing.');
    }
  }, [data]);

  if (data === null) {
    return <View />;
  }
  return (
    <Modal
      animationType="slide"
      visible={visible}
      transparent={true}
      presentationStyle={'overFullScreen'}>
      <View style={styles.modal_container}>
        <TouchableOpacity onPress={() => setVisible(false)}>
          <Text style={styles.breadcrumbs}>
            {chosenComp} / Round {data ? data.matchNumber : ''}{' '}
          </Text>
        </TouchableOpacity>
        <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
          {/*<TouchableOpacity*/}
          {/*  onPress={() => {*/}
          {/*    setEditingActive(!editingActive);*/}
          {/*    if (editingActive) {*/}
          {/*      setTempData(data.data);*/}
          {/*    }*/}
          {/*  }}>*/}
          {/*  <Text*/}
          {/*    style={{*/}
          {/*      textAlign: 'right',*/}
          {/*      color: editingActive ? colors.primary : 'gray',*/}
          {/*      fontWeight: 'bold',*/}
          {/*      fontSize: 17,*/}
          {/*    }}>*/}
          {/*    {editingActive ? 'Cancel' : 'Edit'}*/}
          {/*  </Text>*/}
          {/*</TouchableOpacity>*/}
          <TouchableOpacity onPress={() => setVisible(false)}>
            <Text style={styles.close}>Close</Text>
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View
            style={{
              borderRadius: 10,
              padding: '5%',
            }}>
            <Text style={styles.team_title}>Team #{data.teamNumber}</Text>
            <Text style={styles.report_info}>
              Round {data ? data.matchNumber : ''}
            </Text>
            <Text style={styles.report_info}>By: {userName}</Text>
            <Text style={styles.report_info}>
              {new Date(data.createdAt).toLocaleString()}
            </Text>
          </View>

          {data.form.map((field, index) => (
            <View key={index}>
              {/*If the entry has a text property, this indicates that it is a header, or section divider*/}
              {field.text && (
                <Text style={styles.section_title}>{field.text}</Text>
              )}
              {/*If the entry has a question property, this indicates that it is a question*/}
              {field.question && data.data[index] != null && (
                <View
                  style={{
                    flexDirection:
                      field.type === 'radio' ||
                      field.type === 'textbox' ||
                      field.type === 'checkbox'
                        ? 'column'
                        : 'row',
                    justifyContent: 'space-between',
                    // add a background if the index is even
                    backgroundColor:
                      index % 2 === 0 ? colors.border : 'transparent',
                    padding: 10,
                    margin: 5,
                    borderRadius: 10,
                  }}>
                  <Text style={styles.question}>{field.question}</Text>
                  {field.type === 'radio' && (
                    <View>
                      <RadioButtons
                        title={''}
                        colors={colors}
                        options={field.labels}
                        onValueChange={value => {
                          console.log(
                            'radio button value changed to: ' + value,
                          );
                          let a = [...tempData];
                          console.log(
                            'index of value: ' + field.labels.indexOf(value),
                          );
                          a[index] = field.labels.indexOf(value);
                          setTempData(a);
                        }}
                        value={field.labels[tempData[index]]}
                        disabled={!editingActive}
                      />
                    </View>
                  )}
                  {field.type !== 'radio' &&
                    field.type !== 'checkbox' &&
                    editingActive && (
                      <TextInput
                        keyboardType={
                          field.type === 'number' ? 'numeric' : 'default'
                        }
                        value={tempData[index]}
                        onChangeText={value => {
                          let a = [...tempData];
                          a[index] = value;
                          setTempData(a);
                        }}
                      />
                    )}
                  {field.type === 'checkbox' && (
                    <Checkbox
                      title={''}
                      disabled={!editingActive}
                      colors={colors}
                      options={field.labels}
                      value={
                        tempData[index] &&
                        tempData[index] != null &&
                        tempData[index] !== ''
                          ? Object.values(tempData[index]).map(value => {
                              return Number.parseInt(value, 10);
                            })
                          : []
                      }
                      onValueChange={value => {
                        console.log('new checkbox value: ' + value);
                        // print out the values of the dictionary tempData[index]

                        console.log(
                          'values of temp data index: ' +
                            Object.values(tempData[index]),
                        );
                        console.log(
                          'tostring of temp data index: ' +
                            tempData[index].toString(),
                        );
                      }}
                    />
                  )}
                  {field.type !== 'radio' &&
                    field.type !== 'checkbox' &&
                    !editingActive && (
                      <Text
                        style={{
                          color: colors.primary,
                          fontWeight: 'bold',
                          flexWrap: 'wrap',
                          fontSize: 15,
                          flex: 1,
                          // move this to the rightmost side of the screen
                          textAlign:
                            field.type === 'textbox' ? 'left' : 'center',
                          // align vertically
                          alignSelf:
                            field.type === 'textbox' ? 'flex-start' : 'center',
                        }}>
                        {data.data[index].toString()}
                      </Text>
                    )}
                  {tempData[index] === null ||
                    (tempData[index] === '' && (
                      <Text style={styles.no_info}>N/A</Text>
                    ))}
                </View>
              )}
            </View>
          ))}
          {tempData !== data.data && editingActive && (
            <StandardButton
              color={'blue'}
              text={'Save'}
              onPress={() => {
                Alert.alert(
                  'Save Changes?',
                  'Are you sure you want to save these changes?',
                  [
                    {
                      text: 'Cancel',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },
                    {
                      text: 'Save',
                      onPress: () => {
                        console.log('Save Pressed');
                        // TODO: update the scouting form using updateDoc
                      },
                    },
                  ],
                );
              }}
            />
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

export default ScoutViewer;
