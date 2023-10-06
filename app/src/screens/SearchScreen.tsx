import React, {useEffect, useState} from 'react';
import SearchMain from './SearchMain';

import TeamViewer from './TeamViewer';
import {SimpleTeam} from '../lib/TBAUtils';

function SearchScreen() {
  const [team, setChosenTeam] = useState<SimpleTeam>();

  if (team === null || team === undefined) {
    return <SearchMain setChosenTeam={setChosenTeam} />;
  } else {
    return <TeamViewer team={team} goBack={() => setChosenTeam(undefined)} />;
  }
}

export default SearchScreen;
