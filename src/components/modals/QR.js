import PropTypes from 'prop-types'
import React from 'react'
import { Modal } from 'antd'
import QRCode from 'qrcode.react'

function QR({ tokenId, visible, traceId, runningSeason, onClick, onCancel }) {

  const [traceHash, setTraceHash] = React.useState('')

  React.useEffect(() => {

    async function getTraceID() {
      setTraceHash(traceId)
    }

    getTraceID()

  }, [traceId])

  return (
    <Modal
      visible={visible}
      centered
      title='Download Trace ID'
      okText='Download'
      cancelText='Close'
      onCancel={onCancel}
      onOk={() => onClick(tokenId, runningSeason)}
    >
      <div className='align_center'>
        <QRCode
          id='1234_reap'
          value={`reap:${traceHash}`}
          size={400}
          level={'H'}
          includeMargin={true}
        />
      </div>
    </Modal>
  )
}

QR.propTypes = {
  tokenId: PropTypes.string,
  runningSeason: PropTypes.number,
  onCancel: PropTypes.func,
  onClick: PropTypes.func,
  traceId: PropTypes.string,
}

export default QR

