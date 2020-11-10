import PropTypes from 'prop-types'
import React, { useState } from 'react'
import {
  Form,
  Modal,
  Input,
  Checkbox,
  Typography,
} from 'antd'
import Validator from 'validator'

const { Text } = Typography

function Growth({ visible, onCreate, onCancel }) {
  const [form] = Form.useForm()
  const [isChecked, setIsChecked] = useState(false)

  const onChange = e => {
    setIsChecked(e.target.checked)
  }

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
          pesticideCheck: false,
          pesticideUsed: '',
          pesticideSupplier: '',
        }}
      >
        <Form.Item
          name='pesticideCheck'
          valuePropName='checked'
        >
          <Checkbox onChange={onChange}>Click this box to confirm you were infested by pest and diseases during crop growth</Checkbox>
        </Form.Item>
          {isChecked ? (
            <>
            <Form.Item
              name='pesticideUsed'
              label='Pesticide'
              extra={<Text type='secondary'>Pesticide used during the attack?</Text>}
              rules={[
                {
                  validator: (rule, value) => {
                    if (!Validator.isEmpty(value) && Validator.isAlphanumeric(String(value).replace(/\s+/g, ''))) {
                      return Promise.resolve()
                    } else {
                      return Promise.reject('Invalid pesticide')
                    }
                  }
                }
              ]}
            >
              <Input type='text' />
            </Form.Item>
            <Form.Item
              name='pesticideSupplier'
              label='Supplier'
              extra={<Text type='secondary'>Who supplied the pesticide?</Text>}
              rules={[
                {
                  validator: (rule, value) => {
                    if (!Validator.isEmpty(value) && Validator.isAlphanumeric(String(value).replace(/\s+/g, ''))) {
                      return Promise.resolve()
                    } else {
                      return Promise.reject('Invalid pesticide supplier')
                    }
                  }
                }
              ]}
            >
              <Input type='text' />
            </Form.Item>
            </>
          ) : null} 
      </Form>
    </Modal>
  )
}

Growth.propTypes = {
  visible: PropTypes.bool,
  onCreate: PropTypes.func,
  onCancel: PropTypes.func,
}

export default Growth

