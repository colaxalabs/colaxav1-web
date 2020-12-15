import PropTypes from 'prop-types'
import React, { useState } from 'react'
import {
  Form,
  Modal,
  Input,
  Switch,
  Select,
  Typography,
  message,
} from 'antd'
import Validator from 'validator'

// Utils
import { handleUpload } from '../../utils'

const { Option } = Select
const { Text } = Typography

function Planting({ tokenId, visible, onCreate, onCancel }) {
  const [form] = Form.useForm()
  const [isChecked, setIsChecked] = useState(false)
  const [type, setType] = useState('')
  const [fertilizerProof, setFertilizerProof] = useState()
  const [seedProof, setSeedProof] = useState()

  const onChange = checked => {
    setIsChecked(checked)
  }

  const handleSelect = value => {
    setType(value)
  }

  return (
    <Modal
      visible={visible}
      centered
      title='Confirm season planting'
      okText='Confirm'
      cancelText='Close'
      onCancel={onCancel}
      onOk={() => {
        form.validateFields()
          .then((values) => {
            values.fertilizerProof = fertilizerProof
            values.seedProof = seedProof
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
          seedsUsed: '',
          seedsSupplier: '',
          expectedYield: '',
          fertilizerCheck: false,
          fertilizerType: '',
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
          label='Proof Of Transaction with Supplier'
          name='proofSeed'
          extra={<Text type='secondary'>Upload a proof that you transacted with Supplier. i.e., receipt image</Text>}
          rules={[
            {
              required: true,
              message: 'Required!'
            }
          ]}
        >
          <Input type='file' onChange={(e) => handleUpload(e, setSeedProof)} bordered={false} />
        </Form.Item>
        <Form.Item
          name='expectedYield'
          label='Expected Yield'
          extra={<Text type='secondary'>What your expected yield this season?</Text>}
          rules={[
            {
              validator: (rule, value) => {
                if (Number(value) !== 0 && Validator.isNumeric(value)) {
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
          name='yieldUnit'
          label='Yield Unit'
          extra={<Text type='secondary'>Expected Yield Unit</Text>}
          rules={[
            {
              required: true,
              message: 'Required'
            }
          ]}
        >
          <Select
            placeholder='Yield Unit'
            allowClear
          >
            <Option value='KG'>KILOGRAM</Option>
          </Select>
        </Form.Item>
        <Switch
          checked={isChecked}
          disabled={isChecked}
          onChange={onChange}
          unCheckedChildren={<Text>Did you use any fertilizer during planting?</Text>}
        />
        {isChecked ? (
          <Form.Item
            name='fertilizerType'
            label='Type'
            extra={<Text type='secondary'>Did you use artificial or organic fertilizer?</Text>}
            rules={[
              {
                required: true,
                message: 'Required!'
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

Planting.propTypes = {
  visible: PropTypes.bool,
  onCreate: PropTypes.func,
  onCancel: PropTypes.func,
  tokenId: PropTypes.string,
}

export default Planting

