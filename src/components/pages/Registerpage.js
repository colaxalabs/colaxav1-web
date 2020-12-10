import PropTypes from 'prop-types'
import React from 'react'
import { Row, Col, Steps, message } from 'antd'
import { connect } from 'react-redux'

// Redux actions
import { tokenize } from '../../actions'

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

function Registerpage({ tokenize, loaded }) {

  const [current, setCurrent] = React.useState(1)

  const nextPage = () => {
    setCurrent(current + 1)
  }

  const prevPage = () => {
    setCurrent(current - 1)
  }

  const handleSubmit = (values) => {
    tokenize(values, message)
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
        {current === 3 && <UploadDocument prevPage={prevPage} submit={loaded ? handleSubmit : () => window.alert('Connect wallet!')} />}
      </Col>
    </Row>
  )
}

Registerpage.propTypes = {
  loaded: PropTypes.bool,
  tokenize: PropTypes.func.isRequired,
}

function mapStateToProps(state) {
  return {
    loaded: state.wallet.loaded,
  }
}

export default connect(mapStateToProps, { tokenize })(Registerpage)

