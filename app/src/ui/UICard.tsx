import type { PropsWithChildren } from "react";
import { View } from "react-native";

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
import { UIText } from "./UIText";
import { Color } from "../lib/color.ts";
import { useTheme } from "../lib/contexts/ThemeContext.ts";

export interface UICard extends PropsWithChildren {
    title?: string;
}
export function UICard({ title, children }: UICard) {
    "use memo";

    const { colors } = useTheme();

    return (
        <View
            style={{
                backgroundColor: colors.bg1.hex,
                borderWidth: 1,
                borderColor: colors.border.hex,
                borderRadius: 10,
                padding: 16,
                width: "100%",
                gap: 16,
            }}
        >
            {typeof title === "string" && (
                <UIText size={14} bold level={1} style={{ textTransform: "uppercase" }}>
                    {title}
                </UIText>
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
                    <UIText size={16} bold>
                        {label}
                    </UIText>
                    <RNNumberInput
                        {...props}
                        style={[
                            {
                                borderColor: "gray",
                                borderBottomWidth: 2,
                                padding: 10,
                                color: colors.fg.hex,
                                fontFamily: "monospace",
                                minWidth: "20%",
                                textAlign: "center",
                            },
                            props.style,
                        ]}
                    />
                </View>

                {typeof error === "string" && (
                    <UIText color={Color.parse(colors.danger.hex)} style={{ textAlign: "center", marginTop: 8 }}>
                        {error}
                    </UIText>
                )}
            </View>
        );
    }

    export interface OrientationChooserProps extends UIOrientationChooserProps {
        label?: string;
    }
    export function OrientationChooser({ label, ...props }: OrientationChooserProps) {
        "use memo";

        return (
            <View style={{ marginTop: 8, width: "100%", alignItems: "center" }}>
                {typeof label === "string" && (
                    <UIText size={16} bold style={{ marginBottom: 8 }}>
                        {label}
                    </UIText>
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

        return (
            <View style={{ marginTop: 8, width: "100%", alignItems: "center" }}>
                {typeof label === "string" && (
                    <UIText size={16} bold style={{ marginBottom: 8 }}>
                        {label}
                    </UIText>
                )}
                <UIAllianceChooser {...props} />
            </View>
        );
    }
}
