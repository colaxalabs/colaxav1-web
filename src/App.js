import PropTypes from 'prop-types'
import React, { useEffect } from 'react';
import { connect } from 'react-redux'
import { Switch, Route } from 'react-router-dom'
import Web3 from 'web3'

// Containers
import { DesktopContainer } from './containers'

// Components
import {
  Homepage,
  Userpage,
  Farmpage,
  Registerpage,
  Tracepage,
} from './components/pages'
import { InfiniteModal } from './components/modals'

// Redux actions
import {
  networkFound,
  disconnectWallet,
  walletChange,
} from './actions'

// Utils
import { loadWeb3 } from './utils'

// Redux store
import { store } from './store'

import './App.less'

function App({ network }) {

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
    window.ethereum.on('accountsChanged', async(accounts) => {
      const wallet = {}
      wallet.address = accounts
      store.dispatch(walletChange({ ...wallet }))
    })
    window.ethereum.on('disconnect', (error) => {
      store.dispatch(disconnectWallet())
      window.alert(`Error ${error.message}`)
    })
  }

  return (
    <DesktopContainer>
      <InfiniteModal network={network} />
      <Switch>
        <Route exact path='/' component={Homepage} />
        <Route exact path='/wallet/' component={Userpage} />
        <Route exact path='/register/' component={Registerpage} />
        <Route exact path='/trace/' component={Tracepage} />
        <Route path='/farm/:id/' component={Farmpage} />
      </Switch>
    </DesktopContainer>
  );
}

App.propTypes = {
  network: PropTypes.number,
}

function mapStateToProps(state) {
  return {
    network: state.network.currentNetwork,
  }
}

export default connect(mapStateToProps)(App);

