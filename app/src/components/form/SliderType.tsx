import { View, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import { useTheme } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import Question from './Question';

function SliderLabel({ text }: { text: string }) {
    const { colors } = useTheme();
    return (
        <Text
            style={{
                color: colors.text,
                fontSize: 12,
            }}>
            {text}
        </Text>
    );
}

export interface SliderProps {
    min: number
    max: number
    step: number | null
    value: number
    disabled: boolean
    question: string
    onValueChange: (x: number) => void
    minLabel: string | null
    maxLabel: string | null
}
function SliderType({
    min,
    max,
    step,
    question,
    value,
    onValueChange,
    disabled = false,
    minLabel,
    maxLabel,
}: SliderProps) {
    const { colors } = useTheme();
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    return (
        <View
            style={{
                flexDirection: 'column',
                marginVertical: 10,
            }}>
            <Question
                title={`${question} (${min} - ${max})`}
                onReset={() => {
                    setLocalValue(min);
                    onValueChange(min);
                }}
            />
            <View>
                <Slider
                    disabled={disabled}
                    value={localValue}
                    minimumTrackTintColor={colors.primary}
                    maximumTrackTintColor={colors.text}
                    maximumValue={max}
                    minimumValue={min}
                    step={step ?? 1}
                    // This setup allows user to see live slider value update, but only on release does it update the state
                    // This minimizes the number of rewrites of the array required.
                    onValueChange={setLocalValue}
                    onSlidingComplete={onValueChange}
                />
                {/*Label the min/max values and current value*/}
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}>
                    <SliderLabel text={minLabel ? minLabel : min.toString()} />
                    <Text
                        style={{
                            color: colors.primary,
                            fontSize: 13,
                            alignSelf: 'center',
                            textAlign: 'center',
                            fontWeight: 'bold',
                        }}>
                        {localValue}
                    </Text>
                    <SliderLabel text={maxLabel ? maxLabel : max.toString()} />
                </View>
            </View>
        </View>
    );
}

export default SliderType;
