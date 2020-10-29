import PropTypes from 'prop-types'
import Web3 from 'web3'
import React, { useEffect } from 'react'
import {
  Avatar,
  Row,
  Col,
  Tabs,
  Table,
  Button,
  Typography,
  Space,
  Form,
  Input,
  Select,
  Upload,
  List,
} from 'antd'
import {
  LoadingOutlined,
  SyncOutlined,
  CheckCircleTwoTone,
  UploadOutlined,
} from '@ant-design/icons'
import { connect } from 'react-redux'
import makeBlockie from 'ethereum-blockies-base64'

// Components
import {
  Stats,
} from '../dashboard'
import Loading from '../loading'
import { Farm, Nofarm, Nobooking } from '../farm'

// Redux action
import {
  loadCurrency,
  loadUser,
  isUserDashLoading,
} from '../../actions'

// Redux store
import { store } from '../../store'

// Contracts
import Registry from '../../abis/FRMRegistry.json'
import Season from '../../abis/Season.json'
import Contracts from '../../contracts.json'

// Utils
import { initContract } from '../../utils'

const { TabPane } = Tabs
const { Text, Title, Link } = Typography
const { Option } = Select

const columns = [
  {
    title: '#',
    dataIndex: 'tokenId',
    key: 'tokenId',
  },
  {
    title: 'Booker',
    dataIndex: 'booker',
    key: 'booker',
    render: booker => (
      <Space>
        <Avatar size='small' src={makeBlockie(booker)} />
        <Text ellipsis copyable>{booker}</Text>
      </Space>
    )
  },
  {
    title: 'Volume',
    dataIndex: 'volume',
    key: 'volume',
  },
  {
    title: 'Deposit',
    dataIndex: 'deposit',
    key: 'deposit',
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
    title: 'Action',
    key: 'action',
    render: (text, record) => <Button type='primary' size='small' onClick={() => console.log(record)}>Confirm Receivership</Button>
  }
]

const cons = [
  'Your farm is unique and belongs to you and only you!',
  'Its an open, borderless, & censorship-resistant digital marketplace',
  'Receive farm harvest booking without middlemen',
]

function User({ wallet, userData, isLoading, usdRate }) {

  useEffect(() => {

    const registryContract = initContract(Registry, Contracts.dev.FRMRegistry[0])
    const seasonContract = initContract(Season, Contracts.dev.Season[0])

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
      user.totalBookings = await seasonContract.methods.totalBookingDeliveredForBooker(wallet[0]).call()
      const tx = await seasonContract.methods.addressTransactions(wallet[0]).call()
      user.txs = Web3.utils.fromWei(tx, 'ether')
      user.userFarms = []
      if (Number(user.lands) === 0) {
        user.userFarms = []
      } else {
        for (let i = 1; i <= Number(user.lands); i++) {
          try {
            user.userFarms[i] = await registryContract.methods.queryUserTokenizedFarm(i).call()
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
            let seasonBooked = await seasonContract.methods.getSeasonBooked(i).call()
            user.userBookings[i] = await seasonContract.methods.getBookerBooking(seasonBooked, wallet[0]).call()
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

  }, [wallet])

  return (
    <div>
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
              description='Number of completed bookings'
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
      <Row justify='center' align='center'>
        {isLoading ? (
          <Col xs={24} xl={24} className='column_con' style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <LoadingOutlined style={{ marginTop: '150px' }} />
          </Col>
        ) : (
          <Col xs={24} xl={24} className='column_con'>
            <Tabs>
              <TabPane tab='Farms' key='1'>
                <Row>
                  {userData.userFarms.length === 0 ? (
                    <Nofarm />
                  ) : (
                    userData.userFarms.map(userFarm => (
                      <Col key={userFarm.tokenId} xs={24} xl={8} className='column_con'>
                        <Farm farm={userFarm} />
                      </Col>
                    ))
                  )}
                </Row>
              </TabPane>
              <TabPane tab='Bookings' key='2'>
                <Row justify='center' align='center'>
                  {userData.userBookings.length === 0 ? (
                    <Nobooking />
                  ) : (
                    <Col xs={24} xl={24} className='column_con'>
                      <Table dataSource={userData.userBookings} columns={columns} />
                    </Col>
                  )} 
                </Row>
              </TabPane>
              <TabPane tab='Register' key='3'>
                <Row>
                  <Col xs={24} xl={12} className='column_con'>
                    <Title level={3}>
                      Register your farm land
                    </Title>
                    <List
                      dataSource={cons}
                      renderItem={item => (
                        <List.Item>
                          <Text>
                            <CheckCircleTwoTone style={{ paddingRight: '10px' }} twoToneColor='#7546C9' />
                            {item}
                          </Text>
                        </List.Item>
                      )}
                    >
                      <List.Item>
                        <Text>
                          <CheckCircleTwoTone style={{ paddingRight: '10px' }} twoToneColor='#7546C9' />
                          Deliver farm harvest & transact in <Link href='https://ethereum.org/en/what-is-ethereum/' target='_blank'>Ethereum cryptocurrency</Link>
                        </Text>
                      </List.Item>
                    </List>
                  </Col>
                  <Col xs={24} xl={12} className='column_con'>
                    <Form name='basic' layout='vertical' style={{ width: '400px' }}>
                      <Form.Item
                        label='Farm Name'
                        name='name'
                      >
                        <Input type='text' />
                      </Form.Item>
                      <Form.Item
                        label='Farm Size'
                        name='size'
                      >
                        <Input type='number' />
                      </Form.Item>
                      <Form.Item
                        label='Farm Size Unit'
                        name='unit'
                      >
                        <Select
                          placeholder='Acres/Hectares'
                          allowClear
                        >
                          <Option value='acres'>Acres</Option>
                          <Option value='ha'>Hectares</Option>
                        </Select>
                      </Form.Item>
                      <Form.Item
                        label='Farm Soil Type'
                        name='soil'
                      >
                        <Input type='text' />
                      </Form.Item>
                      <Form.Item
                        label='Upload farm image'
                        name='upload'
                      >
                        <Upload>
                          <Button icon={<UploadOutlined style={{ color: '#7546C9' }} />}>Upload farm image</Button>
                        </Upload>
                      </Form.Item>
                      <Form.Item>
                        <Button
                          type='primary'
                        >
                          Register
                        </Button>
                      </Form.Item>
                    </Form>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </Col>
        )}
      </Row>
    </div>
  )
}

User.propTypes = {
  isLoading: PropTypes.bool,
  usdRate: PropTypes.number,
  wallet: PropTypes.array,
  userData: PropTypes.object,
}

function mapStateToProps(state) {
  return {
    isLoading: state.loading.userDashLoading,
    usdRate: Number(state.currency.ethusd),
    wallet: state.wallet.address,
    userData: state.user,
  }
}

export default connect(mapStateToProps)(User)

