import { UIText } from "../ui/UIText";

export interface MinimalSectionHeaderProps {
    title: string;
}
export function MinimalSectionHeader({ title }: MinimalSectionHeaderProps) {
    "use memo";

    return (
        <UIText size={12} bold level={1} style={{ paddingLeft: "2%", paddingTop: "2%" }}>
            {title.toUpperCase()}
        </UIText>
    );
}
