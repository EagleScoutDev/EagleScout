import React from 'react';
import { View, Text, Modal, Pressable } from 'react-native';
import { useTheme } from '@react-navigation/native';
import MinimalSectionHeader from '../../components/MinimalSectionHeader';
import StandardButton from '../../components/StandardButton';
import { SettingsHomeProps } from './SettingsHome';

interface SettingsPopupProps {
    visible: boolean
    setVisible: (x: boolean) => void
    navigation: SettingsHomeProps["navigation"]
}
const SettingsPopup = ({ visible, setVisible, navigation }: SettingsPopupProps) => {
    const { colors } = useTheme()

    return (
        <Modal
            visible={visible}
            presentationStyle={'formSheet'}
            animationType={'slide'}
            onRequestClose={() => setVisible(false)}
            onDismiss={() => setVisible(false)}>
            <View
                style={{
                    backgroundColor: colors.card,
                    flex: 1,
                }}>
                <Pressable onPress={() => setVisible(false)}>
                    <Text
                        style={{
                            color: colors.text,
                            fontSize: 24,
                            marginVertical: '5%',
                            paddingLeft: '5%',
                        }}>
                        Settings
                    </Text>
                </Pressable>
                <MinimalSectionHeader title={'Dev Tools'} />
                <StandardButton
                    color={'black'}
                    isLoading={false}
                    onPress={() => {
                        setVisible(false)
                        navigation.navigate("Debug/Offline")
                    }}
                    text={'View Device Storage'}
                />
            </View>
        </Modal>
    );
};

export default SettingsPopup;
