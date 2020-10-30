import React from 'react'
import {
  Button,
  Avatar,
  Typography,
  Space,
} from 'antd'
import {
  SyncOutlined,
  CheckCircleTwoTone,
} from '@ant-design/icons'
import makeBlockie from 'ethereum-blockies-base64'

const { Text } = Typography

export const seasonColumns = [
  {
    title: '#',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Crop',
    dataIndex: 'crop',
    key: 'crop',
  },
  {
    title: 'Preparation Fertilizer',
    dataIndex: 'preparationFertilizer',
    key: 'preparationFertilizer',
  },
  {
    title: 'Preparation Fertilizer Supplier',
    dataIndex: 'preparationFertilizerSupplier',
    key: 'preparationFertilizerSupplier',
  },
  {
    title: 'Seeds Used',
    dataIndex: 'seedsUsed',
    key: 'seedsUsed',
  },
  {
    title: 'Seeds Supplier',
    dataIndex: 'seedsSupplier',
    key: 'seedsSupplier',
  },
  {
    title: 'Expected Yield',
    dataIndex: 'expectedYield',
    key: 'expectedYield',
  },
  {
    title: 'Planting Fertilizer Used',
    dataIndex: 'plantingFertilizer',
    key: 'plantingFertilizer',
  },
  {
    title: 'Planting Fertilizer Supplier',
    dataIndex: 'plantingFertilizerSupplier',
    key: 'plantingFertilizerSupplier',
  },
  {
    title: 'Pesticide Used',
    dataIndex: 'pesticideUsed',
    key: 'pesticideUsed',
  },
  {
    title: 'Pesticide Supplier',
    dataIndex: 'pesticideSupplier',
    key: 'pesticideSupplier',
  },
  {
    title: 'Harvest Yield',
    dataIndex: 'harvestSupply',
    key: 'harvestSupply',
  },
  {
    title: 'Harvest Price(per supply)',
    dataIndex: 'harvestPrice',
    key: 'harvestPrice',
  },
  {
    title: 'Bookers',
    dataIndex: 'bookers',
    key: 'bookers',
  },
  {
    title: 'Action',
    key: 'actions',
    render: (text, record) => <Button type='primary' onClick={() => console.log(record)}>Book</Button>
  }
]

export const bookingColumns = [
  {
    title: '#',
    dataIndex: 'tokenId',
    key: 'tokenId',
  },
  {
    title: 'Booker',
    dataIndex: 'booker',
    key: 'booker',
    render: booker => (
      <>
        <Space>
          <Avatar size='small' src={<img alt='booker' src={makeBlockie(booker)} />} />
          <Text ellipsis copyable>{booker}</Text>
        </Space>
      </>
    )
  },
  {
    title: 'Volume',
    dataIndex: 'volume',
    key: 'volume',
  },
  {
    title: 'Deposit',
    dataIndex: 'deposit',
    key: 'deposit',
  },
  {
    title: 'Delivered',
    dataIndex: 'delivered',
    key: 'delivered',
    render: delivered => (
      <>
        {!delivered ? (
          <SyncOutlined spin style={{ color: '#7546C9' }} />
        ) : (
          <CheckCircleTwoTone twoToneColor='#7546C9' />
        )}
      </>
    ),
  },
  {
    title: 'Season',
    dataIndex: 'season',
    key: 'season',
  },
]

