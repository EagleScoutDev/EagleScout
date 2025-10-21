import { Form } from "../../lib/forms";
import { StyleSheet, Text, View } from "react-native";
import { type Theme, useTheme } from "@react-navigation/native";
import { exMemo } from "../../lib/util/react/memo.ts";

export interface HeadingBuilderProps {
    item: Form.Heading;
}
export function FormHeading({ item }: HeadingBuilderProps) {
    const { colors } = useTheme();
    const styles = getStyles(colors);

    return (
        <View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
        </View>
    );
}

const getStyles = exMemo((colors: Theme["colors"]) =>
    StyleSheet.create({
        title: {
            color: colors.text,
            fontSize: 22,
            fontWeight: "bold",
            paddingBottom: 5,
            marginBottom: 10,
        },
        description: {
            color: colors.text,
            fontSize: 14,
            paddingBottom: 5,
        },
    })
);
