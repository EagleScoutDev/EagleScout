import { useEffect, useMemo, useState } from "react";
import { useTheme, type Theme } from "@react-navigation/native";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { ScoutcoinLedger as ScoutcoinLedgerDB, type ScoutcoinLedgerItem } from "../../database/ScoutcoinLedger";
import { TextInput } from "react-native-gesture-handler";

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
                <TextInput
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
                    placeholderTextColor={theme.colors.text}
                    style={styles.filterBox}
                />
            </View>
            <FlatList
                data={filteredScoutcoinLedger}
                renderItem={({ item }) => (
                    <View style={styles.row}>
                        <Text style={styles.date}>{formatDate(item.created_at)}</Text>
                        <Text style={styles.description}>
                            {item.description}
                            {"\n"}
                            {item.description.match(betRegex) ? (
                                <>
                                    {item.amount_change < 0 ? (
                                        <Text>
                                            <Text style={styles.negativeText}>Lost by</Text>{" "}
                                            {item.src_user_name || item.dest_user_name}
                                        </Text>
                                    ) : (
                                        <Text>
                                            <Text style={{ color: "green" }}>Won by</Text>{" "}
                                            {item.dest_user_name || item.src_user_name}
                                        </Text>
                                    )}
                                </>
                            ) : item.description.match(boughtRegex) ? (
                                <Text>
                                    <Text style={styles.negativeText}>Bought by</Text> {item.src_user_name}
                                </Text>
                            ) : (
                                <>
                                    <Text>
                                        <Text style={styles.positiveText}>Sent by</Text>{" "}
                                        {item.amount_change < 0 ? item.src_user_name : item.dest_user_name}{" "}
                                        <Text style={styles.negativeText}>to</Text>{" "}
                                        {item.amount_change < 0 ? item.dest_user_name : item.src_user_name}
                                    </Text>
                                </>
                            )}
                        </Text>
                        <Text style={styles.amount}>{Math.abs(item.amount_change)}</Text>
                    </View>
                )}
                keyExtractor={(item) => item.id.toString()}
                ListHeaderComponent={() => (
                    <View style={styles.header}>
                        <Text style={{ ...styles.headerText, ...styles.date }}>Date</Text>
                        <Text style={{ ...styles.headerText, ...styles.description }}>Description</Text>
                        <Text style={styles.headerAmountText}>Amount</Text>
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
            backgroundColor: colors.card,
            borderRadius: 5,
            color: colors.text,
        },
        row: {
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 20,
            marginVertical: 8,
            marginHorizontal: 16,
            backgroundColor: colors.card,
            alignItems: "center",
            gap: 4,
        },
        header: {
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 20,
            marginVertical: 8,
            marginHorizontal: 16,
            backgroundColor: colors.card,
        },
        headerText: {
            fontWeight: "bold",
        },
        headerAmountText: {
            fontWeight: "bold",
            flex: 1,
            textAlign: "right",
            color: colors.text,
        },
        date: {
            flex: 1,
            color: colors.text,
        },
        description: {
            flex: 2,
            color: colors.text,
        },
        amount: {
            flex: 1 / 2,
            color: colors.text,
            textAlign: "right",
        },
        negativeText: {
            color: "red",
        },
        positiveText: {
            color: "green",
        },
    });
