import React from 'react';
import styled from 'styled-components';

import Control from './control/control-container';
import Map from './map/map-container';
import SnackbarUpdate from './snackbar-update/snackbar-update';

export interface AppProps {
  loading?: boolean;
  isServiceWorkerInitialised?: boolean;
  hasServiceWorkerUpdates?: boolean;
  serviceWorkerRegistration?: ServiceWorkerRegistration | null;
}

interface AppState {
  isHideSnackbar: boolean;
}

const AppWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
`;

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      isHideSnackbar: false
    };
  }

  updateServiceWorker() {
    const { hasServiceWorkerUpdates, serviceWorkerRegistration } = this.props;
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
      </AppWrapper>
    );
  }
}

export default App;
