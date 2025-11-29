import { Form } from "../../lib/forms";
import { UIText } from "../../ui/UIText";
import { View } from "react-native";

export interface HeadingBuilderProps {
    item: Form.Heading;
}
export function FormHeading({ item }: HeadingBuilderProps) {
    return (
        <View>
            <UIText size={22} bold style={{ paddingBottom: 5, marginBottom: 10 }}>
                {item.title}
            </UIText>
            <UIText style={{ paddingBottom: 5 }}>{item.description}</UIText>
        </View>
    );
}
