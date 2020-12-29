import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'

// Contracts
import Market from '../../abis/Market.json'
import Contracts from '../../contracts.json'

// Utils
import { initContract } from '../../utils'

// Store
import { store } from '../../store'

// Redux actions
import { loadMarkets } from '../../actions'

function CropMarket({ wallet, network }) {

  React.useEffect(() => {

    async function queryMarkets() {
      // Init contracts
      const marketContract = initContract(Market, Contracts['4'].Market[0])

      let markets = []
      const totalMarkets = await marketContract.methods.totalMarkets().call()
      if (totalMarkets === 0) {
        markets = []
      } else {
        for (let i = 1; i <= totalMarkets; i++) {
          markets[i] = await marketContract.methods.getEnlistedMarket(i).call()
        } 
      }
      store.dispatch(loadMarkets(markets))
    }

    queryMarkets()

  }, [wallet, network])

  return (
    <div>Crop market page</div>
  )
}

CropMarket.propTypes = {
  network: PropTypes.number,
  wallet: PropTypes.array,
}

function mapStateToProps(state) {
  return {
    network: state.network.currentNetwork,
    wallet: state.wallet.address,
  }
}

export default connect(mapStateToProps)(CropMarket)

