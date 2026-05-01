import { useEffect, useState } from "react";
import { Modal, Pressable, View } from "react-native";
import ColorPicker, { HueSlider } from "reanimated-color-picker";
import { type Tag } from "@/lib/db/models/Picklist";
import type { Setter } from "@/lib/util/react/types";
import { useTheme } from "@/ui/context/ThemeContext";
import { UIText } from "@/ui/components/UIText";
import { Color } from "@/ui/lib/color";
import { useMutation } from "@tanstack/react-query";
import { tagMutations } from "@/lib/mutations/tags";

export interface TagColorChangeModalProps {
    visible: boolean;
    setVisible: Setter<boolean>;
    tag: Tag | undefined;
}
export function TagColorChangeModal({ visible, setVisible, tag }: TagColorChangeModalProps) {
    const { colors } = useTheme();
    const [color, setColor] = useState(tag?.color ?? "#FF0000");

    const updateTagColor = useMutation(tagMutations.updateColor);

    useEffect(() => {
        setColor(tag?.color ?? "#FF0000");
    }, [visible, tag]);

    const saveColor = async () => {
        try {
            await updateTagColor.mutateAsync({ tagId: tag!.id!, color: color! });
            console.log("finished updating color of tag");
        } catch (error) {
            console.error(error);
        }
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
                        backgroundColor: colors.bg1.hex,
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
                        <UIText size={20} bold color={Color.parse(color ?? "").fg}>
                            {tag?.name}
                        </UIText>
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
