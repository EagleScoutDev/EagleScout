import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { launchCameraAsync } from "expo-image-picker";
import * as Bs from "@/ui/icons";
import { useTheme } from "@/ui/context/ThemeContext";
import { UIText } from "@/ui/components/UIText";
import { Image } from "expo-image";

export interface PitScoutingImageListProps {
    images: string[];
    setImages: (images: string[]) => void;
}
export function PitScoutingImageList({ images, setImages }: PitScoutingImageListProps) {
    const { colors } = useTheme();
    const styles = StyleSheet.create({
        image: {
            width: 200,
            height: 250,
            margin: 10,
            borderRadius: 10,
        },
        plusButton: {
            width: 200,
            height: 250,
            margin: 10,
            borderRadius: 10,
            backgroundColor: colors.bg1.hex,
            justifyContent: "center",
            alignItems: "center",
        },
        plusText: {
            fontSize: 50,
            color: colors.fg.hex,
        },
        deleteContainer: {
            position: "absolute",
            top: 0,
            right: 0,
            zIndex: 1,
        },
        deleteButton: {
            backgroundColor: colors.bg1.hex,
            padding: 10,
            borderRadius: 999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },
    });

    return (
        <FlatList
            keyboardShouldPersistTaps="handled"
            style={{
                flex: 1,
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 10,
            }}
            data={images}
            horizontal={true}
            keyExtractor={(item) => item}
            renderItem={({ item }) => {
                if (item === "plus") {
                    return (
                        <Pressable
                            onPress={() => {
                                launchCameraAsync({
                                    mediaTypes: ["images"],
                                    quality: 1,
                                }).then((x) => {
                                    console.log(x);
                                });
                            }}
                        >
                            <View style={styles.plusButton}>
                                <UIText style={styles.plusText}>+</UIText>
                            </View>
                        </Pressable>
                    );
                }
                return (
                    <View>
                        <Pressable
                            style={styles.deleteContainer}
                            onPress={() => {
                                setImages(images.filter((i) => i !== item));
                            }}
                        >
                            <View style={styles.deleteButton}>
                                <Bs.Trash size="20" fill={colors.fg.hex} />
                            </View>
                        </Pressable>
                        <Image source={{ uri: item }} style={styles.image} />
                    </View>
                );
            }}
        />
    );
}
