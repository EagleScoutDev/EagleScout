import React, { useState, type JSX, type PropsWithChildren } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Controller } from '../icons/icons.generated';
import { useTheme } from '@react-navigation/native';

export interface FormSectionProps {
    title: string
    modalAttached: boolean
    onModalPress: () => void
    disabled: boolean
}

// create a react component that shows the children in a row

// this function is a template for other functions to use
// it contains space for the title of the section, and for the data input
export function FormSection({
    children,
    title,
    modalAttached,
    onModalPress,
    disabled,
}: PropsWithChildren<FormSectionProps>) {
    const { colors } = useTheme()

    const [visible, setVisible] = useState(true);
    const styles = StyleSheet.create({
        container: {
            // flexDirection: 'column',
            // minWidth: '85%',
            // maxWidth: '85%',
            paddingTop: '5%',
            paddingBottom: '3%',
            // minWidth: '95%',
            width: '100%',
            paddingHorizontal: '5%',
            // backgroundColor: colors.card,
            // borderRadius: 10,
            borderColor: colors.border,
            borderTopWidth: 2,
            borderBottomWidth: 2,

            // flex: 1,
        },
        title: {
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 10,
            color: colors.text,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        external_area: {
            backgroundColor: colors.background,
            alignItems: 'center',
            justifyContent: 'center',
            // marginVertical: '3%',
        },
    });

    return (
        <View style={styles.external_area}>
            <View style={styles.container}>
                {/*TODO: Display a little green checkmark (like a JUNIT test passing) if all required questions in the section are filled out*/}
                <View style={styles.header}>
                    {title !== '' && (
                        <Text
                            style={styles.title}
                            disabled={disabled}
                            onPress={() => {
                                if (!disabled) {
                                    setVisible(!visible);
                                }
                            }}>
                            {title}
                        </Text>
                    )}
                    {modalAttached && (
                        <Pressable onPress={onModalPress}>
                            <Controller size="24" fill="gray" />
                        </Pressable>
                    )}
                </View>
                {visible && children}
            </View>
        </View>
    );
}
