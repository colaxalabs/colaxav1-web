import React from 'react'
import { Row, Col, Steps } from 'antd'

import { Details, Measurement, UploadDocument } from '../forms'

const { Step } = Steps

const steps = [
  {
    title: 'Farm Details'
  },
  {
    title: 'Size & Soil'
  },
  {
    title: 'Proof Of Existence'
  }
]

function Registerpage() {

  const [current, setCurrent] = React.useState(1)

  const nextPage = () => {
    setCurrent(current + 1)
  }

  const prevPage = () => {
    setCurrent(current - 1)
  }

  const handleSubmit = (values) => {
    console.log(values)
  }

  return (
    <Row className='site-layout-background' style={{ padding: '5px 10px' }}>
      <Steps current={current}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <Col xs={24} xl={24} className='align_center'>
        {current === 1 && <Details nextPage={nextPage} />}
        {current === 2 && <Measurement prevPage={prevPage} nextPage={nextPage} /> }
        {current === 3 && <UploadDocument prevPage={prevPage} submit={handleSubmit} />}
      </Col>
    </Row>
  )
}

export default Registerpage

