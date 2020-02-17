import { ActionType, getType } from 'typesafe-actions';

import * as actions from '../actions';

type Action = ActionType<typeof actions>;

export interface ControlState {
  readonly loading: boolean;
  readonly taxiCount: string;
  readonly pickupEta: number;
  readonly errorMessage?: string;
}

const initialState = {
  loading: false,
  taxiCount: '5',
  pickupEta: 0
};

export const controlReducer = (state: ControlState = initialState, action: Action): ControlState => {

  switch (action.type) {

    case getType(actions.setTaxiCount):
      return {
        ...state,
        taxiCount: action.payload.taxiCount
      };

    case getType(actions.getTaxiEta):
      return {
        ...state,
        errorMessage: undefined,
        pickupEta: action.payload.pickupEta
      };

      case getType(actions.updateTaxiLocationsError):
        return {
          ...state,
          errorMessage: action.payload
        };

    default:
      return state;
  }
};
