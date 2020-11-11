import PropTypes from 'prop-types'
import React from 'react'
import {
  Form,
  Modal,
  Input,
  Typography,
  Select,
} from 'antd'
import Validator from 'validator'

const { Text } = Typography
const { Option } = Select

function Harvest({ visible, onCreate, onCancel }) {
  const [form] = Form.useForm()

  return (
    <Modal
      visible={visible}
      title='Confirm crop growth'
      okText='Confirm'
      cancelText='Close'
      onCancel={onCancel}
      onOk={() => {
        form.validateFields()
          .then((values) => {
            console.log(values)
          })
          .catch((info) => {
            console.log('Validate Failed:', info)
          })
      }}
    >
      <Form
        form={form}
        layout='vertical'
        name='form_in_modal'
        initialValues={{
          supply: 0,
          unit: '',
          price: '',
        }}
      >
        <Form.Item
          name='supply'
          label='Supply'
          extra={<Text type='secondary'>What is your harvest volume this season?</Text>}
          rules={[
            {
              validator: (rule, value) => {
                if (Number(value) !== 0 && Validator.isNumeric(value)) {
                  return Promise.resolve()
                } else {
                  return Promise.reject('Invalid supply')
                }
              }
            }
          ]}
        >
          <Input type='number' />
        </Form.Item>
        <Form.Item
          name='unit'
          label='Unit'
          extra={<Text type='secondary'>What is your supply unit? eg grams, kilogram, tonnes</Text>}
          rules={[
            {
              validator: (rule, value) => {
                if (!Validator.isEmpty(value)) {
                  return Promise.resolve()
                } else {
                  return Promise.reject('Select measurement unit')
                }
              }
            }
          ]}
        >
          <Select placeholder='g/kg/tonnes'>
            <Option value='g'>Gram</Option>
            <Option value='kg'>Kilogram</Option>
            <Option value='tonnes'>Tonnes</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name='price'
          label='Price'
          extra={<Text type='secondary'>What is your the price per 1 unit of your supply(price in Ether. eg 0.0524)</Text>}
          rules={[
            {
              validator: (rule, value) => {
                if (!Validator.isEmpty(value)) {
                  return Promise.resolve()
                } else {
                  return Promise.reject('Invalid price')
                }
              }
            }
          ]}
        >
          <Input type='text' />
        </Form.Item>
      </Form>
    </Modal>
  )
}

Harvest.propTypes = {
  visible: PropTypes.bool,
  onCreate: PropTypes.func,
  onCancel: PropTypes.func,
}

export default Harvest

