import React from 'react';
import styled from 'styled-components';

import Control from './control/control-container';
import Map from './map/map-container';
import SnackbarUpdate from './snackbar-update/snackbar-update';
import Summary from './summary/summary-container';
import Modal from './modal/modal-container';

export interface AppProps {
  loading?: boolean;
  isServiceWorkerInitialised?: boolean;
  hasServiceWorkerUpdates?: boolean;
  serviceWorkerRegistration?: ServiceWorkerRegistration | null;
}

interface AppState {
  isHideSnackbar: boolean;
}

const AppWrapper = styled.main`
  display: flex;
  flex-flow: row wrap;
  justify-content: center;

  height: 100vh;
  height: -moz-available; // webkit
  height: -webkit-fill-available;  // mozilla
  height: fill-available;
`;

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      isHideSnackbar: false
    };
  }

  updateServiceWorker() {
    const { serviceWorkerRegistration } = this.props;
    const registrationWaiting = serviceWorkerRegistration?.waiting;

    if (registrationWaiting) {
      registrationWaiting.postMessage({ type: 'SKIP_WAITING' });

      registrationWaiting.addEventListener('statechange', () => {
        window.location.reload();
      });
    }
  }

  render() {
    const { hasServiceWorkerUpdates } = this.props;

    return (
      <AppWrapper>
        <Control />
        <Map />
        {hasServiceWorkerUpdates &&
          <SnackbarUpdate onDismiss={() => this.updateServiceWorker()}/>
        }
        <Summary />
        <Modal />
      </AppWrapper>
    );
  }
}

export default App;
