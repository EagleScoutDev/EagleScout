import { BettingInfoStep } from "./BettingInfoStep";
import { Pressable } from "react-native";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { useTheme } from "@/ui/context/ThemeContext";
import { Image } from "expo-image";

export function SelectAllianceStep() {
    const { colors } = useTheme();
    return (
        <BettingInfoStep
            index={1}
            title="FormSelect an alliance"
            nextScreen="SelectAmount"
            isFinalScreen={true}
        >
            <BottomSheetView style={{ flexDirection: "row", gap: 20, width: "100%" }}>
                <Pressable
                    style={{
                        backgroundColor: colors.bg1.hex,
                        opacity: 1,
                        padding: 20,
                        borderRadius: 10,
                        flex: 1,
                    }}
                >
                    <Image
                        source={require("../../../assets/images/dozerblue.png")}
                        style={{
                            width: "100%",
                            height: null,
                            aspectRatio: 1,
                        }}
                    />
                </Pressable>
                <Pressable
                    style={{
                        backgroundColor: colors.bg1.hex,
                        opacity: 0.5,
                        padding: 20,
                        borderRadius: 10,
                        flex: 1,
                    }}
                >
                    <Image
                        source={require("../../../assets/images/dozerred.png")}
                        style={{
                            width: "100%",
                            height: null,
                            aspectRatio: 1,
                        }}
                    />
                </Pressable>
            </BottomSheetView>
        </BettingInfoStep>
    );
}
