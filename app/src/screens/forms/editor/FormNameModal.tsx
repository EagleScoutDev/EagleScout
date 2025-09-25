import { StandardModal } from '../../../components/modals/StandardModal.tsx';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { StandardButton } from '../../../ui/StandardButton.tsx';
import { useState } from 'react';
import { useTheme } from '@react-navigation/native';
import type { Setter } from '../../../lib/react';

function Spacer() {
    return <View style={{ height: '2%' }} />;
}

export interface FormNameModalProps {
    visible: boolean, setVisible: Setter<boolean>
    onSubmit: () => void
}
export function FormNameModal({ visible, setVisible, onSubmit }: FormNameModalProps) {
    const { colors } = useTheme();
    const [name, setName] = useState('');

    const styles = StyleSheet.create({
        textInput: {
            // height: 50,
            borderColor: 'gray',
            borderWidth: 1,
            width: '100%',
            borderRadius: 10,
            padding: 10,
            marginBottom: 10,
            color: colors.text,
            fontSize: 18,
        },
        label: {
            color: colors.text,
            fontSize: 18,
            fontWeight: '600',
            textAlign: 'center',
        },
    });

    return (
        <StandardModal
            title="Form Name"
            visible={visible}
            onDismiss={() => {
                setVisible(false);
            }}>
            <Text style={styles.label}>Please enter the form name</Text>
            <Spacer />
            <TextInput
                style={styles.textInput}
                onChangeText={text => setName(text)}
                value={name}
            />
            <StandardButton
                text={'Submit'}
                onPress={() => {
                    if (name === '') {
                        Alert.alert('Please enter a name');
                        return;
                    }
                    setVisible(false);
                    onSubmit(name);
                }}
                color={colors.primary}
            />
            <StandardButton
                text={'Cancel'}
                onPress={() => {
                    setVisible(false);
                }}
                color={colors.notification}
            />
        </StandardModal>
    );
};
