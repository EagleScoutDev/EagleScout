import { useEffect, useRef, useState } from "react";
import { FormsDB } from "@/lib/database/Forms";
import { Form } from "@/lib/forms";
import DraggableFlatList, { ScaleDecorator } from "react-native-draggable-flatlist";
import { key } from "@/lib/util/react/key";
import type { DataTabScreenProps } from "@/navigation/tabs/data";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { Alert, Keyboard, StyleSheet } from "react-native";
import { AsyncAlert } from "@/lib/util/react/AsyncAlert";
import { FormInfoCard } from "./components/FormInfoCard";
import { FormItemPalette } from "./components/FormItemPalette";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { FormItemOptions } from "./components/FormItemOptions";
import { FormItemInfo } from "./components/FormItemInfo";
import { Pressable } from "react-native-gesture-handler";
import { Arrays } from "@/lib/util/Arrays";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { usePreventRemove } from "@react-navigation/native";
import { useTheme } from "@/ui/context/ThemeContext";
import { UISheet } from "@/ui/components/UISheet";
import { UISheetModal } from "@/ui/components/UISheetModal";
import * as Bs from "@/ui/icons";
import type { Theme } from "@/ui/lib/theme";
import ItemType = Form.ItemType;

export interface FormCreatorParams {
    form: Form | null;
}
export function FormCreator({ route, navigation }: DataTabScreenProps<"Forms/Edit">) {
    const { form } = route.params;

    const { colors } = useTheme();
    const styles = getStyles(colors);

    const [title, setTitle] = useState(form?.name ?? "");
    // const [description, setDescription] = useState(form??.description ?? "");
    const [isPit, setIsPit] = useState(false);
    const [items, setItems] = useState<Form.Structure>(form?.formStructure ?? []);
    const [dirty, setDirty] = useState(false); //< If there are unsaved changes

    const editSheetRef = useRef<BottomSheetModal>(null);
    const [editDraft, setEditDraft] = useState<Form.Item | null>(null);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const isNewItem = editIndex === items.length;

    usePreventRemove(dirty, ({ data }) => {
        Alert.alert("Unsaved changes", "Are you sure you want to leave? Your work will be lost!", [
            { text: "Stay", style: "cancel", isPreferred: true, onPress: () => {} },
            { text: "Leave", style: "destructive", onPress: () => navigation.dispatch(data.action) },
        ]);
    });

    async function trySubmit() {
        try {
            if (title === "") return Alert.alert("Error", "Please enter a form title.");

            await FormsDB.addForm({
                name: title,
                formStructure: items,
                pitScouting: isPit,
            });
            setDirty(false);

            await AsyncAlert.alert("Success", "Form added successfully!");
            navigation.goBack();
        } catch (e) {
            console.error(e);
            Alert.alert("Error", "An error occurred, try again later.");
        }
    }

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <HeaderButtons preset={"tabHeader"}>
                    <Item title={"Submit"} onPress={trySubmit} />
                </HeaderButtons>
            ),
        });
    }, [navigation, trySubmit]);

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg1.hex }}>
                <DraggableFlatList
                    contentContainerStyle={styles.canvasContent}
                    onDragEnd={({ data }) => setItems(data)}
                    ListHeaderComponent={
                        <Pressable style={styles.item}>
                            <FormInfoCard title={title} setTitle={setTitle} isPit={isPit} setIsPit={setIsPit} />
                        </Pressable>
                    }
                    data={items}
                    // TODO: this is very bad but fixing it would require database changes
                    keyExtractor={(item) => key(item)}
                    renderItem={({ item, drag, isActive, getIndex }) => {
                        return (
                            <ScaleDecorator>
                                <Pressable
                                    style={styles.item}
                                    onPress={() => {
                                        setEditDraft(item);
                                        setEditIndex(getIndex()!);
                                        editSheetRef.current?.present();
                                    }}
                                    delayLongPress={100}
                                    onLongPress={drag}
                                    disabled={isActive}
                                >
                                    <FormItemInfo item={item} />
                                </Pressable>
                            </ScaleDecorator>
                        );
                    }}
                />
                <UISheet enableDynamicSizing>
                    <BottomSheetView>
                        <SafeAreaView style={{ flex: 1 }}>
                            <FormItemPalette
                                items={ITEMS}
                                onPress={(key) => {
                                    setEditDraft(ITEM_MAP[key].draft());
                                    setEditIndex(items.length);
                                    editSheetRef.current?.present();
                                }}
                            />
                        </SafeAreaView>
                    </BottomSheetView>
                </UISheet>

                <UISheetModal ref={editSheetRef} handleComponent={null} keyboardBehavior={"extend"}>
                    <UISheet.Header
                        left={{
                            text: "Cancel",
                            color: colors.danger,
                            onPress: () => {
                                Keyboard.dismiss();
                                editSheetRef.current?.dismiss();
                            },
                        }}
                        right={{
                            text: "Done",
                            color: colors.primary,
                            onPress: () => {
                                Keyboard.dismiss();
                                const item = finishDraft(editDraft!);
                                if (typeof item === "string") {
                                    Alert.alert("Error", item);
                                } else {
                                    setItems(Arrays.set(items, editIndex!, item));
                                    setDirty(true);
                                    editSheetRef.current?.dismiss();
                                    setEditDraft(null);
                                    setEditIndex(null);
                                }
                            },
                        }}
                    />
                    {editDraft !== null && (
                        <FormItemOptions
                            value={editDraft}
                            onChange={setEditDraft}
                            isNewItem={isNewItem}
                            onDelete={() => {
                                setItems(items.toSpliced(editIndex!, 1));
                                setDirty(true);
                                editSheetRef.current?.dismiss();
                                setEditDraft(null);
                                setEditIndex(null);
                            }}
                        />
                    )}
                </UISheetModal>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
