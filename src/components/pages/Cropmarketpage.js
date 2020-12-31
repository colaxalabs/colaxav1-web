import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import Web3 from 'web3'
import {
  Button,
  Row,
  Col,
  Table,
  Tag,
  Typography,
} from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

// Contracts
import Market from '../../abis/Market.json'
import Registry from '../../abis/FRMRegistry.json'
import Contracts from '../../contracts.json'

// Utils
import { initContract } from '../../utils'

// Store
import { store } from '../../store'

// Components
import Loading from '../loading'
import { Stats } from '../dashboard'

// Redux actions
import { loadCurrency, loadMarkets, loadMarketDash } from '../../actions'

const { Text } = Typography

function CropMarket({ wallet, network, isLoading, markets, usdRate }) {

  const columns = [
    {
      title: '#',
      dataIndex: 'tokenId',
      key: 'tokenId',
    },
    {
      title: 'Crop',
      dataIndex: 'crop',
      key: 'crop',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Supply',
      dataIndex: 'originalSupply',
      key: 'originalSupply',
      render: (text, record) => (
        <>
          <Text>{`${record.originalSupply} ${record.supplyUnit}`}</Text>
        </>
      )
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: price => (
        <>
          <Text>
            {`${Web3.utils.fromWei(price, 'ether')} ETH / ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(Web3.utils.fromWei(price, 'ether')) * usdRate)}`}
          </Text>
        </>
      )
    },
    {
      title: 'Opened',
      dataIndex: 'openDate',
      key: 'openDate',
      render: openDate => (
        <>
          <Text>{`${new Date(openDate * 1000).toLocaleDateString()}`}</Text>
        </>
      )
    },
    {
      title: 'Status',
      dataIndex: 'closeDate',
      key: 'closeDate',
      render: (text, record) => (
        <>
          {record.closeDate >= record.openDate ? (
            <Tag color='red'>Closed</Tag>
          ) : (
            <Tag color='green'>Open</Tag>
          )}
        </>
      )
    },
    {
      title: 'Remaining Supply',
      dataIndex: 'remainingSupply',
      key: 'remainingSupply',
      render: (text, record) => (
        <>
          <Text>{`${record.remainingSupply} ${record.supplyUnit}`}</Text>
        </>
      )
    },
    {
      title: 'Bookers',
      dataIndex: 'bookers',
      key: 'bookers',
    },
    {
      title: 'Book',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: (text, record) => <Button type='primary' size='small' disabled={Number(record.remainingSupply) === 0}>Book</Button>
    }
  ]

  React.useEffect(() => {

    async function queryMarkets() {
      // Init contracts
      const marketContract = initContract(Market, Contracts['4'].Market[0])
      const registryContract = initContract(Registry, Contracts['4'].FRMRegistry[0])

      const marketsData = {}
      const status = {}
      const marketResponse = {}
      status.marketdashLoading = true
      store.dispatch(loadMarketDash({ ...status }))
      marketsData.totalMarkets = Number(await marketContract.methods.totalMarkets().call())
      marketsData.traces = 0
      marketsData.enlistedMarkets = []
      const tx = await marketContract.methods.platformTransactions().call()
      marketsData.txs = Web3.utils.fromWei(tx, 'ether')
      if (marketsData.totalMarkets === 0) {
        marketsData.enlistedMarkets = []
      } else {
        for (let i = 1; i <= marketsData.totalMarkets; i++) {
          try {
            const { tokenId, crop, bookers, closeDate, openDate, originalSupply, remainingSupply, price, supplyUnit } = await marketContract.methods.getEnlistedMarket(i).call()
            const { location } = await registryContract.methods.getFarm(Number(tokenId)).call()
            marketResponse.key = i
            marketResponse.crop = crop
            marketResponse.location = location
            marketResponse.bookers = bookers
            marketResponse.closeDate = closeDate
            marketResponse.openDate = openDate
            marketResponse.originalSupply = originalSupply
            marketResponse.price = price
            marketResponse.remainingSupply = remainingSupply
            marketResponse.supplyUnit = supplyUnit
            marketsData.enlistedMarkets[i-1] = marketResponse
          } catch(err) {
            console.log(err)
          }
        } 
      }
      store.dispatch(loadMarkets({ ...marketsData }))

      // Stop loading app
      status.marketdashLoading = false
      store.dispatch(loadMarketDash({ ...status }))
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
    queryMarkets()

    return () => clearInterval(interval)

  }, [wallet, network])

  return (
    <>
      <Row justify='center' align='center'>
        <Col xs={24} xl={8} className='column_con'>
          {isLoading ? (
            <Loading />  
          ) : (
            <Stats
              title='Traces'
              description='Number of performed traces'
              dispValue={markets.traces}
            />
          )} 
        </Col>
        <Col xs={24} xl={8} className='column_con'>
          {isLoading ? (
            <Loading />
          ) : (
            <Stats
              title='Markets'
              description='Number of markets'
              dispValue={markets.totalMarkets}
            />
          )}
        </Col>
        <Col xs={24} xl={8} className='column_con'>
          {isLoading ? (
            <Loading />
          ) : (
            <Stats
              title='Transaction Volume'
              description='Total transaction volume'
              dispValue={`${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(markets.txs) * Number(usdRate))}`}
            />
          )}
        </Col>
      </Row>
      <Row justify='center' align='center'>
        {isLoading ? (
          <Col xs={24} xl={24} className='column_con' style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <LoadingOutlined style={{ marginTop: '50px' }} />
          </Col>
        ) : (
          <Col xl={24} xs={24} className='column_con'>
            <Table size='small' tableLayout='auto' scroll={{ x: true }} dataSource={markets.enlistedMarkets} columns={columns} />
          </Col>
        )} 
      </Row>
    </>
  )
}

CropMarket.propTypes = {
  network: PropTypes.number,
  wallet: PropTypes.array,
  isLoading: PropTypes.bool,
  markets: PropTypes.object,
  usdRate: PropTypes.number,
}

function mapStateToProps(state) {
  return {
    network: state.network.currentNetwork,
    wallet: state.wallet.address,
    isLoading: state.loading.marketdashLoading,
    markets: state.markets,
    usdRate: Number(state.currency.ethusd),
  }
}

export default connect(mapStateToProps)(CropMarket)

