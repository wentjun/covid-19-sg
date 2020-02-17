import { ActionType, getType } from 'typesafe-actions';

import * as actions from '../actions';

type Action = ActionType<typeof actions>;

export interface ControlState {
  readonly loading: boolean;
  readonly taxiCount: string;
  readonly pickupEta: number;
  readonly errorMessage?: string;
}

const initialState: ControlState = {
  loading: false,
  taxiCount: '5',
  pickupEta: 0
};

export const controlReducer = (
  state: ControlState = initialState,
  action: Action
): ControlState => {
  switch (action.type) {
    default:
      return state;
  }
};
