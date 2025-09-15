import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useMemo } from 'react';
import { useTheme } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import {
    CrescendoActionType,
    CrescendoActions,
    CrescendoActionIcon,
} from './CrescendoActions';
import type { Setter } from '../../../lib/react-utils/types';

export interface CrescendoTeleopModalProps {
    startRelativeTime: number, setStartRelativeTime: Setter<number>
    timeline: Map<number, CrescendoActionType>, setTimeline: Setter<Map<number, CrescendoActionType>>
    isActive: boolean, setIsActive: Setter<boolean>
    arrayData: any[], setArrayData: Setter<any[]>
    form: any
}
export function CrescendoTeleopModal({
    startRelativeTime, setStartRelativeTime,
    timeline, setTimeline,
    isActive, setIsActive,
    arrayData, setArrayData,
    form,
}: CrescendoTeleopModalProps) {
    const { colors } = useTheme();

    // for each linked item, map the link name to the item within the arrayData and the index
    const linkItemMap = useMemo(
        () =>
            form &&
            arrayData &&
            form.reduce((acc: any, item: any) => {
                if (item.link_to) {
                    acc[item.link_to] = {
                        value: arrayData[item.indice],
                        index: item.indice,
                    };
                }
                return acc;
            }, {}),
        [form, arrayData],
    );

    const styles = StyleSheet.create({
        button: {
            backgroundColor: colors.primary,
            padding: '5%',
            borderRadius: 10,
            margin: '5%',
            width: '90%',
            justifyContent: 'center',
            flex: 1,
            alignItems: 'center',
        },
        button_label: {
            color: 'white',
            fontSize: 20,
            textAlign: 'center',
            fontWeight: 'bold',
        },
        button_count: {
            color: 'white',
            paddingTop: '5%',
        },
        category_label: {
            color: 'gray',
            fontWeight: '700',
        },
    });

    const InputButton = ({
        action,
        color = colors.primary,
    }: {
        action: CrescendoActionType;
        color?: string;
    }) => {
        return (
            <Pressable
                style={[
                    styles.button,
                    {
                        backgroundColor: color,
                    },
                ]}
                onPress={() => {
                    const currentTime = Date.now();
                    if (startRelativeTime === -1) {
                        setStartRelativeTime(currentTime);
                    }
                    const relativeTime = currentTime - startRelativeTime;
                    setTimeline(prevTimeline => {
                        const newTimeline = new Map(prevTimeline);
                        newTimeline.set(relativeTime, action);
                        return newTimeline;
                    });
                    setArrayData(prevArrayData => {
                        const linkItem = linkItemMap[CrescendoActions[action].link_name];
                        if (linkItem) {
                            const { index } = linkItem;
                            const newArrayData = [...prevArrayData];
                            newArrayData[index] = prevArrayData[index] + 1;
                            return newArrayData;
                        } else {
                            return prevArrayData;
                        }
                    });
                }}>
                <CrescendoActionIcon action={action} />
                <Text style={styles.button_count}>
                    {linkItemMap[CrescendoActions[action].link_name]?.value}
                </Text>
            </Pressable>
        );
    };

    return (
        <Modal
            visible={isActive}
            transparent={false}
            animationType={'slide'}
            presentationStyle={'formSheet'}>
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: colors.card,
                }}>
                <Pressable
                    style={{ alignSelf: 'flex-end', marginRight: '5%', marginTop: '5%' }}
                    onPress={() => setIsActive(false)}>
                    <Text style={{ color: colors.text }}>Close</Text>
                </Pressable>
                <Text
                    style={{
                        color: colors.text,
                        flex: 0.4,
                        fontSize: 40,
                        fontWeight: 'bold',
                    }}>
                    TELEOP
                </Text>
                <Pressable
                    onPress={() => {
                        const lastTime = Math.max(...Array.from(timeline.keys()));
                        if (lastTime === -Infinity) {
                            return;
                        }
                        setTimeline(prevTimeline => {
                            const newTimeline = new Map(prevTimeline);
                            newTimeline.delete(lastTime);
                            return newTimeline;
                        });
                        setArrayData(prevArrayData => {
                            const linkItem =
                                linkItemMap[
                                CrescendoActions[
                                    timeline.get(lastTime) as CrescendoActionType
                                ].link_name
                                ];
                            if (linkItem) {
                                const { index } = linkItem;
                                const newArrayData = [...prevArrayData];
                                newArrayData[index] = prevArrayData[index] - 1;
                                return newArrayData;
                            } else {
                                return prevArrayData;
                            }
                        });
                    }}
                    style={{
                        flexDirection: 'row',
                        width: '40%',
                        backgroundColor: colors.border,
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                        paddingHorizontal: '2%',
                        paddingVertical: '8%',
                        borderRadius: 10,
                        position: 'absolute',
                        top: '16%',
                    }}>
                    <Svg width="28" height="28" fill={colors.text} viewBox="0 0 16 16">
                        <Path
                            fill-rule="evenodd"
                            d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"
                        />
                        <Path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466" />
                    </Svg>
                    <Text style={{ color: colors.text, fontSize: 20, fontWeight: 'bold' }}>
                        Undo
                    </Text>
                </Pressable>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        flex: 1,
                        marginBottom: '5%',
                    }}>
                    <View
                        style={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            flex: 1,
                            // backgroundColor: 'green',
                            height: '100%',
                        }}>
                        <Text style={styles.category_label}>INPUT</Text>
                        <InputButton action={CrescendoActionType.PickupSource} />
                        <InputButton action={CrescendoActionType.PickupGround} />
                    </View>
                    <View
                        style={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            flex: 1,
                            height: '100%',
                            // backgroundColor: 'green',
                        }}>
                        <Text style={styles.category_label}>SCORING</Text>
                        <InputButton action={CrescendoActionType.ScoreSpeaker} />
                        <InputButton action={CrescendoActionType.ScoreAmp} />
                        <InputButton
                            action={CrescendoActionType.MissSpeaker}
                            color={'red'}
                        />
                        <InputButton action={CrescendoActionType.MissAmp} color={'red'} />
                    </View>
                </View>
            </View>
        </Modal>
    );
};
