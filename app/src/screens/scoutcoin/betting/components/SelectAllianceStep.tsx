import { useTheme } from "@react-navigation/native";
import { BettingInfoStep } from "./BettingInfoStep";
import { Image, Pressable } from "react-native";
import { BottomSheetView } from "@gorhom/bottom-sheet";

export const SelectAllianceStep = () => {
    const { colors } = useTheme();
    return (
        <BettingInfoStep index={1} title="FormSelect an alliance" nextScreen="SelectAmount" isFinalScreen={true}>
            <BottomSheetView style={{ flexDirection: "row", gap: 20, width: "100%" }}>
                <Pressable
                    style={{
                        backgroundColor: colors.card,
                        opacity: 1,
                        padding: 20,
                        borderRadius: 10,
                        flex: 1,
                    }}
                >
                    <Image
                        source={require("../../../../assets/dozerblue.png")}
                        style={{
                            width: "100%",
                            height: null,
                            aspectRatio: 1,
                        }}
                    />
                </Pressable>
                <Pressable
                    style={{
                        backgroundColor: colors.card,
                        opacity: 0.5,
                        padding: 20,
                        borderRadius: 10,
                        flex: 1,
                    }}
                >
                    <Image
                        source={require("../../../../assets/dozerred.png")}
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
};
