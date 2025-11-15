import type { PropsWithChildren } from "react";
import { View } from "react-native";

export interface ActionRowProps extends PropsWithChildren {}
export function ActionRow({ children }: ActionRowProps) {
    "use memo";

    return (
        <View
            style={{
                display: "flex",
                flexDirection: "row",
                marginTop: 16,
                gap: 16,
                flex: 1,
            }}
            children={children}
        />
    );
}
