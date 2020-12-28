import PropTypes from 'prop-types'
import React from 'react'
import { Modal, Space, Typography } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

const { Text } = Typography

function InfiniteModal({ network, isMetamask }) {
  return (
    <Modal
      centered
      footer={null}
      visible={network !== 4 && window.ethereum && isMetamask}
      closable={false}
    >
      <Space>
        <ExclamationCircleOutlined style={{ color: '#faad14', fontSize: 20 }} />
        <Text>
          Current network {
            network === 1 ? 'Mainnet' : 
            network === 3 ? 'Ropsten' :
            network === 4 ? 'Rinkeby' :
            network === 5 ? 'Goerli' : 
            network === 42 ? 'Kovan' : 'Localhost'}.
          Change your network to Rinkeby.
        </Text>
      </Space>
    </Modal>
  )
}

InfiniteModal.propTypes = {
  network: PropTypes.number,
}

export default InfiniteModal

