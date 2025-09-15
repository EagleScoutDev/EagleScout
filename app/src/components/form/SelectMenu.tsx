// source: https://github.com/danish1658/react-native-dropdown-select-list/blob/main/components/SelectList.tsx
// changes:
// - removed custom styling functionality
// - remove disabled mode
// - changes to styling
// - change icon set
import {
    Animated,
    Keyboard,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import React, { type FC, useEffect, useMemo, useRef, useState } from 'react';
import { type Theme, useTheme } from '@react-navigation/native';
import { ChevronDown, X, ZoomIn } from '../icons/icons.generated';

interface Data {
    key: any;
    value: any;
}

export interface SelectListProps {
    /**
     * Function to set the selected value of the select list
     */
    setSelected: Function;

    /**
     * Placeholder text that will be displayed in the select box
     */
    placeholder?: string;

    /**
     * Maximum height of the dropdown wrapper to occupy
     */
    maxHeight?: number;

    /**
     * Data which will be iterated as options of select list
     */
    data: Data[];

    /**
     * The default option of the select list
     */
    defaultOption?: Data;

    /**
     * Enable search functionality
     */
    searchEnabled?: boolean;

    /**
     * Placeholder text for search input
     */
    searchPlaceholder?: string;

    /**
     * Trigger an action when option is selected
     */
    onSelect?: () => void;

    /**
     * Text to display when no data is found
     */
    notFoundText?: string;
}

const SelectList: FC<SelectListProps> = ({
    setSelected,
    placeholder,
    maxHeight,
    data,
    defaultOption,
    searchEnabled = false,
    searchPlaceholder = 'Search',
    notFoundText = 'No forms found',
    onSelect = () => { },
}) => {
    const theme = useTheme();
    const styles = useMemo(() => makeStyles(theme), [theme]);
    const oldOption = useRef(null);
    const [_firstRender, _setFirstRender] = useState<boolean>(true);
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
    const [selectedVal, setSelectedVal] = useState<any>('');
    const [height, setHeight] = useState<number>(200);
    const animatedHeight = useRef(new Animated.Value(0)).current;
    const [filteredData, setFilteredData] = useState(data);

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
        setFilteredData(data);
    }, [data]);

    useEffect(() => {
        if (_firstRender) {
            _setFirstRender(false);
            return;
        }
        onSelect();
    }, [selectedVal]);

    useEffect(() => {
        if (
            !_firstRender &&
            defaultOption &&
            oldOption.current !== defaultOption.key
        ) {
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
                width: '100%',
            }}>
            {dropdownOpen ? (
                <View style={styles.wrapper}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        {searchEnabled ? (
                            <>
                                <ZoomIn size="20" style={{ marginRight: 2 }} />
                                <TextInput
                                    placeholder={searchPlaceholder}
                                    onChangeText={val => {
                                        let result = data.filter((item: Data) => {
                                            val.toLowerCase();
                                            let row = item.value.toLowerCase();
                                            return row.search(val.toLowerCase()) > -1;
                                        });
                                        setFilteredData(result);
                                    }}
                                    style={{ padding: 0, height: 20, flex: 1 }}
                                />
                            </>
                        ) : (
                            <View style={{ flex: 1 }}>
                                <Text style={styles.optionText}>
                                    {placeholder ? placeholder : 'Select'}
                                </Text>
                            </View>
                        )}
                        <TouchableOpacity onPress={() => closeDropdown()}>
                            <X size="20" fill={theme.colors.text} />
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
                    }}>
                    <Text style={styles.optionText}>
                        {selectedVal ? selectedVal : placeholder ? placeholder : 'Select'}
                    </Text>
                    <ChevronDown size="20" />
                </TouchableOpacity>
            )}
            {dropdownOpen && (
                <Animated.View style={[{ maxHeight: animatedHeight }, styles.dropdown]}>
                    <ScrollView
                        contentContainerStyle={{ paddingVertical: 10, overflow: 'hidden' }}
                        nestedScrollEnabled={true}>
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
                                                setFilteredData(data);
                                            }, 800);
                                        }}>
                                        <Text style={styles.optionText}>{value}</Text>
                                    </TouchableOpacity>
                                );
                            })
                        ) : (
                            <TouchableOpacity
                                style={styles.option}
                                onPress={() => {
                                    setSelected(undefined);
                                    setSelectedVal('');
                                    closeDropdown();
                                    setTimeout(() => setFilteredData(data), 800);
                                }}>
                                <Text style={styles.optionText}>{notFoundText}</Text>
                            </TouchableOpacity>
                        )}
                    </ScrollView>
                </Animated.View>
            )}
        </View>
    );
};

export default SelectList;

const makeStyles = ({ colors }: Theme) =>
    StyleSheet.create({
        wrapper: {
            borderWidth: 1,
            borderRadius: 10,
            borderColor: 'gray',
            paddingHorizontal: 20,
            paddingVertical: 12,
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        dropdown: {
            borderWidth: 1,
            borderRadius: 10,
            borderColor: 'gray',
            marginTop: 10,
            overflow: 'hidden',
        },
        option: {
            paddingHorizontal: 20,
            paddingVertical: 8,
            overflow: 'hidden',
        },
        optionText: {
            color: colors.text,
        },
    });
