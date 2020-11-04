import PropTypes from 'prop-types'
import React from 'react'
import {
  Tag,
  Typography,
  Card,
} from 'antd'
import {
  ShareAltOutlined,
  EyeTwoTone,
} from '@ant-design/icons'

const { Text, Link } = Typography

function Farm({ farm, img }) {
  return (
    <Card
      hoverable
      style={{ width: 320 }}
      cover={<img alt='img' height='230px' src={`https://ipfs.io/ipfs/${img}`} />}
      actions={[
        <Link
          href={`/farm/${farm.tokenId}`}
        >
          <EyeTwoTone twoToneColor='#7546C9' style={{ fontSize: '18px', marginLeft: '5px' }} />
        </Link>,
        <Text
          copyable={{
            text: `${window.location.href}farm/${farm.tokenId}/`,
            icon: <ShareAltOutlined style={{ fontSize: '18px' }} />
          }}
        />
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

