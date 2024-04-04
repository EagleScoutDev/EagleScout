import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import React from 'react-native';
import {useTheme} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {TagsDB, TagStructure} from '../../database/Tags';
import {PicklistTeam} from '../../database/Picklists';
import Svg, {Path} from 'react-native-svg';

const TagsModal = ({
  visible,
  setVisible,
  picklist_id,
  selected_team,
  addTag,
  removeTag,
}: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  picklist_id: number;
  selected_team: PicklistTeam | null;
  addTag: (team: PicklistTeam, tag_id: number) => void;
  removeTag: (team: PicklistTeam, tag_id: number) => void;
}) => {
  const {colors} = useTheme();
  const [listOfTags, setListOfTags] = useState<TagStructure[]>([]);

  const [newTagName, setNewTagName] = useState('');
  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  useEffect(() => {
    console.log('picklist_id: ', picklist_id);
    if (picklist_id !== -1) {
      TagsDB.getTagsForPicklist(picklist_id).then(tags => {
        setListOfTags(tags);
      });
    }
  }, [picklist_id, visible]);

  useEffect(() => {
    if (selected_team !== null) {
      setSelectedTags(selected_team.tags);
    }
  }, [visible]);

  return (
    <Modal
      onRequestClose={() => setVisible(false)}
      transparent={true}
      animationType={'fade'}
      visible={visible}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}>
        <View
          style={{
            backgroundColor: colors.card,
            padding: '5%',
            margin: '5%',
            marginVertical: '20%',
            borderRadius: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '5%',
            }}>
            <Text
              style={{
                color: colors.text,
                fontSize: 20,
                fontWeight: 'bold',
              }}>
              {selected_team !== null
                ? 'Tags for Team ' + selected_team.team_number
                : 'Tags'}
            </Text>
            <Pressable onPress={() => setVisible(false)}>
              <Text style={{color: colors.text}}>Close</Text>
            </Pressable>
          </View>
          {listOfTags.length > 0 && (
            <FlatList
              style={{flex: 1}}
              data={listOfTags}
              scrollEnabled={true}
              renderItem={({item}) => (
                <Pressable
                  onPress={() => {
                    if (selected_team === null) {
                      return;
                    }
                    console.log('tag id: ', item.id);
                    // print type of tag id
                    console.log('tag id type: ', typeof item.id);
                    if (
                      selectedTags.includes(Number.parseInt(item.id ?? '', 10))
                    ) {
                      setSelectedTags(
                        selectedTags.filter(
                          tag_id =>
                            tag_id !== Number.parseInt(item.id ?? '', 10),
                        ),
                      );
                      removeTag(
                        selected_team!,
                        Number.parseInt(item.id ?? '', 10),
                      );
                    } else {
                      setSelectedTags([
                        ...selectedTags,
                        Number.parseInt(item.id ?? '', 10),
                      ]);
                      addTag(
                        selected_team!,
                        Number.parseInt(item.id ?? '', 10),
                      );
                    }
                  }}
                  style={{
                    backgroundColor: colors.background,
                    padding: '5%',
                    margin: '2%',
                    borderRadius: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  {selected_team !== null && (
                    <View style={{flex: 0.2}}>
                      {selectedTags.includes(
                        Number.parseInt(item.id ?? '', 10),
                      ) && (
                        <Svg
                          width="16"
                          height="16"
                          fill="currentColor"
                          viewBox="0 0 16 16">
                          <Path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
                        </Svg>
                      )}
                    </View>
                  )}
                  <Text style={{color: colors.text, flex: 1}}>{item.name}</Text>
                  <Pressable
                    onPress={() => {
                      console.log('tag id: ', item.id);
                      // print type of tag id
                      console.log('tag id type: ', typeof item.id);
                      if (item.id !== undefined) {
                        TagsDB.deleteTag(item.id!).then(() => {
                          TagsDB.getTagsForPicklist(picklist_id).then(tags => {
                            setListOfTags(tags);
                          });
                        });
                      }
                    }}>
                    <Text style={{color: colors.notification}}>Delete</Text>
                  </Pressable>
                </Pressable>
              )}
            />
          )}
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: colors.border,
              paddingTop: '5%',
            }}>
            <TextInput
              style={{
                color: colors.text,
                backgroundColor: colors.background,
                padding: '5%',
                borderRadius: 10,
                minWidth: '100%',
              }}
              placeholder={'Tag Name'}
              placeholderTextColor={'gray'}
              value={newTagName}
              onChangeText={setNewTagName}
            />
            <Pressable
              disabled={newTagName === ''}
              onPress={() => {
                TagsDB.createTag(picklist_id, newTagName).then(() => {
                  TagsDB.getTagsForPicklist(picklist_id).then(tags => {
                    setListOfTags(tags);
                    setNewTagName('');
                  });
                });
              }}
              style={{
                backgroundColor: newTagName === '' ? 'gray' : colors.primary,
                padding: '5%',
                borderRadius: 10,
                marginTop: '5%',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 10,
              }}>
              <Text
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                Create Tag
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default TagsModal;
