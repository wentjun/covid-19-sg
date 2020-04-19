import { combineReducers } from 'redux';
import { controlReducer, ControlState } from './control-reducer';
import { mapReducer, MapState } from './map-reducer';
import { configReducer, ConfigState } from './config-reducer';
import { uiReducer, UiState } from './ui-reducer';

export interface RootState {
  control: ControlState;
  map: MapState;
  config: ConfigState;
  ui: UiState;
}

const reducers = combineReducers({
  control: controlReducer,
  map: mapReducer,
  config: configReducer,
  ui: uiReducer,
});

export default reducers;
