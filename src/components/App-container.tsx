import { ActionType } from 'typesafe-actions';
import { connect } from 'react-redux';
import * as actions from '../redux/actions/index';
import { RootState } from '../redux/reducers/index';
import App from './App';

type Action = ActionType<typeof actions>;

const mapStateToProps = (state: RootState) => ({
  loading: !state.map.ready,
  isServiceWorkerInitialised: state.config.isServiceWorkerInitialised,
  hasServiceWorkerUpdates: state.config.hasServiceWorkerUpdates,
  serviceWorkerRegistration: state.config.serviceWorkerRegistration,
});

export default connect(mapStateToProps)(App);
