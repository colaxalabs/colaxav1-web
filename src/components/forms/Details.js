import PropTypes from 'prop-types'
import React from 'react'
import { Form, Button, Input, Tooltip } from 'antd'
import { AimOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import Validator from 'validator'
import { connect } from 'react-redux'

// Redux store
import { store } from '../../store'

// Actions
import { collectDetails, collectLocation } from '../../actions'

let autoComplete

const loadScript = (url, cb) => {
  let script = document.createElement('script')
  script.type = 'text/javascript'

  if (script.readyState) {
    script.onreadystatechange = function () {
      if (script.readyState === 'loaded' || script.readyState === 'complete') {
        script.onreadystatechange = null
        cb()
      }
    }
  } else {
    script.onload = () => cb()
  }

  script.src = url
  document.getElementsByTagName('head')[0].appendChild(script)
}

function handleScriptLoad(updateQuery) {
  autoComplete = new window.google.maps.places.Autocomplete(
    document.getElementById('autocomplete')
  )

  autoComplete.setFields(['address_components', 'formatted_address'])
  autoComplete.addListener('place_changed', () => handlePlaceSelect(updateQuery))
}

async function handlePlaceSelect(updateQuery) {
  const addressObject = autoComplete.getPlace()
  const query = addressObject.formatted_address
  updateQuery(query)
  store.dispatch(collectLocation(query))
}

function Details({ nextPage, nameOfFarm, location }) {

  const [query, setQuery] = React.useState('')
  const [error, setError] = React.useState({})

  const validate = locationQuery => {
    const errors = {}
    if (Validator.isEmpty(locationQuery)) errors.locationError = 'Invalid location'
    return errors
  }

  React.useEffect(() => {
    store.dispatch(collectLocation(''))
    loadScript(`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places`,
      () => handleScriptLoad(setQuery)
    )
  }, [])

  return (
    <Form
      className='form_'
      size='large'
      layout='vertical'
      name='details'
      scrollToFirstError
      initialValues={{
        farmName: nameOfFarm,
      }}
      onFinish={values => {
        const error = validate(location)
        setError(error)
        if (Object.keys(error).length === 0) {
          store.dispatch(collectDetails({ ...values }))
          nextPage()
        }
        
      }}
    >
      <Form.Item
        name='farmName'
        label='Farm Name'
        rules={[
          {
            validator: (rule, value) => {
              if (!Validator.isEmpty(value) && Validator.isAlpha(String(value).replace(/\s+/g, ''))) {
                return Promise.resolve()
              } else {
                return Promise.reject('Invalid name')
              }
            }
          }
        ]}
        hasFeedback
      >
        <Input type='text' placeholder='Farm Name' />
      </Form.Item>
      <Input
        id='autocomplete'
        onChange={(e) => setQuery(e.target.value)}
        placeholder='Your Farm Location'
        addonBefore={<AimOutlined />}
        style={{ paddingBottom: '20px' }}
        defaultValue={location}
        value={query}
        suffix={error.locationError ? (
          <Tooltip title='Provide a valid location'>
            <ExclamationCircleOutlined style={{ color: 'red' }} />
          </Tooltip>
        ) : null}
      />
      <Form.Item>
        <Button
          type='primary'
          htmlType='submit'
        >
          Next
        </Button>
      </Form.Item>
    </Form>
  )
}

Details.propTypes = {
  nameOfFarm: PropTypes.string,
  location: PropTypes.string,
}

function mapStateToProps(state) {
  return {
    nameOfFarm: state.form.farmName,
    location: state.form.farmLocation,
  }
}

export default connect(mapStateToProps)(Details)

