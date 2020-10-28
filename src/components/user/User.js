import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import {
  Row,
  Col,
  Tabs,
  Table,
  Button,
} from 'antd'
import {
  LoadingOutlined,
  SyncOutlined,
  CheckCircleTwoTone,
} from '@ant-design/icons'
import { connect } from 'react-redux'

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

const farms = [
  /*
   *{
   *  id: 1,
   *  img: 'https://gateway.pinata.cloud/ipfs/QmVvJg2VCJ4SnDaR3cSr5f5diXrR7Sc7jLgxtJU8bE6yiY',
   *  season: 'Dormant',
   *  tokenId: 3898392911,
   *},
   *{
   *  id: 2,
   *  img: 'https://gateway.pinata.cloud/ipfs/QmWwS4mjCyoXmQPhE1osyeCcxGz2z9a9JsuvaTRr3Yn6z2',
   *  season: 'Dormant',
   *  tokenId: 9403020311,
   *},
   *{
   *  id: 3,
   *  img: 'https://gateway.pinata.cloud/ipfs/QmPaqwkwUUn9x2wJ574sg14zzrmF8dAbP6C2rgiLHuGa1h',
   *  season: 'Planting',
   *  tokenId: 1110203203,
   *},
   *{
   *  id: 4,
   *  img: 'https://gateway.pinata.cloud/ipfs/QmUfideC1r5JhMVwgd8vjC7DtVnXw3QGfCSQA7fUVHK789',
   *  season: 'Preparation',
   *  tokenId: 9202223452,
   *},
   *{
   *  id: 5,
   *  img: 'https://gateway.pinata.cloud/ipfs/QmQWt49RWk3df8Qywt7C37SMwPxbQW3uBfcxLDKmSNT3Ho',
   *  season: 'Booking',
   *  tokenId: 3339811117,
   *}
   */
]

const dataSource = [
  {
    key: '1',
    booker: 'Mike',
    volume: 32,
    deposit: 203000000,
    delivered: false,
    season: 1,
  },
  {
    key: '2',
    booker: 'Joe',
    volume: 2,
    deposit: 100002333,
    delivered: true,
    season: 11,
  },
]

const columns = [
  {
    title: 'Booker',
    dataIndex: 'booker',
    key: 'booker',
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
          <SyncOutlined spin />
        ) : (
          <CheckCircleTwoTone twoToneColor='#52c41a'/>
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
    render: (text, record) => <Button type='primary' onClick={() => console.log(record)}>Confirm Receivership</Button>
  }
]

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
                <Col xs={24} xl={24} className='column_con'>
                  <Table dataSource={dataSource} columns={columns} />
                </Col>
              </TabPane>
              <TabPane tab='Register' key='3'>
                Register
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

