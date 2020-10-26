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
  walletFound,
} from './actions'

// Redux store
import store from './store'

import './App.less'

function App() {

  const isMetamaskInstalled = typeof window.ethereum !== 'undefined'

  useEffect(() => {
    async function loadWeb3() {
      const networkInfo = {}
      const walletInfo = {}
      if (isMetamaskInstalled) {
        window.web3 = new Web3(window.ethereum)
        networkInfo.currentNetwork = await window.web3.eth.net.getId()
        walletInfo.isMetamask = window.web3.currentProvider.isMetaMask === undefined ? false : window.web3.currentProvider.isMetaMask
        store.dispatch(networkFound({ ...networkInfo }))
        store.dispatch(walletFound({ ...walletInfo }))
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider)
        networkInfo.currentNetwork = await window.web3.eth.net.getId()
        walletInfo.isMetamask = window.web3.currentProvider.isMetaMask === undefined ? false : window.web3.currentProvider.isMetaMask
        store.dispatch(networkFound({ ...networkInfo }))
        store.dispatch(walletFound({ ...walletInfo }))
      } else {
        window.web3 = new Web3('ws://localhost:8545')
        networkInfo.currentNetwork = await window.web3.eth.net.getId()
        walletInfo.isMetamask = window.web3.currentProvider.isMetaMask === undefined ? false : window.web3.currentProvider.isMetaMask
        store.dispatch(networkFound({ ...networkInfo }))
        store.dispatch(walletFound({ ...walletInfo }))
      }
    }
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

