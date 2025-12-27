import { BottomSheetTextInput, useBottomSheetInternal } from "@gorhom/bottom-sheet";
import { TextInput, type TextInputProps as RNTextInputProps } from "react-native";
import { TextInput as RNGHTextInput } from "react-native-gesture-handler";
import React from "react";

export function AutoTextInput(props: Omit<RNTextInputProps, "ref">) {
    const bottomSheet = useBottomSheetInternal(true) !== null;

    return React.createElement(
        bottomSheet ? BottomSheetTextInput : (RNGHTextInput as unknown as typeof TextInput), //< FIXME: this unchecked cast is used for now because RNGH native wrappers don't play nice with exactOptionalPropertyTypes
        props,
    );
}
