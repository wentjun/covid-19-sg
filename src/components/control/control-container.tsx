import { ActionType } from 'typesafe-actions';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from '../../redux/actions/index';
import { RootState } from '../../redux/reducers/index';
import Control from './control';

type Action = ActionType<typeof actions>;

const mapStateToProps = (state: RootState) => ({
  displayTransmissionClusters: state.control.displayTransmissionClusters,
  displayCaseClusters: state.control.displayCaseClusters,
  ready: state.map.ready,
  clusterData: state.map.clusterData,
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => bindActionCreators({
  toggleDisplayTransmissionClusters: (displayTransmissionClusters) =>
    actions.toggleDisplayTransmissionClusters(displayTransmissionClusters),
  toggleDisplayCaseClusters: (displayCaseClusters) =>
    actions.toggleDisplayCaseClusters(displayCaseClusters),
  setSelectedCluster: (selectedCluster) => actions.setSelectedCluster(selectedCluster),
  setSelectedCase: (selectedCase) => actions.setSelectedCase(selectedCase),
  setDateRange: (numberOfDays) => actions.setDateRange(numberOfDays)
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Control);
