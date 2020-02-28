import { ActionType } from 'typesafe-actions';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions/index';
import { RootState } from '../../redux/reducers/index';
import Summary from './summary';

type Action = ActionType<typeof actions>;

const mapStateToProps = (state: RootState) => ({
  ready: state.map.ready,
  clusterData: state.map.clusterData,
  dateEndRange: state.control.dateEndRange,
  selectedCase: state.control.selectedCase,
  selectedCluster: state.control.selectedCluster
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => bindActionCreators({
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Summary);
