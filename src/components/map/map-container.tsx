import { ActionType } from 'typesafe-actions';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from '../../redux/actions/index';
import { RootState } from '../../redux/reducers/index';
import Map from './map';

type Action = ActionType<typeof actions>;

interface OwnProps {
}

const mapStateToProps = (state: RootState) => ({
  loading: !state.map.ready,
  latitude: state.map.latitude,
  longitude: state.map.longitude,
  zoom: state.map.zoom,
  taxiLocations: state.map.taxiLocations
});

const mapDispatchToProps = (dispatch: Dispatch<Action>, props: OwnProps) => bindActionCreators({
  mapReady: () => actions.mapReady(),
  updateCurrentLocation: (longitude: number, latitude: number) => actions.updateCurrentLocation(longitude, latitude)
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Map);
