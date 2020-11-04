import PropTypes from 'prop-types'
import React from 'react'
import {
  Tag,
  Typography,
  Card,
} from 'antd'

const { Text } = Typography

function Farm({ farm, img }) {
  return (
    <Card
      hoverable
      style={{ width: 320 }}
      cover={<img alt='img' height='230px' src={`https://ipfs.io/ipfs/${img}`} />}
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

Farm.propTypes = {
  farm: PropTypes.object,
  img: PropTypes.string,
}

export default Farm

