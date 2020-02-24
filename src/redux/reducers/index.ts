import { combineReducers } from 'redux';

import { controlReducer, ControlState } from './control-reducer';
import { mapReducer, MapState } from './map-reducer';
import { configReducer, ConfigState } from './config-reducer';

export interface RootState {
  control: ControlState;
  map: MapState;
  config: ConfigState;
}

const reducers = combineReducers({
  control: controlReducer,
  map: mapReducer,
  config: configReducer
});

export default reducers;
