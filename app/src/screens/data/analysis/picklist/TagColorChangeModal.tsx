import { useEffect, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import ColorPicker, { HueSlider } from "reanimated-color-picker";
import { useTheme } from "@react-navigation/native";
import { TagsDB, type TagStructure } from "../../../../database/Tags";
import { getIdealTextColor, parseColor } from "../../../../lib/color";
import type { Setter } from "../../../../lib/react/types";

export interface TagColorChangeModalProps {
    visible: boolean;
    setVisible: Setter<boolean>;
    tag: TagStructure | undefined;
}
export function TagColorChangeModal({ visible, setVisible, tag }: TagColorChangeModalProps) {
    const { colors } = useTheme();
    const [color, setColor] = useState(tag?.color ?? "#FF0000");

    useEffect(() => {
        setColor(tag?.color ?? "#FF0000");
    }, [visible, tag]);

    const saveColor = () => {
        TagsDB.updateColorOfTag(tag.id!, color!).then((r) => {
            console.log("finished updating color of tag");
        });
    };

    const onChangeColor = ({ hex }: { hex: string }) => {
        console.log("hex", hex);
        setColor(hex);
    };

    return (
        <Modal visible={visible} transparent={true} animationType={"fade"}>
            <Pressable
                onPress={() => setVisible(false)}
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0,0,0,0.5)",
                }}
            >
                <View
                    style={{
                        backgroundColor: colors.card,
                        padding: "5%",
                        margin: "5%",
                        marginVertical: "20%",
                        borderRadius: 10,
                    }}
                >
                    <View
                        style={{
                            backgroundColor: color,
                            paddingHorizontal: "8%",
                            paddingVertical: "4%",
                            margin: "20%",
                            borderRadius: 40,
                            flexDirection: "row",
                            justifyContent: "space-between",
                            borderWidth: 2,
                            borderColor: color,
                        }}
                    >
                        <Text
                            style={{
                                color: getIdealTextColor(parseColor(color ?? "")),
                                fontWeight: "bold",
                                fontSize: 20,
                            }}
                        >
                            {tag?.name}
                        </Text>
                    </View>
                    <ColorPicker
                        onChange={onChangeColor}
                        value={color}
                        onComplete={() => {
                            saveColor();
                        }}
                    >
                        <HueSlider />
                    </ColorPicker>
                </View>
            </Pressable>
        </Modal>
    );
}
