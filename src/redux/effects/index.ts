import { combineEpics } from 'redux-observable';
import controlEpic from './control-epic';
const epics = combineEpics(
  ...controlEpic
);

export default epics;
