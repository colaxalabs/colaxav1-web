import PropTypes from 'prop-types'
import Web3 from 'web3'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  Row,
  Col,
  Card,
  Tag,
  Table,
  Tabs,
  Descriptions,
  Avatar,
  Typography,
  Space,
  Empty,
} from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import makeBlockie from 'ethereum-blockies-base64'

// Components
import { Stats } from '../dashboard'
import Loading from '../loading'

// Redux actions
import {
  isFarmDashLoading,
  loadCurrency,
  loadFarm,
} from '../../actions'

// Redux store
import { store } from '../../store'

// Contracts
import Registry from '../../abis/FRMRegistry.json'
import Season from '../../abis/Season.json'
import Contracts from '../../contracts.json'

// Utils
import { initContract } from '../../utils'
import { seasonColumns, bookingColumns } from '../../utils'

const { Text } = Typography
const { TabPane } = Tabs

function Farmpage({ farm, usdRate, isLoading }) {
  const { id } = useParams()

  useEffect(() => {
    const registryContract = initContract(Registry, Contracts.dev.FRMRegistry[0])
    const seasonContract = initContract(Season, Contracts.dev.Season[0])

    async function loadFarmDashboard() {
      const loadingState = {}
      const conversionRate = {}
      const farm = {}
      // Start loading app component
      loadingState.farmDashLoading = true
      store.dispatch(isFarmDashLoading({ ...loadingState }))
      const tokenExists = await registryContract.methods.exists(id).call()
      if (tokenExists) {
        // Query farm info from the blockchain
        const _farm = await registryContract.methods.getFarm(id).call() 
        farm.tokenId = id
        farm.name = _farm.name
        farm.size = _farm.size
        farm.lon = _farm.longitude
        farm.lat = _farm.latitude
        farm.img = _farm.imageHash
        farm.soil = _farm.soil
        farm.season = _farm.season
        farm.owner = _farm.owner
        farm.completedSeasons = await seasonContract.methods.getFarmCompleteSeasons(farm.tokenId).call()
        const tx = await seasonContract.methods.farmTransactions(farm.tokenId).call()
        farm.txs = Web3.utils.fromWei(tx, 'ether')
        farm.seasons = []
        if (farm.completedSeasons === 0) {
          farm.seasons = []
        } else {
          for (let i = 1; i <= farm.completedSeasons + 1; i++) {
            farm.seasons[i] = await seasonContract.methods.querySeasonData(farm.tokenId, i).call()
          }
        }
        farm.farmBookings = []
        if (farm.totalBookings === 0) {
          farm.farmBookings = []
        } else {
          for (let i = 1; i <= farm.totalBookings; i++) {
            farm.farmBookings[i] = await seasonContract.methods.getFarmBooking(farm.tokenId, i).call()
          }
        }
        // Fetch Eth price
        const etherPrice = await fetch(`https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEYS}`)
        const { result } = await etherPrice.json()
        conversionRate.ethusd = result.ethusd
        store.dispatch(loadCurrency({ ...conversionRate }))
        // Stop loading app component
        loadingState.farmDashLoading = false
        store.dispatch(isFarmDashLoading({ ...loadingState }))
      }
      farm.notFound = true
      store.dispatch(loadFarm({ ...farm }))
      // Fetch Eth price anyway
      const etherPrice = await fetch(`https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEYS}`)
      const { result } = await etherPrice.json()
      conversionRate.ethusd = result.ethusd
      store.dispatch(loadCurrency({ ...conversionRate }))
      // Stop loading app component
      loadingState.farmDashLoading = false
      store.dispatch(isFarmDashLoading({ ...loadingState }))
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

    loadFarmDashboard()

    return () => clearInterval(interval)

  }, [id])

  return (
    <>
      {farm.notFound ? (
        <Empty description='Not Found' style={{ marginTop: '150px' }} />
      ) : (
        <>
        <Row justify='center' align='center'>
        <Col xs={24} xl={8} className='column_con'>
          {isLoading ? (
            <Loading />
          ) : (
            <Stats
              title='Seasons'
              description='Number of completed seasons'
              dispValue={farm.completedSeasons}
            />
          )} 
        </Col>
        <Col xs={24} xl={8} className='column_con'>
          {isLoading ? (
            <Loading />
          ) : (
            <Stats
              title='Bookings'
              description='Number of completed bookings'
              dispValue={farm.totalBookings}
            />
          )} 
        </Col>
        <Col xs={24} xl={8} className='column_con'>
          {isLoading ? (
            <Loading />
          ) : (
            <Stats
              title='Transaction'
              description='Total amount transacted'
              dispValue={`${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(farm.txs) * Number(usdRate))}`}
            />
          )} 
        </Col>
      </Row>
      <Row justify='center' align='center'>
        <Col xs={24} xl={12} className='column_con'>
          {isLoading ? (
            <Loading />
          ) : (
            <>
              <Card
                hoverable
                style={{ width: 320 }}
                cover={<img src={`${farm.img}`} alt='img' heigth='230px' />}
              >
                <Card.Meta
                  description={<Tag color='#7546C9'>{farm.season}</Tag>}
                />
              </Card>
            </>
          )}
        </Col>
        <Col xs={24} xl={12} className='column_con'>
          {isLoading ? (
            <Loading />
          ) : (
            <>
              <Descriptions title={farm.name} layout='vertical' bordered>
                <Descriptions.Item label='Farm Size'>{farm.size}</Descriptions.Item>
                <Descriptions.Item label='Location'>{farm.location}</Descriptions.Item>
                <Descriptions.Item label='Soil'>{farm.soil}</Descriptions.Item>
                <Descriptions.Item label='Owner'>
                  <Space>
                    <Avatar size='small' src={farm.owner ? makeBlockie(farm.owner) : ''} />
                    <Text ellipsis copyable>{farm.owner}</Text>
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label='Completed Season'>{farm.completedSeasons}</Descriptions.Item>
                <Descriptions.Item label='State'>
                  <Tag color='#7546C9'>{farm.season}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label='#tokenId'>{farm.tokenId}</Descriptions.Item>
              </Descriptions>
            </>
          )}
        </Col>
      </Row>
      <Row justify='center' align='center'>
        {isLoading ? (
          <Col xs={24} xl={24} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <LoadingOutlined style={{ marginTop: '150px' }} />
          </Col>
        ) : (
          <Col xs={24} xl={24} className='column_con'>
            <Tabs>
              <TabPane tab='Seasons' key='1'>
                <Table dataSource={farm.seasons} columns={seasonColumns} />
              </TabPane>
              <TabPane tab='Bookings' key='2'>
                <Table dataSource={farm.farmBookings} columns={bookingColumns} />
              </TabPane>
            </Tabs>
          </Col>
        )} 
      </Row>
        </>
      )}
      
    </>
  )
}

Farmpage.propTypes = {
  usdRate: PropTypes.number,
  isLoading: PropTypes.bool,
  farm: PropTypes.object,
}

function mapStateToProps(state) {
  return {
    isLoading: state.loading.farmDashLoading,
    usdRate: Number(state.currency.ethusd),
    farm: state.farm,
  }
}

export default connect(mapStateToProps)(Farmpage)

