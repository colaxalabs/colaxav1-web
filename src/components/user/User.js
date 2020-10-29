import PropTypes from 'prop-types'
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
import { Farm, Nofarm } from '../farm'

// Redux action
import {
  loadCurrency,
  isUserDashLoading,
} from '../../actions'

// Redux store
import { store } from '../../store'

const { TabPane } = Tabs
const { Text, Title, Link } = Typography
const { Option } = Select

const farms = [
  {
    id: 1,
    img: 'https://gateway.pinata.cloud/ipfs/QmVvJg2VCJ4SnDaR3cSr5f5diXrR7Sc7jLgxtJU8bE6yiY',
    season: 'Dormant',
    tokenId: 3898392911,
  },
  {
    id: 2,
    img: 'https://gateway.pinata.cloud/ipfs/QmWwS4mjCyoXmQPhE1osyeCcxGz2z9a9JsuvaTRr3Yn6z2',
    season: 'Dormant',
    tokenId: 9403020311,
  },
  {
    id: 3,
    img: 'https://gateway.pinata.cloud/ipfs/QmPaqwkwUUn9x2wJ574sg14zzrmF8dAbP6C2rgiLHuGa1h',
    season: 'Planting',
    tokenId: 1110203203,
  },
  {
    id: 4,
    img: 'https://gateway.pinata.cloud/ipfs/QmUfideC1r5JhMVwgd8vjC7DtVnXw3QGfCSQA7fUVHK789',
    season: 'Preparation',
    tokenId: 9202223452,
  },
  {
    id: 5,
    img: 'https://gateway.pinata.cloud/ipfs/QmQWt49RWk3df8Qywt7C37SMwPxbQW3uBfcxLDKmSNT3Ho',
    season: 'Booking',
    tokenId: 3339811117,
  }
]

const dataSource = [
  {
    key: '1',
    tokenId: 9392,
    booker: '0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8',
    volume: 32,
    deposit: 203000000,
    delivered: false,
    season: 1,
  },
  {
    key: '2',
    tokenId: 10003,
    booker: '0x62F9E4026B04175f5eD4CEaDaebc40B7F0499497',
    volume: 2,
    deposit: 100002333,
    delivered: true,
    season: 11,
  },
  {
    key: '3',
    tokenId: 33434,
    booker: '0x808b4dA0Be6c9512E948521452227EFc619BeA52',
    volume: 91,
    deposit: 3992999911,
    delivered: false,
    season: 3,
  },
]

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

const props = {
  onChange({file, fileList}) {
    if (file.status !== 'uploading') {
      console.log(file, fileList)
    }
  },
}

function User({ isLoading, usdRate }) {

  useEffect(() => {

    async function loadUserDashboard() {
      const conversionRate = {}
      const loadingState = {}
      loadingState.userDashLoading = true
      store.dispatch(isUserDashLoading({ ...loadingState }))
      const etherPrice = await fetch(`https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEYS}`)
      const { result } = await etherPrice.json()
      conversionRate.ethusd = result.ethusd
      store.dispatch(loadCurrency({ ...conversionRate }))
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

  }, [])

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
              dispValue={2}
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
              dispValue={3}
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
              dispValue={`${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(1 * Number(usdRate))}`}
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
                  {farms.length === 0 ? (
                    <Nofarm />
                  ) : (
                    farms.map(farm => (
                      <Col key={farm.id} xs={24} xl={8} className='column_con'>
                        <Farm farm={farm} />
                      </Col>
                    ))
                  )}
                </Row>
              </TabPane>
              <TabPane tab='Bookings' key='2'>
                <Row justify='center' align='center'>
                  <Col xs={24} xl={24} className='column_con'>
                    <Table dataSource={dataSource} columns={columns} />
                  </Col>
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
                        <Upload { ...props } >
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
}

function mapStateToProps(state) {
  return {
    isLoading: state.loading.userDashLoading,
    usdRate: Number(state.currency.ethusd),
  }
}

export default connect(mapStateToProps)(User)

