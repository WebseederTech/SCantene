import React from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const RegistrationSuccess = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <FaCheckCircle className="text-green-500 text-6xl mb-4" />
        <h1 className="text-2xl font-bold mb-2">Registration Successful!</h1>
        <p className="text-gray-600 mb-6">
          Your account has been registered successfully. Once approved by the admin, you will be able to log in.
        </p>
        <Link
          to="/login"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default RegistrationSuccess;
