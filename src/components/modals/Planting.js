import PropTypes from 'prop-types'
import React, { useState } from 'react'
import {
  Form,
  Modal,
  Input,
  Checkbox,
  Select,
  Typography,
} from 'antd'
import Validator from 'validator'

const { Option } = Select
const { Text } = Typography

function Planting({ visible, onCreate, onCancel }) {
  const [form] = Form.useForm()
  const [isChecked, setIsChecked] = useState(false)
  const [type, setType] = useState('')

  const onChange = e => {
    setIsChecked(e.target.checked)
  }

  const handleSelect = value => {
    setType(value)
  }

  return (
    <Modal
      visible={visible}
      title='Confirm season planting'
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
          seedsUsed: '',
          seedsSupplier: '',
          expectedYield: '',
          fertilizerCheck: false,
          plantingFertilizer: '',
          fertilizerSupplier: '',
        }}
      >
        <Form.Item
          name='seedsUsed'
          label='Seeds'
          extra={<Text type='secondary'>Seeds used during sowing?</Text>}
          rules={[
            {
              validator: (rule, value) => {
                if (!Validator.isEmpty(value) && Validator.isAlphanumeric(String(value).replace(/\s+/g, ''))) {
                  return Promise.resolve()
                } else {
                  return Promise.reject('Invalid seeds')
                }
              }
            }
          ]}
        >
          <Input type='text' />
        </Form.Item>
        <Form.Item
          name='seedsSupplier'
          label='Seeds Supplier'
          extra={<Text type='secondary'>Who supplied the seeds?</Text>}
          rules={[
            {
              validator: (rule, value) => {
                if (!Validator.isEmpty(value) && Validator.isAlphanumeric(String(value).replace(/\s+/g, ''))) {
                  return Promise.resolve()
                } else {
                  return Promise.reject('Invalid seeds supplier')
                }
              }
            }
          ]}
        >
          <Input type='text' />
        </Form.Item>
        <Form.Item
          name='expectedYield'
          label='Expected Yield'
          extra={<Text type='secondary'>What your expected yield this season?</Text>}
          rules={[
            {
              validator: (rule, value) => {
                if (!Validator.isEmpty(value) && Validator.isAlphanumeric(String(value).replace(/\s+/g, ''))) {
                  return Promise.resolve()
                } else {
                  return Promise.reject('Invalid yield value')
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
          <Checkbox onChange={onChange}>Did you use any fertilizer during planting??</Checkbox>
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
              name='plantingFertilizer'
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
              extra={<Text type='secondary'>Who supplied the fertilizer?</Text>}
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
          </>
        ) : null}
        {type === 'organic' && isChecked ? (
          <>
            <Form.Item
              name='plantingFertilizer'
              label='Fertilizer'
              extra={<Text type='secondary'>Name of the fertilizer</Text>}
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
              label='Supplier'
              extra={<Text type='secondary'>Who supplied you the fertilizer?</Text>}
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
          </>
        ) : null}
      </Form>
    </Modal>
  )
}

Planting.propTypes = {
  visible: PropTypes.bool,
  onCreate: PropTypes.func,
  onCancel: PropTypes.func,
}

export default Planting

