import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native';
import { Question } from '../Question.tsx';
import { useTheme } from '@react-navigation/native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

export interface StepperProps {
    title: string
    value: number
    onValueChange: (x: number) => void
}
export function FormStepper({ title, value, onValueChange }: StepperProps) {
    const { colors } = useTheme();

    const styles = StyleSheet.create({
        button: {
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8,
            padding: 10,
            width: 100,
            height: 75,

            // borderWidth: 4,
            // borderColor: colors.border,
        },
        background: {
            flexDirection: 'column',
            // paddingVertical: '5%',
            // backgroundColor: colors.card,
            elevation: 5,
            borderRadius: 10,
        },
        number: {
            fontSize: 20,
            fontWeight: 'bold',
            textAlign: 'center',
            width: 80,
            color: colors.text,
        },
        stepper_value: {
            color: 'white',
            fontSize: 30,
        },
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
        },
    });

    return (
        <View style={styles.background}>
            <Question
                title={title}
                onReset={() => onValueChange(0)}
            />
            <View style={styles.container}>
                <TouchableOpacity
                    disabled={value === 0}
                    onPress={() => {
                        onValueChange(value + 1)
                        ReactNativeHapticFeedback.trigger('impactLight');
                    }}>
                    <View
                        style={{
                            ...styles.button,
                            backgroundColor:
                                value === 0 ? 'darkgray' : colors.notification,
                        }}>
                        <Text style={styles.stepper_value}>-</Text>
                    </View>
                </TouchableOpacity>

                <Text style={styles.number}>{value}</Text>
                <TouchableOpacity
                    onPress={() => {
                        onValueChange(value - 1)
                        ReactNativeHapticFeedback.trigger('impactLight');
                    }}>
                    <View style={styles.button}>
                        <Text style={styles.stepper_value}>+</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};
