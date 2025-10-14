// source: https://github.com/danish1658/react-native-dropdown-select-list/blob/main/components/SelectList.tsx
// changes:
// - removed custom styling functionality
// - remove disabled mode
// - changes to styling
// - change icon set
import { Animated, Keyboard, ScrollView, StyleSheet, Text, View } from "react-native";
import { useEffect, useRef, useState } from "react";
import { type Theme, useTheme } from "@react-navigation/native";
import * as Bs from "../icons";
import { exMemo } from "../../lib/react/util/memo.ts";
import { PressableOpacity } from "../components/PressableOpacity.tsx";

interface Data {
    key: any;
    name: any;
}

export interface SelectProps<T> {
    options: Data[];
    setSelected: (x: T) => void;

    defaultOption?: Data;
    placeholder?: string;

    maxHeight?: number;
}
export function UISelect<T>({ setSelected, placeholder, maxHeight, options, defaultOption }: SelectProps<T>) {
    const { colors } = useTheme();
    const styles = getStyles(colors);

    const oldOption = useRef(null);
    const [_firstRender, _setFirstRender] = useState<boolean>(true);
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
    const [selectedVal, setSelectedVal] = useState<any>("");
    const [height, setHeight] = useState<number>(200);
    const animatedHeight = useRef(new Animated.Value(0)).current;

    const openDropdown = () => {
        setDropdownOpen(true);
        Animated.timing(animatedHeight, {
            toValue: height,
            duration: 500,
            useNativeDriver: false,
        }).start();
    };
    const closeDropdown = () => {
        Animated.timing(animatedHeight, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
        }).start(() => setDropdownOpen(false));
    };

    useEffect(() => {
        if (maxHeight) {
            setHeight(maxHeight);
        }
    }, [maxHeight]);

    useEffect(() => {
        if (_firstRender) {
            _setFirstRender(false);
            return;
        }
    }, [selectedVal]);

    useEffect(() => {
        if (!_firstRender && defaultOption && oldOption.current !== defaultOption.key) {
            // oldOption.current != null
            oldOption.current = defaultOption.key;
            setSelected(defaultOption.key);
            setSelectedVal(defaultOption.name);
        }
        if (defaultOption && _firstRender && defaultOption.key) {
            oldOption.current = defaultOption.key;
            setSelected(defaultOption.key);
            setSelectedVal(defaultOption.name);
        }
    }, [defaultOption]);

    return (
        <View
            style={styles.container}
        >
            {dropdownOpen ? (
                <View style={styles.wrapper}>
                    <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.optionText}>{placeholder ? placeholder : "FormSelect"}</Text>
                        </View>
                        <PressableOpacity onPress={() => closeDropdown()}>
                            <Bs.X size="20" fill={colors.text} />
                        </PressableOpacity>
                    </View>
                </View>
            ) : (
                <PressableOpacity
                    style={styles.wrapper}
                    onPress={() => {
                        if (!dropdownOpen) {
                            Keyboard.dismiss();
                            openDropdown();
                        } else {
                            closeDropdown();
                        }
                    }}
                >
                    <Text style={styles.optionText}>
                        {selectedVal ? selectedVal : placeholder ? placeholder : "FormSelect"}
                    </Text>
                    <Bs.ChevronDown size="20" />
                </PressableOpacity>
            )}
            {dropdownOpen && (
                <Animated.View style={[{ maxHeight: animatedHeight }, styles.dropdown]}>
                    <ScrollView
                        contentContainerStyle={{ paddingVertical: 10, overflow: "hidden" }}
                        nestedScrollEnabled={true}
                    >
                        {options.map((item: Data, index: number) => {
                            let key = item.key ?? item.name ?? item;
                            let value = item.name ?? item;
                            return (
                                <PressableOpacity
                                    style={styles.option}
                                    key={index}
                                    onPress={() => {
                                        setSelected(key);
                                        setSelectedVal(value);
                                        closeDropdown();
                                    }}
                                >
                                    <Text style={styles.optionText}>{value}</Text>
                                </PressableOpacity>
                            );
                        })}
                    </ScrollView>
                </Animated.View>
            )}
        </View>
    );
}

const getStyles = exMemo((colors: Theme["colors"]) =>
    StyleSheet.create({
        container: {
            width: "100%",
        },
        wrapper: {
            borderWidth: 1,
            borderRadius: 10,
            borderColor: "gray",
            paddingHorizontal: 20,
            paddingVertical: 12,
            flexDirection: "row",
            justifyContent: "space-between",
        },
        dropdown: {
            borderWidth: 1,
            borderRadius: 10,
            borderColor: "gray",
            marginTop: 10,
            overflow: "hidden",
        },
        option: {
            paddingHorizontal: 20,
            paddingVertical: 8,
            overflow: "hidden",
        },
        optionText: {
            color: colors.text,
        },
    })
);
