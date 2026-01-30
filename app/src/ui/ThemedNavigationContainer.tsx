import { NavigationContainer, type NavigationContainerProps } from "@react-navigation/native";
import { Theme } from "./lib/theme";
import { useTheme } from "./context/ThemeContext";

export interface ThemedNavigationContainerProps extends NavigationContainerProps {}
export function ThemedNavigationContainer(props: ThemedNavigationContainerProps) {
    const theme = useTheme();

    return <NavigationContainer theme={Theme.toReactNavigation(theme)} {...props} />;
}
