import type { PropsWithChildren } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Text } from "react-native";

interface ReportFlowTabProps {
    title: string
}
export function ReportFlowTab({ title, children }: PropsWithChildren<ReportFlowTabProps>) {
    return (
        <ScrollView
            style={{ height: "100%" }}
            contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 30, width: "100%", alignItems: "center" }}
            keyboardShouldPersistTaps="handled"
        >
            <Text style={[{ fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 25 }]}>{title}</Text>
            {children}
        </ScrollView>
    );
}
