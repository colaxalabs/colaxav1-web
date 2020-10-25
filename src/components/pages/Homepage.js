import React from 'react'
import {
  Statistic,
  Tag,
  Row,
  Col,
  Typography,
  Card,
  Tooltip,
} from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'

const { Text } = Typography

const valueStyle = { fontFamily: 'Noto Sans SC' }

const infoStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center'
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

function Homepage() {
  return (
    <>
      <Row justify='center' align='middle'>
        <Col xs={24} xl={6} className='column_con'>
          <div style={infoStyle} className='head_line_con'>
            <Statistic title='Lands' value={132} valueStyle={valueStyle} />
            <div style={{ alignSelf: 'flex-start', marginLeft: '15px' }}>
              <Tooltip placement='top' title={<span>Number of tokenized farmlands</span>}>
              <InfoCircleOutlined />
            </Tooltip>
            </div>
          </div>
        </Col>
        <Col xs={24} xl={6} className='column_con'>
          <div style={infoStyle} className='head_line_con'>
            <Statistic title='Seasons' value={13} valueStyle={valueStyle} />
            <div style={{ alignSelf: 'flex-start', marginLeft: '15px' }}>
              <Tooltip placement='top' title={<span>Number of completed seasons</span>}>
              <InfoCircleOutlined />
            </Tooltip>
            </div>
          </div>
        </Col>
        <Col xs={24} xl={6} className='column_con'>
          <div style={infoStyle} className='head_line_con'>
            <Statistic title='Bookings' value={32} valueStyle={valueStyle} />
            <div style={{ alignSelf: 'flex-start', marginLeft: '15px' }}>
              <Tooltip placement='top' title={<span>Number of completed seasons</span>}>
              <InfoCircleOutlined />
            </Tooltip>
            </div>
          </div>
        </Col>
        <Col xs={24} xl={6} className='column_con'>
          <div style={infoStyle} className='head_line_con'>
            <Statistic title='Traces' value={2} valueStyle={valueStyle} />
            <div style={{ alignSelf: 'flex-start', marginLeft: '15px' }}>
              <Tooltip placement='top' title={<span>Number of successful traces</span>}>
              <InfoCircleOutlined />
            </Tooltip>
            </div>
          </div>
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

export default Homepage

