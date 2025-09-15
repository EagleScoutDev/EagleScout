import React, { StyleSheet, Text } from 'react-native';
import { useTheme } from '@react-navigation/native';

const TabHeader = ({ title }: { title: string }) => {
    const { colors } = useTheme();
    const styles = StyleSheet.create({
        title: {
            fontSize: 34,
            fontWeight: '600',
            color: colors.text,
            padding: 20,
            // paddingLeft: 30,
        },
    });

    return <Text style={styles.title}>{title}</Text>;
};

export default TabHeader;
