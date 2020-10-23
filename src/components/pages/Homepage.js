import React from 'react'
import {
  Tag,
  Row,
  Col,
  Typography,
  Card,
} from 'antd'

const { Text, Title } = Typography

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
          <div className='head_line_con'>
            <Title className='head_line' level={5}>Tokenized lands</Title>
            <Text className='stats'>132</Text>
          </div>
        </Col>
        <Col xs={24} xl={6} className='column_con'>
          <div className='head_line_con'>
            <Title className='head_line' level={5}>Completed seasons</Title>
            <Text className='stats'>11</Text>
          </div>
        </Col>
        <Col xs={24} xl={6} className='column_con'>
          <div className='head_line_con'>
            <Title className='head_line' level={5}>Completed bookings</Title>
            <Text className='stats'>9</Text>
          </div>
        </Col>
        <Col xs={24} xl={6} className='column_con'>
          <div className='head_line_con'>
            <Title className='head_line' level={5}>Completed traces</Title>
            <Text className='stats'>3</Text>
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
                <Typography.Text
                  underline
                  strong
                >
                  <a>View</a>
                </Typography.Text>
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

