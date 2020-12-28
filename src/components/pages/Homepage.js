import PropTypes from 'prop-types'
import Web3 from 'web3'
import React, { useEffect } from 'react'
import {
  Row,
  Col,
} from 'antd'
import { connect } from 'react-redux'
import {
  LoadingOutlined,
} from '@ant-design/icons'

// Components
import {
  Farm,
  Nofarm,
} from '../farm'
import {
  Stats,
} from '../dashboard'
import Loading from '../loading'

// Contracts
import Registry from '../../abis/FRMRegistry.json'
import Season from '../../abis/Season.json'
import Market from '../../abis/Market.json'
import Contracts from '../../contracts.json'

// Utils
import { initContract } from '../../utils'

// Redux store
import { store } from '../../store'

// Redux actions
import {
  loadDashboard,
  isDashLoading,
  loadCurrency,
} from '../../actions'

function Homepage({ dash, network, wallet, isLoading, usdRate, isMetamask }) {

  useEffect(() => {
    const registryContract = initContract(Registry, Contracts['4'].FRMRegistry[0])
    const seasonContract = initContract(Season, Contracts['4'].Season[0])
    const marketContract = initContract(Market, Contracts['4'].Market[0])

    async function loadDashboardData() {
      const dashboard = {}
      const loadingState = {}
      const conversionRate = {}
      // Start loading app component
      loadingState.dashLoading = true
      store.dispatch(isDashLoading({ ...loadingState }))
      // Fetch Eth price
      const etherPrice = await fetch(`https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEYS}`)
      const { result } = await etherPrice.json()
      conversionRate.ethusd = result.ethusd
      store.dispatch(loadCurrency({ ...conversionRate }))
      // Query app dashboard info from the blockchain
      dashboard.lands = await registryContract.methods.totalSupply().call()
      dashboard.markets = await marketContract.methods.totalMarkets().call()
      dashboard.traces = await seasonContract.methods.allTraces().call()
      const tx = await marketContract.methods.platformTransactions().call()
      dashboard.txs = Web3.utils.fromWei(tx, 'ether')
      dashboard.farms = []
      // Load the first 3 farms
      if (Number(dashboard.lands) === 0) {
        dashboard.farms = []
      } else if (Number(dashboard.lands) > 3) {
        // Randomize querying the 1st 3 farms
        for (let i = 1; i <= 3; i++) {
          try {
            dashboard.farms[i] = await registryContract.methods.queryTokenizedFarm(Math.floor(Math.random() * Number(dashboard.lands) + 1)).call()
          } catch(err) {
            console.log(err)
          }
        }
      } else {
        for (let i = 1; i <= Number(dashboard.lands); i++) {
          try {
            dashboard.farms[i] = await registryContract.methods.queryTokenizedFarm(i).call()
          } catch(err) {
            console.log(err)
          }
        }
      }
      store.dispatch(loadDashboard({ ...dashboard }))
      
      // Stop loading app component
      loadingState.dashLoading = false
      store.dispatch(isDashLoading({ ...loadingState }))
    }

    async function fetchEtherConversionRate() {
      const etherPrice = await fetch(`https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEYS}`)
      const { result } = await etherPrice.json()
      const conversionRate = {}
      conversionRate.ethusd = result.ethusd
      store.dispatch(loadCurrency({ ...conversionRate }))
    }

    const interval = setInterval(() => {
      fetchEtherConversionRate()
    }, 2500)

    loadDashboardData()

    return () => clearInterval(interval)

  }, [wallet, network])

  return (
    <>
      <Row justify='center' align='middle'>
        <Col xs={24} xl={6} className='column_con'>
          {isLoading ? (
            <Loading />  
          ) : (
            <Stats
              title='Lands'
              description='Number of registered farms lands'
              dispValue={dash.lands}
            />
          )} 
        </Col>
        <Col xs={24} xl={6} className='column_con'>
          {isLoading ? (
            <Loading />
          ) : (
            <Stats
              title='Traces'
              description='Number of performed traces'
              dispValue={dash.traces}
            />
          )}
        </Col>
        <Col xs={24} xl={6} className='column_con'>
          {isLoading ? (
            <Loading />
          ) : (
            <Stats
              title='Markets'
              description='Number of created markets'
              dispValue={dash.markets}
            />
          )}
        </Col>
        <Col xs={24} xl={6} className='column_con'>
          {isLoading ? (
            <Loading />
          ) : (
            <Stats
              title='Transactions'
              description='Total amount transacted'
              dispValue={`${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(dash.txs) * Number(usdRate))}`}
            />
          )}
        </Col>
      </Row>
      <Row>
        {isLoading ? (
          <Col xs={24} xl={24} className='column_con' style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <LoadingOutlined style={{ marginTop: '150px' }}/>
          </Col>
        ) : dash.farms.length === 0 ? (
          <Nofarm />
        ) : dash.farms.map(farm => (
          <Col key={farm.tokenId} xs={24} xl={8} className='column_con'>
            <Farm farm={farm} img={farm.imageHash} />
          </Col>
        ))}
      </Row>
    </>
  )
}

Homepage.propTypes = {
  dash: PropTypes.object,
  isLoading: PropTypes.bool,
  usdRate: PropTypes.number,
  network: PropTypes.number,
  isMetamask: PropTypes.bool,
  wallet: PropTypes.array,
}

function mapStateToProps(state) {
  return {
    isLoading: state.loading.dashLoading,
    usdRate: Number(state.currency.ethusd),
    dash: state.dashboard,
    network: state.network.currentNetwork,
    isMetamask: state.wallet.isMetaMask,
    wallet: state.wallet.address,
  }
}

export default connect(mapStateToProps)(Homepage)

