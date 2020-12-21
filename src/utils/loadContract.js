import Contract from 'web3-eth-contract'

export function initContract(contract, contractAddress) {
  // Set provider for all instances
  const isWeb3Window = typeof window.ethereum !== 'undefined'
  if (isWeb3Window) {
    Contract.setProvider(window.web3.currentProvider)
  } else {
    Contract.setProvider(`wss://rinkeby.infura.io/ws/v3/${process.env.REACT_APP_INFURA_PROJECT_ID}`)
  }
  const newContract = new Contract(contract.abi, contractAddress)
  return newContract
}

