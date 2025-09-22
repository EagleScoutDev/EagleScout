import { Easing, StyleSheet, Text, View } from "react-native";
import GradientShimmer from "react-native-gradient-shimmer";
import LinearGradient from "react-native-linear-gradient"
import * as Bs from "../ui/icons";
import type { User } from "../lib/user";
import { AccountType } from "../lib/user/account.ts";
import { useTheme } from "@react-navigation/native";

export interface UserProfileBoxProps {
    user: User | null;
    scoutcoins: number | null;
}

export function UserProfileBox({ user, scoutcoins }: UserProfileBoxProps) {
    const { colors } = useTheme();

    const styles = StyleSheet.create({
        container: {
            flexDirection: "row",
            padding: "5%",
            margin: "3%",
            alignItems: "center",
            backgroundColor: colors.card,
            borderRadius: 10,
            borderColor: colors.border,
            borderWidth: 1,
        },
        role_text: {
            color: colors.text,
        },
        name_text: {
            fontSize: 20,
            color: colors.text,
        },
    });

    if (user === null) {
        return (
            <View style={styles.container}>
                <Text style={{ color: colors.text }}>No user found.</Text>
            </View>
        );
    }

    const { account, profile } = user;
    const getRoleName = (role: AccountType): String => {
        switch (role) {
            case AccountType.Admin:
                return "Admin";
            case AccountType.Scouter:
                return "Scouter";
            case AccountType.Rejected:
                return "Rejected";
        }
    };

    return (
        <View style={styles.container}>
            <GradientShimmer
                LinearGradientComponent={LinearGradient}
                backgroundColor={colors.primary}
                highlightColor={colors.card}
                animating={true}
                duration={4000}
                easing={Easing.linear}
                highlightWidth={150}
                height={50}
                width={50}
                style={{
                    borderRadius: account.type === AccountType.Admin ? 10 : 100,
                    marginRight: "5%",
                }}
            />
            <View style={{ flex: 1 }}>
                <Text style={styles.name_text}>
                    {profile.firstName} {profile.lastName} {profile.emoji}
                </Text>
                <Text style={styles.role_text}>{getRoleName(account.type)}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Bs.Coin width="16" height="16" fill={colors.text} />
                <Text selectable={true} style={{ color: colors.text, paddingLeft: 8, fontSize: 16 }}>
                    {scoutcoins}
                </Text>
            </View>
        </View>
    );
}
