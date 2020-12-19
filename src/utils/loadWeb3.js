import Web3 from 'web3'

// Redux actions
import {
  networkFound,
  disconnectWallet,
  walletFound,
} from '../actions'

// Redux store
import { store } from '../store'

const isMetamaskInstalled = typeof window.ethereum !== 'undefined'

async function loadWeb3() {
  const networkInfo = {}
  const wallet = {}
  if (isMetamaskInstalled) {
    window.web3 = new Web3(window.ethereum)
    wallet.isMetaMask = window.web3.currentProvider.isMetaMask === undefined ? false : window.web3.currentProvider.isMetaMask
    const isMetamaskUnlocked = await window.ethereum._metamask.isUnlocked()
    if (!isMetamaskUnlocked) {
      networkInfo.currentNetwork = await window.web3.eth.net.getId()
      wallet.isMetaMask = window.web3.currentProvider.isMetaMask === undefined ? false : window.web3.currentProvider.isMetaMask
      store.dispatch(walletFound({ ...wallet }))
      store.dispatch(networkFound({ ...networkInfo }))
      store.dispatch(disconnectWallet())
    }
    networkInfo.currentNetwork = await window.web3.eth.net.getId()
    store.dispatch(networkFound({ ...networkInfo }))
    store.dispatch(walletFound({ ...wallet }))
  } else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider)
    wallet.isMetaMask = window.web3.currentProvider.isMetaMask === undefined ? false : window.web3.currentProvider.isMetaMask
    networkInfo.currentNetwork = await window.web3.eth.net.getId()
    store.dispatch(networkFound({ ...networkInfo }))
    store.dispatch(walletFound({ ...wallet }))
  } else {
    window.web3 = new Web3(`wss://rinkeby.infura.io/ws/v3/${process.env.REACT_APP_INFURA_PROJECT_ID}`)
    networkInfo.currentNetwork = await window.web3.eth.net.getId()
    wallet.isMetaMask = window.web3.currentProvider.isMetaMask === undefined ? false : window.web3.currentProvider.isMetaMask
    store.dispatch(networkFound({ ...networkInfo }))
    store.dispatch(walletFound({ ...wallet }))
  }
}

export default loadWeb3

