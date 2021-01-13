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
  Descriptions,
  Avatar,
  Typography,
  Space,
  Empty,
  Button,
  message,
  Statistic,
  Tabs,
  Table,
} from 'antd'
import { SyncOutlined, CheckCircleTwoTone, LoadingOutlined, ShareAltOutlined } from '@ant-design/icons'
import makeBlockie from 'ethereum-blockies-base64'

// Components
import { Stats } from '../dashboard'
import Loading from '../loading'
import {
  Preparation,
  Planting,
  Growth,
  Harvest,
  Closure,
  QR,
  MarketModal,
} from '../modals'

// Redux actions
import {
  isFarmDashLoading,
  loadCurrency,
  loadFarm,
  openSeason,
  confirmPreparation,
  confirmPlanting,
  confirmGrowth,
  confirmHarvest,
  bookHarvest,
  seasonClosure,
  gotoMarket,
  listenBooking,
  listenConfirmation,
} from '../../actions'

// Redux store
import { store } from '../../store'

// Contracts
import Registry from '../../abis/FRMRegistry.json'
import Season from '../../abis/Season.json'
import Market from '../../abis/Market.json'
import Contracts from '../../contracts.json'

// Utils
import {
  initContract,
  sanitize,
} from '../../utils'

const { Text } = Typography
const { TabPane } = Tabs

