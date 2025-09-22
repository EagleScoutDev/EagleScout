import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Question } from '../Question.tsx';
import { useTheme } from '@react-navigation/native';

export interface RadioButtonsProps {
    title: string
    options: string[]
    value: string
    disabled?: boolean
    required?: boolean
    onValueChange?: ((x: string) => void) | undefined
    onReset?: (() => void) | undefined
}
export function Radio({ title, options, value, disabled = false, required = true, onValueChange, onReset }: RadioButtonsProps) {
    const { colors } = useTheme()

    const styles = StyleSheet.create({
        circle: {
            height: 24,
            width: 24,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: colors.text,
            alignItems: 'center',
            justifyContent: 'center',
            // marginRight: 10,
            marginRight: '6%',
        },
        selectedCircle: {
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: colors.text,
            alignItems: 'center',
            justifyContent: 'center',
            // marginRight: 10,
            marginRight: '6%',
        },
        disabledSelectedCircle: {
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: colors.text,
            alignItems: 'center',
            justifyContent: 'center',
            // marginRight: 10,
            marginRight: '6%',
            opacity: 0.6,
        },
    });

    const list = options.map((item, index) => {
        return (
            <View key={index}>
                <TouchableOpacity
                    key={index}
                    onPress={() => {
                        if(onValueChange) onValueChange(item);
                    }}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginVertical: 5,
                    }}>
                    <View
                        style={value === item ? styles.selectedCircle : styles.circle}
                    />
                    <Text style={{ color: colors.text }}>{item}</Text>
                </TouchableOpacity>
            </View>
        );
    });

    const disabledList = options.map((item, index) => {
        return (
            <View
                key={index}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginVertical: 5,
                }}>
                <View
                    style={
                        value === item ? styles.disabledSelectedCircle : styles.circle
                    }
                />
                <Text
                    style={{
                        color: colors.text,
                    }}>
                    {item}
                </Text>
            </View>
        );
    });
    return (
        <View>
            <Question
                title={title}
                required={required}
                onReset={onReset}
            />
            {disabled ? disabledList : list}
        </View>
    );
};
