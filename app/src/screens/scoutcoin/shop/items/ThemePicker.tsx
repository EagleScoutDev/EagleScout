import { Pressable, ScrollView, Text, View } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FormHelper } from "../../../../FormHelper.ts";
import { useTheme } from "@react-navigation/native";
import { ThemeOptions, ThemeOptionsMap } from "../../../../themes";

export interface ThemePickerProps {
    setTheme: (theme: ThemeOptions) => void;
}
export function ThemePicker({ setTheme }: ThemePickerProps) {
    "use memo";
    const { colors } = useTheme();
    const [selectedTheme, setSelectedTheme] = useState(ThemeOptions.SYSTEM);

    const saveThemePreference = async (value: ThemeOptions) => {
        try {
            await AsyncStorage.setItem(FormHelper.THEME, value.toString(10));
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        FormHelper.readAsyncStorage(FormHelper.THEME).then((r) => {
            if (r != null) {
                setSelectedTheme(parseInt(r, 10) as ThemeOptions);
            }
        });
    }, []);

    return (
        <View>
            <ScrollView
                style={{
                    margin: 20,
                    padding: 2,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: colors.border,
                    alignContent: "center",
                    height: "36%",
                }}
            >
                {Array.from(ThemeOptionsMap.keys()).map((themeOption) => {
                    return (
                        <Pressable
                            onPress={() => {
                                setSelectedTheme(themeOption);
                                setTheme(themeOption);
                                saveThemePreference(themeOption);
                            }}
                            key={themeOption}
                            style={{
                                flexDirection: "row",
                                flex: 1,
                                borderWidth: 2, //themeOption === selectedTheme ? 2 : 0,
                                borderRadius: 10,
                                borderColor: themeOption === selectedTheme ? colors.text : colors.card,
                                // borderRadius: 10,
                                padding: 10,
                                justifyContent: "space-between",
                                alignItems: "center",
                                backgroundColor: themeOption === selectedTheme ? colors.background : colors.card,
                            }}
                        >
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Text
                                    style={{
                                        color: colors.text,
                                        flex: 1,
                                        fontWeight: "bold",
                                        fontSize: 16,
                                    }}
                                >
                                    {ThemeOptions[themeOption].toLowerCase().charAt(0).toUpperCase() +
                                        ThemeOptions[themeOption].toLowerCase().slice(1)}
                                </Text>

                                <View
                                    style={{
                                        borderRadius: 200,
                                        width: 40,
                                        height: 40,
                                        backgroundColor: ThemeOptionsMap.get(themeOption)?.colors.background,
                                    }}
                                />
                            </View>
                        </Pressable>
                    );
                })}
            </ScrollView>
        </View>
    );
}
