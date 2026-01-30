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
        options?: AsyncAlertOptions,
    ): Promise<keyof B | null> =>
        new Promise((resolve) => {
            Alert.alert(
                title as string,
                message,
                buttons === undefined
                    ? [{ text: "OK", onPress: () => resolve(null) }]
                    : Array.isArray(buttons)
                      ? buttons.map((b, i) => ({ ...b, onPress: () => resolve(i as keyof B) }))
                      : Object.entries(buttons).map(([k, b]) => ({ ...b, onPress: () => resolve(k as keyof B) })),
                {
                    ...options,
                    onDismiss: () => resolve(null),
                },
            );
        });
}
