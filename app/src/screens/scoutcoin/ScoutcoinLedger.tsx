import { useEffect, useMemo, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { ScoutcoinLedger as ScoutcoinLedgerDB, type ScoutcoinLedgerItem } from "../../database/ScoutcoinLedger";
import { UIText } from "../../ui/UIText";
import { useTheme } from "../../lib/contexts/ThemeContext.ts";
import type { Theme } from "../../theme";
import { UITextInput } from "../../ui/input/UITextInput.tsx";

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
    "use memo";

    const theme = useTheme();
    const styles = useMemo(() => makeStyles(theme), [theme]);
    const [scoutcoinLedger, setScoutcoinLedger] = useState<ScoutcoinLedgerItem[]>([]);
    const [filteredScoutcoinLedger, setFilteredScoutcoinLedger] = useState<ScoutcoinLedgerItem[]>([]);
    useEffect(() => {
        ScoutcoinLedgerDB.getLogs().then((logs) => {
            setScoutcoinLedger(logs);
            setFilteredScoutcoinLedger(logs);
        });
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.filterContainer}>
                <UITextInput
                    placeholder="Search ledger"
                    onChangeText={(text) => {
                        setFilteredScoutcoinLedger(
                            scoutcoinLedger.filter(
                                (ledger) =>
                                    ledger.description.toLowerCase().includes(text.toLowerCase()) ||
                                    ledger.src_user_name?.toLowerCase().includes(text.toLowerCase()) ||
                                    ledger.dest_user_name?.toLowerCase().includes(text.toLowerCase())
                            )
                        );
                    }}
                    style={styles.filterBox}
                />
            </View>
            <FlatList
                data={filteredScoutcoinLedger}
                renderItem={({ item }) => (
                    <View style={styles.row}>
                        <UIText style={styles.date}>{formatDate(item.created_at)}</UIText>
                        <UIText style={styles.description}>
                            {item.description}
                            {"\n"}
                            {item.description.match(betRegex) ? (
                                <>
                                    {item.amount_change < 0 ? (
                                        <UIText>
                                            <UIText color={theme.colors.loss}>Lost by</UIText>{" "}
                                            {item.src_user_name || item.dest_user_name}
                                        </UIText>
                                    ) : (
                                        <UIText>
                                            <UIText color={theme.colors.win}>Won by</UIText>{" "}
                                            {item.dest_user_name || item.src_user_name}
                                        </UIText>
                                    )}
                                </>
                            ) : item.description.match(boughtRegex) ? (
                                <UIText>
                                    <UIText color={theme.colors.loss}>Bought by</UIText> {item.src_user_name}
                                </UIText>
                            ) : (
                                <>
                                    <UIText>
                                        <UIText color={theme.colors.win}>Sent by</UIText>{" "}
                                        {item.amount_change < 0 ? item.src_user_name : item.dest_user_name}{" "}
                                        <UIText color={theme.colors.loss}>to</UIText>{" "}
                                        {item.amount_change < 0 ? item.dest_user_name : item.src_user_name}
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
