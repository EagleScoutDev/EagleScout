import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect } from "react";
import type { ParamListBase } from "@react-navigation/native";

/**
 * Hook to construct header items for stack screens
 * @param navigation navigation prop passed to the stack screen
 * @param mode toolbar mode; should match that passed to useStackThemeConfig
 * @param options toolbar options TODO: actually implement
 */
export function useStackToolbar(navigation: NativeStackNavigationProp<ParamListBase>, mode: "infoSheet", options: {} & object) {
    useEffect(() => {
        switch (mode) {
            case "infoSheet":
                navigation.setOptions({
                    unstable_headerRightItems: (props) => [
                        {
                            type: "button",
                            variant: "done",
                            label: "Done",
                            icon: { type: "sfSymbol", name: "checkmark" },
                            onPress: navigation.goBack,
                        },
                    ],
                });
        }
    }, [navigation, mode]);
}
