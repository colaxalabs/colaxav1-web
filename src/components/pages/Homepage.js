import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import {
  Statistic,
  Tag,
  Row,
  Col,
  Typography,
  Card,
  Tooltip,
} from 'antd'
import { connect } from 'react-redux'
import { InfoCircleOutlined, LoadingOutlined } from '@ant-design/icons'

// Contracts
import Registry from '../../abis/FRMRegistry.json'
import Season from '../../abis/Season.json'

// Utils
import { initContract } from '../../utils'

// Redux store
import store from '../../store'

// Redux actions
import {
  loadDashboard,
  isDashLoading,
} from '../../actions'

const { Text } = Typography

const valueStyle = { fontFamily: 'Noto Sans SC' }

const infoStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center'
}

const loadingInfo = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '60px'
}

const farms = [
  {
    id: 1,
    img: 'https://gateway.pinata.cloud/ipfs/QmPaqwkwUUn9x2wJ574sg14zzrmF8dAbP6C2rgiLHuGa1h',
    tokenId: 3253322,
    season: 'Dormant',
  },
  {
    id: 2,
    img: 'https://gateway.pinata.cloud/ipfs/QmUfideC1r5JhMVwgd8vjC7DtVnXw3QGfCSQA7fUVHK789',
    tokenId: 4900211,
    season: 'Harvesting',
  },
  {
    id: 3,
    img: 'https://gateway.pinata.cloud/ipfs/QmVvJg2VCJ4SnDaR3cSr5f5diXrR7Sc7jLgxtJU8bE6yiY',
    tokenId: 10000122,
    season: 'Planting',
  },
]

function Homepage({ dash, isLoading }) {

  useEffect(() => {
    const registryContract = initContract(Registry, '0x5a43A0684E85Dd2bD06B96E8EF85a6E686a15C36')
    const seasonContract = initContract(Season, '0x038B880cc4E1A47D9005892e2DF920625aB3C8BB')

    async function loadDashboardData() {
      const dashboard = {}
      const loadingState = {}
      loadingState.dashLoading = true
      store.dispatch(isDashLoading({ ...loadingState }))
      dashboard.lands = await registryContract.methods.totalSupply().call()
      dashboard.seasons = await seasonContract.methods.completeSeasons().call()
      dashboard.bookings = await seasonContract.methods.totalBooking().call()
      dashboard.traces = await seasonContract.methods.allTraces().call()
      store.dispatch(loadDashboard({ ...dashboard }))
      loadingState.dashLoading = false
      store.dispatch(isDashLoading({ ...loadingState }))
    }

    loadDashboardData()

  }, [])

  return (
    <>
      <Row justify='center' align='middle'>
        <Col xs={24} xl={6} className='column_con'>
          {isLoading ? (
            <div style={loadingInfo} className='head_line_con'>
              <LoadingOutlined style={{ marginTop: '20px' }}/>
            </div>
          ) : (
            <div style={infoStyle} className='head_line_con'>
              <Statistic title='Lands' value={Number(dash.lands)} valueStyle={valueStyle} />
              <div style={{ alignSelf: 'flex-start', marginLeft: '15px' }}>
                <Tooltip placement='top' title={<span>Number of tokenized farmlands</span>}>
                  <InfoCircleOutlined />
                </Tooltip>
              </div>
            </div>
          )} 
        </Col>
        <Col xs={24} xl={6} className='column_con'>
          {isLoading ? (
            <div style={loadingInfo} className='head_line_con'>
              <LoadingOutlined style={{ marginTop: '20px' }}/>
            </div>
          ) : (
            <div style={infoStyle} className='head_line_con'>
              <Statistic title='Seasons' value={Number(dash.seasons)} valueStyle={valueStyle} />
              <div style={{ alignSelf: 'flex-start', marginLeft: '15px' }}>
                <Tooltip placement='top' title={<span>Number of complete seasons</span>}>
                  <InfoCircleOutlined />
                </Tooltip>
              </div>
            </div>
          )}
        </Col>
        <Col xs={24} xl={6} className='column_con'>
          {isLoading ? (
            <div style={loadingInfo} className='head_line_con'>
              <LoadingOutlined style={{ marginTop: '20px' }}/>
            </div>
          ) : (
            <div style={infoStyle} className='head_line_con'>
              <Statistic title='Bookings' value={Number(dash.bookings)} valueStyle={valueStyle} />
              <div style={{ alignSelf: 'flex-start', marginLeft: '15px' }}>
                <Tooltip placement='top' title={<span>Number of complete bookings</span>}>
                  <InfoCircleOutlined />
                </Tooltip>
              </div>
            </div>
          )}
        </Col>
        <Col xs={24} xl={6} className='column_con'>
          {isLoading ? (
            <div style={loadingInfo} className='head_line_con'>
              <LoadingOutlined style={{ marginTop: '20px' }}/>
            </div>
          ) : (
            <div style={infoStyle} className='head_line_con'>
              <Statistic title='Traces' value={Number(dash.traces)} valueStyle={valueStyle} />
              <div style={{ alignSelf: 'flex-start', marginLeft: '15px' }}>
                <Tooltip placement='top' title={<span>Number of traces performed</span>}>
                  <InfoCircleOutlined />
                </Tooltip>
              </div>
            </div>
          )}
        </Col>
      </Row>
      <Row justify='center' align='center'>
        {farms.map(farm => (
          <Col key={farm.id} xs={24} xl={8} className='column_con'>
            <Card
              hoverable
              style={{ width: 320 }}
              cover={<img alt='img' src={`${farm.img}`} />}
              actions={[
                <Text
                  underline
                  strong
                >
                  <a>View</a>
                </Text>
              ]}
            >
              <Card.Meta title={'#' + farm.tokenId} description={<Tag color='#7546C9'>{farm.season}</Tag>} />
            </Card>
          </Col>
        ))}
      </Row>
    </>
  )
}

Homepage.propTypes = {
  dash: PropTypes.object,
}

function mapStateToProps(state) {
  return {
    isLoading: state.loading.dashboardLoading,
    dash: state.dashboard,
  }
}

export default connect(mapStateToProps)(Homepage)

