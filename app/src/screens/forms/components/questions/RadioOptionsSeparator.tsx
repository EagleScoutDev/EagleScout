import { Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@react-navigation/native';

export function RadioOptionsSeparator({ onPress })  {
    const { colors } = useTheme();

    return (
        <View
            style={{
                alignItems: 'center',
            }}>
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
        </View>
    );
};


