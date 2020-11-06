import Web3 from 'web3'

// Redux actions
import {
  networkFound,
  walletFound,
  disconnectWallet,
} from '../actions'

// Redux store
import { store } from '../store'

const isMetamaskInstalled = typeof window.ethereum !== 'undefined'

async function loadWeb3() {
  const networkInfo = {}
  const walletInfo = {}
  if (isMetamaskInstalled) {
    window.web3 = new Web3(window.ethereum)
    const isMetamaskUnlocked = await window.ethereum._metamask.isUnlocked()
    if (!isMetamaskUnlocked) {
      networkInfo.currentNetwork = await window.web3.eth.net.getId()
      walletInfo.isMetamask = window.web3.currentProvider.isMetaMask === undefined ? false : window.web3.currentProvider.isMetaMask
      store.dispatch(networkFound({ ...networkInfo }))
      store.dispatch(walletFound({ ...walletInfo }))
      store.dispatch(disconnectWallet())
    }
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
    window.web3 = new Web3(`wss://rinkeby.infura.io/ws/v3/${process.env.REACT_APP_INFURA_PROJECT_ID}`)
    networkInfo.currentNetwork = await window.web3.eth.net.getId()
    walletInfo.isMetamask = window.web3.currentProvider.isMetaMask === undefined ? false : window.web3.currentProvider.isMetaMask
    store.dispatch(networkFound({ ...networkInfo }))
    store.dispatch(walletFound({ ...walletInfo }))
  }
}

export default loadWeb3

