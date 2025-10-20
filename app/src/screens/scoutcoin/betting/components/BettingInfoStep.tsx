import { useCallback, useMemo } from "react";
import { type Theme, useNavigation, useTheme } from "@react-navigation/native";
import { BottomSheetView, useBottomSheetModal } from "@gorhom/bottom-sheet";
import { StyleSheet, Text } from "react-native";
import { StandardButton } from "../../../../ui/StandardButton";

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
            <Text style={styles.heading}>How to Bet</Text>
            <Text style={styles.subheading}>{title}</Text>
            <BottomSheetView style={styles.infoBox}>{children}</BottomSheetView>
            <BottomSheetView style={styles.buttonBox}>
                <StandardButton
                    width={"100%"}
                    color={theme.colors.primary}
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
            color: colors.text,
            paddingBottom: 20,
        },
        subheading: {
            fontSize: 20,
            color: colors.text,
            paddingBottom: 10,
        },
        infoBox: {
            borderWidth: 2,
            borderColor: colors.text,
            borderRadius: 12,
            padding: 10,
            width: "100%",
        },
        buttonBox: {
            width: "100%",
            alignSelf: "flex-end",
        },
    });
