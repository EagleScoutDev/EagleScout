import { Dimensions, Pressable, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useEffect, useState } from "react";
import type { Setter } from "@/lib/util/react/types";
import { UIModal } from "@/ui/components/UIModal";
import { UIText } from "@/ui/components/UIText";
import { useTheme } from "@/ui/context/ThemeContext";

export interface DataGraphProps {
    modalActive: boolean;
    setModalActive: Setter<boolean>;
    item: any;
    data: { match: number; data: number }[];
}
export function DataGraph({ item, modalActive, setModalActive, data }: DataGraphProps) {
    const { colors, dark } = useTheme();
    const chartConfig = {
        backgroundGradientFrom: colors.bg1.hex,
        backgroundGradientFromOpacity: 1.0,
        backgroundGradientTo: colors.bg1.hex,
        backgroundGradientToOpacity: 1.0,
        color: (opacity = 1) => (dark ? `rgba(255, 255, 255, ${opacity})` : "rgba(0, 0, 0, 1)"),
        backgroundColor: colors.bg1.hex,
        strokeWidth: 2, // optional, default 3
        // barPercentage: 0.5,
        useShadowColorFromDataset: false, // optional
        fillShadowGradient: colors.bg1.hex,
    };
    const [avg, setAvg] = useState<number>(0);

    useEffect(() => {
        let sum = 0;
        data.forEach((datum) => {
            sum += datum.data;
        });
        setAvg(sum / data.length);
    }, []);

    return (
        <UIModal
            title={item.question}
            visible={modalActive}
            onDismiss={() => {
                setModalActive(false);
            }}
        >
            <View>
                <LineChart
                    data={{
                        labels: data
                            .sort((a, b) => a.match - b.match)
                            .map((datum) => String(datum.match)),
                        datasets: [
                            {
                                data: data
                                    .sort((a, b) => a.match - b.match)
                                    .map((datum) => datum.data),
                                color: (opacity = 1) => colors.primary.hex,
                                strokeWidth: 2, // optional
                            },
                            {
                                data: data.map(() => avg),
                                strokeDashArray: [10],
                                withDots: false,
                                color: (opacity = 1) => colors.fg.hex,
                                strokeWidth: 2, // optional
                            },
                        ],
                        legend: ["Data", "Average"], // optional
                    }}
                    width={Dimensions.get("window").width * 0.85} // from react-native
                    height={Dimensions.get("window").height / 4}
                    // verticalLabelRotation={30}
                    chartConfig={chartConfig}
                    bezier
                />
                <UIText bold style={{ textAlign: "center", marginVertical: "3%" }}>
                    Match Number
                </UIText>
                {item.options && item.options.length > 0 && (
                    <>
                        <UIText style={{ textAlign: "center" }}>Graph Interpretation</UIText>
                        {item.options?.map((option: string, index: number) => {
                            return (
                                <UIText style={{ textAlign: "center" }}>
                                    {index + " - " + item.options![index]}
                                </UIText>
                            );
                        })}
                    </>
                )}
            </View>
            <Pressable style={{ marginTop: "4%" }} onPress={() => setModalActive(false)}>
                <UIText size={16} color={colors.primary}>
                    Close
                </UIText>
            </Pressable>
        </UIModal>
    );
}
