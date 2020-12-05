import PropTypes from 'prop-types'
import React from 'react'
import { Form, Button, Input, Space } from 'antd'

// Redux store
import { store } from '../../store'

// Actions
import { collectFarmImage } from '../../actions'

function UploadDocument({ submit, prevPage }) {

  const [upload, setUpload] = React.useState()

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
      size='large'
      layout='vertical'
      name='upload_document'
      scrollToFirstError
      onFinish={values => {
        store.dispatch(collectFarmImage(upload))
        const { form } = store.getState()
        submit(form)
      }}
    >
      <Form.Item
        name='upload'
        label='Farm Image'
        rules={[
          {
            required: true,
            message: 'Required!',
          }
        ]}
        hasFeedback
      >
        <Input type='file' bordered={false} onChange={handleChange} />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button onClick={prevPage}>
            Previous
          </Button>

          <Button
            type='primary'
            htmlType='submit'
          >
            Done
          </Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

UploadDocument.propTypes = {
  submit: PropTypes.func.isRequired,
}

export default UploadDocument

