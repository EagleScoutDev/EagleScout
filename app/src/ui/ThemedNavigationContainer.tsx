import { useContext } from "react";
import { NavigationContainer, type NavigationContainerProps } from "@react-navigation/native";
import { ThemeContext } from "../lib/contexts/ThemeContext";

export interface ThemedNavigationContainerProps extends NavigationContainerProps {}
export function ThemedNavigationContainer(props: ThemedNavigationContainerProps) {
    "use memo";
    const { theme } = useContext(ThemeContext);

    return <NavigationContainer theme={theme} {...props} />;
}
