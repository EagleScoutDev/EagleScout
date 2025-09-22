import { StandardModal } from '../../../../components/modals/StandardModal';
import { Alert, Text, TextInput, View } from 'react-native';
import { useEffect, useMemo, useState } from 'react';
import { StandardButton } from '../../../../ui/StandardButton';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { useTheme } from '@react-navigation/native';
import { ReefscapeActions } from '../../../../components/games/reefscape/ReefscapeActions';
import { Selector } from '../../../../ui/form/components/Selector.tsx';
import { NumberInput } from "../../../../ui/input/Number.tsx";

function Spacer() {
    return <View style={{ height: '2%' }} />;
}

export function Number({ visible, setVisible, styles, onSubmit, value })  {
    const [question, setQuestion] = useState('');
    const [slider, setSlider] = useState(false);
    const [low, setLow] = useState<number | null>(null);
    const [high, setHigh] = useState<number | null>(null);
    const [step, setStep] = useState<number>(1);
    const [linkTo, setLinkTo] = useState('');
    const { colors } = useTheme();

    const linkOptions = useMemo(() => {
        return Object.values(ReefscapeActions).map(action => ({
            key: action.link_name,
            value: action.name,
        }));
    }, [ReefscapeActions]);

    useEffect(() => {
        if (value && value.type === 'number') {
            setQuestion(value.question);
            setSlider(value.slider);
            setLow(value.low == null ? '' : value.low.toString());
            setHigh(value.high == null ? '' : value.high.toString());
            setStep(value.step.toString());
            setLinkTo(value.link_to || '');
        }
    }, [value]);

    const submit = () => {
        if (question === '') {
            Alert.alert('Please enter a question');
            return false;
        }
        if (slider) {
            if (low === null) {
                Alert.alert('Please enter a low value');
                return false;
            }
            if (high === null) {
                Alert.alert('Please enter a high value');
                return false;
            }
        }
        if (low != null && high != null && low > high) {
            Alert.alert('Low must be less than high');
            return false;
        }
        onSubmit({
            type: 'number',
            question: question,
            slider: slider,
            low,
            high,
            step,
            link_to: linkTo,
        });
        return true;
    };

    return (
        <StandardModal
            title="New Number Question"
            visible={visible}
            onDismiss={() => {
                setVisible(false);
            }}>
            <View style={styles.rowContainer}>
                <Text style={styles.rowLabel}>
                    Question: <Text style={styles.requiredStarText}>*</Text>
                </Text>
                <TextInput
                    style={styles.textInput}
                    onChangeText={setQuestion}
                    value={question}
                />
            </View>
            <View style={styles.rowContainer}>
                <Text style={styles.label}>Slider</Text>
                <BouncyCheckbox
                    onPress={() => {
                        setSlider(!slider);
                    }}
                    isChecked={slider}
                    bounceEffectIn={1}
                    bounceEffectOut={1}
                    style={{
                        marginRight: '6%',
                    }}
                    textStyle={{
                        textDecorationLine: 'none',
                    }}
                    iconStyle={{
                        borderRadius: 3,
                    }}
                    fillColor={colors.text}
                    innerIconStyle={{ borderRadius: 3 }}
                />
            </View>
            <Spacer />
            <View style={styles.rowContainer}>
                <Text style={styles.rowLabel}>
                    Low:{slider && <Text style={styles.requiredStarText}>*</Text>}
                </Text>
                <NumberInput
                    style={styles.textInput}
                    onInput={setLow}
                    value={low}
                    min={0}
                />
            </View>
            <View style={styles.rowContainer}>
                <Text style={styles.rowLabel}>
                    High:{slider && <Text style={styles.requiredStarText}>*</Text>}
                </Text>
                <NumberInput
                    style={styles.textInput}
                    onInput={setHigh}
                    value={high}
                    min={0}
                />
            </View>
            <View style={styles.rowContainer}>
                <Text style={styles.rowLabel}>
                    Step:<Text style={styles.requiredStarText}>*</Text>
                </Text>
                <NumberInput
                    style={styles.textInput}
                    onInput={setStep}
                    value={step}
                    min={1}
                />
            </View>
            <View style={styles.rowContainer}>
                <Text style={styles.rowLabel}>Link to</Text>
                <Selector
                    setSelected={setLinkTo}
                    data={linkOptions}
                    searchEnabled={false}
                    searchPlaceholder={'Search for a link to...'}
                    placeholder={'Selector a link to...'}
                    maxHeight={100}
                />
            </View>
            <StandardButton
                text={'Submit'}
                onPress={() => {
                    setVisible(!submit());
                }}
                color={colors.primary}
            />
            <StandardButton
                text={'Cancel'}
                onPress={() => {
                    setVisible(false);
                }}
                color={colors.card}
            />
        </StandardModal>
    );
};


