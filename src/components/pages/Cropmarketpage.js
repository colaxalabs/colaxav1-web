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
  Space,
  Statistic,
} from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

// Contracts
import Market from '../../abis/Market.json'
import Registry from '../../abis/FRMRegistry.json'
import Season from '../../abis/Season.json'
import Contracts from '../../contracts.json'

// Utils
import { initContract } from '../../utils'

// Store
import { store } from '../../store'

// Components
import Loading from '../loading'
import { Stats } from '../dashboard'
import { QR, Book, Reviews } from '../modals'

// Redux actions
import {
  bookHarvest,
  loadCurrency,
  loadMarkets,
  loadMarketDash,
  listenBook,
  listenMarketing,
  listenMarketConfirmation,
  listenReviewing,
} from '../../actions'

const { Text } = Typography

function CropMarket({ wallet, network, bookHarvest, walletLoaded, isExecutionable, isBooking, isLoading, markets, usdRate }) {
  const [traceOpen, setTraceOpen] = React.useState(false)
  const [bookingOpen, setBookingOpen] = React.useState(false)
  const [rowRecord, setRowRecord] = React.useState(null)
  const [traceRecord, setTraceRecord] = React.useState({})
  const [openReviews, setOpenReviews] = React.useState(false)
  const [counts, setCounts] = React.useState(0)
  const [comments, setComments] = React.useState([])

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
            <Tag color='#20c89e'>Open</Tag>
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
      title: 'Reviews',
      dataIndex: 'reviews',
      key: 'reviews',
      render: (text, record) => (
        <>
          {Number(record.reviews) === 0 ? <Text>{`${record.reviews} reviews`}</Text> : <Button type='link' onClick={() => {
            setCounts(record.reviews)
            setOpenReviews(true)
            setComments(record.comments)
          }}>{`${record.reviews} reviews`}</Button>}
          <Reviews visible={openReviews} comments={comments} count={Number(counts)} cancel={() => setOpenReviews(false)} />
        </>
      )
    },
    {
      title: 'Trace',
      key: 'trace',
      render: (text, record) => (
        <Space>
          <QR
            tokenId={traceRecord.tokenId}
            traceId={traceRecord.traceId}
            runningSeason={traceRecord.season}
            visible={traceOpen}
            onClick={downloadQR}
            onCancel={() => setTraceOpen(false)}
          />
          <Button
            type='primary'
            size='small'
            onClick={() => {
              setTraceRecord(record)
              setTraceOpen(true)
            }}
          >
            Trace
          </Button>
        </Space>
      )
    },
    {
      title: 'Book',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: (text, record) => (
        <>
          <Space>
            <Button
              type='primary'
              size='small'
              loading={isBooking}
              disabled={Number(record.remainingSupply) === 0 || isBooking || (walletLoaded ? String(record.owner).toUpperCase() === String(wallet[0]).toUpperCase() : false)}
              onClick={() => {
                setBookingOpen(true)
                setRowRecord(record)
              }}
            >
              Book
            </Button>
            <Book record={rowRecord} visible={bookingOpen} book={bookHarvest} isExecutionable={isExecutionable} onCancel={() => {
              setRowRecord(null)
              setBookingOpen(false)
            }} />
          </Space>
        </>
      )
    }
  ]

  React.useEffect(() => {
    // Init contracts
    const marketContract = initContract(Market, Contracts['4'].Market[0])
    const registryContract = initContract(Registry, Contracts['4'].FRMRegistry[0])
    const seasonContract = initContract(Season, Contracts['4'].Season[0])

    function bookMeta() {
      marketContract.events.BookHarvest((error, result) => {
        if (!error) {
          const resp = {}
          const { _tokenId, _newMarketVolume, _marketBookers, _closeDate } = result.returnValues
          resp.id = _tokenId
          resp.volume = _newMarketVolume
          resp.bookers = _marketBookers
          resp.closeDate = _closeDate
          store.dispatch(listenBook({ ...resp }))
        } else {
          console.error(error)
        }
      })
    }

    function createMarketMeta() {
      marketContract.events.CreateMarket((error, result) => {
        if (!error) {
          const { _totalMarket } = result.returnValues
          store.dispatch(listenMarketing(_totalMarket))
        } else {
          console.error(error)
        }
      })
    }

    function marketConfirmation() {
      marketContract.events.Confirmation((error, result) => {
        if (!error) {
          const { _txVolume } = result.returnValues
          store.dispatch(listenMarketConfirmation(_txVolume))
        }
      })
    }

    function reviewMeta() {
      marketContract.events.LeaveReview((error, result) => {
        if (!error) {
          const resp = {}
          const { _tokenId, _totalReviews } = result.returnValues
          resp.id = _tokenId
          resp.totalReviews = _totalReviews
          store.dispatch(listenReviewing({ ...resp }))
        }
      })
    }

    async function queryMarkets() {
      const marketsData = {}
      const status = {}
      status.marketdashLoading = true
      store.dispatch(loadMarketDash({ ...status }))
      marketsData.totalMarkets = Number(await marketContract.methods.totalMarkets().call())
      marketsData.traces = 0
      marketsData.enlistedMarkets = []
      marketsData.txs = await marketContract.methods.platformTransactions().call()
      if (marketsData.totalMarkets === 0) {
        marketsData.enlistedMarkets = []
      } else {
        for (let i = 1; i <= marketsData.totalMarkets; i++) {
          try {
            let _token = await marketContract.methods.getIndexedEnlistedMarket(i).call()
            const _currentSeason = await seasonContract.methods.currentSeason(Number(_token)).call()
            marketsData.enlistedMarkets[i-1] = await marketContract.methods.getCurrentFarmMarket(Number(_token)).call()
            const { location } = await registryContract.methods.getFarm(Number(_token)).call()
            marketsData.enlistedMarkets[i-1].location = location
            marketsData.enlistedMarkets[i-1].key = Number(_token)
            marketsData.enlistedMarkets[i-1].traceId = await seasonContract.methods.hashedSeason(Number(_token), _currentSeason).call()
            marketsData.enlistedMarkets[i-1].owner = await registryContract.methods.ownerOf(Number(_token)).call()
            marketsData.enlistedMarkets[i-1].reviews = await marketContract.methods.marketReviewCount(Number(_token)).call()
          } catch(err) {
            console.log(err)
          }
        } 
      }
      for (let i = 0; i < marketsData.enlistedMarkets.length; i++) {
        marketsData.enlistedMarkets[i].comments = []
        if (Number(marketsData.enlistedMarkets[i].reviews) === 0) {
          marketsData.enlistedMarkets[i].comments = []
        } else {
          for (let j = 1; j <= Number(marketsData.enlistedMarkets[i].reviews); j++) {
            marketsData.enlistedMarkets[i].comments[j-1] = await marketContract.methods.getReviewForMarket(Number(marketsData.enlistedMarkets[i].tokenId), j).call()
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
    bookMeta()
    createMarketMeta()
    marketConfirmation()
    reviewMeta()

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
              description='Number of performed traces'
              children={<Statistic title='Traces' value={markets.traces} />}
            />
          )} 
        </Col>
        <Col xs={24} xl={8} className='column_con'>
          {isLoading ? (
            <Loading />
          ) : (
            <Stats
              description='Number of markets'
              children={<Statistic value={markets.totalMarkets} title='Markets' />}
            />
          )}
        </Col>
        <Col xs={24} xl={8} className='column_con'>
          {isLoading ? (
            <Loading />
          ) : (
            <Stats
              description='Transaction volume'
              children={<Statistic title='Transaction volume' value={`${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(Web3.utils.fromWei(markets.txs, 'ether')) * Number(usdRate))}`} />}
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
  bookHarvest: PropTypes.func,
  isBooking: PropTypes.bool,
  isExecutionable: PropTypes.bool,
  walletLoaded: PropTypes.bool,
}

function mapStateToProps(state) {
  return {
    network: state.network.currentNetwork,
    wallet: state.wallet.address,
    isLoading: state.loading.marketdashLoading,
    markets: state.markets,
    usdRate: Number(state.currency.ethusd),
    isBooking: state.loading.booking,
    isExecutionable: state.wallet.isMetaMask && state.wallet.loaded,
    walletLoaded: state.wallet.loaded,
  }
}

export default connect(mapStateToProps, { bookHarvest })(CropMarket)

