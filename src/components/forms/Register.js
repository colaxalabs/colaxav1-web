import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import {
  Form,
  Select,
  Input,
  Button,
  Typography,
} from 'antd'
import Validator from 'validator'
import { connect } from 'react-redux'

// Redux actions
import { connectLocation, submitting } from '../../actions'

// Redux store
import { store } from '../../store'

const { Option } = Select
const { Text } = Typography

function Register({ wallet, farmConfirming, submittingForm, lon, lat, tokenize }) {
  const [form] = Form.useForm()
  const [upload, setUpload] = useState()

  function onsuccess(position) {
    const coords = {}
    const longitude = String(position.coords.longitude)
    const latitude = String(position.coords.latitude)
    coords.longitude = longitude
    coords.latitude = latitude
    store.dispatch(connectLocation({ ...coords }))
  }

  function onerror() {
    window.alert('Unable to get your current position')
  }

  useEffect(() => {
    function locationQuery() {
      navigator.permissions.query({name: 'geolocation'}).then(function(result) {
        if (result.state === 'prompt') {
          navigator.geolocation.getCurrentPosition(onsuccess, onerror)
        } else if (result.state === 'granted') {
          navigator.geolocation.getCurrentPosition(onsuccess, onerror)
        }
      })
    }

    locationQuery()

  })

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
        values.file = upload
        const { name, size, unit, soil, file } = values
        const farmSize = size + unit
        const status = {}
        status.formSubmitting = true
        store.dispatch(submitting({ ...status }))
        tokenize(name, farmSize, lon, lat, file, soil, wallet)
        form.resetFields()
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
          loading={submittingForm}
          htmlType='submit'
        >
          {submittingForm ? 'Submitting...' : farmConfirming ? 'Confirming...' : 'Register'}
        </Button>
      </Form.Item>
    </Form>
  )
}

Register.propTypes = {
  lon: PropTypes.string,
  lat: PropTypes.string,
  submitting: PropTypes.bool,
  confirming: PropTypes.bool,
  wallet: PropTypes.object,
  tokenize: PropTypes.func,
}

function mapStateToProp(state) {
  return {
    lon: state.wallet.longitude,
    lat: state.wallet.latitude,
    submittingForm: state.loading.formSubmitting,
    farmConfirming: state.loading.confirmingFarm,
    wallet: state.wallet,
  }
}

export default connect(mapStateToProp)(Register)

