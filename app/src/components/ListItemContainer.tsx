import React, { type ReactElement } from 'react';
import { View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { MinimalSectionHeader } from './MinimalSectionHeader';

export interface ListItemContainerProps {
    children: ReactElement | ReactElement[];
    title: string;
}

export const ListItemContainer = ({ children, title }: ListItemContainerProps) => {
    const { colors } = useTheme();

    return (
        <>
            {title.length > 0 && <MinimalSectionHeader title={title} />}
            <View
                style={{
                    margin: '3%',
                    borderRadius: 10,
                    overflow: 'hidden',
                    borderWidth: 1,
                    borderColor: colors.border,
                    minWidth: '90%',
                }}>
                {children}
            </View>
        </>
    );
};
