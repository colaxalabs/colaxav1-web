import React, { useState } from 'react'
import {
  Form,
  Select,
  Input,
  Button,
  Typography,
} from 'antd'
import Validator from 'validator'

const { Option } = Select
const { Text } = Typography

function Register() {
  const [form] = Form.useForm()
  const [upload, setUpload] = useState()

  const convertToBuffer = async reader => {
    const buffer = await Buffer.from(reader.result)
    setUpload(buffer)
  }
  const handleChange = e => {
    e.preventDefault()
    const file = e.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => convertToBuffer(reader)
  }

  return (
    <Form
      form={form}
      name='basic'
      layout='vertical'
      requiredMark={false}
      style={{ width: '400px' }}
      onFinish={(values) => {
        values.upload = upload
        form.resetFields()
        console.log(values)
      }}
      initialValues={{
        name: '',
        size: '0',
        soil: ''
      }}
      scrollToFirstError
    >
      <Form.Item
        label='Farm Name'
        name='name'
        extra={<Text type='secondary'>For example, 'Arunga Vineyard'</Text>}
        rules={[
          {
            validator: (rule, value) => {
              if (!Validator.isEmpty(value) && Validator.isAlpha(String(value).replace(/\s+/g, ''))) {
                return Promise.resolve()
              } else {
                return Promise.reject('Invalid farm name')
              }
            }
          }
        ]} 
      >
        <Input type='text' />
      </Form.Item>
      <Form.Item
        label='Farm Size'
        name='size'
        extra={<Text type='secondary'>What's the size of your farm land?</Text>}
        rules={[
          {
            validator: (rule, value) => {
              if (Number(value) !== 0 && Number(value) > 0 && !Validator.isEmpty(value) && Validator.isFloat(value)) {
                return Promise.resolve()
              } else {
                return Promise.reject('Invalid size number')
              }
            }
          }
        ]}
      >
        <Input type='number' />
      </Form.Item>
      <Form.Item
        label='Farm Size Unit'
        name='unit'
        extra={<Text type='secondary'>Acres/Hectares</Text>}
        rules={[
          {
            required: true,
            message: 'Farm size unit is required'
          }
        ]}
      >
        <Select
          placeholder='Acres/Hectares'
          allowClear
        >
          <Option value='acres'>Acres</Option>
          <Option value='ha'>Hectares</Option>
        </Select>
      </Form.Item>
      <Form.Item
        label='Farm Soil Type'
        name='soil'
        extra={<Text type='secondary'>Clay, Loam, etc</Text>}
        rules={[
          {
            validator: (rule, value) => {
              if (!Validator.isEmpty(value) && Validator.isAlpha(String(value).replace(/\s+/g, ''))) {
                return Promise.resolve()
              } else {
                return Promise.reject('Invalid soil type')
              }
            }
          },
          {
            type: 'string',
            message: 'Invalid soil type'
          }
        ]}
      >
        <Input type='text' />
      </Form.Item>
      <Form.Item
        label='Upload farm image'
        name='upload'
        extra={<Text type='secondary'>Pictures speak to us. Your farm image will be your brand</Text>}
        rules={[
          {
            required: true,
            message: 'Farm image file is required'
          }
        ]}
      >
        <Input type='file' onChange={handleChange} bordered={false} />
      </Form.Item>
      <Form.Item>
        <Button
          type='primary'
          htmlType='submit'
        >
          Register
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Register

