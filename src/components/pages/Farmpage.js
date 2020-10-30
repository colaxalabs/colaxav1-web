import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
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
} from '../../actions'

// Redux store
import { store } from '../../store'

// Utils
import { seasonColumns, bookingColumns } from '../../utils'

const { Text } = Typography
const { TabPane } = Tabs

const farm = {
  farmName: 'Arunga Vineyard',
    tokenId: 2293934,
    img: 'https://gateway.pinata.cloud/ipfs/QmPaqwkwUUn9x2wJ574sg14zzrmF8dAbP6C2rgiLHuGa1h',
    season: 'Planting',
    owner: '0x7723EFcbBC8b874E07744006cA1d4cf9F54f96BD',
    completeSeasons: 3,
  size: '243.33ha',
  location: 'Lurambi, Kakamega, Kakamega County',
  soil: 'Loam soil',
}

const seasons = []

const bookings = []

function Farmpage({ usdRate, isLoading }) {

  useEffect(() => {
    async function loadFarmDashboard() {
      const loadingState = {}
      const conversionRate = {}
      // Start loading app component
      loadingState.farmDashLoading = true
      store.dispatch(isFarmDashLoading({ ...loadingState }))
      // Fetch Eth price
      const etherPrice = await fetch(`https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEYS}`)
      const { result } = await etherPrice.json()
      conversionRate.ethusd = result.ethusd
      store.dispatch(loadCurrency({ ...conversionRate }))
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

  }, [])

  return (
    <>
      <Row justify='center' align='center'>
        <Col xs={24} xl={8} className='column_con'>
          {isLoading ? (
            <Loading />
          ) : (
            <Stats
              title='Seasons'
              description='Number of completed seasons'
              dispValue={11}
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
              dispValue={21}
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
              dispValue={`${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(2 * Number(usdRate))}`}
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
              <Descriptions title={farm.farmName} layout='vertical' bordered>
                <Descriptions.Item label='Farm Size'>{farm.size}</Descriptions.Item>
                <Descriptions.Item label='Location'>{farm.location}</Descriptions.Item>
                <Descriptions.Item label='Soil'>{farm.soil}</Descriptions.Item>
                <Descriptions.Item label='Owner'>
                  <Space>
                    <Avatar size='small' src={makeBlockie(farm.owner)} />
                    <Text ellipsis copyable>{farm.owner}</Text>
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label='Completed Season'>{farm.completeSeasons}</Descriptions.Item>
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
                <Table dataSource={seasons} columns={seasonColumns} />
              </TabPane>
              <TabPane tab='Bookings' key='2'>
                <Table dataSource={bookings} columns={bookingColumns} />
              </TabPane>
            </Tabs>
          </Col>
        )} 
      </Row>
    </>
  )
}

Farmpage.propTypes = {
  usdRate: PropTypes.number,
  isLoading: PropTypes.bool,
}

function mapStateToProps(state) {
  return {
    isLoading: state.loading.farmDashLoading,
    usdRate: Number(state.currency.ethusd),
  }
}

export default connect(mapStateToProps)(Farmpage)

