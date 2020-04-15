import { connect } from 'react-redux';
import { RootState } from '../../redux/reducers/index';
import Summary from './summary';

const mapStateToProps = (state: RootState) => ({
  ready: state.map.ready,
  clusterData: state.map.clusterData,
  dateEndRange: state.control.dateEndRange,
  selectedCase: state.control.selectedCase,
  selectedCluster: state.control.selectedCluster
});

export default connect(mapStateToProps)(Summary);
