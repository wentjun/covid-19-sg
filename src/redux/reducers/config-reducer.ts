import { ActionType, getType } from 'typesafe-actions';
import * as actions from '../actions';

type Action = ActionType<typeof actions>;

export interface ConfigState {
  isServiceWorkerInitialised: boolean;
  hasServiceWorkerUpdates: boolean;
  serviceWorkerRegistration: ServiceWorkerRegistration | null;
}

const initialState: ConfigState = {
  isServiceWorkerInitialised: false,
  hasServiceWorkerUpdates: false,
  serviceWorkerRegistration: null
};

export const configReducer = (
  state: ConfigState = initialState,
  action: Action
): ConfigState => {
  switch (action.type) {
    case getType(actions.initialiseServiceWorker):
      return {
        ...state,
        isServiceWorkerInitialised: !initialState.isServiceWorkerInitialised
      };

    case getType(actions.updateServiceWorker):
      return {
        ...state,
        hasServiceWorkerUpdates: !initialState.hasServiceWorkerUpdates,
        serviceWorkerRegistration: action.payload.serviceWorkerRegistration
      };

    default:
      return state;
  }
};
