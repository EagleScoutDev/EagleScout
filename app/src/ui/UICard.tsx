import type { PropsWithChildren } from "react";
import { Text, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { type UINumberInputProps } from "./input/UINumberInput";
import { NumberInput as RNNumberInput } from "./components/NumberInput";
import {
    OrientationChooser as UIOrientationChooser,
    type OrientationChooserProps as UIOrientationChooserProps,
} from "../components/OrientationChooser";
import {
    AllianceChooser as UIAllianceChooser,
    type AllianceChooserProps as UIAllianceChooserProps,
} from "../components/AllianceChooser";

export interface UICard extends PropsWithChildren {
    title?: string;
}
export function UICard({ title, children }: UICard) {
    "use memo";

    const { colors } = useTheme();

    return (
        <View
            style={{
                backgroundColor: colors.card,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 10,
                padding: 16,
                width: "100%",
                gap: 16,
            }}
        >
            {typeof title === "string" && (
                <Text style={{ color: "gray", fontSize: 14, fontWeight: "bold", textTransform: "uppercase" }}>
                    {title}
                </Text>
            )}
            {children}
        </View>
    );
}

export namespace UICard {
    export interface NumberInputProps extends UINumberInputProps {
        label: string;
        error?: string | null | undefined;
    }
    export function NumberInput({ label, error, ...props }: NumberInputProps) {
        "use memo";

        const { colors } = useTheme();

        return (
            <View>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-evenly",
                    }}
                >
                    <Text style={{ color: colors.text, fontSize: 16, fontWeight: "bold" }}>{label}</Text>
                    <RNNumberInput
                        {...props}
                        style={[
                            {
                                borderColor: "gray",
                                borderBottomWidth: 2,
                                padding: 10,
                                color: colors.text,
                                fontFamily: "monospace",
                                minWidth: "20%",
                                textAlign: "center",
                            },
                            props.style,
                        ]}
                    />
                </View>

                {typeof error === "string" && (
                    <Text style={{ color: colors.notification, textAlign: "center", marginTop: 8 }}>{error}</Text>
                )}
            </View>
        );
    }

    export interface OrientationChooserProps extends UIOrientationChooserProps {
        label?: string;
    }
    export function OrientationChooser({ label, ...props }: OrientationChooserProps) {
        "use memo";

        const { colors } = useTheme();

        return (
            <View style={{ marginTop: 8, width: "100%", alignItems: "center" }}>
                {typeof label === "string" && (
                    <Text
                        style={{
                            color: colors.text,
                            fontSize: 16,
                            fontWeight: "bold",
                            marginBottom: 8,
                        }}
                    >
                        {label}
                    </Text>
                )}
                <UIOrientationChooser {...props} />
            </View>
        );
    }

    export interface AllianceChooserProps extends UIAllianceChooserProps {
        label?: string;
    }
    export function AllianceChooser({ label, ...props }: AllianceChooserProps) {
        "use memo";

        const { colors } = useTheme();

        return (
            <View style={{ marginTop: 8, width: "100%", alignItems: "center" }}>
                {typeof label === "string" && (
                    <Text
                        style={{
                            color: colors.text,
                            fontSize: 16,
                            fontWeight: "bold",
                            marginBottom: 8,
                        }}
                    >
                        {label}
                    </Text>
                )}
                <UIAllianceChooser {...props} />
            </View>
        );
    }
}
