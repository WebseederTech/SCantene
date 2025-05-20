// import { useState, useEffect } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import Loader from "../../components/Loader";
// import { useLoginMutation } from "../../redux/api/usersApiSlice";
// import { setCredentials } from "../../redux/features/auth/authSlice";
// import { toast } from "react-toastify";

// const Login = () => {
//   const [identifier, setIdentifier] = useState(""); // Email or contact number
//   const [password, setPassword] = useState("");

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [login, { isLoading }] = useLoginMutation();

//   const { userInfo } = useSelector((state) => state.auth);

//   const { search } = useLocation();
//   const sp = new URLSearchParams(search);
//   const redirect = sp.get("redirect") || "/";

//   // Remove automatic redirect based on userInfo
//   // This might conflict with our manual navigation

//   const submitHandler = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await login(
//         { identifier, password },
//         { withCredentials: true }
//       ).unwrap();

//       dispatch(setCredentials({ ...res }));
//       localStorage.setItem("userData", JSON.stringify(res));
//       toast.success("Login successful!");

//       // Force navigation with a slight delay to ensure state updates complete
//       setTimeout(() => {
//         console.log("Navigating to admin dashboard");
//         navigate("/admin/dashboard", { replace: true });
//       }, 100);
//     } catch (err) {
//       toast.error(err?.data?.message || err.error);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center darktheme">
//       <section className="relative w-full max-w-2xl darktheme bg-opacity-50 rounded-lg shadow-lg p-8 border-2 border-gray-600">
//         <div className="relative z-10">
//           <h1 className="text-2xl font-semibold mb-6 text-center text-customBlue">
//             Sign In
//           </h1>

//           <form onSubmit={submitHandler} className="space-y-6">
//             <div className="flex flex-col space-y-2">
//               <label
//                 htmlFor="identifier"
//                 className="text-sm font-medium darklabel"
//               >
//                 Email Address or Contact Number
//               </label>
//               <input
//                 type="text"
//                 id="identifier"
//                 className="p-3 border border-gray-700 darkthemeinput rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customBlue"
//                 placeholder="Enter your email or contact number"
//                 value={identifier}
//                 onChange={(e) => setIdentifier(e.target.value)}
//               />
//             </div>

//             <div className="flex flex-col space-y-2">
//               <label
//                 htmlFor="password"
//                 className="text-sm font-medium darklabel"
//               >
//                 Password
//               </label>
//               <input
//                 type="password"
//                 id="password"
//                 className="p-3 border border-gray-700 darkthemeinput rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customBlue"
//                 placeholder="Enter your password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </div>

//             <button
//               type="submit"
//               className="w-full p-3 bg-customBlue text-white rounded-md mt-4 transition duration-300 hover:bg-customBlue/80 focus:outline-none focus:ring-2 focus:ring-customBlue disabled:bg-blue-300"
//               disabled={isLoading}
//             >
//               {isLoading ? "Processing..." : "Sign In"}
//             </button>

//             {isLoading && <Loader />}
//           </form>

//           <div className="mt-4 text-center">
//             <p className="text-sm text-gray-400">
//               New Customer?{" "}
//               <Link
//                 to={redirect ? `/register?redirect=${redirect}` : "/register"}
//                 className="text-customBlue hover:underline"
//               >
//                 Register
//               </Link>
//             </p>
//             <p className="text-sm text-gray-400 mt-2">
//               Forgot Password?{" "}
//               <Link
//                 to="/forgot-password"
//                 className="text-customBlue hover:underline"
//               >
//                 Reset it here
//               </Link>
//             </p>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Login;


import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { useLoginMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ identifier, password }, { withCredentials: true }).unwrap();
      dispatch(setCredentials({ ...res }));
      localStorage.setItem("userData", JSON.stringify(res));
      toast.success("Login successful!");
      setTimeout(() => {
        navigate("/admin/dashboard", { replace: true });
      }, 100);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 darktheme">
      <section className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl bg-opacity-50 rounded-lg shadow-lg p-6 sm:p-8 md:p-10 border-2 border-gray-600 darktheme transition-all duration-300">
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-center text-customBlue">
            Welcome Back
          </h1>

          <form onSubmit={submitHandler} className="space-y-6">
            <div className="flex flex-col space-y-2">
              <label htmlFor="identifier" className="text-sm font-medium darklabel">
                Email Address or Contact Number
              </label>
              <input
                type="text"
                id="identifier"
                className="p-3 border border-gray-700 darkthemeinput rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customBlue transition-all duration-200"
                placeholder="Enter your email or contact number"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="password" className="text-sm font-medium darklabel">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="p-3 border border-gray-700 darkthemeinput rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customBlue transition-all duration-200"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {!isLoading ? (
              <button
                type="submit"
                className="w-full p-3 bg-customBlue text-white rounded-md font-medium transition duration-300 hover:bg-customBlue/80 focus:outline-none focus:ring-2 focus:ring-customBlue shadow-md hover:shadow-lg"
              >
                Sign In
              </button>
            ) : (
              <div className="flex justify-center">
                <Loader />
              </div>
            )}

          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              New Customer?{" "}
              <Link
                to={redirect ? `/register?redirect=${redirect}` : "/register"}
                className="text-customBlue hover:underline font-medium"
              >
                Register
              </Link>
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Forgot Password?{" "}
              <Link to="/forgot-password" className="text-customBlue hover:underline font-medium">
                Reset it here
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;