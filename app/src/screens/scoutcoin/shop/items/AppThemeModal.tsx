import { useContext } from "react";
import { ThemePicker } from "./ThemePicker";
import { ThemeContext } from "../../../../lib/contexts/ThemeContext";
import { UIModal } from "../../../../ui/UIModal";

export interface AppThemeModalProps {
    onClose: () => void;
}
export function AppThemeModal({ onClose }: AppThemeModalProps) {
    const { setThemePreference } = useContext(ThemeContext);

    return (
        <UIModal visible onDismiss={onClose} backdropPressBehavior={"none"} title={"Select Theme"}>
            <ThemePicker
                setTheme={(t) => {
                    setThemePreference(t);
                    onClose();
                }}
            />
        </UIModal>
    );
}
