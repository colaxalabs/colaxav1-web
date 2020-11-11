import PropTypes from 'prop-types'
import React from 'react'
import {
  Form,
  Modal,
  Input,
  Typography,
} from 'antd'
import Validator from 'validator'

const { Text } = Typography

function Receivership({ visible, onCreate, onCancel }) {
  const [form] = Form.useForm()

  return (
    <Modal
      visible={visible}
      title='Confirm harvest receivership'
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
          volume: 0,
        }}
      >
        <Form.Item
          name='volume'
          label='Volume'
          extra={<Text type='secondary'>You are confirming the amount/whole of your booking volume is delivered</Text>}
          rules={[
            {
              validator: (rule, value) => {
                if (Number(value) !== 0 && Validator.isNumeric(value)) {
                  return Promise.resolve()
                } else {
                  return Promise.reject('Invalid volume')
                }
              }
            }
          ]}
        >
          <Input type='number' />
        </Form.Item>
      </Form>
    </Modal>
  )
}

Receivership.propTypes = {
  visible: PropTypes.bool,
  onCreate: PropTypes.func,
  onCancel: PropTypes.func,
}

export default Receivership

