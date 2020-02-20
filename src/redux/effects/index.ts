import { combineEpics } from 'redux-observable';

const epics = combineEpics(
  // ...getTaxiListEpic
);

export default epics;
