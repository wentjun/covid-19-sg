import React from 'react';
import styled from 'styled-components';

import Control from './control/control-container';
import Map from './map/map-container';

export interface AppProps {
  loading?: boolean;
}

const AppWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;

  @media all and (max-width: 1024px) {
    flex-direction: column-reverse;
  }
`;

class App extends React.Component<AppProps, {}> {
  render() {
    return (
      <AppWrapper>
        <Control />
        <Map />
      </AppWrapper>
    );
  }
}

export default App;
