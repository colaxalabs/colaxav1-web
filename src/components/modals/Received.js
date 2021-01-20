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
import { connect } from 'react-redux'
import { received } from '../../actions'

const { Text } = Typography

function Received({ visible, received, record, cancel }) {

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
            values.season = Number(record.season)
            values.tokenId = Number(record.marketId)
            received(values, message)
            //console.log(values)
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
                if (value !== 0 && value > 1 && Validator.isInt(String(value)) && value <= Number(record.volume)) {
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
            extra={<Text type='secondary'>rate farm service or harvest product in less 50 words</Text>}
            rules={[
              {
                validator: (rule, value) => {
                  if (!Validator.isEmpty(value) && Validator.isAlphanumeric(value.replace(/\s+/g, '')) && value.replace(/\s+/g, '').length <= 50) {
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
  received: PropTypes.func,
  record: PropTypes.object,
  cancel: PropTypes.func,
}

export default connect(null, { received })(Received)

