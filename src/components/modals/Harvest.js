import PropTypes from 'prop-types'
import React from 'react'
import {
  Form,
  Modal,
  Input,
  Typography,
  Select,
  message,
} from 'antd'
import Validator from 'validator'
import { connect } from 'react-redux'

const { Text } = Typography
const { Option } = Select

function Harvest({ tokenId, visible, onCreate, onCancel, ethusd }) {

  const [form] = Form.useForm()

  return (
    <Modal
      visible={visible}
      centered
      title='Confirm crop growth'
      okText='Confirm'
      cancelText='Close'
      onCancel={onCancel}
      onOk={() => {
        form.validateFields()
          .then((values) => {
            onCreate(tokenId, values, message)
            onCancel()
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
        }}
      >
        <Form.Item
          name='supply'
          label='Supply'
          extra={<Text type='secondary'>What is your harvest volume this season?</Text>}
          rules={[
            {
              validator: (rule, value) => {
                if (Number(value) !== 0 && Validator.isInt(value)) {
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
              required: true,
              message: 'Required!'
            }
          ]}
        >
          <Select>
            <Option value='KG'>KILOGRAM</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

Harvest.propTypes = {
  visible: PropTypes.bool,
  onCreate: PropTypes.func,
  onCancel: PropTypes.func,
  tokenId: PropTypes.string,
  ethusd: PropTypes.number,
}

function mapStateToProps(state) {
  return {
    ethusd: Number(state.currency.ethusd),
  }
}

export default connect(mapStateToProps)(Harvest)

