import {
  LOAD_FARM_DATA,
  FORM_SUBMITTING,
  OPEN_SEASON,
  OPENING_SEASON,
  CONFIRMING_PREPARATION,
  CLOSE_PREPARATION,
  CONFIRMING_PLANTING,
  CLOSE_PLANTING,
  CONFIRMING_GROWTH,
  CLOSE_GROWTH,
  CONFIRMING_HARVEST,
  FINISH_HARVEST,
} from '../types'
import ipfs from '../ipfs'
import Web3 from 'web3'
import { randInt, initContract } from '../utils'

// Contracts
import Registry from '../abis/FRMRegistry.json'
import Season from '../abis/Season.json'
import Contracts from '../contracts.json'

export const loadFarm = farm => ({
  type: LOAD_FARM_DATA,
  farm,
})

export const submitting = status => ({
  type: FORM_SUBMITTING,
  status,
})

const seasonOpened = farm => ({
  type: OPEN_SEASON,
  farm,
})

const openingSeason = status => ({
  type: OPENING_SEASON,
  status,
})

const confirmingPreparation = status => ({
  type: CONFIRMING_PREPARATION,
  status,
})

const closePreparation = farm => ({
  type: CLOSE_PREPARATION,
  farm,
})

const confirmingPlanting = status => ({
  type: CONFIRMING_PLANTING,
  status,
})

const closePlanting = farm => ({
  type: CLOSE_PLANTING,
  farm,
})

const confirmingGrowth = status => ({
  type: CONFIRMING_GROWTH,
  status,
})

const closeGrowth = farm => ({
  type: CLOSE_GROWTH,
  farm,
})

const confirmingHarvest = status => ({
  type: CONFIRMING_HARVEST,
  status,
})

const finishHarvesting = farm => ({
  type: FINISH_HARVEST,
  farm,
})

export const tokenize = (name, size, lon, lat, file, soil, message) => async dispatch => {
  // Init contracts
  const registryContract = initContract(Registry, Contracts['4'].FRMRegistry[0])
  // Upload file to IPFS
  const { cid } = await ipfs.add(file)
  const fileHash = cid.string
  const token = randInt(999, 999999999)
  const status = {}
  const accounts = await window.web3.eth.getAccounts()
  // Send transaction
  registryContract.methods.tokenizeLand(name, size, lon, lat, fileHash, soil, token).send({ from: accounts[0] })
    .on('transactionHash', (hash) => {
      message.info('Confirming transaction...', 5)
    })
    .on('confirmation', (confirmationNumber, receipt) => {
      if (confirmationNumber === 1) {
        status.formSubmitting = false
        dispatch(submitting({ ...status }))
        message.success('Registration was successful!', 5)
        console.log(receipt)
      }
    })
    .on('error', error => {
      status.formSubmitting = false
      dispatch(submitting({ ...status }))
      message.error(`Error: ${error.message}`, 10)
      console.log(error)
    })
}

export const openSeason = (tokenId, message) => async dispatch => {
  // Init contracts
  const seasonContract = initContract(Season, Contracts['4'].Season[0])
  const accounts = await window.web3.eth.getAccounts()
  // Send tx
  const status = {}
  status.openingSeason = true
  dispatch(openingSeason({ ...status }))
  seasonContract.methods.openSeason(tokenId).send({ from: accounts[0] })
    .on('transactionHash', () => {
      message.info('Confirming transaction...', 5)
    })
    .on('confirmation', async(confirmationNumber, receipt) => {
      if (confirmationNumber === 1) {
        status.openingSeason = false
        dispatch(openingSeason({ ...status }))
        const farm = {}
        farm.season = await seasonContract.methods.getSeason(tokenId).call()
        dispatch(seasonOpened({ ...farm }))
        message.success('Season opened. Start seasonal activities!', 5)
      }
    })
    .on('error', error => {
      status.openingSeason = false
      dispatch(openingSeason({ ...status }))
      message.error(`Error: ${error.message}`, 10)
      console.log(error)
    })
}

