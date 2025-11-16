import { Alert } from "react-native";

export interface AsyncAlertButton {
    text?: string | undefined;
    isPreferred?: boolean | undefined;
    style?: "default" | "cancel" | "destructive" | undefined;
}
export interface AsyncAlertOptions {
    cancelable?: boolean | undefined;
    userInterfaceStyle?: "unspecified" | "light" | "dark" | undefined;
}
export namespace AsyncAlert {
    export const alert = <B extends AsyncAlertButton[] | Record<string, AsyncAlertButton>>(
        title?: string,
        message?: string,
        buttons?: B,
        options?: AsyncAlertOptions
    ): Promise<keyof B | null> =>
        new Promise((resolve) => {
            Alert.alert(
                <string>title,
                message,
                buttons === undefined
                    ? [{ label: "OK", onPress: () => resolve(null) }]
                    : Array.isArray(buttons)
                    ? buttons.map((b, i) => ({ ...b, onPress: () => resolve(<keyof B>i) }))
                    : Object.entries(buttons).map(([k, b]) => ({ ...b, onPress: () => resolve(<keyof B>k) })),
                {
                    ...options,
                    onDismiss: () => resolve(null),
                }
            );
        });
}
