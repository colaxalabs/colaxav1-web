import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'

// Components
import { Nowallet, User } from '../user'

function Userpage({ isWalletConnected }) {
  return (
    <div>
      {isWalletConnected ? (
        <User />
      ) : (
        <Nowallet /> 
      )}
    </div>
  )
}

Userpage.propTypes = {
  isWalletConnected: PropTypes.bool,
}

function mapStateToProps(state) {
  return {
    isWalletConnected: state.wallet.loaded,
  }
}

export default connect(mapStateToProps)(Userpage)

