import { useState } from "react";
import { Alert, FlatList, Pressable, View } from "react-native";
import { useMutation, useQuery } from "@tanstack/react-query";
import * as Bs from "@/ui/icons";
import type { DataTabScreenProps } from "../index";
import { useTheme } from "@/ui/context/ThemeContext";
import { UIText } from "@/ui/components/UIText";
import { StandardButton } from "@/ui/StandardButton";
import { queries } from "@/lib/queries";
import { picklistMutations } from "@/lib/mutations/picklists";
import { useCurrentCompetition } from "@/lib/stores/currentComp";

export interface PicklistsProps extends DataTabScreenProps<"Picklists"> {}
export function Picklists({ navigation }: PicklistsProps) {
    const { colors } = useTheme();
    const [hoveredPicklistID, setHoveredPicklistID] = useState<number | null>(null);

    const { comp: currentCompetition } = useCurrentCompetition(true);

    const { data: picklists = [] } = useQuery({
        ...queries.picklists.forCompetition({ competitionId: currentCompetition?.id ?? -1 }),
        select: (data) =>
            [...data].sort((a, b) => {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }),
        enabled: !!currentCompetition?.id && currentCompetition.id !== -1,
    });

    const deletePicklist = useMutation(picklistMutations.delete);

    return (
        <View style={{ flex: 1, paddingBottom: 10 }}>
            {!currentCompetition || currentCompetition.id === -1 ? (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <UIText>There is no competition happening currently.</UIText>
                </View>
            ) : (
                <>
                    {picklists.length === 0 && (
                        <UIText size={20} style={{ textAlign: "center", marginTop: "5%" }}>
                            No picklists found.{"\n"}Create one to get started!
                        </UIText>
                    )}
                    <FlatList
                        data={picklists}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <PicklistItem
                                item={item}
                                hoveredPicklistID={hoveredPicklistID}
                                setHoveredPicklistID={setHoveredPicklistID}
                                colors={colors}
                                navigation={navigation}
                                currentCompID={currentCompetition.id}
                                onDelete={async () => {
                                    try {
                                        await deletePicklist.mutateAsync(item.id);
                                    } catch (error) {
                                        console.error(error);
                                    }
                                }}
                            />
                        )}
                    />
                    <StandardButton
                        color={colors.primary.hex}
                        onPress={() => {
                            navigation.navigate("Picklists/Create", {
                                picklistId: -1,
                                currentCompID: currentCompetition.id,
                            });
                        }}
                        text="Create Picklist"
                    />
                </>
            )}
        </View>
    );
}

function PicklistItem({
    item,
    hoveredPicklistID,
    setHoveredPicklistID,
    colors,
    navigation,
    currentCompID,
    onDelete,
}: any) {
    const { data: creatorProfile } = useQuery(queries.profiles.forId({ id: item.createdBy }));

    return (
        <Pressable
            key={item.id}
            onPressIn={() => {
                setHoveredPicklistID(item.id);
            }}
            onPressOut={() => {
                setHoveredPicklistID(null);
            }}
            onPress={() => {
                navigation.navigate("Picklists/Create", {
                    picklistId: item.id,
                    currentCompID: currentCompID,
                });
            }}
            onLongPress={() => {
                Alert.alert(
                    "Delete Picklist",
                    "Are you sure you want to delete this picklist?",
                    [
                        {
                            text: "Cancel",
                            style: "cancel",
                        },
                        {
                            text: "Delete",
                            onPress: onDelete,
                        },
                    ],
                    { cancelable: false },
                );
            }}
            style={{
                backgroundColor: colors.bg1.hex,
                padding: "5%",
                borderRadius: 10,
                marginTop: "5%",
                marginHorizontal: "5%",
                flexDirection: "row",
                borderWidth: hoveredPicklistID === item.id ? 1.5 : 1,
                borderColor: hoveredPicklistID === item.id ? colors.primary.hex : colors.border.hex,
            }}
        >
            <View>
                <UIText size={20} bold>
                    {item.name}
                </UIText>
                <UIText size={12} placeholder>
                    By {creatorProfile?.name || "Unknown"}, at{" "}
                    {new Date(item.createdAt).toLocaleString()}
                </UIText>
            </View>
            <Bs.ChevronRight
                size="20"
                fill="gray"
                style={{ position: "absolute", right: "5%", top: "80%" }}
            />
        </Pressable>
    );
}
