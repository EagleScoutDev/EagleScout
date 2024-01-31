import {Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '@react-navigation/native';

const NewQuestionSeparator = ({onPress}) => {
  const {colors} = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: '5%',
        marginRight: '5%',
      }}>
      <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
      <TouchableOpacity
        onPress={onPress}
        style={{
          padding: '1%',
          alignContent: 'center',
          justifyContent: 'center',
          margin: 10,
          borderRadius: 100,
          borderStyle: 'solid',
          backgroundColor: colors.primary,
          width: 35,
        }}>
        <Text
          style={{
            color: 'white',
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: 22,
          }}>
          +
        </Text>
      </TouchableOpacity>
      <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
    </View>
  );
};

export default NewQuestionSeparator;
