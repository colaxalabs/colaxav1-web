import PropTypes from 'prop-types'
import React from 'react'
import {
  Statistic,
  Tooltip,
} from 'antd'
import {
  InfoCircleOutlined,
} from '@ant-design/icons'

const valueStyle = { fontFamily: 'Noto Sans SC' }

const infoStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center'
}

function Stats({ title, description, dispValue }) {
  return (
    <div style={infoStyle} className='head_line_con'>
      <Statistic title={title} value={dispValue} valueStyle={valueStyle} />
      <div style={{ alignSelf: 'flex-start', marginLeft: '15px' }}>
        <Tooltip placement='top' title={<span>{description}</span>}>
          <InfoCircleOutlined />
        </Tooltip>
      </div>
    </div>
  )
}

Stats.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
}

export default Stats

