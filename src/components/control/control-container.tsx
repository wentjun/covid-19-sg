import { ActionType } from 'typesafe-actions';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from '../../redux/actions/index';
import { RootState } from '../../redux/reducers/index';
import Control from './control';

type Action = ActionType<typeof actions>;

const mapStateToProps = (state: RootState) => ({
  displayTransmissionClusters: state.control.displayTransmissionClusters
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => bindActionCreators({
  toggleDisplayTransmissionClusters: (displayTransmissionClusters) =>
    actions.toggleDisplayTransmissionClusters(displayTransmissionClusters),
  setSelectedCluster: (selectedCluster) => actions.setSelectedCluster(selectedCluster)
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Control);