const getStyles = (colors: Theme["colors"]) =>
    StyleSheet.create({
        canvasContent: {
            paddingHorizontal: 15,
            paddingTop: 5,
            paddingBottom: "100%",
        },
        item: {
            marginVertical: 2.5,
            width: "100%",
            borderRadius: 16,
            backgroundColor: colors.bg0.hex,
            boxShadow: [
                {
                    offsetX: 1,
                    offsetY: 1,
                    color: "rgba(0,0,0,0.075)",
                    blurRadius: 1,
                    spreadDistance: 0.25,
                },
            ],
            padding: 20,
        },
    });

export const ITEMS = [
    {
        key: "heading",
        icon: Bs.CardHeading,
        name: "Heading",
        draft: (): Form.Heading => ({
            type: Form.ItemType.heading,
            title: "",
            description: "",
        }),
    },
    {
        key: "radio",
        icon: Bs.UiRadios,
        name: "Multiple Choice",
        draft: (): Form.Radio => ({
            type: Form.ItemType.radio,
            question: "",
            required: false,
            options: [""],
            defaultIndex: 0,
        }),
    },
    {
        key: "checks",
        icon: Bs.UiChecksGrid,
        name: "Checkboxes",
        draft: (): Form.Checkboxes => ({
            type: Form.ItemType.checkbox,
            question: "",
            required: false,
            options: [""],
        }),
    },
    {
        key: "number",
        icon: Bs.OneTwoThree,
        name: "Number",
        draft: (): Form.Number => ({
            type: Form.ItemType.number,
            question: "",
            required: false,
            slider: false,
            low: null,
            high: null,
            step: 1,
        }),
    },
    {
        key: "slider",
        icon: Bs.Sliders,
        name: "Slider",
        draft: (): Form.Slider => ({
            type: Form.ItemType.number,
            question: "",
            required: false,
            slider: true,
            lowLabel: null,
            highLabel: null,
            low: 0,
            high: 10,
            step: 1,
        }),
    },
    {
        key: "textbox",
        icon: Bs.InputCursorText,
        name: "Short Answer",
        draft: (): Form.Textbox => ({
            type: Form.ItemType.textbox,
            question: "",
            required: false,
        }),
    },
] as const;
export const ITEM_MAP: { readonly [T in (typeof ITEMS)[number] as T["key"]]: T } = Object.fromEntries(
    ITEMS.map((x) => [x.key, x]),
) as any;

function finishDraft(item: Form.Item): string | Form.Item {
    if (item.type === ItemType.heading) {
        item = { ...item, title: item.title.trim(), description: item.description.trim() };
        if (item.title === "") return "Please enter a title";
        return item;
    }

    item = { ...item, question: item.question.trim() };
    if (item.question === "") return "Please enter a question.";

    if (item.type === ItemType.radio || item.type === ItemType.checkbox) {
        item = { ...item, options: item.options.map((x) => x.trim()).filter((x) => !!x) };
        if (item.options.length === 0) return "At least one non-empty option is required.";
        return item;
    } else if (item.type === ItemType.number) {
        if (item.slider) {
            item = {
                ...item,
                lowLabel: item.lowLabel?.trim() || null,
                highLabel: item.highLabel?.trim() || null,
            };
            if (item.low > item.high) return "Slider minimum value cannot be greater than the maximum.";
            return item;
        } else {
            return item;
        }
    } else if (item.type === ItemType.textbox) {
        return item;
    }

    return item;
}
