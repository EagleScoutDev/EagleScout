// source: https://github.com/danish1658/react-native-dropdown-select-list/blob/main/components/SelectList.tsx
// changes:
// - removed custom styling functionality
// - remove disabled mode
// - changes to styling
// - change icon set
import { Animated, Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { type FC, useEffect, useMemo, useRef, useState } from "react";
import { type Theme, useTheme } from "@react-navigation/native";
import * as Bs from "../../icons";

interface Data {
    key: any;
    value: any;
}

export interface SelectListProps<T> {
    setSelected: (x: T) => void;

    placeholder?: string;

    maxHeight?: number;

    options: Data[];
    defaultOption?: Data;

    onSelect?: () => void;
    notFoundText?: string;
}

export function FormSelect<T>({
    setSelected,
    placeholder,
    maxHeight,
    options,
    defaultOption,
    notFoundText = "No forms found",
    onSelect = () => {},
}: SelectListProps<T>) {
    const theme = useTheme();
    const styles = useMemo(() => makeStyles(theme), [theme]);
    const oldOption = useRef(null);
    const [_firstRender, _setFirstRender] = useState<boolean>(true);
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
    const [selectedVal, setSelectedVal] = useState<any>("");
    const [height, setHeight] = useState<number>(200);
    const animatedHeight = useRef(new Animated.Value(0)).current;
    const [filteredData, setFilteredData] = useState(options);

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
        setFilteredData(options);
    }, [options]);

    useEffect(() => {
        if (_firstRender) {
            _setFirstRender(false);
            return;
        }
        onSelect();
    }, [selectedVal]);

    useEffect(() => {
        if (!_firstRender && defaultOption && oldOption.current !== defaultOption.key) {
            // oldOption.current != null
            oldOption.current = defaultOption.key;
            setSelected(defaultOption.key);
            setSelectedVal(defaultOption.value);
        }
        if (defaultOption && _firstRender && defaultOption.key) {
            oldOption.current = defaultOption.key;
            setSelected(defaultOption.key);
            setSelectedVal(defaultOption.value);
        }
    }, [defaultOption]);

    return (
        <View
            style={{
                width: "100%",
            }}
        >
            {dropdownOpen ? (
                <View style={styles.wrapper}>
                    <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.optionText}>{placeholder ? placeholder : "FormSelect"}</Text>
                        </View>
                        <TouchableOpacity onPress={() => closeDropdown()}>
                            <Bs.X size="20" fill={theme.colors.text} />
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <TouchableOpacity
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
                </TouchableOpacity>
            )}
            {dropdownOpen && (
                <Animated.View style={[{ maxHeight: animatedHeight }, styles.dropdown]}>
                    <ScrollView
                        contentContainerStyle={{ paddingVertical: 10, overflow: "hidden" }}
                        nestedScrollEnabled={true}
                    >
                        {filteredData.length >= 1 ? (
                            filteredData.map((item: Data, index: number) => {
                                let key = item.key ?? item.value ?? item;
                                let value = item.value ?? item;
                                return (
                                    <TouchableOpacity
                                        style={styles.option}
                                        key={index}
                                        onPress={() => {
                                            setSelected(key);
                                            setSelectedVal(value);
                                            closeDropdown();
                                            setTimeout(() => {
                                                setFilteredData(options);
                                            }, 800);
                                        }}
                                    >
                                        <Text style={styles.optionText}>{value}</Text>
                                    </TouchableOpacity>
                                );
                            })
                        ) : (
                            <TouchableOpacity
                                style={styles.option}
                                onPress={() => {
                                    setSelected(null);
                                    setSelectedVal("");
                                    closeDropdown();
                                    setTimeout(() => setFilteredData(options), 800);
                                }}
                            >
                                <Text style={styles.optionText}>{notFoundText}</Text>
                            </TouchableOpacity>
                        )}
                    </ScrollView>
                </Animated.View>
            )}
        </View>
    );
}

const makeStyles = ({ colors }: Theme) =>
    StyleSheet.create({
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
    });
