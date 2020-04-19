import { ActionType, getType } from 'typesafe-actions';
import * as actions from '../actions';

type Action = ActionType<typeof actions>;

export type Modal = 'case' | 'information' | null;

export interface UiState {
  readonly modal: Modal;
}

const initialState: UiState = {
  modal: null,
};

export const uiReducer = (
  state: UiState = initialState,
  action: Action,
): UiState => {
  switch (action.type) {
    case getType(actions.setModal):
      return {
        ...state,
        modal: action.payload.modal,
      };

    default:
      return state;
  }
};
