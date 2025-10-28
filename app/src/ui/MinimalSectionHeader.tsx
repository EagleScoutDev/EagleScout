import { Text } from "react-native";
import { useTheme } from "@react-navigation/native";

export interface MinimalSectionHeaderProps {
    title: string;
}
export function MinimalSectionHeader({ title }: MinimalSectionHeaderProps) {
    "use memo";
    const { colors } = useTheme();

    return (
        <Text
            style={{
                color: colors.text,
                opacity: 0.6, //< TODO: no
                fontWeight: "bold",
                fontSize: 12,
                paddingLeft: "2%",
                paddingTop: "2%",
            }}
        >
            {title.toUpperCase()}
        </Text>
    );
}
