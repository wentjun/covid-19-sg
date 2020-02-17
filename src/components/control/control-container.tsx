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
  taxiCount: state.control.taxiCount,
  pickupEta: state.control.pickupEta,
  errorMessage: state.control.errorMessage
});

const mapDispatchToProps = (dispatch: Dispatch<Action>, props: OwnProps) => bindActionCreators({
  setTaxiCount: (taxiCount: string) => actions.setTaxiCount(taxiCount),
  mapReady: () => actions.mapReady()
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Control);
