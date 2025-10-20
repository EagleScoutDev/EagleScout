import type { PropsWithChildren } from "react";
import { Text, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { type UINumberInputProps } from "./input/UINumberInput.tsx";
import { NumberInput as RNNumberInput } from "./components/NumberInput.tsx";
import {
    OrientationChooser as UIOrientationChooser,
    type OrientationChooserProps as UIOrientationChooserProps,
} from "../components/OrientationChooser.tsx";

export interface UICardFormProps extends PropsWithChildren {
    title?: string;
}
export function UICardForm({ title, children }: UICardFormProps) {
    "use memo";

    const { colors } = useTheme();

    return (
        <View style={{ width: "100%", padding: 16 }}>
            <View
                style={{
                    backgroundColor: colors.card,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 10,
                    padding: 16,
                    paddingBottom: 24,
                    width: "100%",
                    gap: 16,
                }}
            >
                {typeof title === "string" && <Text style={{ color: "gray", fontSize: 14, fontWeight: "bold", textTransform: "uppercase" }}>
                    {title}
                </Text>}
                {children}
            </View>
        </View>
    );
}

export namespace UICardForm {
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

    export interface OrientationChooserProps extends UIOrientationChooserProps {}
    export function OrientationChooser(props: OrientationChooserProps) {
        "use memo";

        const { colors } = useTheme();

        return (
            <View style={{ marginTop: 8, width: "100%", alignItems: "center" }}>
                <Text
                    style={{
                        color: colors.text,
                        fontSize: 16,
                        fontWeight: "bold",
                        marginBottom: 8,
                    }}
                >
                    Field Orientation
                </Text>
                <UIOrientationChooser {...props} />
            </View>
        );
    }
}
