import { Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@react-navigation/native';

export function NewQuestionSeparator({ onPress, noDividerLine = false })  {
    const { colors } = useTheme();

    return (
        <View
            style={{
                alignItems: 'center',
                ...(!noDividerLine && {
                    flexDirection: 'row',
                    marginLeft: '5%',
                    marginRight: '5%',
                }),
            }}>
            {!noDividerLine && (
                <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
            )}
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
                        color: colors.text,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        fontSize: 22,
                    }}>
                    +
                </Text>
            </TouchableOpacity>
            {!noDividerLine && (
                <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
            )}
        </View>
    );
};


