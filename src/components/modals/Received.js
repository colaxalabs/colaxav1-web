import PropTypes from 'prop-types'
import React from 'react'
import {
  Modal,
  Form,
  Input,
  Typography,
} from 'antd'
import Validator from 'validator'

const { Text } = Typography

function Received({ visible, confirmReceived, record, cancel }) {

  const [confirmationVolume, setConfirmationVolume] = React.useState(0)

  const [form] = Form.useForm()

  return (
    <Modal
      visible={visible}
      centered
      title='Receivership'
      okText='Confirm'
      cancelText='Close'
      onCancel={cancel}
      onOk={() => {
        form.validateFields()
          .then(values => {
            console.log(values)
            cancel()
          })
      }}
    >
      <Form
        form={form}
        layout='vertical'
        initialValues={{
          volume: 0,
          review: '',
        }}
      >
        <Form.Item
          label='Volume Received'
          name='volume'
          extra={<Text type='secondary'>you are confirming that you have received the above volume of your booking</Text>}
          rules={[
            {
              validator: (rule, value) => {
                if (value !== 0 && Validator.isInt(String(value)) && value <= Number(record.volume)) {
                  return Promise.resolve()
                } else {
                  return Promise.reject('Invalid confirmation volume')
                }
              }
            }
          ]}
        >
          <Input type='number' onChange={(e) => setConfirmationVolume(e.target.value)} />
        </Form.Item>
        {Number(record.volume) === Number(confirmationVolume) ? (
          <Form.Item
            label='Review'
            name='review'
            extra={<Text type='secondary'>rate farm service or harvest product in 50 words</Text>}
            rules={[
              {
                validator: (rule, value) => {
                  if (!Validator.isEmpty(value) && Validator.isAlpha(value.replace(/\s+/g, '')) && value.replace(/\s+/g, '').length <= 50) {
                    return Promise.resolve()
                  } else {
                    return Promise.reject('Invalid review')
                  }
                }
              }
            ]}
          >
            <Input type='textarea' />
          </Form.Item>
        ) : null}
      </Form>
    </Modal>
  )
}

Received.propTypes = {
  visible: PropTypes.bool,
  confirmReceived: PropTypes.func,
  record: PropTypes.object,
  cancel: PropTypes.func,
}

export default Received

