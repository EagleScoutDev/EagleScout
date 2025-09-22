import { StandardModal } from '../../../components/modals/StandardModal';
import { StandardButton } from '../../../components/StandardButton';
import { ScrollView, Text, type StyleSheetProperties } from 'react-native';
import { Heading } from './questions/Heading';
import { useState } from 'react';
import { useTheme } from '@react-navigation/native';
import { Radio } from './questions/Radio';
import { Number } from './questions/Number';
import { TextBox } from './questions/TextBox';
import { Checkboxes } from './questions/Checkboxes';
import type { Setter } from '../../../lib/react/types';

export interface NewQuestionModalProps {
    visible: boolean, setVisible: Setter<boolean>
    onSubmit: () => void
    styles: StyleSheetProperties
}
export function NewQuestionModal({ visible, setVisible, onSubmit, styles }: NewQuestionModalProps) {
    const [headingModalVisible, setHeadingModalVisible] = useState(false);
    const [radioModalVisible, setRadioModalVisible] = useState(false);
    const [checkBoxModalVisible, setCheckBoxModalVisible] = useState(false);
    const [numberModalVisible, setNumberModalVisible] = useState(false);
    const [textModalVisible, setTextModalVisible] = useState(false);
    const [radioKey, setRadioKey] = useState(0);
    const [numberKey, setNumberKey] = useState(1);
    const [textKey, setTextKey] = useState(2);
    const [headingKey, setHeadingKey] = useState(3);
    const [nextKey, setNextKey] = useState(4);
    const [checkBoxKey, setCheckBoxKey] = useState(5);
    const { colors } = useTheme();

    return <>
        <StandardModal
            title="New question"
            visible={visible}
            onDismiss={() => {
                setVisible(false);
            }}>
            <Text
                style={{
                    textAlign: 'center',
                    color: colors.text,
                    fontSize: 20,
                    fontWeight: 'bold',
                    paddingBottom: 20,
                }}>
                What type of question do you want to add?
            </Text>
            <ScrollView
                style={{
                    width: '100%',
                    paddingBottom: 10,
                }}>
                <StandardButton
                    text={'Heading'}
                    onPress={() => {
                        setHeadingKey(nextKey);
                        setNextKey(nextKey + 1);
                        setVisible(false);
                        setHeadingModalVisible(true);
                    }}
                    color={colors.primary}
                />
                <StandardButton
                    text={'Radio'}
                    onPress={() => {
                        setRadioKey(nextKey);
                        setNextKey(nextKey + 1);
                        setVisible(false);
                        setRadioModalVisible(true);
                    }}
                    color={colors.primary}
                />
                <StandardButton
                    text={'Checkboxes'}
                    onPress={() => {
                        setCheckBoxKey(nextKey);
                        setNextKey(nextKey + 1);
                        setVisible(false);
                        setCheckBoxModalVisible(true);
                    }}
                    color={colors.primary}
                />
                <StandardButton
                    text={'Number'}
                    onPress={() => {
                        setNumberKey(nextKey);
                        setNextKey(nextKey + 1);
                        setVisible(false);
                        setNumberModalVisible(true);
                    }}
                    color={colors.primary}
                />
                <StandardButton
                    text={'Text'}
                    onPress={() => {
                        setTextKey(nextKey);
                        setNextKey(nextKey + 1);
                        setVisible(false);
                        setTextModalVisible(true);
                    }}
                    color={colors.primary}
                />
            </ScrollView>
            <StandardButton
                text={'Cancel'}
                onPress={() => {
                    setVisible(false);
                }}
                color={colors.notification}
            />
        </StandardModal>
        <Heading
            visible={headingModalVisible}
            setVisible={setHeadingModalVisible}
            styles={styles}
            onSubmit={onSubmit}
            key={headingKey}
        />
        <Radio
            visible={radioModalVisible}
            setVisible={setRadioModalVisible}
            styles={styles}
            key={radioKey}
            onSubmit={onSubmit}
        />
        <Checkboxes
            visible={checkBoxModalVisible}
            setVisible={setCheckBoxModalVisible}
            styles={styles}
            key={checkBoxKey}
            onSubmit={onSubmit}
        />
        <Number
            visible={numberModalVisible}
            setVisible={setNumberModalVisible}
            styles={styles}
            onSubmit={onSubmit}
            key={numberKey}
        />
        <TextBox
            visible={textModalVisible}
            setVisible={setTextModalVisible}
            styles={styles}
            onSubmit={onSubmit}
            key={textKey}
        />
    </>
};
