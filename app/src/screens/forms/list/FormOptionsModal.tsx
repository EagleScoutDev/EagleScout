import { StandardModal } from "../../../components/modals/StandardModal.tsx";
import { StandardButton } from "../../../ui/StandardButton.tsx";
import { FormsDB } from "../../../database/Forms.ts";
import { Alert } from "react-native";
import { useTheme } from "@react-navigation/native";
import type { Setter } from "../../../lib/react";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { FormsMenuParamList } from "../ManageForms.tsx";

export interface FormOptionsModalProps {
    visible: boolean;
    setVisible: Setter<boolean>;
    form: any;
    onSuccess: () => void;
    navigation: NativeStackNavigationProp<FormsMenuParamList>;
}
export function FormOptionsModal({ form, visible, setVisible, onSuccess, navigation }: FormOptionsModalProps) {
    const { colors } = useTheme();
    return (
        <StandardModal
            title={`Form '${form && form.name}'`}
            visible={visible}
            onDismiss={() => {
                setVisible(false);
            }}
        >
            <StandardButton
                text={"View"}
                onPress={() => {
                    setVisible(false);
                    navigation.navigate("View", {
                        questions: form.formStructure,
                    });
                }}
                color={colors.primary}
            />
            <StandardButton
                text={"Delete"}
                onPress={() => {
                    (async () => {
                        let success = true;
                        try {
                            await FormsDB.deleteForm(form);
                        } catch (e) {
                            success = false;
                            console.error(e);
                            Alert.alert("Failed to delete form");
                        }
                        if (success) {
                            onSuccess();
                            setVisible(false);
                        }
                    })();
                }}
                color={colors.notification}
            />
            <StandardButton
                text={"Duplicate"}
                onPress={() => {
                    setVisible(false);
                    navigation.navigate("Edit", {
                        form: form,
                    });
                }}
                color={"green"}
            />
            <StandardButton
                text={"Cancel"}
                onPress={() => {
                    setVisible(false);
                }}
                color={"gray"}
            />
        </StandardModal>
    );
}
