import { Switch, TextInput } from "react-native-gesture-handler";
import { StyleSheet, View } from "react-native";
import type { Setter } from "@/lib/util/react/types";
import { exMemo } from "@/lib/util/react/memo";
import { useTheme } from "@/ui/context/ThemeContext";
import { UIText } from "@/ui/components/UIText";
import type { Theme } from "@/ui/lib/theme";

export interface InfoCardProps {
    title: string;
    setTitle: Setter<string>;
    // description: string;
    // setDescription: Setter<string>;
    isPit: boolean;
    setIsPit: Setter<boolean>;
}
export function FormInfoCard({ title, setTitle, isPit, setIsPit }: InfoCardProps) {
    const { colors } = useTheme();
    const styles = getStyles(colors);
    return (
        <>
            <TextInput
                style={styles.title}
                placeholder={"Form title"}
                placeholderTextColor={"gray"}
                value={title}
                onChangeText={setTitle}
                selectTextOnFocus={true}
                enterKeyHint={"done"}
            />
            {/*<TextInput*/}
            {/*    style={s.description}*/}
            {/*    placeholder={"Form description"}*/}
            {/*    placeholderTextColor={"gray"}*/}
            {/*    value={description}*/}
            {/*    multiline={true}*/}
            {/*    onChangeText={setDescription}*/}
            {/*/>*/}
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                <UIText size={16} style={{ marginRight: "auto" }}>
                    Used in pit scouting?
                </UIText>
                <Switch value={isPit} onValueChange={setIsPit} />
            </View>
        </>
    );
}

const getStyles = exMemo((colors: Theme["colors"]) =>
    StyleSheet.create({
        title: {
            fontSize: 26,
            flexWrap: "wrap",
            fontWeight: "bold",
            paddingBottom: 5,
            borderBottomWidth: 1,
            borderColor: colors.border.hex,
            borderStyle: "dotted",
            marginBottom: 10,
            color: colors.fg.hex,
        },
        // description: {
        //     fontSize: 16,
        //     paddingBottom: 5,
        //     borderBottomWidth: 1,
        //     borderStyle: "dotted",
        //     borderColor: colors.border.hex,
        // },
    }),
);
