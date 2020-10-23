import React from 'react'
import { Row, Col, Typography } from 'antd'

const { Text, Title } = Typography

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
    </>
  )
}

export default Homepage

