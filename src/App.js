import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom'
import Web3 from 'web3'

// Containers
import { DesktopContainer } from './containers'

// Components
import { Homepage } from './components/pages'

// Redux actions
import {
  networkFound,
} from './actions'

// Utils
import { loadWeb3 } from './utils'

// Redux store
import store from './store'

import './App.less'

function App() {

  const isMetamaskInstalled = typeof window.ethereum !== 'undefined'

  useEffect(() => {
    loadWeb3()
  })

  if (isMetamaskInstalled) {
    window.ethereum.on('chainChanged', async(_chainId) => {
      const networkInfo = {}
      networkInfo.currentNetwork = Web3.utils.isHex(_chainId) ? Web3.utils.hexToNumber(_chainId) : _chainId
      store.dispatch(networkFound({ ...networkInfo }))
    })
  }

  return (
    <DesktopContainer>
      <Switch>
        <Route exact path='/' component={Homepage} />
      </Switch>
    </DesktopContainer>
  );
}

export default App;

