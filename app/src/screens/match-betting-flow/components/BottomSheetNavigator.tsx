import { useMemo } from "react";
import { createStackNavigator, type StackNavigationOptions, TransitionPresets } from "@react-navigation/stack";
import { useTheme } from "@react-navigation/native";
import { BettingInfoStep } from "./BettingInfoStep";
import { Image, Pressable, Text } from "react-native";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { ThemedNavigationContainer } from "../../../components/ThemedNavigationContainer";

const Stack = createStackNavigator();

const PlayerIcon = ({
    emoji,
    amount,
    name,
    alliance,
}: {
    emoji: string;
    amount: number;
    name: string;
    alliance: "red" | "blue";
}) => {
    const { colors } = useTheme();
    return (
        <BottomSheetView style={{ alignItems: "center" }}>
            <Text
                style={{
                    color: colors.text,
                    fontSize: 60,
                    fontWeight: "bold",
                }}
            >
                {emoji}
            </Text>
            <Text
                style={{
                    color: colors.text,
                    fontSize: 14,
                }}
            >
                {name}
            </Text>
            <Text
                style={{
                    color: alliance === "red" ? "red" : "blue",
                    fontSize: 18,
                    fontWeight: "bold",
                }}
            >
                {amount}
            </Text>
        </BottomSheetView>
    );
};

const WaitForPlayersStep = ({ handleBottomSheetClose }: { handleBottomSheetClose: () => void }) => (
    <BettingInfoStep
        index={0}
        title="Wait for 2+ players"
        nextScreen="SelectAlliance"
        isFinalScreen={false}
        handleBottomSheetClose={handleBottomSheetClose}
    >
        <BottomSheetView
            style={{
                flexDirection: "row",
                justifyContent: "space-around",
                paddingVertical: 20,
            }}
        >
            <PlayerIcon emoji="👾" amount={10} name="Eddie" alliance="red" />
            <PlayerIcon emoji="🤖" amount={4} name="Alan" alliance="blue" />
            <PlayerIcon emoji="🙂" amount={3} name="Vir" alliance="blue" />
        </BottomSheetView>
    </BettingInfoStep>
);

const SelectAllianceStep = ({ handleBottomSheetClose }: { handleBottomSheetClose: () => void }) => {
    const { colors } = useTheme();
    return (
        <BettingInfoStep
            index={1}
            title="Select an alliance"
            nextScreen="SelectAmount"
            isFinalScreen={true}
            handleBottomSheetClose={handleBottomSheetClose}
        >
            <BottomSheetView style={{ flexDirection: "row", gap: 20, width: "100%" }}>
                <Pressable
                    style={{
                        backgroundColor: colors.card,
                        opacity: 1,
                        padding: 20,
                        borderRadius: 10,
                        flex: 1,
                    }}
                >
                    <Image
                        source={require("../../../assets/dozerblue.png")}
                        style={{
                            width: "100%",
                            height: null,
                            aspectRatio: 1,
                        }}
                    />
                </Pressable>
                <Pressable
                    style={{
                        backgroundColor: colors.card,
                        opacity: 0.5,
                        padding: 20,
                        borderRadius: 10,
                        flex: 1,
                    }}
                >
                    <Image
                        source={require("../../../assets/dozerred.png")}
                        style={{
                            width: "100%",
                            height: null,
                            aspectRatio: 1,
                        }}
                    />
                </Pressable>
            </BottomSheetView>
        </BettingInfoStep>
    );
};

export const BottomSheetNavigator = ({ handleBottomSheetClose }: { handleBottomSheetClose: () => void }) => {
    const { colors } = useTheme();
    const screenOptions = useMemo<StackNavigationOptions>(
        () => ({
            ...TransitionPresets.SlideFromRightIOS,
            headerMode: "screen",
            headerShown: false,
            safeAreaInsets: { top: 0 },
            cardStyle: {
                backgroundColor: colors.card,
                overflow: "visible",
            },
        }),
        []
    );

    return (
        <ThemedNavigationContainer navigationContainerProps={{ independent: true }}>
            <Stack.Navigator screenOptions={screenOptions}>
                <Stack.Screen name="WaitForPlayers">
                    {() => <WaitForPlayersStep handleBottomSheetClose={handleBottomSheetClose} />}
                </Stack.Screen>
                <Stack.Screen name="SelectAlliance">
                    {() => <SelectAllianceStep handleBottomSheetClose={handleBottomSheetClose} />}
                </Stack.Screen>
            </Stack.Navigator>
        </ThemedNavigationContainer>
    );
};
