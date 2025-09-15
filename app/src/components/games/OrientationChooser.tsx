import React from 'react';
import { Pressable, View, Text } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Alliance, Orientation } from '../../games/common';
import { ArrowLeftRight, CheckLg } from '../icons/icons.generated';
import type { Setter } from '../../lib/react-utils/types';

export interface OrientationChooserProps {
    orientation: Orientation, setOrientation: Setter<Orientation>
    alliance: Alliance,       setAlliance: Setter<Alliance>
}
export const OrientationChooser = ({
    orientation,
    setOrientation,
    alliance,
    setAlliance,
}: OrientationChooserProps) => {
    const { colors } = useTheme();
    return (
        <View
            style={{
                padding: '5%',
                borderRadius: 10,
                justifyContent: 'center',
            }}>
            <Text
                style={{
                    color: colors.text,
                    fontSize: 16,
                    textAlign: 'center',
                    fontWeight: 'bold',
                    paddingBottom: '3%',
                }}>
                Field Orientation
            </Text>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginVertical: '1%',
                }}>
                <Pressable
                    style={{
                        backgroundColor: orientation === Orientation.leftBlue ? 'blue' : 'red',
                        paddingVertical: '3%',
                        borderTopLeftRadius: 10,
                        borderBottomLeftRadius: 10,
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    onPress={() => setAlliance(Alliance.fromOrientation(orientation))}>
                    {alliance === Alliance.fromOrientation(orientation) ? (
                        <CheckLg size="24" fill="white" />
                    ) : null}
                </Pressable>
                <View>
                    <Pressable
                        style={{
                            backgroundColor: '#FFEBD9',
                            justifyContent: 'center',
                            flex: 1,
                            paddingHorizontal: '10%',
                            alignItems: 'center',
                        }}
                        onPress={() => setOrientation(Orientation.toggle(orientation))}>
                        <ArrowLeftRight size="24" fill="black" />
                    </Pressable>
                </View>
                <Pressable
                    style={{
                        backgroundColor: orientation === Orientation.leftRed ? 'blue' : 'red',
                        paddingVertical: '3%',
                        borderTopRightRadius: 10,
                        borderBottomRightRadius: 10,
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    onPress={() => setAlliance(Alliance.toggle(Alliance.fromOrientation(orientation)))}>
                    {alliance !== Alliance.fromOrientation(orientation) ? (
                        <CheckLg size="24" fill="white" />
                    ) : null}
                </Pressable>
            </View>
        </View>
    );
};
