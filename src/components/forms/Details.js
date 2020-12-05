import PropTypes from 'prop-types'
import React from 'react'
import { Form, Button, Input } from 'antd'
import Validator from 'validator'
import { connect } from 'react-redux'

// Redux store
import { store } from '../../store'

// Actions
import { collectDetails } from '../../actions'

function Details({ nextPage, nameOfFarm, location }) {
  return (
    <Form
      className='form_'
      size='large'
      layout='vertical'
      name='details'
      scrollToFirstError
      initialValues={{
        farmName: nameOfFarm,
        farmLocation: location,
      }}
      onFinish={values => {
        store.dispatch(collectDetails({ ...values }))
        nextPage()
      }}
    >
      <Form.Item
        name='farmName'
        label='Farm Name'
        rules={[
          {
            validator: (rule, value) => {
              if (!Validator.isEmpty(value) && Validator.isAlpha(String(value).replace(/\s+/g, ''))) {
                return Promise.resolve()
              } else {
                return Promise.reject('Invalid name')
              }
            }
          }
        ]}
        hasFeedback
      >
        <Input type='text' placeholder='Farm Name' />
      </Form.Item>
      <Form.Item
        name='farmLocation'
        label='Farm Location'
        rules={[
          {
            validator: (rule, value) => {
              if (!Validator.isEmpty(value) && Validator.isAlpha(String(value).replace(/\s+/g, ''))) {
                return Promise.resolve()
              } else {
                return Promise.reject('Invalid location')
              }
            }
          }
        ]}
        hasFeedback
      >
        <Input type='text' placeholder='Farm Location' />
      </Form.Item>
      <Form.Item>
        <Button
          type='primary'
          htmlType='submit'
        >
          Next
        </Button>
      </Form.Item>
    </Form>
  )
}

Details.propTypes = {
  nameOfFarm: PropTypes.string,
  location: PropTypes.string,
}

function mapStateToProps(state) {
  return {
    nameOfFarm: state.form.farmName,
    location: state.form.farmLocation,
  }
}

export default connect(mapStateToProps)(Details)

