import { usePreventRemove, useTheme } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { FormsDB } from "../../../../database/Forms.ts";
import { Form } from "../../../../lib/forms";
import * as Bs from "../../../../ui/icons";
import Animated, { useSharedValue } from "react-native-reanimated";
import DraggableFlatList, { ScaleDecorator } from "react-native-draggable-flatlist";
import { key } from "../../../../lib/react/util/key.ts";
import type { DataMenuScreenProps } from "../../../data/DataMain.tsx";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { Alert, Keyboard, View } from "react-native";
import { AsyncAlert } from "../../../../lib/react/util/AsyncAlert.ts";
import { FormInfoCard } from "./components/FormInfoCard.tsx";
import { UICard } from "../../../../ui/UICard.tsx";
import { arr } from "../../../../lib/util/im.ts";
import { FormItemPalette } from "./components/FormItemPalette.tsx";
import { UISheet } from "../../../../ui/UISheet.tsx";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { UISheetModal } from "../../../../ui/UISheetModal.tsx";
import { Color } from "../../../../lib/color.ts";
import { FormItemOptions } from "./components/FormItemOptions.tsx";
import { FormItemInfo } from "./components/FormItemInfo.tsx";
import ItemType = Form.ItemType;

export interface FormCreatorParams {
    form: Form | null;
}
export function FormCreator({ route, navigation }: DataMenuScreenProps<"Forms/Edit">) {
    const { form } = route.params;

    const { colors } = useTheme();

    const [title, setTitle] = useState(form?.name ?? "");
    // const [description, setDescription] = useState(form??.description ?? "");
    const [isPit, setIsPit] = useState(false);
    const [items, setItems] = useState<Form.Structure>(form?.formStructure ?? []);

    const [editDraft, setEditDraft] = useState<Form.Item | null>(null);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const editSheetRef = useRef<BottomSheetModal>(null);

    const hasUnsavedChanges = items.length > 0;
    const sheetPosition = useSharedValue(0);

    usePreventRemove(hasUnsavedChanges, ({ data }) => {
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
        } catch (e) {
            console.error(e);
            return Alert.alert("Error", "An error occurred, try again later.");
        }

        await AsyncAlert.alert("Success", "Form added successfully!");
        navigation.goBack();
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
        <View style={{ flex: 1, backgroundColor: colors.card }}>
            <Animated.View style={{ height: sheetPosition }}>
                <DraggableFlatList
                    contentContainerStyle={{
                        flexDirection: "column",
                        paddingHorizontal: 15,
                        paddingTop: 5,
                        paddingBottom: "100%",
                    }}
                    onDragEnd={({ data }) => setItems(data)}
                    ListHeaderComponent={
                        <UICard>
                            <FormInfoCard title={title} setTitle={setTitle} isPit={isPit} setIsPit={setIsPit} />
                        </UICard>
                    }
                    data={items}
                    // TODO: this is very bad but fixing it would require database changes
                    keyExtractor={(item) => key(item)}
                    renderItem={({ item, drag, isActive, getIndex }) => {
                        return (
                            <ScaleDecorator>
                                <Animated.View>
                                    <UICard
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
                                    </UICard>
                                </Animated.View>
                            </ScaleDecorator>
                        );
                    }}
                />
            </Animated.View>
            <UISheet animatedPosition={sheetPosition} snapPoints={[90]} enableDynamicSizing={false}>
                <BottomSheetView>
                    <FormItemPalette
                        items={ITEMS}
                        onPress={(key) => {
                            setEditDraft(ITEM_MAP[key].draft());
                            setEditIndex(items.length);
                            editSheetRef.current?.present();
                        }}
                    />
                </BottomSheetView>
            </UISheet>

            <UISheetModal ref={editSheetRef} handleComponent={null} gap={"25%"} keyboardBehavior={"extend"}>
                <UISheet.Header
                    left={{
                        text: "Cancel",
                        color: Color.parse(colors.notification),
                        onPress: () => {
                            Keyboard.dismiss();
                            editSheetRef.current?.dismiss();
                        },
                    }}
                    right={{
                        text: "Done",
                        color: Color.parse(colors.primary),
                        onPress: () => {
                            Keyboard.dismiss();
                            const item = finishDraft(editDraft!);
                            if (typeof item === "string") {
                                Alert.alert("Error", item);
                            } else {
                                setItems(arr.set(items, editIndex!, item));
                                editSheetRef.current?.dismiss();
                            }
                        },
                    }}
                />
                {editDraft !== null && <FormItemOptions value={editDraft} onChange={setEditDraft} />}
            </UISheetModal>
        </View>
    );
}

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
    ITEMS.map((x) => [x.key, x])
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
