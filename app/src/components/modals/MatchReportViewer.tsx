import { Pressable, StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { UIRadio } from "../../ui/input/UIRadio.tsx";
import { UICheckboxes } from "../../ui/input/UICheckboxes.tsx";
import { UISheetModal, type UISheetModal as UISheetModalType } from "../../ui/UISheetModal.tsx";
import { UISheet } from "../../ui/UISheet.tsx";
import { Color } from "../../lib/color.ts";
import { supabase } from "../../lib/supabase.ts";
import { type UserAttributeReturnData, UserAttributesDB } from "../../database/UserAttributes.ts";
import {
    type MatchReportHistory,
    type MatchReportReturnData,
    MatchReportsDB,
} from "../../database/ScoutMatchReports.ts";
import { exMemo } from "../../lib/util/react/memo.ts";
import { Form } from "../../lib/forms";
import { FormQuestion } from "../../forms/components/FormQuestion.tsx";
import { UITextInput } from "../../ui/input/UITextInput.tsx";
import { UIText } from "../../ui/UIText.tsx";
import { useTheme } from "../../lib/contexts/ThemeContext.ts";
import { SafeAreaInsetsContext, SafeAreaProvider } from "react-native-safe-area-context";

export interface MatchReportViewerProps {
    ref?: React.Ref<MatchReportViewer>;
    onDismiss: () => void;

    data: MatchReportReturnData;

    isOfflineForm: boolean;
    navigateToTeamViewer: () => void;
    onEdit?: (orig: MatchReportReturnData, edited: MatchReportReturnData) => Promise<boolean>;
}
export interface MatchReportViewer {
    present(): void;
    dismiss(): void;
}
export function MatchReportViewer({
    ref,
    onDismiss,
    data,
    isOfflineForm,
    navigateToTeamViewer,
    onEdit,
}: MatchReportViewerProps) {
    "use memo";

    const { colors } = useTheme();
    const s = getStyles(colors);

    const modalRef = useRef<UISheetModalType>(null);
    const [userName, setUserName] = useState<null>(null);
    const formData = data.data;

    useImperativeHandle(ref, () => ({
        present() {
            modalRef.current?.present();
        },
        dismiss() {
            modalRef.current?.dismiss();
        },
    }));

    const [editing, setEditing] = useState(false);

    const [historySelectorModalVisible, setHistorySelectorModalVisible] = useState(false);
    const [historyButtonEnabled, setHistoryButtonEnabled] = useState(false);
    const [historyButtonVisible, setHistoryButtonVisible] = useState(true);
    const [selectedHistoryId, setSelectedHistoryId] = useState<number | null>(0);

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
            const att = await UserAttributesDB.getCurrentUserAttribute();
            setAuthUserAttributes(att);
        })();
    }, []);

    async function fetchUsername() {
        if (isOfflineForm) {
            setUserName(null);
        } else {
            const { error, data: res } = await supabase.from("profiles").select("name").eq("id", data.userId).single();
            if (error) {
                console.error(error);
                setUserName(null);
                return;
            }

            setUserName(res?.name ?? null);
        }
    }
    useEffect(() => void fetchUsername(), [data]);

    const canEdit = authUserId === data.userId || (authUserAttributes && authUserAttributes.admin) || isOfflineForm;

    return (
        <>
            <UISheetModal
                ref={modalRef}
                backdropPressBehavior="close"
                onDismiss={onDismiss}
                handleComponent={null}
                enablePanDownToClose
            >
                {!editing && (
                    <UISheet.Header
                        title={"Scout Report"}
                        left={
                            !!onEdit &&
                            !selectedHistoryId && {
                                text: "Edit",
                                color: Color.parse(colors.primary.hex),
                                onPress: () => setEditing(true),
                            }
                        }
                        right={{
                            text: "Done",
                            color: Color.parse(colors.primary.hex),
                            onPress: () => modalRef.current?.dismiss(),
                        }}
                    />
                )}
                {editing && (
                    <UISheet.Header
                        title={"Scout Report"}
                        left={{
                            text: "Cancel",
                            color: Color.parse(colors.danger.hex),
                            onPress: () => setEditing(false),
                        }}
                        right={{
                            text: "Save",
                            color: Color.parse(colors.primary.hex),
                            onPress: () => setEditing(false),
                        }}
                    />
                )}
                <SafeAreaProvider>
                    <SafeAreaInsetsContext.Consumer
                        children={(insets) => {
                            console.log(insets);
                            return (
                                <FlatList
                                    contentContainerStyle={{ padding: 16 }}
                                    scrollIndicatorInsets={{ bottom: 34 }}
                                    ListHeaderComponent={
                                        <ReportMetadataView
                                            data={data}
                                            navigateToTeamViewer={navigateToTeamViewer}
                                            userName={userName}
                                        />
                                    }
                                    data={data.form}
                                    renderItem={({ item, index }) => (
                                        <View key={index}>
                                            {item.type === Form.ItemType.heading ? (
                                                <UIText style={s.sectionTitle}>{item.title}</UIText>
                                            ) : item.type === Form.ItemType.radio ||
                                              item.type === Form.ItemType.textbox ||
                                              item.type === Form.ItemType.checkbox ? (
                                                <View style={{ padding: 8 }}>
                                                    <FormQuestion title={item.question} required={item.required}>
                                                        {item.type === Form.ItemType.radio && (
                                                            <UIRadio
                                                                disabled={!editing}
                                                                options={item.options}
                                                                onInput={(value) => {}}
                                                                value={item.options[formData[index]]}
                                                            />
                                                        )}
                                                        {item.type === Form.ItemType.checkbox && (
                                                            <UICheckboxes
                                                                disabled={!editing}
                                                                options={item.options}
                                                                onInput={(value) => {}}
                                                                value={formData[index] ?? []}
                                                            />
                                                        )}
                                                        {item.type === Form.ItemType.textbox && (
                                                            <UITextInput
                                                                multiline={true}
                                                                disabled={!editing}
                                                                placeholder={"Type here"}
                                                                value={formData[index]}
                                                                onChangeText={(value) => {}}
                                                            />
                                                        )}
                                                    </FormQuestion>
                                                </View>
                                            ) : (
                                                <View
                                                    style={{
                                                        backgroundColor:
                                                            index % 2 === 0 ? colors.bg1.hex : "transparent",
                                                        padding: 8,
                                                        borderRadius: 8,
                                                    }}
                                                >
                                                    <FormQuestion title={item.question} required={item.required} inline>
                                                        {formData[index] === null ? (
                                                            <UIText style={s.na}>N/A</UIText>
                                                        ) : (
                                                            <UIText
                                                                style={{
                                                                    color: colors.fg.hex,
                                                                    fontWeight: "bold",
                                                                    fontSize: 20,
                                                                    marginLeft: "auto",
                                                                    textAlign: "center",
                                                                    paddingHorizontal: 32,
                                                                }}
                                                            >
                                                                {formData[index] ?? ""}
                                                            </UIText>
                                                        )}
                                                    </FormQuestion>
                                                </View>
                                            )}
                                        </View>
                                    )}
                                />
                            );
                        }}
                    />
                </SafeAreaProvider>
            </UISheetModal>
        </>
    );
}