export const confirmPreparation = (tokenId, values, message) => async dispatch => {
  // Init contracts
  const seasonContract = initContract(Season, Contracts['4'].Season[0])
  const accounts = await window.web3.eth.getAccounts()
  // Send tx
  const status = {}
  if (values.fertilizerCheck) {
    status.confirmingPreparation = true
    dispatch(confirmingPreparation({ ...status }))
    const { crop, fertilizerSupplier, fertilizerType, fertilizerUsed } = values
    const fertilizerName = `${fertilizerType} (${fertilizerUsed})`
    seasonContract.methods.confirmPreparations(Number(tokenId), crop, fertilizerName, fertilizerSupplier).send({ from: accounts[0] })
      .on('transactionHash', () => {
        message.info('Confirming transaction...', 5)
      })
      .on('confirmation', async(confirmationNumber, receipt) => {
        if (confirmationNumber === 1) {
          const farm = {}
          farm.season = await seasonContract.methods.getSeason(tokenId).call()
          dispatch(closePreparation({ ...farm }))
          status.confirmingPreparation = false
          dispatch(confirmingPreparation({ ...status }))
          message.success('Transaction confirmed!', 5)
        }
      })
      .on('error', err => {
        status.confirmingPreparation = false
        dispatch(confirmingPreparation({ ...status }))
        message.error(`Error: ${err.message}`, 10)
        console.log(err)
      })
  } else {
    status.confirmingPreparation = true
    dispatch(confirmingPreparation({ ...status }))
    const { crop } = values
    seasonContract.methods.confirmPreparations(tokenId, crop, "", "").send({ from: accounts[0] })
      .on('transactionHash', () => {
        message.info('Confirming transaction...', 5)
      })
      .on('confirmation', async(confirmationNumber, receipt) => {
        if (confirmationNumber === 1) {
          const farm = {}
          farm.season = await seasonContract.methods.getSeason(tokenId).call()
          dispatch(closePreparation({ ...farm }))
          status.confirmingPreparation = false
          dispatch(confirmingPreparation({ ...status }))
          message.success('Transaction confirmed!', 5)
        }
      })
      .on('error', err => {
        status.confirmingPreparation = false
        dispatch(confirmingPreparation({ ...status }))
        message.error(`Error: ${err.message}`, 10)
        console.log(err)
      })
  }
}

export const confirmPlanting = (tokenId, values, message) => async dispatch => {
  // Init contracts
  const seasonContract = initContract(Season, Contracts['4'].Season[0])
  const accounts = await window.web3.eth.getAccounts()
  // Send tx
  const status = {}
  const { fertilizerCheck } = values
  if (fertilizerCheck) {
    const { expectedYield, seedsUsed, seedsSupplier, plantingFertilizer, fertilizerType, fertilizerSupplier } = values
    const fertilizerName = `${fertilizerType} (${plantingFertilizer})}`
    status.confirmingPlanting = true
    dispatch(confirmingPlanting({ ...status }))
    seasonContract.methods.confirmPlanting(tokenId, seedsUsed, seedsSupplier, expectedYield, fertilizerName, fertilizerSupplier).send({ from: accounts[0] })
      .on('transactionHash', () => {
        message.info('Confirming transaction...', 5)
      })
      .on('confirmation', async(confirmationNumber, receipt) => {
        if (confirmationNumber === 1) {
          const farm = {}
          farm.season = await seasonContract.methods.getSeason(tokenId).call()
          dispatch(closePlanting({ ...farm }))
          status.confirmingPlanting = false
          dispatch(confirmingPlanting({ ...status }))
          message.success('Transaction confirmed!', 5)
        }
      })
      .on('error', err => {
        status.confirmingPlanting = false
        dispatch(confirmingPlanting({ ...status }))
        message.error(`Error: ${err.message}`, 10)
        console.log(err)
      })
  } else {
    const { expectedYield, seedsUsed, seedsSupplier } = values
    status.confirmingPlanting = true
    dispatch(confirmingPlanting({ ...status }))
    seasonContract.methods.confirmPlanting(tokenId, seedsUsed, seedsSupplier, expectedYield, "", "").send({ from: accounts[0] })
      .on('transactionHash', () => {
        message.info('Confirming transaction...', 5)
      })
      .on('confirmation', async(confirmationNumber, receipt) => {
        if (confirmationNumber === 1) {
          const farm = {}
          farm.season = await seasonContract.methods.getSeason(tokenId).call()
          dispatch(closePlanting({ ...farm }))
          status.confirmingPlanting = false
          dispatch(confirmingPlanting({ ...status }))
          message.success('Transaction confirmed!', 5)
        }
      })
      .on('error', err => {
        status.confirmingPlanting = false
        dispatch(confirmingPlanting({ ...status }))
        message.error(`Error: ${err.message}`, 10)
        console.log(err)
      })
  }
}

