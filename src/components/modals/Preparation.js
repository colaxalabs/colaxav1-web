import PropTypes from 'prop-types'
import React, { useState } from 'react'
import {
  Form,
  Modal,
  Input,
  Checkbox,
  Select,
  Typography,
  message,
} from 'antd'
import { connect } from 'react-redux'
import Validator from 'validator'

// Utils
import { handleUpload } from '../../utils'

const { Option } = Select
const { Text } = Typography

function Preparation({ visible, tokenId, onCreate, onCancel, confirmingPreparation }) {
  const [form] = Form.useForm()
  const [isChecked, setIsChecked] = useState(false)
  const [type, setType] = useState('')
  const [fertilizerProof, setFertilizerProof] = useState('')

  const onChange = e => {
    setIsChecked(e.target.checked)
  }

  const handleSelect = value => {
    setType(value)
  }

  return (
    <Modal
      visible={visible}
      title='Confirm season preparation'
      okText='Confirm'
      okButtonProps={{
        disabled: confirmingPreparation,
        loading: confirmingPreparation,
      }}
      cancelText='Close'
      onCancel={onCancel}
      onOk={() => {
        form.validateFields()
          .then((values) => {
            values.fertilizerProof = fertilizerProof
            onCreate(tokenId, values, message)
            console.log(values)
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
          crop: '',
          fertilizerCheck: false,
          fertilizerType: '',
          fertilizerUsed: '',
          fertilizerSupplier: '',
        }}
      >
        <Form.Item
          name='crop'
          label='Crop'
          extra={<Text type='secondary'>Which crop are you preparing for this season?</Text>}
          rules={[
            {
              validator: (rule, value) => {
                if (!Validator.isEmpty(value) && Validator.isAlphanumeric(String(value).replace(/\s+/g, ''))) {
                  return Promise.resolve()
                } else {
                  return Promise.reject('Invalid name')
                }
              }
            }
          ]}
        >
          <Input type='text' />
        </Form.Item>
        <Form.Item
          name='fertilizerCheck'
          valuePropName='checked'
        >
          <Checkbox indeterminate={isChecked} disabled={isChecked} onChange={onChange}>Did you use any fertilizer during preparations?</Checkbox>
        </Form.Item>
        {isChecked ? (
          <Form.Item
            name='fertilizerType'
            label='Type'
            extra={<Text type='secondary'>Did you use artificial or organic fertilizer?</Text>}
            rules={[
              {
                validator: (rule, value) => {
                  if (isChecked) {
                    if (!Validator.isEmpty(value) && Validator.isAlphanumeric(String(value).replace(/\s+/g, ''))) {
                      return Promise.resolve()
                    } else {
                      return Promise.reject('Select type')
                    }
                  }
                }
              }
            ]}
          >
            <Select placeholder='Artificial/Organic' onChange={handleSelect}>
              <Option value='artificial'>Artificial</Option>
              <Option value='organic'>Organic</Option>
            </Select>
          </Form.Item>
        ) : null}
        {type === 'artificial' && isChecked ? (
          <>
            <Form.Item
              name='fertilizerUsed'
              label='Name'
              extra={<Text type='secondary'>Name of the fertilizer used?</Text>}
              rules={[
                {
                  validator: (rule, value) => {
                    if (isChecked && type === 'artificial') {
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
              name='fertilizerSupplier'
              label='Supplier'
              extra={<Text type='secondary'>Who supplied your the fertilizer?</Text>}
              rules={[
                {
                  validator: (rule, value) => {
                    if (isChecked && type === 'artificial') {
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
              label='Proof Of Transaction with Supplier'
              name='proofFertilizer'
              extra={<Text type='secondary'>Upload a proof that you transacted with Supplier. i.e., receipt image</Text>}
              rules={[
                {
                  required: true,
                  message: 'Required!'
                }
              ]}
            >
              <Input type='file' onChange={(e) => handleUpload(e, setFertilizerProof)} bordered={false} />
            </Form.Item>
          </>
        ) : null}
        {type === 'organic' && isChecked ? (
          <>
            <Form.Item
              name='fertilizerUsed'
              label='Name of the fertilizer'
              rules={[
                {
                  validator: (rule, value) => {
                    if (isChecked && type === 'organic') {
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
              name='fertilizerSupplier'
              label='Your fertilizer supplier'
              rules={[
                {
                  validator: (rule, value) => {
                    if (isChecked && type === 'organic') {
                      if (!Validator.isEmpty(value) && Validator.isAlphanumeric(String(value).replace(/\s+/g, ''))) {
                        return Promise.resolve()
                      } else {
                        return Promise.reject('Invalid supplier')
                      }
                    }
                  }
                }
              ]}
            >
              <Input type='text' />
            </Form.Item>
            <Form.Item
              label='Proof Of Transaction with Supplier'
              name='proofFertilizer'
              extra={<Text type='secondary'>Upload a proof that you transacted with Supplier. i.e., receipt image</Text>}
              rules={[
                {
                  required: true,
                  message: 'Required!'
                }
              ]}
            >
              <Input type='file' onChange={(e) => handleUpload(e, setFertilizerProof)} bordered={false} />
            </Form.Item>
          </>
        ) : null}
      </Form>
    </Modal>
  )
}

Preparation.propTypes = {
  visible: PropTypes.bool,
  onCreate: PropTypes.func,
  onCancel: PropTypes.func,
  tokenId: PropTypes.string,
  confirmingPreparation: PropTypes.bool,
}

function mapStateToProps(state) {
  return {
    confirmingPreparation: state.loading.confirmingPreparation,
  }
}

export default connect(mapStateToProps)(Preparation)

