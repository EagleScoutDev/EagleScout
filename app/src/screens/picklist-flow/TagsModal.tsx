import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React from 'react-native';
import {useTheme} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {TagsDB, TagStructure} from '../../database/Tags';

const TagsModal = ({
  visible,
  setVisible,
  picklist_id,
}: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  picklist_id: number;
}) => {
  const {colors} = useTheme();
  const [listOfTags, setListOfTags] = useState<TagStructure[]>([]);

  const [newTagName, setNewTagName] = useState('');

  useEffect(() => {
    console.log('picklist_id: ', picklist_id);
    if (picklist_id !== -1) {
      TagsDB.getTagsForPicklist(picklist_id).then(tags => {
        setListOfTags(tags);
      });
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
              Tags
            </Text>
            <Pressable onPress={() => setVisible(false)}>
              <Text style={{color: colors.text}}>Close</Text>
            </Pressable>
          </View>
          <FlatList
            style={{flex: 1}}
            data={listOfTags}
            scrollEnabled={true}
            renderItem={({item}) => (
              <View
                style={{
                  backgroundColor: colors.background,
                  padding: '5%',
                  margin: '2%',
                  borderRadius: 10,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={{color: colors.text}}>{item.name}</Text>
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
                  <Text style={{color: colors.primary}}>Delete</Text>
                </Pressable>
              </View>
            )}
          />
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
