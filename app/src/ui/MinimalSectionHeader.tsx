import { UIText } from "./components/UIText";

export interface MinimalSectionHeaderProps {
    title: string;
}
export function MinimalSectionHeader({ title }: MinimalSectionHeaderProps) {
    return (
        <UIText size={12} bold placeholder style={{ paddingLeft: "2%", paddingTop: "2%" }}>
            {title.toUpperCase()}
        </UIText>
    );
}
