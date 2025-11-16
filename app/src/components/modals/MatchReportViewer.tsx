import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { type Theme, useTheme } from "@react-navigation/native";
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
import { HistorySelectorModal } from "./HistorySelectorModal.tsx";
import * as Bs from "../../ui/icons";
import { exMemo } from "../../lib/util/react/memo.ts";
import { Form } from "../../lib/forms";
import { FormQuestion } from "../../forms/components/FormQuestion.tsx";
import { UITextInput } from "../../ui/input/UITextInput.tsx";

export interface MatchReportViewerProps {
    ref?: React.Ref<MatchReportViewer>;
    onDismiss: () => void;

    data: MatchReportReturnData;

    isOfflineForm: boolean;
    navigateToTeamViewer: () => void;
    onEdit: (orig: MatchReportReturnData, edited: MatchReportReturnData) => Promise<boolean>;
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
            <UISheetModal ref={modalRef} backdropPressBehavior="close" onDismiss={onDismiss} handleComponent={null}>
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
                        setFormData(formHistory.find((history) => history.historyId === id)!.data);
                        // this is a very crude way of detecting if this is the first/current form
                        // todo: should probably improve if/once a better method is devised
                        if (formHistory.length && id === formHistory[0].historyId) {
                            setHistoryButtonEnabled(false);
                            setSelectedHistoryId(null);
                        }
                    }}
                />
                {!editing && (
                    <UISheet.Header
                        title={"Scout Report"}
                        left={
                            !selectedHistoryId
                                ? {
                                      text: "Edit",
                                      color: Color.parse(colors.primary),
                                      onPress: () => setEditing(true),
                                  }
                                : !editing && historyButtonVisible
                                ? {
                                      icon: Bs.ClockHistory,
                                      color: Color.parse(historyButtonEnabled ? colors.text : colors.primary),
                                      onPress: () => {
                                          setHistorySelectorModalVisible(true);
                                          setHistoryButtonEnabled(true);
                                      },
                                  }
                                : null
                        }
                        right={{
                            text: "Done",
                            color: Color.parse(colors.primary),
                            onPress: () => modalRef.current?.dismiss(),
                        }}
                    />
                )}
                {editing && (
                    <UISheet.Header
                        title={"Scout Report"}
                        left={{
                            text: "Cancel",
                            color: Color.parse(colors.notification),
                            onPress: () => setEditing(false),
                        }}
                        right={{
                            text: "Save",
                            color: Color.parse(colors.primary),
                            onPress: () => setEditing(false),
                        }}
                    />
                )}
                <ScrollView style={{ flex: 1, padding: 16 }}>
                    <ReportMetadataView data={data} navigateToTeamViewer={navigateToTeamViewer} userName={userName} />

                    {data.form.map((field, index) => (
                        <View key={index}>
                            {field.type === Form.ItemType.heading ? (
                                <Text style={s.sectionTitle}>{field.title}</Text>
                            ) : field.type === Form.ItemType.radio ||
                              field.type === Form.ItemType.textbox ||
                              field.type === Form.ItemType.checkbox ? (
                                <View style={{ padding: 8 }}>
                                    <FormQuestion title={field.question} required={field.required}>
                                        {field.type === Form.ItemType.radio && (
                                            <UIRadio
                                                disabled={!editing}
                                                options={field.options}
                                                onInput={(value) => {}}
                                                value={field.options[formData[index]]}
                                            />
                                        )}
                                        {field.type === Form.ItemType.checkbox && (
                                            <UICheckboxes
                                                disabled={!editing}
                                                options={field.options}
                                                onInput={(value) => {}}
                                                value={formData[index] ?? []}
                                            />
                                        )}
                                        {field.type === Form.ItemType.textbox && (
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
                                        backgroundColor: index % 2 === 0 ? colors.card : "transparent",
                                        padding: 8,
                                        borderRadius: 8,
                                    }}
                                >
                                    <FormQuestion title={field.question} required={field.required} inline>
                                        {formData[index] === null ? (
                                            <Text style={s.na}>N/A</Text>
                                        ) : (
                                            <Text
                                                style={{
                                                    color: colors.text,
                                                    fontWeight: "bold",
                                                    fontSize: 20,
                                                    marginLeft: "auto",
                                                    textAlign: "center",
                                                    paddingHorizontal: 32,
                                                }}
                                            >
                                                {formData[index] ?? ""}
                                            </Text>
                                        )}
                                    </FormQuestion>
                                </View>
                            )}
                        </View>
                    ))}
                </ScrollView>
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
                <Text
                    style={{
                        fontSize: 30,
                        fontWeight: "bold",
                        color: colors.text,
                    }}
                >
                    Team #{data.teamNumber}
                </Text>
            </Pressable>
            <Text style={{ color: colors.text }}>
                Round {data.matchNumber} of {data.competitionName}
            </Text>
            {userName !== null && <Text style={{ color: colors.text }}>Submitted by {userName}</Text>}
            <Text style={{ color: colors.text }}>{new Date(data.createdAt).toLocaleString()}</Text>
        </View>
    );
}

const getStyles = exMemo((colors: Theme["colors"]) =>
    StyleSheet.create({
        sectionTitle: {
            color: colors.text,
            fontSize: 18,
            textAlign: "center",
            fontWeight: "bold",
            marginTop: 32,
            marginBottom: 8,
        },
        na: {
            color: colors.notification,
            fontWeight: "bold",
            flexWrap: "wrap",
            fontSize: 15,
            flex: 1,
        },
    })
);
