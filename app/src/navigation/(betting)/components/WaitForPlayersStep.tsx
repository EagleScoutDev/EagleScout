import { BettingInfoStep } from "./BettingInfoStep";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { PlayerIcon } from "./PlayerIcon";

export function WaitForPlayersStep() {
    return (
        <BettingInfoStep
            index={0}
            title="Wait for 2+ players"
            nextScreen="SelectAlliance"
            isFinalScreen={false}
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
}
