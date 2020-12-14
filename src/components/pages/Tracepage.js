import React from 'react'
import QrReader from 'react-qr-reader'
import {
  Space,
  Typography,
  Row,
  Col,
  Modal,
  Button,
  Timeline
} from 'antd'
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  EnvironmentOutlined
} from '@ant-design/icons'
import { ScanOutlined } from '@ant-design/icons'

// Utils
import { initContract, sanitize } from '../../utils'

// Abis
import Season from '../../abis/Season.json'
import Registry from '../../abis/FRMRegistry.json'
import Contracts from '../../contracts.json'

//const dummyHash = '0xca0cfa03651c71fc80a8d1c321279bb6e51b662b5069e0c9d49116a1995db85c'

const { Text } = Typography

function Tracepage() {

  const [visible, setVisible] = React.useState()
  const [resolveStatus, setResolveStatus] = React.useState()
  const [result, setResult] = React.useState()

  const handleScan = async data => {
    const seasonContract = initContract(Season, Contracts['4'].Season[0])
    const registryContract = initContract(Registry, Contracts['4'].FRMRegistry[0])
    
    if (data) {
      const hash = String(data).split(':')[1]
      const hashPattern = /^0x/i
      const isValidHash = hashPattern.test(hash)
      if (isValidHash && hash.length === 66) {
        setResolveStatus(undefined)
        const resp = await seasonContract.methods.resolveSeasonHash(hash).call()
        const season = {}
        const farm = await registryContract.methods.getFarm(Number(resp.tokenId)).call()
        season.farmName = farm.name
        season.farmLocation = farm.location
        season.openingDate = resp.openingDate
        season.preparationDate = resp.preparationDate
        season.preparationFertilizer = resp.preparationFertilizer
        season.preparationFertilizerSupplier = resp.preparationFertilizerSupplier
        season.plantingDate = resp.plantingDate
        season.seeds = resp.seedsUsed
        season.seedsSupplier = resp.seedsSupplier
        season.plantingFertilizer = resp.plantingFertilizer
        season.plantingFertilizerSupplier = resp.plantingFertilizerSupplier
        season.growthDate = resp.growthDate
        season.pestOrVirus = resp.pestOrVirus
        season.pesticideUsed = resp.pesticideUsed
        season.pesticideSupplier = resp.pesticideSupplier
        season.harvestDate = resp.harvestDate
        season.harvestSupply = resp.harvestSupply
        setResult(season)
        setVisible(false)
      } else {
        setResult(undefined)
        setResolveStatus('Invalid trace ID!')
        setVisible(false)
      }
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
        {result ? (
          <div className='site-layout-background trace_con'>
            <Timeline mode='alternate'>
              <Timeline.Item dot={<EnvironmentOutlined />}>
                <Space direction='vertical'>
                  <Text strong>{result.farmLocation}</Text>
                  <Text>{result.farmName}</Text>
                </Space>
              </Timeline.Item>
              <Timeline.Item>
                <Space direction='vertical'>
                  <Text>Start of Season</Text>
                  <Text>{`${new Date(result.openingDate * 1000)}`}</Text>
                </Space>
              </Timeline.Item>
              <Timeline.Item>
                <Space direction='vertical'>
                  <Text>Land Preparation</Text>
                  <Text>{`${new Date(result.preparationDate * 1000)}`}</Text>
                  <Text>{result.preparationFertilizer}</Text>
                  <Text>{result.preparationFertilizerSupplier}</Text>
                </Space>
              </Timeline.Item>
              <Timeline.Item>
                <Space direction='vertical'>
                  <Text>Planting</Text>
                  <Text>{`${new Date(result.plantingDate * 1000)}`}</Text>
                  <Text>{result.seedsUsed}</Text>
                  <Text>{result.seedsSupplier}</Text>
                  <Text>{result.plantingFertilizer}</Text>
                  <Text>{result.plantingFertilizerSupplier}</Text>
                </Space>
              </Timeline.Item>
              <Timeline.Item dot={<ClockCircleOutlined />}>
                <Space direction='vertical'>
                  <Text>Crop Growth</Text>
                  <Text>{`${new Date(result.plantingDate * 1000)} - ${new Date(result.growthDate * 1000)}`}</Text>
                  <Text>{result.pestOrVirus}</Text>
                  <Text>{result.pesticideUsed}</Text>
                  <Text>{result.pesticideSupplier}</Text>
                </Space>
              </Timeline.Item>
              <Timeline.Item dot={<CheckCircleOutlined />}>
                <Space direction='vertical'>
                  <Text>Harvest</Text>
                  <Text>{`${new Date(result.harvestDate * 1000)}`}</Text>
                  <Text>{sanitize(result.harvestSupply)}</Text>
                </Space>
              </Timeline.Item>
            </Timeline>
          </div>
        ) : null}
      </Col>
      <Modal
        visible={visible}
        centered
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