export const confirmGrowth = (tokenId, values, message) => async dispatch => {
  // Init contracts
  const seasonContract = initContract(Season, Contracts['4'].Season[0])
  const accounts = await window.web3.eth.getAccounts()
  // Send tx
  const status = {}
  const { pesticideCheck } = values
  if (pesticideCheck) {
    const { name, pesticideUsed, pesticideSupplier } = values
    status.confirmingGrowth = true
    dispatch(confirmingGrowth({ ...status }))
    seasonContract.methods.confirmGrowth(tokenId, name, pesticideUsed, pesticideSupplier).send({ from: accounts[0] })
      .on('transactionHash', () => {
        message.info('Confirming transaction...')
      })
      .on('confirmation', async(confirmationNumber, receipt) => {
        if (confirmationNumber === 1) {
          const farm = {}
          farm.season = await seasonContract.methods.getSeason(tokenId).call()
          dispatch(closeGrowth({ ...farm }))
          status.confirmingGrowth = false
          dispatch(confirmingGrowth({ ...status }))
          message.success('Transaction confirmed!')
        }
      })
      .on('error', err => {
        status.confirmingGrowth = false
        dispatch(confirmingGrowth({ ...status }))
        message.error(`Error: ${err.message}`)
        console.log(err)
      })
  } else {
    status.confirmingGrowth = true
    dispatch(confirmingGrowth({ ...status }))
    seasonContract.methods.confirmGrowth(tokenId, "", "", "").send({ from: accounts[0] })
      .on('transactionHash', () => {
        message.info('Confirming transaction...')
      })
      .on('confirmation', async(confirmationNumber, receipt) => {
        if (confirmationNumber === 1) {
          const farm = {}
          farm.season = await seasonContract.methods.getSeason(tokenId).call()
          dispatch(closeGrowth({ ...farm }))
          status.confirmingGrowth = false
          dispatch(confirmingGrowth({ ...status }))
          message.success('Transaction confirmed!')
        }
      })
      .on('error', err => {
        status.confirmingGrowth = false
        dispatch(confirmingGrowth({ ...status }))
        message.error(`Error: ${err.message}`)
        console.log(err)
      })
  }
}

export const confirmHarvest = (tokenId, values, message) => async dispatch => {
  const { file, price, unit, supply } = values
  // Init contracts
  const seasonContract = initContract(Season, Contracts['4'].Season[0])
  const accounts = await window.web3.eth.getAccounts()
  const priceWei = Web3.utils.toWei(price, 'ether')
  // Send tx
  const status = {}
  status.confirmingHarvest = true
  dispatch(confirmingHarvest({ ...status }))
  // Upload file to IPFS
  const { cid } = await ipfs.add(file)
  const fileHash = cid.string
  seasonContract.methods.confirmHarvesting(tokenId, supply, unit, priceWei, fileHash).send({ from: accounts[0] })
    .on('transactionHash', () => {
      message.info('Confirming transaction...')
    })
    .on('confirmation', async(confirmationNumber, receipt) => {
      if (confirmationNumber === 1) {
        const farm = {}
        farm.season = await seasonContract.methods.getSeason(tokenId).call()
        dispatch(finishHarvesting({ ...farm }))
        status.confirmingHarvest = false
        dispatch(confirmingHarvest({ ...status }))
        message.success('Transaction confirmed!')
      } 
    })
    .on('error', err => {
      status.confirmingHarvest = false
      dispatch(confirmingHarvest({ ...status }))
      message.error(`Error: ${err.message}`)
      console.log(err)
    })
}

export const bookHarvest = (tokenId, values) => async dispatch => {
  const { volume } = values
  // Init Contract
  const seasonContract = initContract(Season, Contracts['4'].Season[0])
  const seasonNo = await seasonContract.methods.currentSeason(tokenId).call()
  console.log({ tokenId, volume, seasonNo })
}

