import PropTypes from 'prop-types'
import React from 'react'
import { Form, Button, Input, Select, Space } from 'antd'
import Validator from 'validator'
import { connect } from 'react-redux'

// Redux store
import { store } from '../../store'

// Actions
import { collectMeasurements } from '../../actions'

const { Option } = Select

function Measurement({ nextPage, prevPage, farmValues }) {
  return (
    <Form
      className='form_'
      size='large'
      layout='vertical'
      name='measurements'
      scrollToFirstError
      initialValues={{
        farmSize: farmValues.farmSize,
        sizeUnit: farmValues.sizeUnit,
        soilType: farmValues.soilType,
      }}
      onFinish={values => {
        store.dispatch(collectMeasurements({ ...values }))
        nextPage()
      }}
    >
      <Form.Item
        name='farmSize'
        label='Farm Size'
        placeholder='Farm Size'
        rules={[
          {
            validator: (rule, value) => {
              if (Number(value) !== 0 && Number(value) > 0 && !Validator.isEmpty(value) && Validator.isFloat(value)) {
                return Promise.resolve()
              } else {
                return Promise.reject('Invalid size')
              }
            }
          }
        ]}
        hasFeedback
      >
        <Input type='number' placeholder='Farm Size' />
      </Form.Item>
      <Form.Item
        name='sizeUnit'
        label='Size Unit'
        rules={[
          {
            required: true,
            message: 'Required',
          }
        ]}
      >
        <Select
          placeholder='Size Unit'
          allowClear
        >
          <Option value='acres'>Acres</Option>
          <Option value='ha'>Hectares</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name='soilType'
        label='Soil Type'
        rules={[
          {
            validator: (rule, value) => {
              if (!Validator.isEmpty(value) && Validator.isAlpha(String(value).replace(/\s+/g, ''))) {
                return Promise.resolve()
              } else {
                return Promise.reject('Invalid soil')
              }
            }
          }
        ]}
        hasFeedback
      >
        <Input type='text' placeholder='Soil Type' />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button onClick={prevPage}>
            Previous
          </Button>

          <Button
            type='primary'
            htmlType='submit'
          >
            Next
          </Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

Measurement.propTypes = {
  farmValues: PropTypes.object,
  prevPage: PropTypes.func.isRequired,
  nextPage: PropTypes.func.isRequired,
}

function mapStateToProps(state) {
  return {
    farmValues: state.form
  }
}

export default connect(mapStateToProps)(Measurement)

