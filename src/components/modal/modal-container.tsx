import { ActionType } from 'typesafe-actions';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from '../../redux/actions/index';
import { RootState } from '../../redux/reducers/index';
import { Modal } from './modal';

type Action = ActionType<typeof actions>;

const mapStateToProps = (state: RootState) => ({
  modal: state.ui.modal,
  selectedCase: state.control.selectedCase,
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => bindActionCreators({

}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
