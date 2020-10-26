import Contract from 'web3-eth-contract'

export function initContract(contract, contractAddress) {
  // Set provider for all instances
  Contract.setProvider(window.web3.currentProvider)
  const newContract = new Contract(contract.abi, contractAddress)
  return newContract
}

