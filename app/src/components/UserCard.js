import {Text, View} from 'react-native';
import {Path, Svg} from 'react-native-svg';
import {useTheme} from '@react-navigation/native';

function UserCard({name, email}) {
  const {colors} = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        padding: '5%',
        margin: '3%',
        alignItems: 'center',
        backgroundColor: colors.card,
        borderRadius: 10,
        borderColor: colors.border,
        borderWidth: 1,
      }}>
      <View style={{marginRight: '5%'}}>
        <Svg width={50} height={50} viewBox="0 0 16 16">
          <Path fill="gray" d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
          <Path
            fill="gray"
            d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
          />
        </Svg>
      </View>
      <View>
        <Text style={{fontSize: 20, color: colors.text}}>{name}</Text>
        <Text style={{color: colors.text}}>{email}</Text>
      </View>
    </View>
  );
}

export default UserCard;
