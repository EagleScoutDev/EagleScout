import { View } from "react-native";
import { UIText } from "../ui/UIText";
import { StandardButton } from "./StandardButton";
import * as Bs from "./icons";
import { useTheme } from "@react-navigation/native";

export interface NoInternetProps {
    onRefresh: () => void;
}

export function NoInternet({ onRefresh }: NoInternetProps) {
    "use memo";
    const { colors } = useTheme();

    return (
        <View
            style={{
                backgroundColor: colors.card,
                borderRadius: 10,
                paddingTop: 20,
                margin: 10,
                borderWidth: 2,
                borderColor: "red",
            }}
        >
            <Bs.WifiOff width="100%" height="40%" fill={colors.text} />

            <View
                style={{
                    padding: "4%",
                }}
            >
                <UIText size={25} bold style={{ textAlign: "center" }}>
                    No Internet Connection
                </UIText>
                <UIText style={{ textAlign: "center" }}>Press the button below to try again.</UIText>
                <StandardButton text={"Refresh"} color={"red"} onPress={() => onRefresh()} />
            </View>
        </View>
    );
}
