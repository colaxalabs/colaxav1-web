import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import {
  Modal,
  message,
  Form,
  Input,
  Typography,
} from 'antd'
import Validator from 'validator'

// Utils
import { handleUpload } from '../../utils'

const { Text } = Typography

function MarketModal({
  visible,
  onCreate,
  cancel,
  tokenId,
  harvestSupply,
  crop,
  supplyUnit,
  ethusd,
}) {

  const [form] = Form.useForm()
  const [productImage, setProductImage] = React.useState('')

  return (
    <Modal
      visible={visible}
      centered
      title='Go to market'
      okText='Proceed'
      cancelText='Cancel'
      onCancel={cancel}
      onOk={() => {
        form.validateFields()
          .then((values) => {
            const _price = Number(values.price) / Number(ethusd)
            values.price = _price.toFixed(4)
            values.productImage = productImage
            onCreate(tokenId, values, message)
            cancel()
          })
          .catch((info) => {
            console.log('validate Failed:', info)
          })
      }}
    >
      <Form
        form={form}
        layout='vertical'
        name='form_in_modal'
        initialValues={{
          supply: harvestSupply,
          unit: supplyUnit,
          seasonCrop: crop,
          price: 0,
        }}
      >
        <Form.Item
          name='seasonCrop'
          label='Crop'
          extra={<Text type='secondary'>Current season crop going to market</Text>}
        >
          <Input disabled={true} value={crop} />
        </Form.Item>
        <Form.Item
          label='Proof of Harvest'
          name='harvestProof'
          extra={<Text type='secondary'>Upload 3 image files of farm harvest</Text>}
          rules={[
            {
              required: true,
              message: 'Required!',
            }
          ]}
          hasFeedback
        >
          <Input type='file' onChange={(e) => handleUpload(e, setProductImage)} bordered={false} />
        </Form.Item>
        <Form.Item
          name='supply'
          label='Supply'
          extra={<Text type='secondary'>Season supply</Text>}
        >
          <Input value={harvestSupply} disabled={true} />
        </Form.Item>
        <Form.Item
          name='unit'
          label='Supply Unit'
          extra={<Text type='secondary'>Season supply unit</Text>}
        >
          <Input value={supplyUnit} disabled={true} />
        </Form.Item>
        <Form.Item
          name='price'
          label='Price'
          extra={<Text type='secondary'>price per unit of the supply</Text>}
          rules={[
            {
              validator: (rule, value) => {
                if (Number(value) > 0 && Number(value) !== 0 && Validator.isFloat(value)) {
                  return Promise.resolve()
                } else {
                  return Promise.reject('Invalid price')
                }
              }
            }
          ]}
        >
          <Input addonBefore={<Text>$</Text>} type='number' addonAfter={<Text>per {supplyUnit}</Text>} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

MarketModal.propTypes = {
  visible: PropTypes.bool,
  onCreate: PropTypes.func,
  cancel: PropTypes.func,
  tokenId: PropTypes.string,
  harvestSupply: PropTypes.string,
  supplyUnit: PropTypes.string,
  ethusd: PropTypes.string,
}

function mapStateToProps(state) {
  return {
    ethusd: String(state.currency.ethusd),
  }
}

export default connect(mapStateToProps)(MarketModal)

