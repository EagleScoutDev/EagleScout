import { useMemo, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useTheme } from "@/ui/context/ThemeContext";
import { UITextInput } from "@/ui/components/UITextInput";
import { UIText } from "@/ui/components/UIText";
import type { Theme } from "@/ui/lib/theme";
import { useQuery } from "@tanstack/react-query";
import { queries } from "@/lib/queries";

const formatDate = (date: Date) => {
    const month = date.toLocaleString("default", { month: "short" });
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
};

// TODO: maybe have a field in the ledger for these types of transactions
const betRegex = /Bet Match \d+ (Won|Lost)/;
const boughtRegex = /Bought item: /;

export function ScoutcoinLedger() {
    const theme = useTheme();
    const styles = useMemo(() => makeStyles(theme), [theme]);
    const { data: scoutcoinLedger = [] } = useQuery(queries.scoutcoinLedger.logs);
    const [searchText, setSearchText] = useState("");

    const filteredScoutcoinLedger = useMemo(() => {
        if (!searchText) return scoutcoinLedger;
        const lower = searchText.toLowerCase();
        return scoutcoinLedger.filter(
            (ledger) =>
                ledger.description.toLowerCase().includes(lower) ||
                ledger.sourceUserName?.toLowerCase().includes(lower) ||
                ledger.destinationUserName?.toLowerCase().includes(lower),
        );
    }, [scoutcoinLedger, searchText]);

    return (
        <View style={styles.container}>
            <View style={styles.filterContainer}>
                <UITextInput
                    placeholder="Search ledger"
                    onChangeText={setSearchText}
                    style={styles.filterBox}
                />
            </View>
            <FlatList
                data={filteredScoutcoinLedger}
                renderItem={({ item }) => (
                    <View style={styles.row}>
                        <UIText style={styles.date}>{formatDate(item.createdAt)}</UIText>
                        <UIText style={styles.description}>
                            {item.description}
                            {"\n"}
                            {item.description.match(betRegex) ? (
                                <>
                                    {item.amountChange < 0 ? (
                                        <UIText>
                                            <UIText color={theme.colors.loss}>Lost by</UIText>{" "}
                                            {item.sourceUserName || item.destinationUserName}
                                        </UIText>
                                    ) : (
                                        <UIText>
                                            <UIText color={theme.colors.win}>Won by</UIText>{" "}
                                            {item.destinationUserName || item.sourceUserName}
                                        </UIText>
                                    )}
                                </>
                            ) : item.description.match(boughtRegex) ? (
                                <UIText>
                                    <UIText color={theme.colors.loss}>Bought by</UIText>{" "}
                                    {item.sourceUserName}
                                </UIText>
                            ) : (
                                <>
                                    <UIText>
                                        <UIText color={theme.colors.win}>Sent by</UIText>{" "}
                                        {item.amountChange < 0
                                            ? item.sourceUserName
                                            : item.destinationUserName}{" "}
                                        <UIText color={theme.colors.loss}>to</UIText>{" "}
                                        {item.amountChange < 0
                                            ? item.destinationUserName
                                            : item.sourceUserName}
                                    </UIText>
                                </>
                            )}
                        </UIText>
                        <UIText style={styles.amount}>{Math.abs(item.amount_change)}</UIText>
                    </View>
                )}
                keyExtractor={(item) => item.id.toString()}
                ListHeaderComponent={() => (
                    <View style={styles.header}>
                        <UIText style={styles.date} bold>
                            Date
                        </UIText>
                        <UIText style={styles.description} bold>
                            Description
                        </UIText>
                        <UIText style={styles.headerAmountText} bold>
                            Amount
                        </UIText>
                    </View>
                )}
            />
        </View>
    );
}

const makeStyles = ({ colors }: Theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        filterContainer: {
            padding: 20,
            marginVertical: 8,
            marginHorizontal: 16,
        },
        filterBox: {
            padding: 10,
            backgroundColor: colors.bg1.hex,
            borderRadius: 5,
        },
        row: {
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 20,
            marginVertical: 8,
            marginHorizontal: 16,
            backgroundColor: colors.bg1.hex,
            alignItems: "center",
            gap: 4,
        },
        header: {
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 20,
            marginVertical: 8,
            marginHorizontal: 16,
            backgroundColor: colors.bg1.hex,
        },
        headerAmountText: {
            flex: 1,
            textAlign: "right",
        },
        date: {
            flex: 1,
        },
        description: {
            flex: 2,
        },
        amount: {
            flex: 1 / 2,
            textAlign: "right",
        },
    });
