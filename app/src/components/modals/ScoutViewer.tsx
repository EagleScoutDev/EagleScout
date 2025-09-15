import {
    Alert,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    StyleSheet,
    Pressable,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { RadioButtons } from '../form/RadioButtons';
import { Checkboxes } from '../form/Checkboxes';
import { supabase } from '../../lib/supabase';
import { FormHelper } from '../../FormHelper';
import { type UserAttributeReturnData } from '../../database/UserAttributes';
import { type MatchReportHistory, type MatchReportReturnData } from '../../database/ScoutMatchReports';
import { SliderType } from '../form/SliderType';
import { HistorySelectorModal } from './HistorySelectorModal';
import { isTablet } from '../../lib/deviceType';
import { ClockHistory, PencilSquare, SendFill, X } from '../icons/icons.generated';

const DEBUG = false;

/**
 * This component displays the scout data in a modal.
 * @param visible - whether the modal is visible
 * @param setVisible - function to set the visibility of the modal
 * @param data - the data to display
 * @param chosenComp - the competition that the data is from
 * @param updateFormData - function to update the form data visually
 * @param isOfflineForm - whether the data is from an offline form
 * @returns {JSX.Element} - the scout viewer
 */
export interface ScoutViewerProps {
    visible: boolean
    setVisible: React.Dispatch<React.SetStateAction<boolean>>
    data: MatchReportReturnData
    chosenComp: string
    updateFormData: () => void
    isOfflineForm: boolean
    navigateToTeamViewer: () => void
}
export function ScoutViewer({
    visible,
    setVisible,
    data,
    chosenComp,
    updateFormData,
    isOfflineForm,
    navigateToTeamViewer,
}: ScoutViewerProps) {
    const { colors } = useTheme();
    const [userName, setUserName] = useState('');
    const [formData, setFormData] = useState(data.data);

    // editing state:
    const [editingActive, setEditingActive] = useState(false);

    // history state:
    const [historySelectorModalVisible, setHistorySelectorModalVisible] =
        useState(false);
    // this controls the color of the history button - true: blue, false: grey
    const [historyButtonEnabled, setHistoryButtonEnabled] = useState(false);
    // this will be false if there is no history to show (i.e. the report has never been edited)
    const [historyButtonVisible, setHistoryButtonVisible] = useState(true);
    const [selectedHistoryId, setSelectedHistoryId] = useState<number | null>(0);

    // this only holds the data of the form, since the form questions should remain the same
    // this is a writable copy of the data
    const [tempData, setTempData] = useState([]);
    // this holds the metadata of the form (comp id, match id, etc)
    const [formMetaData, setFormMetaData] = useState(null);
    // this is the history of the form fetched from scout_edit_reports
    const [formHistory, setFormHistory] = useState<MatchReportHistory[]>([]);

    const refreshHistory = useCallback(async () => {
        setHistoryButtonVisible(false);
        if (data && !isOfflineForm) {
            const history = await MatchReportsDB.getReportHistory(data.reportId);
            if (history.length !== 0) {
                setHistoryButtonVisible(true);
                setFormHistory(history);
            }
        }
    }, [data, isOfflineForm]);

    useEffect(() => {
        (async () => {
            await refreshHistory();
        })();
    }, [data, isOfflineForm, refreshHistory]);

    const [authUserId, setAuthUserId] = useState<string | null>(null);
    const [authUserAttributes, setAuthUserAttributes] = useState<UserAttributeReturnData | null>(null);
    useEffect(() => {
        (async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            setAuthUserId(user!.id);
            const att = await UserAttributes.getCurrentUserAttribute();
            setAuthUserAttributes(att);
        })();
    }, []);

    const styles = StyleSheet.create({
        modal_container: {
            alignSelf: 'center',
            backgroundColor: colors.background,
            padding: '5%',
            // marginTop: '8%',
            height: '100%',
            width: '100%',
        },
        breadcrumbs: {
            color: colors.text,
            opacity: 0.8,
            fontSize: 12,
            fontStyle: 'italic',
            textAlign: 'center',
            marginTop: isTablet() ? '0%' : '10%',
        },
        close: {
            color: colors.notification,
            fontWeight: 'bold',
            fontSize: 17,
            padding: '2%',
        },
        team_title: {
            fontSize: 30,
            fontWeight: 'bold',
            color: colors.text,
            textAlign: 'center',
            marginTop: 10,
            marginBottom: 5,
        },
        report_info: {
            textAlign: 'center',
            color: colors.text,
        },
        section_title: {
            // set the color to be the opposite of the background
            color: colors.text,
            fontSize: 18,
            textAlign: 'center',
            fontWeight: 'bold',
            margin: '6%',
            textDecorationLine: 'underline',
        },
        no_info: {
            color: colors.notification,
            fontWeight: 'bold',
            flexWrap: 'wrap',
            fontSize: 15,
            flex: 1,
        },
        question: {
            color: editingActive ? colors.primary : colors.text,
            fontSize: 15,
            fontWeight: '600',
            // wrap text if it's too long
            flex: 1,
            flexWrap: 'wrap',
            paddingBottom: 5,
        },
    });

    useEffect(() => {
        if (data != null) {
            setTempData(data.data);
            setFormMetaData(data);
        }
    }, [data]);

    useEffect(() => {
        /**
         * This function gets the user's name from the database
         * allowing it to be displayed in the scout viewer.
         * @returns {Promise<void>}
         */
        const getUserName = async () => {
            const res = await supabase
                .from('profiles')
                .select('name')
                .eq('id', data.userId)
                .single();
            if (res.error) {
                console.error(res.error);
            } else if (data) {
                setUserName(res.data.name);
            } else {
                console.error('data is null, cannot get username');
            }
        };
        if (!isOfflineForm) {
            getUserName().then(r => {
                if (DEBUG) {
                    console.log('creator of scout report found');
                }
            });
        } else {
            setUserName('You');
        }
    }, [data]);

    useEffect(() => {
        if (DEBUG) {
            console.log('printing out individual scout report data: ');
            console.log(data);
            console.log('finished printing.');
        }
    }, [data]);

    return (
        <Modal
            animationType="slide"
            visible={visible}
            transparent={true}
            presentationStyle={'overFullScreen'}>
            <HistorySelectorModal
                formHistory={formHistory}
                selectedHistoryId={selectedHistoryId}
                visible={historySelectorModalVisible}
                setVisible={setHistorySelectorModalVisible}
                onHistorySelect={(id: number | null) => {
                    setHistorySelectorModalVisible(false);
                    if (id == null) {
                        // user dismissed the modal
                        return;
                    }
                    setSelectedHistoryId(id);
                    setFormData(formHistory.find(history => history.historyId === id)!.data)
                    // this is a very crude way of detecting if this is the first/current form
                    // todo: should probably improve if/once a better method is devised
                    if (formHistory.length && id === formHistory[0].historyId) {
                        setHistoryButtonEnabled(false);
                        setSelectedHistoryId(null);
                    }
                }}
            />
            <View style={styles.modal_container}>
                <TouchableOpacity onPress={() => setVisible(false)}>
                    <Text style={styles.breadcrumbs}>
                        {chosenComp} / Round {data ? data.matchNumber : ''}{' '}
                    </Text>
                </TouchableOpacity>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                    {(authUserId === data.userId ||
                        (authUserAttributes && authUserAttributes.admin) ||
                        isOfflineForm) && (
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    gap: 20,
                                }}>
                                {!selectedHistoryId && (
                                    <TouchableOpacity
                                        onPress={() => {
                                            if (!editingActive) {
                                                setEditingActive(true);
                                                return;
                                            }
                                            // if the data is different than the temp data, then we should ask the user to save
                                            if (
                                                !tempData.every(
                                                    (value, index) => value === data.data[index],
                                                )
                                            ) {
                                                Alert.alert(
                                                    'Save Changes?',
                                                    'Are you sure you want to save these changes?',
                                                    [
                                                        {
                                                            text: 'Cancel',
                                                            onPress: () => {
                                                                console.log('Cancel Pressed');
                                                            },
                                                            style: 'cancel',
                                                        },
                                                        {
                                                            text: 'Save',
                                                            onPress: async () => {
                                                                console.log('Save Pressed');
                                                                for (let i = 0; i < tempData.length; i++) {
                                                                    if (
                                                                        data.form[i].required &&
                                                                        (tempData[i] == null || tempData[i] === '')
                                                                    ) {
                                                                        Alert.alert(
                                                                            'Missing Required Fields',
                                                                            'Please fill in all required fields.',
                                                                            [
                                                                                {
                                                                                    text: 'OK',
                                                                                    onPress: () => { },
                                                                                    style: 'cancel',
                                                                                },
                                                                            ],
                                                                        );
                                                                        return;
                                                                    }
                                                                }
                                                                if (isOfflineForm) {
                                                                    await FormHelper.editFormOffline(
                                                                        tempData,
                                                                        data.createdAt,
                                                                    );
                                                                    setEditingActive(false);
                                                                } else {
                                                                    await MatchReportsDB.editOnlineScoutReport(
                                                                        formMetaData.reportId,
                                                                        tempData,
                                                                    );
                                                                }
                                                                setEditingActive(false);
                                                                updateFormData(tempData);
                                                                setFormData(tempData);
                                                                await refreshHistory();
                                                            },
                                                        },
                                                    ],
                                                );
                                            } else {
                                                setEditingActive(false);
                                            }
                                        }}>
                                        <PencilSquare
                                            size="30"
                                            fill={editingActive ? colors.primary : colors.text}
                                            style={{
                                                padding: '2%',
                                                opacity: editingActive ? 1 : 0.6,
                                            }}
                                        />
                                    </TouchableOpacity>
                                )}
                                {!editingActive && historyButtonVisible && (
                                    <TouchableOpacity
                                        onPress={() => {
                                            setHistorySelectorModalVisible(true);
                                            setHistoryButtonEnabled(true);
                                        }}>
                                        <ClockHistory
                                            size="30"
                                            fill={historyButtonEnabled ? colors.text : colors.primary}
                                            style={{
                                                padding: '2%',
                                            }}
                                        />
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}
                    <TouchableOpacity
                        onPress={() => {
                            if (
                                !tempData.every((value, index) => value === data.data[index])
                            ) {
                                Alert.alert(
                                    'Cancel Changes?',
                                    'Are you sure you want to cancel these changes?',
                                    [
                                        {
                                            text: 'No',
                                            onPress: () => {
                                                console.log('Cancel Pressed');
                                            },
                                            style: 'cancel',
                                        },
                                        {
                                            text: 'Yes',
                                            onPress: () => {
                                                console.log('Yes Pressed');
                                                setEditingActive(false);
                                                setTempData(data.data);
                                                setVisible(false);
                                            },
                                        },
                                    ],
                                );
                                return;
                            }
                            setVisible(false);
                        }}>
                        <X
                            size="40"
                            fill={colors.notification}
                            style={{
                                padding: '2%',
                            }}
                        />
                    </TouchableOpacity>
                </View>
                <ScrollView>
                    <View
                        style={{
                            borderRadius: 10,
                            padding: '5%',
                        }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <Text style={styles.team_title}>Team #{data.teamNumber}</Text>
                            <Pressable
                                onPress={() => {
                                    navigateToTeamViewer();
                                }}>
                                <SendFill size="16" fill="gray" />
                            </Pressable>
                        </View>
                        <Text style={styles.report_info}>
                            Round {data ? data.matchNumber : ''}
                        </Text>
                        <Text style={styles.report_info}>By: {userName}</Text>
                        <Text style={styles.report_info}>
                            {new Date(data.createdAt).toLocaleString()}
                        </Text>
                    </View>

                    {data.form.map((field, index) => (
                        <View key={index}>
                            {/*If the entry has a text property, this indicates that it is a header, or section divider*/}
                            {field.title && (
                                <Text style={styles.section_title}>{field.title}</Text>
                            )}
                            {/*If the entry has a question property, this indicates that it is a question*/}
                            {field.question && formData[index] != null && (
                                <View
                                    style={{
                                        flexDirection:
                                            field.type === 'radio' ||
                                                field.type === 'textbox' ||
                                                field.type === 'checkboxes' ||
                                                (editingActive && field.type === 'number' && field.slider)
                                                ? 'column'
                                                : 'row',
                                        justifyContent: 'space-between',
                                        // add a background if the index is even
                                        backgroundColor:
                                            index % 2 === 0 ? colors.border : 'transparent',
                                        padding: 10,
                                        margin: 5,
                                        borderRadius: 10,
                                    }}>
                                    {/*SliderType renders its own custom question text, so we shouldn't render a question here
                  if the field is a slider*/}
                                    {/*SliderType is only used when editing is active*/}
                                    {(!editingActive || !field.slider) &&
                                        field.type !== 'checkboxes' && (
                                            <Text style={styles.question}>{field.question}</Text>
                                        )}
                                    {field.type === 'radio' && (
                                        <View>
                                            <RadioButtons
                                                title={''}
                                                colors={colors}
                                                options={field.options}
                                                onValueChange={value => {
                                                    console.log(
                                                        'radio button value changed to: ' + value,
                                                    );
                                                    let a = [...tempData];
                                                    console.log(
                                                        'index of value: ' + field.options.indexOf(value),
                                                    );
                                                    a[index] = field.options.indexOf(value);
                                                    setTempData(a);
                                                }}
                                                value={field.options[tempData[index]]}
                                                disabled={!editingActive}
                                            />
                                        </View>
                                    )}
                                    {editingActive &&
                                        ((field.type === 'number' && !field.slider) ||
                                            field.type === 'textbox') && (
                                            <TextInput
                                                style={{
                                                    flex: 1,
                                                    textAlign:
                                                        field.type === 'textbox' ? 'left' : 'center',
                                                    alignSelf:
                                                        field.type === 'textbox' ? 'flex-start' : 'center',
                                                    // make text box seem editable
                                                    backgroundColor: colors.background,
                                                    borderColor: colors.border,
                                                    // field.required && tempData[index] == null
                                                    //   ? colors.notification
                                                    //   : colors.border,
                                                    borderWidth: 1,
                                                    borderRadius: 5,
                                                    padding: 5,
                                                    width: '100%',
                                                    fontSize: 20,
                                                    color: colors.text,
                                                }}
                                                keyboardType={
                                                    field.type === 'number' ? 'numeric' : 'default'
                                                }
                                                value={
                                                    tempData[index] != null
                                                        ? tempData[index].toString()
                                                        : null
                                                }
                                                placeholderTextColor={colors.notification}
                                                onChangeText={value => {
                                                    let a = [...tempData];
                                                    if (field.type === 'number') {
                                                        if (value === '' || !/^\d+$/.test(value)) {
                                                            a[index] = null;
                                                            setTempData(a);
                                                            return;
                                                        }
                                                        a[index] = Number.parseInt(value, 10);
                                                    } else {
                                                        a[index] = value;
                                                    }
                                                    setTempData(a);
                                                }}
                                                multiline={true}
                                            />
                                        )}
                                    {editingActive && field.type === 'number' && field.slider && (
                                        // it is a number slider
                                        <View>
                                            <SliderType
                                                min={field.low ? Number.parseInt(field.low, 10) : 0}
                                                max={field.high ? Number.parseInt(field.high, 10) : 10}
                                                step={field.step ? Number.parseInt(field.step, 10) : 1}
                                                question={field.question}
                                                value={tempData[index]}
                                                onValueChange={value => {
                                                    let a = [...tempData];
                                                    a[index] = value;
                                                    setTempData(a);
                                                }}
                                                disabled={!editingActive}
                                                minLabel={field.minLabel}
                                                maxLabel={field.maxLabel}
                                            />
                                        </View>
                                    )}
                                    {field.type === 'checkboxes' && (
                                        <View>
                                            <Checkboxes
                                                title={field.question}
                                                options={field.options}
                                                value={tempData[index]}
                                                disabled={!editingActive}
                                                colors={colors}
                                                editingActive={editingActive}
                                                onValueChange={value => {
                                                    let a = [...tempData];
                                                    a[index] = value;
                                                    setTempData(a);
                                                }}
                                            />
                                        </View>
                                    )}
                                    {field.type !== 'radio' &&
                                        field.type !== 'checkboxes' &&
                                        !editingActive && (
                                            <Text
                                                style={{
                                                    color: colors.text,
                                                    fontWeight: 'bold',
                                                    flexWrap: 'wrap',
                                                    fontSize: 20,
                                                    flex: 1,
                                                    // move this to the rightmost side of the screen
                                                    textAlign:
                                                        field.type === 'textbox' ? 'left' : 'center',
                                                    // align vertically
                                                    alignSelf:
                                                        field.type === 'textbox' ? 'flex-start' : 'center',
                                                }}>
                                                {formData[index].toString()}
                                            </Text>
                                        )}
                                    {!editingActive &&
                                        (tempData[index] == null || tempData[index] === '') && (
                                            <Text style={styles.no_info}>N/A</Text>
                                        )}
                                </View>
                            )}
                        </View>
                    ))}
                </ScrollView>
            </View>
        </Modal>
    );
};
