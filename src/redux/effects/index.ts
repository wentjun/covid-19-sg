import { combineEpics } from 'redux-observable';

import getTaxiListEpic from './control-epic';

const epics = combineEpics(
  ...getTaxiListEpic
);

export default epics;
