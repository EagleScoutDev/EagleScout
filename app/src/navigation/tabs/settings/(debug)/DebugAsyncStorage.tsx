import { ScrollView, View } from "react-native";
import * as Bs from "@/ui/icons";
import { useEffect, useState } from "react";
import AsyncStorage from "expo-sqlite/kv-store";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomSheet from "@gorhom/bottom-sheet";
import Animated, { useSharedValue } from "react-native-reanimated";
import Toast from "react-native-toast-message";
import { PressableOpacity } from "@/components/PressableOpacity";
import { useTheme } from "@/ui/context/ThemeContext";
import { UIList } from "@/ui/components/UIList";
import { UIText } from "@/ui/components/UIText";
import Clipboard from "expo-clipboard";

export function DebugAsyncStorage() {
    const [keys, setKeys] = useState<readonly string[]>([]);

    const [currentKey, setCurrentKey] = useState<string | null>(null);
    const [currentValue, setCurrentValue] = useState<string | null>(null);
    const { colors } = useTheme();

    const sheetPosition = useSharedValue(0);

    async function getAllKeys() {
        try {
            setKeys(await AsyncStorage.getAllKeys());
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        getAllKeys();
    }, []);
    useEffect(() => {
        console.log(keys);
    }, [keys]);

    async function selectKey(key: string) {
        setCurrentKey(key);
        setCurrentValue(await AsyncStorage.getItem(key));
    }
    async function deleteKey(key: string) {
        await AsyncStorage.removeItem(key);
        setCurrentKey(null);
        setCurrentValue(null);
    }

    return (
        <SafeAreaView
            edges={{ bottom: "off", top: "off" }}
            style={{ width: "100%", height: "100%" }}
        >
            <Animated.View style={{ height: sheetPosition }}>
                <UIList onRefresh={getAllKeys}>
                    <UIList.Section>
                        {keys?.map((key) => (
                            <UIList.Label
                                key={key}
                                onPress={() => selectKey(key)}
                                label={key}
                                body={() => (
                                    <PressableOpacity onPress={() => deleteKey(key)}>
                                        <Bs.Trash size={20} color={colors.danger.hex} />
                                    </PressableOpacity>
                                )}
                            />
                        ))}
                    </UIList.Section>
                </UIList>
            </Animated.View>

            <BottomSheet
                animatedPosition={sheetPosition}
                backgroundStyle={{
                    backgroundColor: colors.bg0.hex,
                    borderRadius: 24,
                }}
                style={{
                    boxShadow: [
                        {
                            offsetX: 0,
                            offsetY: 0,
                            color: "rgba(0,0,0,0.125)",
                            blurRadius: 8,
                            spreadDistance: 1,
                        },
                    ],
                    borderRadius: 24,
                }}
                snapPoints={["25%", "50%", "75%", "95%"]}
                index={1}
                enableDynamicSizing={false}
            >
                <View style={{ flex: 1, padding: 8 }}>
                    <View
                        style={{ padding: 8, borderBottomWidth: 1, borderColor: colors.border.hex }}
                    >
                        <UIText
                            size={16}
                            style={{ fontFamily: "monospace" }}
                            onPress={() => {
                                if (currentKey === null) return;
                                Clipboard.setString(currentKey);
                                Toast.show({
                                    text1: "Copied to clipboard!",
                                });
                            }}
                        >
                            {currentKey}
                        </UIText>
                    </View>
                    <ScrollView style={{ padding: 8 }}>
                        <UIText
                            style={{ fontFamily: "monospace" }}
                            onPress={() => {
                                if (currentValue === null) return;
                                Clipboard.setString(currentValue);
                                Toast.show({
                                    text1: "Copied to clipboard!",
                                });
                            }}
                        >
                            {currentValue}
                        </UIText>
                    </ScrollView>
                </View>
            </BottomSheet>
        </SafeAreaView>
    );
}
