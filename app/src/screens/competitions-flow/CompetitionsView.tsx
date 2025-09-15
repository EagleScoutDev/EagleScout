import React, { useState } from 'react';
import CompetitionViewer from './CompetitionViewer';
import CompetitionsList from './CompetitionsList';

function CompetitionsView() {
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
}

export default CompetitionsView;
