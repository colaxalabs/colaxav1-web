import PropTypes from 'prop-types'
import React from 'react'
import {
  Tooltip,
} from 'antd'
import {
  InfoCircleOutlined,
} from '@ant-design/icons'

const infoStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
}

function Stats({ description, children }) {
  return (
    <div style={infoStyle} className='head_line_con'>
      <div style={{ marginLeft: 'auto', alignSelf: 'flex-start', padding: '0 5px 0' }}>
        <Tooltip placement='topRight' title={<span>{description}</span>}>
          <InfoCircleOutlined />
        </Tooltip>
      </div>
      {children}
    </div>
  )
}

Stats.propTypes = {
  description: PropTypes.string,
  children: PropTypes.object,
}

export default Stats

