import { combineReducers } from 'redux';

import { controlReducer, ControlState } from './control-reducer';
import { mapReducer, MapState } from './map-reducer';

export interface RootState {
  control: ControlState;
  map: MapState;
}

const reducers = combineReducers({
  control: controlReducer,
  map: mapReducer
});

export default reducers;
