import PropTypes from 'prop-types'
import React from 'react'
import Details from './Details'
import Proof from './Proof'

function Registration({ onSubmit }) {

  const [page, setPage] = React.useState(1)

  const nextPage = () => {
    setPage(page + 1)
  }

  const prevPage = () => {
    setPage(page - 1)
  }

  return (
    <div>
      {page === 1 && <Details onSubmit={() => nextPage()} />}
      {page === 2 && <Proof prevPage={() => prevPage()} onSubmit={() => onSubmit()} />}
    </div>
  )
}

Registration.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}

export default Registration

