import { ScrollView, View } from "react-native";
import { UIText } from "../../../ui/UIText";
import { useEffect, useState } from "react";
import { useTheme } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Clipboard from "@react-native-clipboard/clipboard";
import { SafeAreaView } from "react-native-safe-area-context";
import { UIList } from "../../../ui/UIList";
import BottomSheet from "@gorhom/bottom-sheet";
import Animated, { useSharedValue } from "react-native-reanimated";
import Toast from "react-native-toast-message";
import * as Bs from "../../../ui/icons";
import { PressableOpacity } from "../../../ui/components/PressableOpacity";

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
        <SafeAreaView edges={{ bottom: "off", top: "off" }} style={{ width: "100%", height: "100%" }}>
            <Animated.View style={{ height: sheetPosition }}>
                <UIList onRefresh={getAllKeys}>
                    {[
                        UIList.Section({
                            items: keys?.map((key, i) =>
                                UIList.Label({
                                    key,
                                    onPress: () => selectKey(key),
                                    label: key,
                                    body: () => (
                                        <PressableOpacity onPress={() => deleteKey(key)}>
                                            <Bs.Trash size={20} color={colors.notification} />
                                        </PressableOpacity>
                                    ),
                                })
                            ),
                        }),
                    ]}
                </UIList>
            </Animated.View>

            <BottomSheet
                animatedPosition={sheetPosition}
                backgroundStyle={{
                    backgroundColor: colors.background,
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
                    <View style={{ padding: 8, borderBottomWidth: 1, borderColor: colors.border }}>
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
