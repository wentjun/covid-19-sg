import { ActionType } from 'typesafe-actions';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from '../../redux/actions/index';
import { RootState } from '../../redux/reducers/index';
import Control from './control';

type Action = ActionType<typeof actions>;

interface OwnProps {
}

const mapStateToProps = (state: RootState) => ({
  displayTransmissionClusters: state.control.displayTransmissionClusters,
});

const mapDispatchToProps = (dispatch: Dispatch<Action>, props: OwnProps) => bindActionCreators({
  toggleDisplayTransmissionClusters: (displayTransmissionClusters) =>
    actions.toggleDisplayTransmissionClusters(displayTransmissionClusters),
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Control);
