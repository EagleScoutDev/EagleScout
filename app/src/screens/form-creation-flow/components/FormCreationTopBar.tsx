import React, {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { FormNameModal } from './FormNameModal';
import { useState } from 'react';

export interface FormCreationTopBarProps {
    onSubmit: () => void
    onCancel: () => void
    questions: () => void
}
export function FormCreationTopBar({ onSubmit, onCancel, questions }: FormCreationTopBarProps) {
    const { colors } = useTheme();
    const [formNameModalVisible, setFormNameModalVisible] = useState(false);

    const styles = StyleSheet.create({
        mainContainer: {
            alignSelf: 'flex-end',
            backgroundColor: colors.card,
            padding: 10,
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        cancelButton: {
            color: colors.text,
            opacity: 0.6,
            fontWeight: 'bold',
            fontSize: 17,
            textAlign: 'center',
        },
        submitButton: {
            fontWeight: 'bold',
            fontSize: 17,
            textAlign: 'center',
            color: colors.text,
        },
    });

    return (
        <>
            <FormNameModal
                visible={formNameModalVisible}
                setVisible={setFormNameModalVisible}
                onSubmit={onSubmit}
            />
            <View onPress={() => { }} style={styles.mainContainer}>
                <TouchableOpacity
                    onPress={() => {
                        if (questions.length === 0) {
                            onCancel();
                        } else {
                            Alert.alert(
                                'Cancel Form',
                                'Are you sure you want to cancel creating this form? Your work will be lost!',
                                [
                                    {
                                        text: 'Cancel',
                                        onPress: () => { },
                                        style: 'cancel',
                                    },
                                    {
                                        text: 'Yes',
                                        onPress: () => {
                                            onCancel();
                                        },
                                    },
                                ],
                                { cancelable: false },
                            );
                        }
                    }}>
                    <Text style={styles.cancelButton}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        if (questions.length === 0) {
                            Alert.alert(
                                'Error',
                                'Please add at least one question to your form.',
                            );
                        } else if (questions[0].type !== 'heading') {
                            Alert.alert('Error', 'A form must start with a heading.');
                        } else {
                            setFormNameModalVisible(true);
                        }
                    }}>
                    <Text style={styles.submitButton}>Submit</Text>
                </TouchableOpacity>
            </View>
        </>
    );
};
