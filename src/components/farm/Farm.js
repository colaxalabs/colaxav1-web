import React from 'react'
import {
  Tag,
  Typography,
  Card,
} from 'antd'

const { Text } = Typography

function Farm({ farm }) {
  return (
    <Card
      hoverable
      style={{ width: 320 }}
      cover={<img alt='img' height='230px' src={`${farm.img}`} />}
      actions={[
        <Text
          underline
          strong
        >
          <a>View</a>
        </Text>
      ]}
    >
      <Card.Meta title={'#' + farm.tokenId} description={<Tag color='#7546C9'>{farm.season}</Tag>} />
    </Card>
  )
}

export default Farm

