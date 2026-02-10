import { Pressable, StyleSheet, View } from "react-native";
import * as Bs from "@/ui/icons";
import type { Setter } from "@/lib/util/react/types";
import { Alliance, Orientation } from "@/frc/common/common";
import { useTheme } from "@/ui/context/ThemeContext";
import {UIText} from "@/ui/components/UIText";

export interface OrientationChooserProps {
    orientation: Orientation;
    setOrientation: Setter<Orientation>;
    alliance: Alliance;
    setAlliance: Setter<Alliance>;
}
export function OrientationChooser({ orientation, setOrientation, alliance, setAlliance }: OrientationChooserProps) {
    const {colors} = useTheme();
    const leftAlliance = Orientation.getLeft(orientation);
    const rightAlliance = Alliance.toggle(leftAlliance);

    return (
        <View style={styles.container}>
            <Pressable
                style={[styles.side, { backgroundColor: Alliance.getColor(leftAlliance).hex }]}
                onPress={() => setAlliance(leftAlliance)}
            >
                {alliance === leftAlliance ? <Bs.CheckLg size="24" fill={colors.fg.hex} /> : null}
            </Pressable>
            <Pressable style={styles.center} onPress={() => setOrientation(Orientation.toggle(orientation))}>
                <Bs.ArrowLeftRight size="24" fill={colors.fg.hex} />
            </Pressable>
            <Pressable
                style={[styles.side, { backgroundColor: Alliance.getColor(rightAlliance).hex }]}
                onPress={() => setAlliance(Alliance.toggle(leftAlliance))}
            >
                {alliance === rightAlliance ? <Bs.CheckLg size="24" fill={colors.fg.hex} /> : null}
            </Pressable>
        </View>
    );
}

export const ColorChooser = ({
                                 selectedColor,
                                 setSelectedColor,
                             }: {
    selectedColor: string;
    setSelectedColor: (color: string) => void;
}) => {
    const {colors} = useTheme();
    return (
        <View
            style={{
                padding: '5%',
                borderRadius: 10,
                justifyContent: 'center',
            }}>
            <UIText
                size={20}
                bold
                style={{
                    textAlign: 'center',
                    paddingBottom: '3%',
                }}>
                Select Team
            </UIText>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginVertical: '1%',
                    width: '80%',
                    alignSelf: 'center',
                }}>
                <Pressable
                    style={{
                        backgroundColor: 'blue',
                        paddingVertical: '3%',
                        borderTopLeftRadius: 10,
                        borderBottomLeftRadius: 10,
                        flex: 3,
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: 43,
                    }}
                    onPress={() => {
                        setSelectedColor('blue');
                    }}>
                    {selectedColor === 'blue' ?<Bs.CheckLg size="24" fill={colors.fg.hex} /> : null}
                </Pressable>
                {/*<View style={{flex: 1, backgroundColor: colors.text}} />*/}
                <Pressable
                    style={{
                        backgroundColor: 'red',
                        paddingVertical: '3%',
                        borderTopRightRadius: 10,
                        borderBottomRightRadius: 10,
                        flex: 3,
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: 43,
                    }}
                    onPress={() => {
                        setSelectedColor('red');
                    }}>
                    {selectedColor === 'red' ? <Bs.CheckLg size="24" fill={colors.fg.hex} /> : null}
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        height: 40,
        borderRadius: 10,
        overflow: "hidden",
    },
    side: {
        alignItems: "center",
        justifyContent: "center",
        width: "40%",
    },
    center: {
        justifyContent: "center",
        alignItems: "center",
        width: "20%",
    },
});

