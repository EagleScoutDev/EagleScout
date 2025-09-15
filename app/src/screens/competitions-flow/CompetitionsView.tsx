import React, { useState } from 'react';
import { CompetitionViewer } from './CompetitionViewer';
import { CompetitionsList } from './CompetitionsList';

export function CompetitionsView() {
    const [chosenComp, setChosenComp] = useState(null);

    if (chosenComp == null) {
        return <CompetitionsList setChosenComp={setChosenComp} />;
    } else {
        return (
            <CompetitionViewer
                competition={chosenComp}
                resetCompID={() => setChosenComp(null)}
            />
        );
    }
};
