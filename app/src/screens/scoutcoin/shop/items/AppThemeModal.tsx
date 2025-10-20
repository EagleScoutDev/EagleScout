import { useContext, useMemo } from "react";
import { useTheme, type Theme } from "@react-navigation/native";
import { ShopModalBase } from "./ShopModalBase";
import { StyleSheet, Text } from "react-native";
import { ThemePicker } from "./ThemePicker.tsx";
import { ThemeContext } from "../../../../lib/contexts/ThemeContext";
import { UIModal } from "../../../../ui/UIModal.tsx";

export interface AppThemeModalProps {
    onClose: () => void;
}
export function AppThemeModal({ onClose }: AppThemeModalProps) {
    const theme = useTheme();
    const styles = useMemo(() => makeStyles(theme), [theme]);
    const { setThemePreference } = useContext(ThemeContext);

    return (
        <UIModal visible onClose={onClose} backdropPressBehavior={"none"} title={"Select Theme"}>
            <ThemePicker
                setTheme={(t) => {
                    setThemePreference(t);
                    onClose();
                }}
            />
        </UIModal>
    );
}

const makeStyles = ({ colors }: Theme) =>
    StyleSheet.create({
        title: {
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 20,
            textAlign: "center",
            color: colors.text,
        },
    });
