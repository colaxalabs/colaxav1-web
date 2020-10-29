import React from 'react'
import {
  Col,
  Empty,
} from 'antd'

function Nobooking() {
  return (
    <Col xs={24} xl={24} className='column_con'>
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span>No booking records</span>} />
    </Col>
  )
}

export default Nobooking

