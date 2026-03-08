import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <>
        <section className='page notfound'>
          <div className="content">
            <img src="/app/notfound.png" alt="notfound" />
            <Link to={'/landing'}>RETURN TO HOME PAGE</Link>
          </div>
        </section>
    </>
  )
}

export default NotFound
