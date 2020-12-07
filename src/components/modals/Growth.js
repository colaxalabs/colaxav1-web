import PropTypes from 'prop-types'
import React, { useState } from 'react'
import {
  Form,
  Modal,
  Input,
  Checkbox,
  Typography,
  message,
} from 'antd'
import Validator from 'validator'
import { connect } from 'react-redux'

// Utils
import { handleUpload } from '../../utils'

const { Text } = Typography

function Growth({ tokenId, visible, onCreate, onCancel, confirmingGrowth }) {

  const [form] = Form.useForm()
  const [isChecked, setIsChecked] = useState(false)
  const [pestProof, setPestProof] = useState('')
  const [pesticideProof, setPesticideProof] = useState('')

  const onChange = e => {
    setIsChecked(e.target.checked)
  }

  return (
    <Modal
      visible={visible}
      title='Confirm crop growth'
      okText='Confirm'
      okButtonProps={{
        disabled: confirmingGrowth,
        loading: confirmingGrowth,
      }}
      cancelText='Close'
      onCancel={() => {
        onCancel()
        form.resetFields()
      }}
      onOk={() => {
        form.validateFields()
          .then((values) => {
            values.pestProof = pestProof
            values.pesticideProof = pesticideProof
            onCreate(tokenId, values, message)
            console.log(values)
            onCancel()
            form.resetFields()
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
          pestName: '',
          pesticideUsed: '',
          pesticideSupplier: '',
        }}
      >
        <Form.Item
          name='pesticideCheck'
          valuePropName='checked'
        >
          <Checkbox disabled={isChecked} indeterminate={isChecked} onChange={onChange}>Click this box to confirm you were infested by pest and diseases during crop growth</Checkbox>
        </Form.Item>
          {isChecked ? (
            <>
            <Form.Item
              name='pestName'
              label='Pest and Diseases'
              extra={<Text type='secondary'>Name of the pest or disease</Text>}
              rules={[
                {
                  validator: (rule, value) => {
                    if (isChecked) {
                      if (!Validator.isEmpty(value) && Validator.isAlphanumeric(String(value).replace(/\s+/g, ''))) {
                        return Promise.resolve()
                      } else {
                        return Promise.reject('Invalid name')
                      }
                    }
                  }
                }
              ]}
            >
              <Input type='text' />
            </Form.Item>
              <Form.Item
                name='pestImage'
                label='Proof Of Pesticide'
                extra={<Text type='secondary'>Upload an image of your affected crop</Text>}
                rules={[
                  {
                    required: true,
                    message: 'Required!'
                  }
                ]}
              >
                <Input type='file' onChange={(e) => handleUpload(e, setPestProof)} bordered={false} />
              </Form.Item>
            <Form.Item
              name='pesticideUsed'
              label='Pesticide'
              extra={<Text type='secondary'>Pesticide used during the attack?</Text>}
              rules={[
                {
                  validator: (rule, value) => {
                    if (isChecked) {
                      if (!Validator.isEmpty(value) && Validator.isAlphanumeric(String(value).replace(/\s+/g, ''))) {
                        return Promise.resolve()
                      } else {
                        return Promise.reject('Invalid pesticide')
                      }
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
                    if (isChecked) {
                      if (!Validator.isEmpty(value) && Validator.isAlphanumeric(String(value).replace(/\s+/g, ''))) {
                        return Promise.resolve()
                      } else {
                        return Promise.reject('Invalid pesticide supplier')
                      }
                    } 
                  }
                }
              ]}
            >
              <Input type='text' />
            </Form.Item>
              <Form.Item
                name='proofPestSupplier'
                label='Proof Of Transaction with Supplier'
                extra={<Text type='secondary'>Upload a proof that you transacted with Supplier. i.e., receipt image</Text>}
                rules={[
                  {
                    required: true,
                    message: 'Required!'
                  }
                ]}
              >
                <Input type='file' onChange={(e) => handleUpload(e, setPesticideProof)} bordered={false} />
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
  tokenId: PropTypes.string,
  confirmingGrowth: PropTypes.bool,
}

function mapStateToProps(state) {
  return {
    confirmingGrowth: state.loading.confirmingGrowth,
  }
}

export default connect(mapStateToProps)(Growth)

