import { ThemePicker } from "./ThemePicker";
import { useTheming } from "@/ui/context/ThemeContext";
import { UIModal } from "@/ui/components/UIModal";
import { THEME_OPTIONS } from "@/ui/lib/theme";

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
