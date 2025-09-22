import { Alert, StyleSheet, View } from "react-native";
import { StandardButton } from "../StandardButton";
import { useTheme } from "@react-navigation/native";
import { useState } from "react";
import { StandardModal } from "./StandardModal";
import { supabase } from "../../lib/supabase";
import { RadioButtons } from "../form/RadioButtons";

function Spacer() {
    return <View style={{ height: "2%" }} />;
}

export function EnableScoutAssignmentsModal({ visible, setVisible, competition, onRefresh }) {
    const { colors } = useTheme();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [checked, setChecked] = useState(null);

    const submit = async () => {
        let scoutAssignmentsConfig;
        if (checked === "Team based") {
            scoutAssignmentsConfig = "team_based";
        } else if (checked === "Position based") {
            scoutAssignmentsConfig = "position_based";
        } else {
            Alert.alert("Error", "Please select a scout assignments configuration.");
            return false;
        }
        const { error } = await supabase
            .from("competitions")
            .update({
                scout_assignments_config: scoutAssignmentsConfig,
            })
            .eq("id", competition.id);
        if (error) {
            Alert.alert(
                "Error",
                "There was an error enabling scout assignments. Please check if the TBA key is correct."
            );
        }
        return !error;
    };

    const styles = StyleSheet.create({
        tbakey_input: {
            // height: 50,
            borderColor: "gray",
            borderWidth: 1,
            width: "100%",
            borderRadius: 10,
            padding: 10,
            marginBottom: 10,
            color: colors.text,
            fontSize: 18,
        },
        label: {
            color: colors.text,
            fontSize: 18,
            fontWeight: "600",
            textAlign: "center",
        },
        button_row: { flexDirection: "row", justifyContent: "space-evenly" },
    });

    return (
        <StandardModal title={"Enable Scout Assignments?"} visible={visible}>
            <RadioButtons
                options={["Team based", "Position based"]}
                value={checked}
                onValueChange={setChecked}
                colors={colors}
            />
            <Spacer />
            <View style={styles.button_row}>
                <StandardButton
                    color={colors.notification}
                    onPress={() => setVisible(false)}
                    text={"Cancel"}
                    width={"40%"}
                />
                <StandardButton
                    color={colors.primary}
                    isLoading={isSubmitting}
                    onPress={() => {
                        setIsSubmitting(true);
                        submit().then((success) => {
                            setIsSubmitting(false);
                            if (success) {
                                onRefresh();
                                setVisible(false);
                            }
                        });
                    }}
                    text={"Yes"}
                    width={"40%"}
                />
            </View>
        </StandardModal>
    );
}
