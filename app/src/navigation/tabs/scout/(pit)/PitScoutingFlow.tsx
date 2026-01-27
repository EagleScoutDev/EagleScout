import { useEffect, useState } from "react";
import { Alert, View } from "react-native";
import Toast from "react-native-toast-message";
import { TeamInformation } from "../components/TeamInformation";
import { CompetitionsDB } from "@/lib/database/Competitions";
import { PitReportsDB, type PitReportWithoutId } from "@/lib/database/ScoutPitReports";
import { FormHelper } from "@/lib/FormHelper";
import type { ScoutMenuScreenProps } from "../index";
import { ScoutingFlowTab } from "../components/ScoutingFlowTab";
import { Form } from "@/lib/forms";
import { useCurrentCompetition } from "@/lib/hooks/useCurrentCompetition";
import { AsyncAlert } from "@/lib/util/react/AsyncAlert";
import { Arrays } from "@/lib/util/Arrays";
import { PitScoutingImageList } from "./PitScoutingImageList";
import { FormView } from "@/components/FormView";
import { UIText } from "@/ui/components/UIText";
import { UITabView } from "@/ui/components/UITabView.tsx";

export interface PitFlowProps extends ScoutMenuScreenProps<"Pit"> {}
export function PitScoutingFlow({ navigation }: PitFlowProps) {
    const { competition, online } = useCurrentCompetition();
    const formStructure = competition?.pitScoutFormStructure ?? null;
    const formSections = formStructure === null ? [] : Form.splitSections(formStructure);

    const [currentTab, setCurrentTab] = useState("Match");

    const [images, setImages] = useState<string[]>(["plus"]);
    const [team, setTeam] = useState<number | null>(null);
    const [sectionData, setSectionData] = useState<any[]>([]);

    function reset() {
        setTeam(null);
        setImages(["plus"]);
        resetResponses();
    }
    function resetResponses() {
        setSectionData(formSections === null ? [] : Form.initialize(formSections));
    }
    useEffect(() => void resetResponses(), [formStructure]);

    async function submitForm() {
        if (competition === null || formStructure === null) return;

        if (team === null) {
            await AsyncAlert.alert("Invalid Team Number", "Please enter a valid team number");
            navigation.navigate("Match");
            return;
        }

        let missing = Form.checkRequired(formSections, sectionData);
        if (missing) {
            Alert.alert(
                "Required Question: " + missing.question + " not filled out",
                "Please fill out all questions denoted with an asterisk"
            );
            return;
        }

        const data: PitReportWithoutId = {
            data: Form.packSectionData(sectionData),
            teamNumber: team,
            competitionId: competition.id,
        };
        const internetResponse = await CompetitionsDB.getCurrentCompetition()
            .then(() => true)
            .catch(() => false);
        if (!internetResponse) {
            await FormHelper.savePitFormOffline(
                data,
                images.filter((item) => item !== "plus")
            );
            reset();

            Toast.show({
                type: "success",
                text1: "Saved offline successfully!",
                visibilityTime: 3000,
            });
        } else {
            try {
                await PitReportsDB.createOnlinePitScoutReport(
                    data,
                    images.filter((item) => item !== "plus")
                );
                reset();

                Toast.show({
                    type: "success",
                    text1: "Submitted successfully!",
                    visibilityTime: 3000,
                });
            } catch (error) {
                console.error(error);
                Alert.alert("Error", "There was an error submitting your pit report.");
            }
        }
    }

    if (competition === null) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <UIText>There is no competition happening currently.</UIText>

                {!online && (
                    <UIText>To check for competitions, please connect to the internet.</UIText>
                )}
            </View>
        );
    }

    const tabs = [
        {
            key: "Match",
            title: "Match",
            component: () => (
                <ScoutingFlowTab
                    title={competition ? `${competition.name}` : "Pit Scouting"}
                    buttonText={"Next"}
                    onNext={() => setCurrentTab(`Form/${formSections[0].title}`)}
                >
                    <TeamInformation team={team} setTeam={setTeam} />
                </ScoutingFlowTab>
            ),
        },
        ...formSections.map(({ title, items }, i) => {
            const isLast = i === formSections.length - 1;

            return {
                key: `Form/${title}`,
                title,
                component: () => (
                    <ScoutingFlowTab
                        buttonText={"Next"}
                        title={title}
                        onNext={() => {
                            setCurrentTab(isLast ? "Images" : `Form/${formSections[i + 1].title}`);
                        }}
                    >
                        <FormView
                            items={items}
                            data={sectionData[i]}
                            onInput={(data) => setSectionData(Arrays.set(sectionData, i, data))}
                        />
                    </ScoutingFlowTab>
                ),
            };
        }),
        {
            key: "Images",
            title: "Images",
            component: () => (
                <ScoutingFlowTab title={"Images"} buttonText="Submit" onNext={submitForm}>
                    <PitScoutingImageList images={images} setImages={setImages} />
                </ScoutingFlowTab>
            ),
        },
    ];

    return <UITabView currentKey={currentTab} onTabChange={setCurrentTab} tabs={tabs} />;
}
