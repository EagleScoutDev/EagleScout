import { StandardModal } from '../../../../components/modals/StandardModal';
import { Alert, Text, TextInput, View } from 'react-native';
import { useEffect, useState } from 'react';
import { StandardButton } from '../../../../components/StandardButton';
import { useTheme } from '@react-navigation/native';

function Spacer() {
    return <View style={{ height: '2%' }} />;
}

export function Heading({ visible, setVisible, styles, onSubmit, value })  {
    const { colors } = useTheme();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (value && value.type === 'heading') {
            setTitle(value.title);
            setDescription(value.description);
        }
    }, [value]);

    const submit = () => {
        if (title === '') {
            Alert.alert('Please enter a title');
            return false;
        }
        if (description === '') {
            Alert.alert('Please enter a description');
            return false;
        }
        onSubmit({
            type: 'heading',
            title: title,
            description: description,
        });
        return true;
    };

    return (
        <StandardModal
            title="New Heading"
            visible={visible}
            onDismiss={() => {
                setVisible(false);
            }}>
            <Spacer />
            <Text style={styles.label}>Title</Text>
            <Spacer />
            <TextInput
                style={styles.textInput}
                placeholder="Title"
                onChangeText={text => setTitle(text)}
                value={title}
            />
            <Spacer />
            <Text style={styles.label}>Description</Text>
            <Spacer />
            <TextInput
                style={styles.textInput}
                placeholder="Description"
                onChangeText={text => setDescription(text)}
                value={description}
            />
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
                color={colors.notification}
            />
        </StandardModal>
    );
};


