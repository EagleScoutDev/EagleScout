import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useEffect, useState } from "react";
import Forms from "../../database/Forms";

const FormList = ({navigation}) => {
  const {colors} = useTheme();
  const [formList, setFormList] = useState([]);
  // checking if user has permission to edit competitions

  useEffect(() => {
    return navigation.addListener('focus', () => {
      (async () => {
        const forms = await Forms.getAllForms();
        setFormList(forms);
      })();
    });
  }, [navigation]);

  return (
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
              onPress={() => {}}
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
            navigation.navigate('Form Creation Main');
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
  );
};

export default FormList;
