import { useCallback, useMemo } from "react";
import { UIText } from "../../../../ui/UIText";
import { BottomSheetView, useBottomSheetModal } from "@gorhom/bottom-sheet";
import { StyleSheet } from "react-native";
import { StandardButton } from "../../../../ui/StandardButton";
import { useTheme } from "../../../../lib/contexts/ThemeContext.ts";
import { useNavigation } from "@react-navigation/native";
import type { Theme } from "../../../../theme";

export const BettingInfoStep = ({
    index,
    title,
    nextScreen,
    isFinalScreen,
    children,
}: {
    index: number;
    title: string;
    nextScreen: string;
    isFinalScreen: boolean;
    children: React.ReactNode;
}) => {
    const theme = useTheme();
    const styles = useMemo(() => makeStyles(theme), [theme]);
    const { navigate } = useNavigation();
    const { dismiss } = useBottomSheetModal();

    const handleNavigatePress = useCallback(() => {
        requestAnimationFrame(() => navigate(nextScreen as never));
    }, []);

    return (
        <BottomSheetView style={styles.container}>
            <UIText style={styles.heading}>How to Bet</UIText>
            <UIText style={styles.subheading}>{title}</UIText>
            <BottomSheetView style={styles.infoBox}>{children}</BottomSheetView>
            <BottomSheetView style={styles.buttonBox}>
                <StandardButton
                    width={"100%"}
                    color={theme.colors.primary.hex}
                    onPress={isFinalScreen ? dismiss : handleNavigatePress}
                    text={isFinalScreen ? "Close" : "Next"}
                />
            </BottomSheetView>
        </BottomSheetView>
    );
};

const makeStyles = ({ colors }: Theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            padding: 20,
            justifyContent: "space-between",
            alignItems: "center",
        },
        heading: {
            fontSize: 30,
            fontWeight: "bold",
            color: colors.fg.hex,
            paddingBottom: 20,
        },
        subheading: {
            fontSize: 20,
            color: colors.fg.hex,
            paddingBottom: 10,
        },
        infoBox: {
            borderWidth: 2,
            borderColor: colors.fg.hex,
            borderRadius: 12,
            padding: 10,
            width: "100%",
        },
        buttonBox: {
            width: "100%",
            alignSelf: "flex-end",
        },
    });