function Farmpage({ closingPreparation, closingPlanting, closingGrowth, wallet, farm, usdRate, isLoading, opening, openSeason, confirmPreparation, confirmPlanting, confirmGrowth, closingHarvest, confirmHarvest, bookHarvest, isBooking, closingSeason, goingToMarket, seasonClosure, network, gotoMarket }) {

  const columns = [
    {
      title: '#',
      dataIndex: 'marketId',
      key: 'marketId',
    },
    {
      title: 'Crop',
      dataIndex: 'crop',
      key: 'crop',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: date => (
        <Text>{`${new Date(date * 1000).toLocaleDateString()}`}</Text>
      )
    },
    {
      title: 'Booker',
      dataIndex: 'booker',
      key: 'booker',
      render: booker => (
        <Space
          style={{ width: '150px' }}
        >
          <Avatar size='small' src={makeBlockie(booker)} />
          {String(booker).toUpperCase() === String(wallet[0]).toUpperCase() ? (
            <Text type='secondary'>You</Text>
          ) : (
            <Text ellipsis copyable>{booker}</Text>
          )}
        </Space>
      )
    },
    {
      title: 'Volume',
      dataIndex: 'volume',
      key: 'volume',
      render: volume => (
        <Text>{`${volume} KG`}</Text>
      )
    },
    {
      title: 'Deposit',
      dataIndex: 'deposit',
      key: 'deposit',
      render: deposit => (
        <>
          <Text>
            {`${Web3.utils.fromWei(deposit, 'ether')} ETH / ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(Web3.utils.fromWei(deposit, 'ether')) * usdRate)}`}
          </Text>
        </>
      )
    },
    {
      title: 'Delivered',
      dataIndex: 'delivered',
      key: 'delivered',
      render: delivered => (
        <>
          {!delivered ? (
            <SyncOutlined spin style={{ color: '#fae276' }} />
          ) : (
            <CheckCircleTwoTone twoToneColor='#20c89e'/>
          )}
        </>
      ),
    },
    {
      title: 'Season',
      dataIndex: 'season',
      key: 'season',
    },
  ]

  const { id } = useParams()
  const [isOwner, setIsOwner] = useState(false)
  const [openPreparation, setOpenPreparation] = useState(false)
  const [openPlanting, setOpenPlanting] = useState(false)
  const [openGrowth, setOpenGrowth] = useState(false)
  const [openHarvest, setOpenHarvest] = useState(false)
  const [openClosing, setOpenClosing] = useState(false)
  const [openQr, setOpenQr] = useState(false)
  const [openMarket, setOpenMarket] = useState(false)

  useEffect(() => {
    const registryContract = initContract(Registry, Contracts['4'].FRMRegistry[0])
    const seasonContract = initContract(Season, Contracts['4'].Season[0])
    const marketContract = initContract(Market, Contracts['4'].Market[0])

    function bookingMeta() {
      marketContract.events.BookHarvest((error, result) => {
        if (!error) {
          const resp = {}
          const { _tokenId, _marketBookers, _newMarketVolume } = result.returnValues
          resp.id = _tokenId
          resp.bookers = _marketBookers
          resp.volume = _newMarketVolume
          store.dispatch(listenBooking({ ...resp }))
        }
      })
    }

    function confirmationMeta() {
      marketContract.events.Confirmation((error, result) => {
        if (!error) {
          const resp = {}
          const { _tokenId, _farmTxVolume, _delivered } = result.returnValues
          resp.id = _tokenId
          resp.volume = _farmTxVolume
          resp.delivered = _delivered
          store.dispatch(listenConfirmation({ ...resp }))
        }
      })
    }

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
        farm.location = _farm.location
        farm.img = _farm.imageHash
        farm.soil = _farm.soil
        farm.season = _farm.season
        farm.owner = _farm.owner
        farm.currentSeason = await seasonContract.methods.currentSeason(Number(farm.tokenId)).call()
        const { crop, harvestSupply, traceHash } = await seasonContract.methods.querySeasonData(Number(farm.tokenId), Number(farm.currentSeason)).call()
        farm.seasonCrop = crop
        farm.seasonSupply = harvestSupply.split(' ')[0]
        farm.seasonMarketed = await marketContract.methods.isSeasonMarketed(Number(farm.tokenId), Number(farm.currentSeason)).call()
        setIsOwner(String(farm.owner).toLowerCase() === String(wallet.address[0]).toLowerCase())
        farm.totalBookings = await marketContract.methods.totalMarketBookers(farm.tokenId).call()
        farm.completedSeasons = await seasonContract.methods.getFarmCompleteSeasons(farm.tokenId).call()
        farm.txs = await marketContract.methods.farmTransactions(farm.tokenId).call()
        const currentMarket = await marketContract.methods.getCurrentFarmMarket(Number(farm.tokenId)).call()
        farm.currentSeasonSupply = currentMarket.remainingSupply
        farm.farmBookings = []
        if (Number(farm.totalBookings) === 0) {
          farm.farmBookings = []
        } else {
          for (let i = 1; i <= Number(farm.totalBookings); i++) {
            farm.farmBookings[i-1] = await marketContract.methods.getMarketBooking(farm.tokenId, i).call()
            const seasonMeta = await seasonContract.methods.querySeasonData(
              Number(farm.tokenId),
              Number(farm.farmBookings[i-1].season)
            ).call()
            farm.farmBookings[i-1].crop = seasonMeta.crop
            farm.farmBookings[i-1].key = i-1
          }
        }
        farm.traceId = traceHash
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
    bookingMeta()
    confirmationMeta()

    return () => clearInterval(interval)

  }, [id, network, wallet.address])

  const handlePreparation = (tokenId, values, message) => {
    confirmPreparation(tokenId, values, message)
  }

  const handlePlanting = (tokenId, values, message) => {
    confirmPlanting(tokenId, values, message)
  }

  const handleGrowth = (tokenId, values, message) => {
    confirmGrowth(tokenId, values, message)
  }

  const handleHarvest = (tokenId, values, message) => {
    confirmHarvest(tokenId, values, message)
  }

  const handleClosure = (tokenId, message) => {
    seasonClosure(tokenId, message)
  }

  const downloadQR = (_id, _season) => {
    const canvas = document.getElementById('1234_reap')
    const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
    let downloadLink = document.createElement('a')
    downloadLink.href = pngUrl
    downloadLink.download = `${Number(_id) + Number(_season)}.png`
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
  }

  const handleGotoMarket = (tokenId, values, message) => {
    gotoMarket(tokenId, values, message)
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
                children={<Statistic title='Seasons' value={farm.completedSeasons} />}
                description='Completed seasons'
              />
            )} 
          </Col>
          <Col xs={24} xl={8} className='column_con'>
            {isLoading ? (
              <Loading />
            ) : (
              <Stats
                children={<Statistic title='Bookings' value={farm.totalBookings} />}
                description='Number of completed bookings'
              />
            )} 
          </Col>
          <Col xs={24} xl={8} className='column_con'>
            {isLoading ? (
              <Loading />
            ) : (
              <Stats
                description='Transaction volume'
                children={<Statistic title='Transaction volume' value={`${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(Web3.utils.fromWei(farm.txs, 'ether')) * Number(usdRate))}`} />}
              />
            )} 
          </Col>
        </Row>
          {isLoading ? (
            <Row>
              <Col xl={24} xs={24} className='column_con loading_container'>
                <LoadingOutlined />
              </Col>
            </Row>
          ) : (
            <>
              <Row justify='center' align='center'>
                <Col xl={12} xs={24} className='column_con site-layout-background' style={{ padding: 8 }}>
                  <Card
                    hoverable
                    style={{ width: 320 }}
                    cover={<img src={`https://ipfs.io/ipfs/${farm.img}`} alt='img' heigth='230px' />}
                    actions={[
                      farm.season === 'Dormant' && isOwner ? (
                        <Button
                          disabled={opening}
                          loading={opening}
                          type='link'
                          onClick={() => openSeason(id, message)}
                        >
                          Open Season
                        </Button>
                      ) : null,
                      farm.season === 'Preparation' && isOwner ? (
                        <Button
                          disabled={closingPreparation}
                          loading={closingPreparation}
                          type='link'
                          onClick={() => setOpenPreparation(true)}
                        >
                          Confirm Preparation
                        </Button>
                      ) : null,
                      farm.season === 'Planting' && isOwner ? (
                        <Button
                          disabled={closingPlanting}
                          loading={closingPlanting}
                          type='link'
                          onClick={() => setOpenPlanting(true)}
                        >
                          Confirm Planting
                        </Button>
                      ) : null,
                      farm.season === 'Crop Growth' && isOwner ? (
                        <Button
                          disabled={closingGrowth}
                          loading={closingGrowth}
                          type='link'
                          onClick={() => setOpenGrowth(true)}
                        >
                          Confirm Growth
                        </Button>
                      ) : null,
                      farm.season === 'Harvesting' && isOwner ? (
                        <Button
                          disabled={closingHarvest}
                          loading={closingHarvest}
                          type='link'
                          onClick={() => setOpenHarvest(true)}
                        >
                          Confirm Harvest
                        </Button>
                      ) : null,
                      farm.season === 'Marketing' && isOwner && !farm.seasonMarketed ? (
                        <>
                          <Button
                            type='link'
                            disabled={goingToMarket}
                            loading={goingToMarket}
                            onClick={() => setOpenMarket(true)}
                          >
                            Sell
                          </Button>
                          <Button
                            type='link'
                            danger
                            disabled={closingSeason}
                            loading={closingSeason}
                            onClick={() => setOpenClosing(true)}
                          >
                            Close Season
                          </Button>
                        </>
                      ) : null,
                      farm.season === 'Marketing' && isOwner && farm.seasonMarketed && Number(farm.currentSeasonSupply) === 0 ? (
                          <Button
                            type='link'
                            danger
                            disabled={closingSeason}
                            loading={closingSeason}
                            onClick={handleClosure}
                          >
                            Close Season
                          </Button>
                      ) : null,
                      farm.season === 'Marketing' ? (
                        <Button
                          type='link'
                          onClick={() => setOpenQr(true)}
                        >
                          Trace
                        </Button>
                      ) : null,
                      <Text
                        copyable={{
                          text: `${window.location.href}`,
                          icon: <ShareAltOutlined style={{ fontSize: '18px', marginTop: '5px' }} />
                        }}
                      />,
                    ].filter(i => i !== null)}
                  >
                    <Card.Meta
                      description={<Tag color={farm.season === 'Dormant' ? '#f50' :
                      farm.season === 'Preparation' ? '#b22989' :
                      farm.season === 'Planting' ? '#108ee9' :
                      farm.season === 'Crop Growth' ? '#87d068' :
                      farm.season === 'Harvesting' ? '#0aa679' :
                      farm.season === 'Marketing' ? '#7546C9' : null}>{farm.season}</Tag>}
                    />
                  </Card>
                  <Preparation tokenId={id} visible={openPreparation} onCreate={handlePreparation} onCancel={() => setOpenPreparation(false)} />
                  <Planting tokenId={id} visible={openPlanting} onCreate={handlePlanting} onCancel={() => setOpenPlanting(false)} />
                  <Growth tokenId={id} visible={openGrowth} onCreate={handleGrowth} onCancel={() => setOpenGrowth(false)} />
                  <Harvest tokenId={id} visible={openHarvest} onCreate={handleHarvest} onCancel={() => setOpenHarvest(false)} />
                  <Closure tokenId={id} visible={openClosing} onCreate={handleClosure} cancel={() => setOpenClosing(false)} />
                  <QR tokenId={id} traceId={farm.traceId} runningSeason={Number(farm.currentSeason)} visible={openQr} onClick={downloadQR} onCancel={() => setOpenQr(false)} />
                  <MarketModal crop={farm.seasonCrop} tokenId={id} visible={openMarket} onCreate={handleGotoMarket} cancel={() => setOpenMarket(false)} harvestSupply={farm.seasonSupply} supplyUnit={farm.seasonSupplyUnit} />
                </Col>
                <Col xl={12} xs={24} className='column_con site-layout-background' style={{ padding: 8 }}>
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
                        farm.season === 'Marketing' ? '#7546C9' : null}>{farm.season}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label='#tokenId'>{farm.tokenId}</Descriptions.Item>
                  </Descriptions>
                </Col>
              </Row>
              <Row justify='center' align='center'>
                <Col xl={24} xs={24} className='column_con'>
                  <Tabs type='card'>
                    <TabPane tab={`Bookings(${farm.totalBookings})`} key='1'>
                      <Row>
                        <Col xs={24} xl={24} className='column_con'>
                          <Table size='small' tableLayout='auto' scroll={{ x: true }} dataSource={farm.farmBookings} columns={columns} />
                        </Col>
                      </Row>
                    </TabPane>
                  </Tabs>
                </Col>
              </Row>
            </>
          )}
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
  confirmPreparation: PropTypes.func,
  closingPreparation: PropTypes.bool,
  confirmPlanting: PropTypes.func,
  closingPlanting: PropTypes.bool,
  confirmGrowth: PropTypes.func,
  closingGrowth: PropTypes.bool,
  confirmHarvest: PropTypes.func,
  closingHarvest: PropTypes.bool,
  bookHarvest: PropTypes.func,
  isBooking: PropTypes.bool,
  closingSeason: PropTypes.bool,
  goingToMarket: PropTypes.bool,
  seasonClosure: PropTypes.func,
  network: PropTypes.number,
}

function mapStateToProps(state) {
  return {
    isLoading: state.loading.farmDashLoading,
    usdRate: Number(state.currency.ethusd),
    farm: state.farm,
    wallet: state.wallet,
    opening: state.loading.openingSeason,
    closingPreparation: state.loading.confirmingPreparation,
    closingPlanting: state.loading.confirmingPlanting,
    closingGrowth: state.loading.confirmingGrowth,
    closingHarvest: state.loading.confirmingHarvest,
    isBooking: state.loading.booking,
    closingSeason: state.loading.closingSeason,
    goingToMarket: state.loading.goingToMarket,
    network: state.network.currentNetwork,
  }
}

export default connect(mapStateToProps, {
  openSeason,
  confirmPreparation,
  confirmPlanting,
  confirmGrowth,
  confirmHarvest,
  bookHarvest,
  seasonClosure,
  gotoMarket,
})(Farmpage)

