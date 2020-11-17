import PropTypes from 'prop-types'
import React, { useState } from 'react'
import {
  Form,
  Modal,
  Input,
  Typography,
  Select,
  message,
  Tooltip,
} from 'antd'
import Validator from 'validator'
import { connect } from 'react-redux'

const { Text } = Typography
const { Option } = Select

function Harvest({ tokenId, visible, onCreate, onCancel, confirmingHarvest, ethusd }) {
  const [form] = Form.useForm()
  const [price, setPrice] = useState(0)
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
    <Modal
      visible={visible}
      title='Confirm crop growth'
      okText='Confirm'
      okButtonProps={{
        disabled: confirmingHarvest,
        loading: confirmingHarvest,
      }}
      cancelText='Close'
      onCancel={onCancel}
      onOk={() => {
        form.validateFields()
          .then((values) => {
            values.file = upload
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
          supply: 0,
          unit: '',
          price: '',
        }}
      >
        <Form.Item
          name='supply'
          label='Supply'
          extra={<Text type='secondary'>What is your harvest volume this season?</Text>}
          rules={[
            {
              validator: (rule, value) => {
                if (Number(value) !== 0 && Validator.isNumeric(value)) {
                  return Promise.resolve()
                } else {
                  return Promise.reject('Invalid supply')
                }
              }
            }
          ]}
        >
          <Input type='number' />
        </Form.Item>
        <Form.Item
          name='unit'
          label='Unit'
          extra={<Text type='secondary'>What is your supply unit? eg grams, kilogram, tonnes</Text>}
          rules={[
            {
              validator: (rule, value) => {
                if (!Validator.isEmpty(value)) {
                  return Promise.resolve()
                } else {
                  return Promise.reject('Select measurement unit')
                }
              }
            }
          ]}
        >
          <Select placeholder='g/kg/tonnes'>
            <Option value='g'>Gram</Option>
            <Option value='kg'>Kilogram</Option>
            <Option value='tonnes'>Tonnes</Option>
          </Select>
        </Form.Item>
        <Form.Item label='Price'>
          <Form.Item
            name='price'
            extra={<Text type='secondary'>What is the price per 1 unit of your supply</Text>}
            noStyle
            rules={[
              {
                validator: (rule, value) => {
                  if (!Validator.isEmpty(value)) {
                    return Promise.resolve()
                  } else {
                    return Promise.reject('Invalid price')
                  }
                }
              }
            ]}
          >
            <Input type='text' onChange={(e) => setPrice(e.target.value)} />
          </Form.Item>
          <Tooltip title='Amount in Fiat currency'>
            <Text type='secondary'>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(price) * Number(ethusd))}</Text>
          </Tooltip>
        </Form.Item>
        <Form.Item
          name='upload'
          label='Upload harvest image'
          extra={<Text type='secondary'>Pictures speak to us. Provide a picture of your fresh harvest</Text>}
          rules={[
            {
              required: true,
              message: 'Harvest image is required'
            }
          ]}
        >
          <Input type='file' onChange={handleChange} bordered={false} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

Harvest.propTypes = {
  visible: PropTypes.bool,
  onCreate: PropTypes.func,
  onCancel: PropTypes.func,
  tokenId: PropTypes.string,
  confirmingHarvest: PropTypes.bool,
  ethusd: PropTypes.number,
}

function mapStateToProps(state) {
  return {
    confirmingHarvest: state.loading.confirmingHarvest,
    ethusd: Number(state.currency.ethusd),
  }
}

export default connect(mapStateToProps)(Harvest)

