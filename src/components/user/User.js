import PropTypes from 'prop-types'
import Web3 from 'web3'
import React, { useEffect, useState } from 'react'
import {
  Avatar,
  Row,
  Col,
  Tabs,
  Table,
  Button,
  Typography,
  Space,
} from 'antd'
import {
  LoadingOutlined,
  SyncOutlined,
  CheckCircleTwoTone,
} from '@ant-design/icons'
import { connect } from 'react-redux'
import makeBlockie from 'ethereum-blockies-base64'

// Components
import {
  Stats,
} from '../dashboard'
import Loading from '../loading'
import { Farm, Nofarm } from '../farm'

// Redux action
import {
  loadCurrency,
  loadUser,
  isUserDashLoading,
  tokenize,
} from '../../actions'

// Redux store
import { store } from '../../store'

// Contracts
import Registry from '../../abis/FRMRegistry.json'
import Market from '../../abis/Market.json'
import Season from '../../abis/Season.json'
import Contracts from '../../contracts.json'

// Utils
import { initContract } from '../../utils'

// Components
import { QR } from '../modals'

const { TabPane } = Tabs
const { Text } = Typography



function User({ tokenize, wallet, network, userData, isLoading, usdRate }) {
  const [traceOpen, setTraceOpen] = useState(false)
  const [bookRecord, setBookRecord] = useState({})

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
      dataIndex: 'marketId',
      key: 'marketId',
    },
    {
      title: 'Crop',
      dataIndex: 'crop',
      key: 'crop',
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
            <SyncOutlined spin style={{ color: '#7546C9' }} />
          ) : (
            <CheckCircleTwoTone twoToneColor='#7546C9'/>
          )}
        </>
      ),
    },
    {
      title: 'Season',
      dataIndex: 'season',
      key: 'season',
    },
    {
      title: 'Trace',
      key: 'trace',
      render: (text, record) => (
        <Space>
          <Button
            type='primary'
            size='small'
            onClick={() => {
              setTraceOpen(true)
              setBookRecord(record)
            }}
          >
            Trace
          </Button>
          <QR
            tokenId={bookRecord.marketId}
            traceId={bookRecord.traceId}
            runningSeason={bookRecord.runningSeason}
            visible={traceOpen}
            onClick={downloadQR}
            onCancel={() => setTraceOpen(false)}
          />
        </Space>
      )
    },
    {
      title: 'Confirm',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: (text, record) => (
        <>
          {record.volume !== 0 && <Button type='primary' size='small' onClick={() => console.log(record.volume)}>Received</Button>}
        </>
      )
    }
  ]

  useEffect(() => {

    const registryContract = initContract(Registry, Contracts['4'].FRMRegistry[0])
    const marketContract = initContract(Market, Contracts['4'].Market[0])
    const seasonContract = initContract(Season, Contracts['4'].Season[0])

    async function loadUserDashboard() {
      const user = {}
      const conversionRate = {}
      const loadingState = {}
      // Start loading app component
      loadingState.userDashLoading = true
      store.dispatch(isUserDashLoading({ ...loadingState }))
      // Fetch Eth price
      const etherPrice = await fetch(`https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEYS}`)
      const { result } = await etherPrice.json()
      conversionRate.ethusd = result.ethusd
      store.dispatch(loadCurrency({ ...conversionRate }))
      // Query user info from the blockchain
      user.lands = await registryContract.methods.balanceOf(wallet[0]).call()
      user.totalBookings = await marketContract.methods.totalBookerBooking(wallet[0]).call()
      const tx = await marketContract.methods.userTransactions(wallet[0]).call()
      user.txs = Web3.utils.fromWei(tx, 'ether')
      user.userFarms = []
      if (Number(user.lands) === 0) {
        user.userFarms = []
      } else {
        for (let i = 1; i <= Number(user.lands); i++) {
          try {
            user.userFarms[i-1] = await registryContract.methods.queryUserTokenizedFarm(i).call({ from: wallet[0] })
          } catch(err) {
            console.log(err)
          }
        }
      }
      user.userBookings = []
      if (Number(user.totalBookings) === 0) {
        user.userBookings = []
      } else {
        for (let i = 1; i <= Number(user.totalBookings); i++) {
          try {
            let seasonBooked = await marketContract.methods.getSeasonBooked(i, wallet[0]).call()
            user.userBookings[i-1] = await marketContract.methods.getBookerBooking(seasonBooked, wallet[0]).call()
            const _token = Number(user.userBookings[i-1].marketId)
            const _seasonNo = Number(user.userBookings[i-1].season)
            const seasonData = await seasonContract.methods.querySeasonData(_token, _seasonNo).call()
            user.userBookings[i-1].crop = seasonData.crop
            user.userBookings[i-1].key = i-1
            user.userBookings[i-1].traceId = await seasonContract.methods.hashedSeason(_token, _seasonNo).call()
            user.userBookings[i-1].runningSeason = _seasonNo
          } catch(err) {
            console.log(err)
          }
        }
      }
      store.dispatch(loadUser({ ...user }))
      // Stop loading app component
      loadingState.userDashLoading = false
      store.dispatch(isUserDashLoading({ ...loadingState }))
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

    loadUserDashboard()

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
              title='Lands'
              description='Number of registered farm lands'
              dispValue={userData.lands}
            />
          )}
        </Col>
        <Col xs={24} xl={8} className='column_con'>
          {isLoading ? (
            <Loading />
          ) : (
            <Stats
              title='Bookings'
              description='Number of bookings'
              dispValue={userData.totalBookings}
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
              dispValue={`${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(userData.txs) * Number(usdRate))}`}
            />
          )}
        </Col>
      </Row>
      <Row>
        {isLoading ? (
          <Col xs={24} xl={24} className='column_con' style={{ height: '300px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <LoadingOutlined />
          </Col>
        ) : (
          <Col xs={24} xl={24} className='column_con'>
            <Tabs type='card'>
              <TabPane tab='Farms' key='1'>
                <Row>
                  {userData.userFarms.length === 0 ? (
                    <Col xs={24} xl={24} className='column_con'>
                      <Nofarm />
                    </Col>
                  ) : (
                    userData.userFarms.map(userFarm => (
                      <Col key={userFarm.tokenId} xs={24} xl={8} className='column_con'>
                        <Farm farm={userFarm} img={userFarm.imageHash} />
                      </Col>
                    ))
                  )}
                </Row>
              </TabPane>
              <TabPane tab='Bookings' key='2'>
                <Row justify='center' align='center'>
                  <Col xs={24} xl={24} className='column_con'>
                    <Table size='small' tableLayout='auto' scroll={{ x: true }} dataSource={userData.userBookings} columns={columns} />
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </Col>
        )}
      </Row>
    </>
  )
}

User.propTypes = {
  isLoading: PropTypes.bool,
  usdRate: PropTypes.number,
  wallet: PropTypes.array,
  userData: PropTypes.object,
  tokenize: PropTypes.func,
  network: PropTypes.number,
}

function mapStateToProps(state) {
  return {
    isLoading: state.loading.userDashLoading,
    usdRate: Number(state.currency.ethusd),
    wallet: state.wallet.address,
    userData: state.user,
    network: state.network.currentNetwork,
  }
}

export default connect(mapStateToProps, { tokenize })(User)

