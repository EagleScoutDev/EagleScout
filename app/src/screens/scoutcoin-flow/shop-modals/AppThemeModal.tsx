import React, { useContext, useMemo } from 'react';
import { useTheme, type Theme } from '@react-navigation/native';
import { ShopModalBase } from './ShopModalBase';
import { StyleSheet, Text } from 'react-native';
import ThemePicker from '../../../components/pickers/ThemePicker';
import { ThemeContext } from '../../../lib/contexts/ThemeContext';

export const AppThemeModal = ({ onClose }: { onClose: () => void }) => {
    const theme = useTheme();
    const styles = useMemo(() => makeStyles(theme), [theme]);
    const { setThemePreference } = useContext(ThemeContext);

    return (
        <ShopModalBase onClose={onClose}>
            <Text style={styles.title}>Select Theme</Text>
            <ThemePicker
                setTheme={t => {
                    setThemePreference(t);
                    onClose();
                }}
            />
        </ShopModalBase>
    );
};

const makeStyles = ({ colors }: Theme) =>
    StyleSheet.create({
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 20,
            textAlign: 'center',
            color: colors.text,
        },
    });
