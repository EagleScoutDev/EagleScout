import { ThemePicker } from "./ThemePicker";
import { useTheming } from "../../../../lib/contexts/ThemeContext";
import { UIModal } from "../../../../ui/UIModal";
import { THEME_OPTIONS } from "../../../../theme";

export interface AppThemeModalProps {
    onClose: () => void;
}
export function AppThemeModal({ onClose }: AppThemeModalProps) {
    const { themePreference, setThemePreference } = useTheming();

    return (
        <UIModal visible onDismiss={onClose} backdropPressBehavior={"none"} title={"Select Theme"}>
            <ThemePicker
                options={THEME_OPTIONS}
                value={themePreference}
                onSubmit={(value) => {
                    setThemePreference(value);
                    onClose();
                }}
            />
        </UIModal>
    );
}