function ReportMetadataView({
    data,
    userName,
    navigateToTeamViewer,
}: {
    data: MatchReportReturnData;
    userName: string | null;
    navigateToTeamViewer: () => void;
}) {
    "use memo";

    const { colors } = useTheme();

    return (
        <View style={{ alignItems: "center" }}>
            <Pressable style={{ flexDirection: "row", justifyContent: "center" }} onPress={navigateToTeamViewer}>
                <UIText
                    style={{
                        fontSize: 30,
                        fontWeight: "bold",
                        color: colors.fg.hex,
                    }}
                >
                    Team #{data.teamNumber}
                </UIText>
            </Pressable>
            <UIText style={{ color: colors.fg.hex }}>
                Round {data.matchNumber} of {data.competitionName}
            </UIText>
            {userName !== null && <UIText style={{ color: colors.fg.hex }}>Submitted by {userName}</UIText>}
            <UIText style={{ color: colors.fg.hex }}>{new Date(data.createdAt).toLocaleString()}</UIText>
        </View>
    );
}

const getStyles = exMemo((colors: Theme["colors"]) =>
    StyleSheet.create({
        sectionTitle: {
            color: colors.fg.hex,
            fontSize: 18,
            textAlign: "center",
            fontWeight: "bold",
            marginTop: 32,
            marginBottom: 8,
        },
        na: {
            color: colors.danger.hex,
            fontWeight: "bold",
            flexWrap: "wrap",
            fontSize: 15,
            flex: 1,
        },
    })
);
