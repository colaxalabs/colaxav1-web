import PropTypes from 'prop-types'
import React from 'react'
import {
  Modal,
  Form,
  Input,
  Typography,
  message,
} from 'antd'
import Validator from 'validator'

const { Text } = Typography

function Book({ isExecutionable, record, book, visible, onCancel }) {

  const [form] = Form.useForm()

  return (
    <Modal
      visible={visible}
      centered
      title='Booking'
      okText='Confirm'
      cancelText='Close'
      onCancel={onCancel}
      onOk={() => {
        form.validateFields()
          .then(values => {
            if (isExecutionable) {
              book(Number(record.tokenId), values, record.price, message)
              console.log(record.tokenId, values)
              onCancel()
            } else {
              window.alert('Connect Wallet!')
            }
          })
          .catch(info => {
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
          extra={<Text type='secondary'>Amount of harvest you are booking</Text>}
          rules={[
            {
              validator: (rule, value) => {
                if (value !== 0 && Validator.isInt(String(value)) && value <= Number(record.remainingSupply)) {
                  return Promise.resolve()
                } else {
                  return Promise.reject('Invalid booking volume')
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

Book.propTypes = {
  visible: PropTypes.bool,
  onCancel: PropTypes.func,
  book: PropTypes.func,
  record: PropTypes.object,
  isExecutionable: PropTypes.bool,
}

export default Book

