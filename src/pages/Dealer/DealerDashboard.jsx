import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const SellerDashboard = () => {
  const { search } = useLocation();

  const sp = new URLSearchParams(search);

  const redirect = sp.get("redirect") || "/";

  return (
    <div>
      <h2 className=''>Currently Not Available </h2>
      <p className="text-sm text-gray-400">
        Login With Another account?{" "}
        <Link
          to={redirect ? `/login?redirect=${redirect}` : "/login"}
          className="text-customBlue hover:underline"
        >
          Login
        </Link>
      </p>
    </div>
  )
}

export default SellerDashboard