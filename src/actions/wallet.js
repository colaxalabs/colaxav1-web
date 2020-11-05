import Web3 from 'web3'

import {
  WALLET_FOUND,
  CONNECT_WALLET,
  WALLET_DISCONNECT,
  LOCATION_ACCESS,
  WALLET_CHANGE,
} from '../types'

export const walletFound = wallet => ({
  type: WALLET_FOUND,
  wallet,
})

export const walletChange = wallet => ({
  type: WALLET_CHANGE,
  wallet,
})

export const walletConnected = wallet => ({
  type: CONNECT_WALLET,
  wallet,
})

export const disconnectWallet = () => ({
  type: WALLET_DISCONNECT,
})

export const connectLocation = coords => ({
  type: LOCATION_ACCESS,
  coords,
})

export const connectWallet = () => async dispatch => {
  const wallet = {}
  const isMetaMaskInstalled = typeof window.ethereum !== 'undefined'
  if (isMetaMaskInstalled) {
    window.web3 = new Web3(window.ethereum)
    wallet.address = await window.ethereum.request({ method: 'eth_requestAccounts' })
    dispatch(walletConnected({ ...wallet }))
  } else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider)
    wallet.address = await window.web3.eth.getAccounts()
    dispatch(walletConnected({ ...wallet }))
  } else {
    window.alert('Install Metamask Wallet!')
  }
}

