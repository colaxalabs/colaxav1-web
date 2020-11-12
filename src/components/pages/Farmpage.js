import PropTypes from 'prop-types'
import Web3 from 'web3'
import React, { useState, useEffect } from 'react'
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
  Button,
  message,
} from 'antd'
import { LoadingOutlined, ShareAltOutlined } from '@ant-design/icons'
import makeBlockie from 'ethereum-blockies-base64'

// Components
import { Stats } from '../dashboard'
import Loading from '../loading'
import {
  Preparation,
  Planting,
  Growth,
  Harvest,
  Receivership,
} from '../modals'

// Redux actions
import {
  isFarmDashLoading,
  loadCurrency,
  loadFarm,
  openSeason,
} from '../../actions'

// Redux store
import { store } from '../../store'

// Contracts
import Registry from '../../abis/FRMRegistry.json'
import Season from '../../abis/Season.json'
import Contracts from '../../contracts.json'

// Utils
import {
  initContract,
  sanitize,
  seasonColumns,
  bookingColumns,
} from '../../utils'

const { Text } = Typography
const { TabPane } = Tabs

const loadingInfo = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#fff',
  margin: '0 12px 20px 0',
  textAlign: 'center',
  borderRadius: 4,
}

function Farmpage({ wallet, farm, usdRate, isLoading, openSeason, opening }) {
  const { id } = useParams()
  const [isOwner, setIsOwner] = useState(false)
  const [openPreparation, setOpenPreparation] = useState(false)
  const [openPlanting, setOpenPlanting] = useState(false)
  const [openGrowth, setOpenGrowth] = useState(false)
  const [openHarvest, setOpenHarvest] = useState(false)
  const [openConfirmation, setOpenConfirmation] = useState(false)

  useEffect(() => {
    const registryContract = initContract(Registry, Contracts['4'].FRMRegistry[0])
    const seasonContract = initContract(Season, Contracts['4'].Season[0])

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
        setIsOwner(String(farm.owner).toLowerCase() === String(wallet.address[0]).toLowerCase())
        farm.totalBookings = await seasonContract.methods.totalFarmBookings(farm.tokenId).call()
        farm.completedSeasons = await seasonContract.methods.getFarmCompleteSeasons(farm.tokenId).call()
        const tx = await seasonContract.methods.farmTransactions(farm.tokenId).call()
        farm.txs = Web3.utils.fromWei(tx, 'ether')
        farm.seasons = []
        if (Number(farm.completedSeasons) === 0) {
          farm.seasons = []
        } else {
          for (let i = 1; i <= Number(farm.completedSeasons) + 1; i++) {
            farm.seasons[i] = await seasonContract.methods.querySeasonData(farm.tokenId, i).call()
          }
        }
        farm.farmBookings = []
        if (Number(farm.totalBookings) === 0) {
          farm.farmBookings = []
        } else {
          for (let i = 1; i <= Number(farm.totalBookings); i++) {
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
      farm.notFound = !tokenExists
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

  }, [id, wallet.address])

  const onCreate = values => {
    console.log(values)
    setOpenPreparation(false)
  }

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
            <div style={{ ...loadingInfo, height: 180, width: 320}}>
              <LoadingOutlined stype={{ marginTop: '50px' }} />
            </div>
          ) : (
            <>
              <Card
                hoverable
                style={{ width: 320 }}
                cover={<img src={`https://ipfs.io/ipfs/${farm.img}`} alt='img' heigth='230px' />}
                actions={[
                  <Text
                    copyable={{
                      text: `${window.location.href}`,
                      icon: <ShareAltOutlined style={{ fontSize: '18px' }} />
                    }}
                  />,
                ]}
              >
                <Card.Meta
                  description={<Tag color={farm.season === 'Dormant' ? '#f50' :
          farm.season === 'Preparation' ? '#b22989' :
          farm.season === 'Planting' ? '#108ee9' :
          farm.season === 'Crop Growth' ? '#87d068' :
          farm.season === 'Harvesting' ? '#0aa679' :
        farm.season === 'Booking' ? '#7546C9' : null}>{farm.season}</Tag>}
                />
              </Card>
              {farm.season === 'Dormant' && isOwner ? <Button disabled={opening} loading={opening} style={{ width: 320, marginTop: 8 }} onClick={() => openSeason(id, message)}>Open Season</Button> :
                  farm.season === 'Preparation' && isOwner ? <Button style={{ width: 320, marginTop: 8 }} onClick={() => setOpenPreparation(true)}>Confirm Preparation</Button> :
                  farm.season === 'Planting' && isOwner ? <Button style={{ width: 320, marginTop: 8 }} onClick={() => setOpenPlanting(true)}>Confirm Plant</Button> :
                  farm.season === 'Crop Growth' && isOwner ? <Button style={{ width: 320, marginTop: 8 }} onClick={() => setOpenGrowth(true)}>Confirm Growth</Button> :
                  farm.season === 'Harvesting' && isOwner ? <Button style={{ width: 320, marginTop: 8 }} onClick={() => setOpenHarvest(true)}>Confirm Harvest</Button> :
                  farm.season === 'Booking' && isOwner ? <Button style={{ width: 320, marginTop: 8 }} onClick={() => setOpenConfirmation(true)}>Close Season</Button> : null}
            </>
          )}
          <Preparation visible={openPreparation} onCreate={onCreate} onCancel={() => setOpenPreparation(false)} />
          <Planting visible={openPlanting} onCreate={onCreate} onCancel={() => setOpenPlanting(false)} />
          <Growth visible={openGrowth} onCreate={onCreate} onCancel={() => setOpenGrowth(false)} />
          <Harvest visible={openHarvest} onCreate={onCreate} onCancel={() => setOpenHarvest(false)} />
          <Receivership visible={openConfirmation} onCreate={onCreate} onCancel={() => setOpenConfirmation(false)} />
        </Col>
        <Col xs={24} xl={12} className='column_con'>
          {isLoading ? (
            <div style={{ ...loadingInfo, height: 180, width: '100%' }}>
              <LoadingOutlined stype={{ marginTop: '50px' }} />
            </div>
          ) : (
            <>
              <Descriptions title={farm.name} size='middle' layout='vertical' bordered>
                <Descriptions.Item label='Farm Size'>{sanitize(farm.size)}</Descriptions.Item>
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
                  <Tag color={farm.season === 'Dormant' ? '#f50' :
          farm.season === 'Preparation' ? '#b22989' :
          farm.season === 'Planting' ? '#108ee9' :
          farm.season === 'Crop Growth' ? '#87d068' :
          farm.season === 'Harvesting' ? '#0aa679' :
        farm.season === 'Booking' ? '#7546C9' : null}>{farm.season}</Tag>
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
                <Table tableLayout='auto' scroll={{ x: true }} dataSource={farm.seasons} columns={seasonColumns} />
              </TabPane>
              <TabPane tab='Bookings' key='2'>
                <Table tableLayout='auto' scroll={{ x: true }} dataSource={farm.farmBookings} columns={bookingColumns} />
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
  wallet: PropTypes.object,
  openSeason: PropTypes.func,
  opening: PropTypes.bool,
}

function mapStateToProps(state) {
  return {
    isLoading: state.loading.farmDashLoading,
    usdRate: Number(state.currency.ethusd),
    farm: state.farm,
    wallet: state.wallet,
    opening: state.loading.openingSeason,
  }
}

export default connect(mapStateToProps, { openSeason })(Farmpage)

