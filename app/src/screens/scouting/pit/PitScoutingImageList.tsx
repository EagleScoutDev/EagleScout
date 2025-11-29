import { FlatList, Image, Pressable, StyleSheet, View } from "react-native";
import { UIText } from "../../../ui/UIText";
import { launchCamera } from "react-native-image-picker";
import * as Bs from "../../../ui/icons";
import { useTheme } from "@react-navigation/native";

export interface PitScoutingImageListProps {
    images: string[];
    setImages: (images: string[]) => void;
}
export function PitScoutingImageList({ images, setImages }: PitScoutingImageListProps) {
    "use memo";

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
            backgroundColor: colors.card,
            justifyContent: "center",
            alignItems: "center",
        },
        plusText: {
            fontSize: 50,
            color: colors.text,
        },
        deleteContainer: {
            position: "absolute",
            top: 0,
            right: 0,
            zIndex: 1,
        },
        deleteButton: {
            backgroundColor: colors.card,
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
                                launchCamera({
                                    mediaType: "photo",
                                    quality: 1,
                                    saveToPhotos: false,
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
                                <Bs.Trash size="20" fill={colors.text} />
                            </View>
                        </Pressable>
                        <Image source={{ uri: item }} style={styles.image} />
                    </View>
                );
            }}
        />
    );
}
