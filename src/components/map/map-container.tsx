import { ActionType } from 'typesafe-actions';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from '../../redux/actions/index';
import { RootState } from '../../redux/reducers/index';
import Map from './map';

type Action = ActionType<typeof actions>;

const mapStateToProps = (state: RootState) => ({
  loading: !state.map.ready,
  latitude: state.map.latitude,
  longitude: state.map.longitude,
  zoom: state.map.zoom,
  clusterData: state.map.clusterData,
  transmissionClusterData: state.map.transmissionClusterData,
  displayTransmissionClusters: state.control.displayTransmissionClusters,
  displayCaseClusters: state.control.displayCaseClusters,
  selectedCluster: state.control.selectedCluster,
  selectedCase: state.control.selectedCase,
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => bindActionCreators({
  mapReady: () => actions.mapReady(),
  setSelectedCase: (selectedCase) => actions.setSelectedCase(selectedCase),
  setSelectedCluster: (selectedCluster) => actions.setSelectedCluster(selectedCluster),
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Map);
