import { NavigationContainer, type NavigationContainerProps } from "@react-navigation/native";
import { useTheme } from "../lib/contexts/ThemeContext.ts";
import { Theme } from "../theme";

export interface ThemedNavigationContainerProps extends NavigationContainerProps {}
export function ThemedNavigationContainer(props: ThemedNavigationContainerProps) {
    "use memo";
    const theme = useTheme();

    return <NavigationContainer theme={Theme.toReactNavigation(theme)} {...props} />;
}
