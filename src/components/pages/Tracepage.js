import React from 'react'
import QrReader from 'react-qr-reader'
import { Space, Typography, Row, Col, Modal, Button } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { ScanOutlined } from '@ant-design/icons'

// Utils
import { initContract } from '../../utils'

// Abis
import Season from '../../abis/Season.json'
import Contracts from '../../contracts.json'

//const dummyHash = '0xca0cfa03651c71fc80a8d1c321279bb6e51b662b5069e0c9d49116a1995db85c'

const { Text } = Typography

function Tracepage() {

  const [visible, setVisible] = React.useState()
  const [resolveStatus, setResolveStatus] = React.useState()

  const handleScan = async data => {
    const seasonContract = initContract(Season, Contracts['4'].Season[0])
    if (data) {
      const hash = String(data).split(':')[1]
      const hashPattern = /^0x/i
      const isValidHash = hashPattern.test(hash)
      if (isValidHash && hash.length === 66) {
        const hashStatus = await seasonContract.methods.resolvedHash(hash).call()
        if (hashStatus) {
          setVisible(false)
          const season = await seasonContract.methods.resolveSeasonHash(hash).call()
          console.log(season)
        } else {
          setVisible(false)
          setResolveStatus('Trace ID not recognized!')
          return
        }
      } else {
        setVisible(false)
        setResolveStatus('Invalid trace ID!')
        return
      }
      return
    }
  }

  return (
    <Row className='align_center'>
      <Col xs={24} xl={24} className='column_con align_center'>
        <Button type='primary' onClick={() => setVisible(true)} icon={<ScanOutlined />} size='large' />
      </Col>
      <Col xs={24} xl={24} className='column_con align_center'>
        {resolveStatus ? (
          <Space>
            <ExclamationCircleOutlined style={{ color: 'red' }}/>
            <Text type='danger'>{resolveStatus}</Text>
          </Space>
        ) : null}
      </Col>
      <Modal
        visible={visible}
        title='Place your QR code at the center'
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <QrReader
          onError={(err) => console.log(err)}
          onScan={handleScan}
          style={{ width: '100%' }}
        />
      </Modal>
    </Row>
  )
}

export default Tracepage

