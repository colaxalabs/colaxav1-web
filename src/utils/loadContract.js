import Contract from 'web3-eth-contract'

export function initContract(contract, contractAddress) {
  // Set provider for all instances
  Contract.setProvider('ws://localhost:8545')
  const newContract = new Contract(contract.abi, contractAddress)
  return newContract
}

