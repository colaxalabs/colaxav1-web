import React from 'react'
import {
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

