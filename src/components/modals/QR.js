import PropTypes from 'prop-types'
import React from 'react'
import { Modal } from 'antd'
import QRCode from 'qrcode.react'

// Utils
import { initContract } from '../../utils'

// Contracts
import Season from '../../abis/Season.json'
import Contracts from '../../contracts.json'

function QR({ tokenId, visible, runningSeason, onClick, onCancel }) {

  const [traceId, setTraceId] = React.useState('')

  React.useEffect(() => {
    const seasonContract = initContract(Season, Contracts['4'].Season[0])

    async function getTraceID() {
      const _id = await seasonContract.methods.hashedSeason(Number(tokenId), Number(runningSeason)).call()
      setTraceId(_id)
    }

    getTraceID()

  }, [tokenId, runningSeason])

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
          value={`reap:${traceId}`}
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
  runningSeason: PropTypes.string,
  onCancel: PropTypes.func,
  onClick: PropTypes.func,
}

export default QR

