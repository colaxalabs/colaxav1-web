import React from 'react'
import { Row, Col, List, Typography } from 'antd'
import {
  CheckCircleTwoTone,
} from '@ant-design/icons'
import { connect } from 'react-redux'

// Redux actions
import { tokenize } from '../../actions'

// Components
import { Register } from '../forms'

const { Text, Title } = Typography

const cons = [
  'On the Internet, Your farm is unique and belongs to you and only you!',
  'Participate in an open, borderless, & censorship-resistant digital marketplace',
  'Receive farm harvest booking without middlemen',
  'Deliver farm harvest and trigger timely payments; without delays'
]

function Registerpage({ tokenize }) {
  return (
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
        />
      </Col>
      <Col xs={24} xl={12} className='column_con site-layout-background' style={{ padding: '20px' }}>
        <Register tokenize={tokenize} />
      </Col>
    </Row>
  )
}

export default connect(null, { tokenize })(Registerpage)

