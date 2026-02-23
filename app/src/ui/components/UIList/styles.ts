import type { Theme } from "@/ui/lib/theme";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import type { IconProps } from "@/ui/icons";
import type { UITextProps } from "@/ui/components/UIText";

export interface UIListStyles {
    list: StyleProp<ViewStyle>;
    listContents: StyleProp<ViewStyle>;

    spinnerContainer: StyleProp<ViewStyle>;
    feedbackContainer: StyleProp<ViewStyle>;

    sectionHeader: StyleProp<ViewStyle>;
    sectionHeaderText: StyleProp<TextStyle>;
    sectionFooter: StyleProp<ViewStyle>;
    sectionFooterText: StyleProp<TextStyle>;
    sectionSeparator: StyleProp<ViewStyle>;

    itemSeparator: StyleProp<ViewStyle>;

    item: StyleProp<ViewStyle>;
    firstItem: StyleProp<ViewStyle>;
    lastItem: StyleProp<ViewStyle>;
    itemInner: StyleProp<ViewStyle>;

    row: StyleProp<ViewStyle>;
    rowIconContainer: StyleProp<ViewStyle>;
    rowIcon: IconProps;
    rowText: UITextProps;
    rowBody: StyleProp<ViewStyle>;
    rowCaret: IconProps;
}

export const getListStyles = (colors: Theme["colors"]): UIListStyles => ({
    list: { flex: 1 },
    listContents: { padding: 16 },

    spinnerContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    feedbackContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    sectionHeader: { marginBottom: 5 },
    sectionHeaderText: {
        color: colors.fg.hex,
        opacity: 0.6,
        fontSize: 12,
        fontWeight: "bold",
        textTransform: "uppercase",
    },
    sectionFooter: { marginTop: 3 },
    sectionFooterText: {
        color: colors.fg.hex,
        opacity: 0.6,
        fontSize: 12,
    },
    sectionSeparator: { height: 24 },

    itemSeparator: {
        borderBottomWidth: 1,
        borderBottomColor: colors.border.hex,
    },

    item: {
        minHeight: 48,
        backgroundColor: colors.bg1.hex,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: colors.border.hex,

        width: "100%",
    },
    firstItem: {
        borderTopWidth: 1,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    lastItem: {
        borderBottomWidth: 1,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    itemInner: {
        padding: 12,
    },

    row: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 8,
        gap: 8,
    },
    rowIconContainer: {
        marginRight: 4,
        width: 24,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
    },
    rowIcon: { size: 18, fill: colors.primary.hex },
    rowText: { size: 16, style: { flex: 1 }, numberOfLines: 1 },
    rowBody: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
    },
    rowCaret: { size: 16, fill: colors.placeholder.hex },
});
