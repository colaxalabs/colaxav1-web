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
import { CloseCircleFilled, LoadingOutlined } from '@ant-design/icons'

// Contracts
import Market from '../../abis/Market.json'
import Season from '../../abis/Season.json'
import Contracts from '../../contracts.json'

// Utils
import { initContract } from '../../utils'

// Store
import { store } from '../../store'

// Components
import Loading from '../loading'
import { Stats } from '../dashboard'

// Redux actions
import { loadMarkets, loadMarketDash } from '../../actions'

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
      title: 'Supply',
      dataIndex: 'originalSupply',
      key: 'originalSupply',
      render: (text, record) => (
        <Text>{`${record.originalSupply} ${record.supplyUnit}`}</Text>
      )
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: price => (
        <Text>
          {`${Web3.utils.fromWei(price, 'ether')} ETH / ${new Intl.NumberFormat('en-US').format(parseInt(parseFloat(Web3.utils.fromWei(price, 'ether')) * parseFloat(usdRate)), 10)}`}
        </Text>
      )
    },
    {
      title: 'Opened',
      dataIndex: 'openDate',
      key: 'openDate',
      render: openDate => (
        <Text>{new Date(openDate * 1000)}</Text>
      )
    },
    {
      title: 'Closed',
      dataIndex: 'closeDate',
      key: 'closeDate',
      render: closeDate => (
        <>
          {Date.now() >= closeDate ? (
            <CloseCircleFilled />
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
        <Text>{`${record.remainingSupply} ${record.supplyUnit}`}</Text>
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
      const seasonContract = initContract(Season, Contracts['4'].Season[0])

      const marketsData = {}
      const status = {}
      status.marketdashLoading = true
      store.dispatch(loadMarketDash({ ...status }))
      marketsData.totalMarkets = Number(await marketContract.methods.totalMarkets().call())
      marketsData.traces = await seasonContract.methods.allTraces().call()
      const tx = await marketContract.methods.platformTransactions().call()
      marketsData.txs = Web3.utils.fromWei(tx, 'ether')
      if (marketsData.totalMarkets === 0) {
        marketsData.enlistedMarkets = []
      } else {
        for (let i = 1; i <= marketsData.totalMarkets; i++) {
          marketsData.enlistedMarkets[i] = await marketContract.methods.getEnlistedMarket(i).call()
        } 
      }
      store.dispatch(loadMarkets({ ...marketsData }))

      // Stop loading app
      status.marketdashLoading = false
      store.dispatch(loadMarketDash({ ...status }))
    }

    queryMarkets()

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
  usdRate: PropTypes.string,
}

function mapStateToProps(state) {
  return {
    network: state.network.currentNetwork,
    wallet: state.wallet.address,
    isLoading: state.loading.marketdashLoading,
    markets: state.markets,
    usdRate: state.currency.ethusd,
  }
}

export default connect(mapStateToProps)(CropMarket)

