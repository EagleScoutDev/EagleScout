import Question from './Question';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { useTheme } from '@react-navigation/native';
import { View } from 'react-native';

export interface CheckboxesProps<T extends string> {
    title: string
    options: T[]
    disabled: boolean
    value: T[]
    onValueChange: (x: T[]) => void
}
export function Checkboxes<T extends string>({
    title,
    options,
    disabled,
    value,
    onValueChange
}: CheckboxesProps<T>) {
    const { colors } = useTheme()

    if (!value) {
        return null;
    }
    return (
        <View>
            <Question
                title={title}
                onReset={() => {
                    onValueChange([]);
                }}
            />
            <View
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}>
                {options.map((item, index) => (
                    <View
                        key={index}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginVertical: 5,
                        }}>
                        <BouncyCheckbox
                            onPress={checked => {
                                if (disabled) {
                                    return;
                                }
                                if (!checked) {
                                    onValueChange(value.filter(x => x !== item));
                                } else {
                                    onValueChange([...value, item]);
                                }
                            }}
                            isChecked={value.includes(item)}
                            style={{
                                marginRight: '6%',
                            }}
                            textStyle={{
                                color: colors.text,
                                textDecorationLine: 'none',
                            }}
                            iconStyle={{
                                borderRadius: 3,
                            }}
                            fillColor={colors.text}
                            innerIconStyle={{ borderRadius: 3 }}
                            text={item}
                        />
                    </View>
                ))}
            </View>
        </View>
    );
}
