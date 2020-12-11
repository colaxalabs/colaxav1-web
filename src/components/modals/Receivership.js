import PropTypes from 'prop-types'
import React from 'react'
import {
  Modal,
  message,
  Typography,
  Space,
} from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

const { Text } = Typography

function Closure({ visible, onCreate, cancel, tokenId }) {

  return (
    <Modal
      visible={visible}
      title='Closing Season'
      okText='Confirm'
      cancelText='Close'
      onCancel={cancel}
      onOk={() => {
        onCreate(tokenId, message)
        cancel()
      }}
    >
      <Space>
        <ExclamationCircleOutlined style={{ color: '#faad14', fontSize: 20 }} />
        <Text>You are going to close this season and choose not to participate in our digital & decentralized marketplace but your own! You farm product will still inherit our traceability properties in your market! GOOD LUCK</Text>
      </Space>
    </Modal>
  )
}

Closure.propTypes = {
  visible: PropTypes.bool,
  onCreate: PropTypes.func,
  cancel: PropTypes.func,
  tokenId: PropTypes.string,
}

export default Closure

