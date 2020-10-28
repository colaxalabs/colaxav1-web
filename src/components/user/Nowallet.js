import PropTypes from 'prop-types'
import React from 'react'
import {
  Avatar,
  Button,
  Row,
  Col,
  Typography,
} from 'antd'
import { connect } from 'react-redux'

// Redux actions
import { connectWallet } from '../../actions'

const { Title } = Typography

function Nowallet({ connectWallet }) {
  return (
    <Row justify='center' align='center'>
      <Col xs={24} xl={24} className='column_con'>
        <div className='head_line_con' style={{ height: '300px' }}>
          <Title level={2}>Connect Wallet</Title>
          <Button
            type='primary'
            onClick={connectWallet}
            size='large'
            icon={
              <Avatar
                style={{ marginRight: '20px' }}
                size={25}
                src='https://gateway.pinata.cloud/ipfs/QmW5YmoAs8M7rX8QjptLd8BPtw8JS8nvSaAQc6Ld4nFCP5'
              />
            }
          >
            Metamask Wallet
          </Button>
        </div>
      </Col>
    </Row>
  )
}

Nowallet.propTypes = {
  connectWallet: PropTypes.func,
}

export default connect(null, { connectWallet })(Nowallet)

