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

function Homepage({ dash, isLoading, usdRate }) {

  useEffect(() => {
    const registryContract = initContract(Registry, Contracts.dev.FRMRegistry[0])
    const seasonContract = initContract(Season, Contracts.dev.Season[0])

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
      dashboard.bookings = await seasonContract.methods.totalBooking().call()
      dashboard.traces = await seasonContract.methods.allTraces().call()
      const tx = await seasonContract.methods.platformTransactions().call()
      dashboard.txs = Web3.utils.fromWei(tx, 'ether')
      dashboard.farms = []
      // Load the first 3 farms
      if (Number(dashboard.lands) === 0) {
        dashboard.farms = []
      } else if (Number(dashboard.lands) > 3) {
        // Randomize querying the 1st 3 farms
        for (let i = 1; i <= 3; i++) {
          try {
            dashboard.farms[i] = await registryContract.methods.queryUserTokenizedFarm(Math.floor(Math.random() * Number(dashboard.lands) + 1))
          } catch(err) {
            console.log(err)
          }
        }
      } else {
        for (let i = 1; i <= Number(dashboard.lands); i++) {
          try {
            dashboard.farms[i] = await registryContract.methods.queryUserTokenizedFarm(i).call()
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

  }, [])

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
              title='Bookings'
              description='Number of completed bookings'
              dispValue={dash.bookings}
            />
          )}
        </Col>
        <Col xs={24} xl={6} className='column_con'>
          {isLoading ? (
            <Loading />
          ) : (
            <Stats
              title='Traces'
              description='Number of performed bookings'
              dispValue={dash.traces}
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
      <Row justify='center' align='center'>
        {isLoading ? (
          <Col xs={24} xl={24} className='column_con' style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <LoadingOutlined style={{ marginTop: '150px' }}/>
          </Col>
        ) : dash.farms.length === 0 ? (
          <Nofarm />
        ) : dash.farms.map(farm => (
          <Col key={farm.tokenId} xs={24} xl={8} className='column_con'>
            <Farm farm={farm} />
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
}

function mapStateToProps(state) {
  return {
    isLoading: state.loading.dashboardLoading,
    usdRate: Number(state.currency.ethusd),
    dash: state.dashboard,
  }
}

export default connect(mapStateToProps)(Homepage)

