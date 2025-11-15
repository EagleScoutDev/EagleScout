import { useContext } from "react";
import { ThemePicker } from "./ThemePicker.tsx";
import { ThemeContext } from "../../../../lib/contexts/ThemeContext";
import { UIModal } from "../../../../ui/UIModal.tsx";

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
