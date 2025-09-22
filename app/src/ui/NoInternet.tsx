import { Text, View } from "react-native";
import { StandardButton } from "./StandardButton";
import * as Bs from "./icons";
import { useTheme } from "@react-navigation/native";

export interface NoInternetProps {
    onRefresh: () => void;
}

export function NoInternet({ onRefresh }: NoInternetProps) {
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
                <Text
                    style={{
                        color: colors.text,
                        fontWeight: "bold",
                        fontSize: 25,
                        textAlign: "center",
                    }}
                >
                    No Internet Connection
                </Text>
                <Text style={{ color: colors.text, textAlign: "center" }}>Press the button below to try again.</Text>
                <StandardButton text={"Refresh"} color={"red"} onPress={() => onRefresh()} />
            </View>
        </View>
    );
}
