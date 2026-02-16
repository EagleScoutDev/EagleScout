import { useTheme } from "@/ui/context/ThemeContext";
import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { queries } from "@/lib/queries";
import { ActivityIndicator, TextInput, View } from "react-native";
import * as Bs from "@/ui/icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { UIListPicker } from "@/ui/components/UIListPicker";
import { KeyboardController } from "react-native-keyboard-controller";
import { UIText } from "@/ui/components/UIText";
import { PressableOpacity } from "@/components/PressableOpacity";
import { useCurrentCompetition } from "@/lib/hooks/useCurrentCompetition";

export interface HeaderProps {
    query: string | null;
    setQuery: (query: string | null) => void;

    activeComp: number | null;
    setActiveComp: (id: number) => void;

    placeholder: string;
}
export function Header({ query, setQuery, activeComp, setActiveComp, placeholder }: HeaderProps) {
    const { colors } = useTheme();

    const searching = query !== null;
    const searchRef = useRef<TextInput>(null);

    return (
        <SafeAreaView
            edges={["top", "left", "right"]}
            style={{
                width: "100%",
                backgroundColor: colors.bg2.hex,
                borderColor: colors.border.hex,
                borderBottomWidth: 1,
            }}
        >
            <View
                style={{
                    width: "100%",
                    paddingLeft: 8,
                    height: 56,
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                {searching ? (
                    <View
                        style={{
                            flex: 1,
                            flexDirection: "row",
                            alignItems: "center",
                            padding: 8,
                            gap: 8,
                        }}
                    >
                        <Bs.Search size={20} fill={colors.placeholder.hex} />

                        <TextInput
                            ref={searchRef}
                            style={{ color: colors.fg.hex, fontSize: 16, flex: 1 }}
                            onChangeText={setQuery}
                            value={query ?? ""}
                            placeholderTextColor={colors.placeholder.hex}
                            placeholder={placeholder}
                            autoFocus
                        />
                    </View>
                ) : (
                    <CompetitionSelector activeComp={activeComp} setActiveComp={setActiveComp} />
                )}

                <PressableOpacity
                    style={{ padding: 16 }}
                    onPress={() => {
                        if (searching) {
                            setQuery(null);
                            KeyboardController.dismiss();
                        } else {
                            setQuery("");
                        }
                    }}
                >
                    {searching ? (
                        <Bs.XLg size={24} fill={colors.fg.hex} />
                    ) : (
                        <Bs.Search size={24} fill={colors.fg.hex} />
                    )}
                </PressableOpacity>
            </View>
        </SafeAreaView>
    );
}

interface CompetitionSelectorProps {
    activeComp: number | null;
    setActiveComp: (id: number) => void;
}
function CompetitionSelector({ activeComp, setActiveComp }: CompetitionSelectorProps) {
    const { colors } = useTheme();

    const compPickerRef = useRef<UIListPicker>(null);

    const { data: competitions, isLoading: competitionsLoading } = useQuery({
        ...queries.competitions.all,
        select: (comps) => new Map(comps.map((comp) => [comp.id, comp])),
        throwOnError: true,
    });

    // TODO: don't use a separate fetch for this
    const { competition: currentCompetition } = useCurrentCompetition();
    useEffect(() => {
        if(activeComp === null && currentCompetition !== null) {
            setActiveComp(currentCompetition.id)
        }
    }, [currentCompetition]);

    return (
        <PressableOpacity
            style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                padding: 8,
                gap: 8,
            }}
            onPress={() => compPickerRef.current?.present()}
        >
            {competitionsLoading || competitions === undefined ? (
                <>
                    <View style={{ width: 20, height: 20 }}>
                        <ActivityIndicator size="small" color={colors.fg.hex} />
                    </View>
                    <UIText size={18}>No competition</UIText>
                </>
            ) : (
                <>
                    <Bs.ChevronExpand size={20} fill={colors.fg.hex} />
                    <UIListPicker
                        ref={compPickerRef}
                        title="Select Competition"
                        options={Array.from(competitions.keys())}
                        value={activeComp}
                        onChange={setActiveComp}
                        render={(id) => ({
                            name: competitions.get(id)?.name ?? "Unknown Competition",
                        })}
                        Display={({ value: id, render }) => (
                            <UIText size={18} ellipsizeMode={"middle"}>
                                {id === null ? "No competition" : render(id).name}
                            </UIText>
                        )}
                    />
                </>
            )}
        </PressableOpacity>
    );
}
