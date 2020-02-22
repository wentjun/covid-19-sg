import { combineEpics } from 'redux-observable';
import controlEpic from './control-epic';

const rootEpic = combineEpics(
  ...controlEpic
);

export default rootEpic;
