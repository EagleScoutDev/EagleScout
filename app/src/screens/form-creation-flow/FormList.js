import React, {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import Forms from '../../database/Forms';
import FormOptionsModal from './components/FormOptionsModal';

const FormList = ({navigation}) => {
  const {colors} = useTheme();
  const [formList, setFormList] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [selectedFormIndex, setSelectedFormIndex] = useState(0);
  const [formOptionsModalVisible, setFormOptionsModalVisible] = useState(false);

  const removeCurrentForm = () => {
    setFormList([
      ...formList.slice(0, selectedFormIndex),
      ...formList.slice(selectedFormIndex + 1),
    ]);
  };

  const fetchForms = () => {
    (async () => {
      const forms = await Forms.getAllForms();
      setFormList(forms);
    })();
  };

  useEffect(() => {
    return navigation.addListener('focus', () => {
      fetchForms();
    });
  }, [navigation]);

  return (
    <>
      <View style={{flex: 1}}>
        {/*TODO: Make this bigger*/}
        <View
          style={{
            alignSelf: 'center',
            backgroundColor: colors.background,
            height: '100%',
            borderRadius: 10,
            padding: '10%',
            width: '100%',
          }}>
          <Text
            style={{
              fontSize: 25,
              fontWeight: 'bold',
              marginBottom: 20,
              color: colors.text,
              textDecorationStyle: 'solid',
              textDecorationLine: 'underline',
              textDecorationColor: colors.border,
            }}>
            Choose a Form
          </Text>
          <ScrollView>
            {formList.map((form, index) => (
              <TouchableOpacity
                key={form.id}
                onPress={() => {
                  setSelectedForm(form);
                  setSelectedFormIndex(index);
                  setFormOptionsModalVisible(true);
                }}
                style={{
                  padding: 20,
                  borderRadius: 10,
                  backgroundColor:
                    index % 2 === 0 ? colors.border : colors.background,
                }}>
                <Text
                  style={{
                    color: colors.text,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontSize: 16,
                  }}>
                  {form.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Form Creation Main', {
                form: null,
              });
            }}
            style={{
              padding: '2%',
              alignContent: 'center',
              justifyContent: 'center',
              paddingHorizontal: '6%',
              margin: 10,
              borderRadius: 100,
              borderStyle: 'solid',
              backgroundColor: colors.primary,
              position: 'absolute',
              bottom: 0,
              right: 0,
            }}>
            <Text
              style={{
                color: 'white',
                fontWeight: 'bold',
                textAlign: 'center',
                fontSize: 40,
              }}>
              +
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <FormOptionsModal
        visible={formOptionsModalVisible}
        setVisible={setFormOptionsModalVisible}
        form={selectedForm}
        onSuccess={removeCurrentForm}
        navigation={navigation}
      />
    </>
  );
};

export default FormList;
