import React from 'react'
import {
  LoadingOutlined,
} from '@ant-design/icons'

const loadingInfo = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '60px'
}

function Loading() {
  return (
    <div style={loadingInfo} className='head_line_con'>
      <LoadingOutlined />
    </div>
  )
}

export default Loading

