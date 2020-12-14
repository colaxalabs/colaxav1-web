import PropTypes from 'prop-types'
import React from 'react'
import { Modal } from 'antd'
import QRCode from 'qrcode.react'

function QR({ tokenId, visible, runningSeason, onClick, onCancel }) {
  return (
    <Modal
      visible={visible}
      title='Download Trace ID'
      okText='Download'
      cancelText='Close'
      onCancel={onCancel}
      onOk={() => onClick(tokenId, runningSeason)}
    >
      <QRCode
        id={`${Number(tokenId) + Number(runningSeason)}`}
        value={`${Number(tokenId) + Number(runningSeason)}`}
        size={290}
        level={'H'}
        includeMargin={true}
      />
    </Modal>
  )
}

QR.propTypes = {
  tokenId: PropTypes.string,
  runningSeason: PropTypes.string,
  onCancel: PropTypes.func,
  onClick: PropTypes.func,
}

export default QR

