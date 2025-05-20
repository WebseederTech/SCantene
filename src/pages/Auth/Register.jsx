import { setCredentials } from "../../redux/features/auth/authSlice";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { useRegisterMutation } from "../../redux/api/usersApiSlice";
import { toast } from "react-toastify";

const Register = () => {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [shopName, setShopName] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate("/registration-success");
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await register({
          username,
          email,
          password,
          contactNo,

          referralCode,
          shopName,
          addresses: [
            {
              address,
              city,
              postalCode,
              country,
            },
          ],
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("User registered successfully! Pending admin approval.");
        navigate("/registration-success");
      } catch (err) {
        console.log(err);
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center darktheme mt-8 mb-4">
      <section className="relative w-full max-w-2xl darktheme bg-opacity-50 rounded-lg shadow-lg p-8 border-2 border-gray-600">
        <div className="relative z-10">
          <h1 className="text-2xl font-semibold mb-6 text-center text-customBlue">
            Create an Account
          </h1>
          <form onSubmit={submitHandler} className="space-y-6">
            <div className="flex space-x-6">
              <div className="flex-1">
                <label htmlFor="name" className="text-sm font-medium darklabel">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="p-3 border border-gray-700 darkthemeinput rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customBlue"
                  placeholder="Enter your name"
                  value={username}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label htmlFor="shopName" className="text-sm font-medium darklabel">
                  Shop Name
                </label>
                <input
                  type="text"
                  id="shopName"
                  className="p-3 border border-gray-700 darkthemeinput rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customBlue"
                  placeholder="Enter your shop name"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                />
              </div>
            </div>

            <div className="flex space-x-6">
              <div className="flex-1">
                <label htmlFor="email" className="text-sm font-medium darklabel">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="p-3 border border-gray-700 darkthemeinput rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customBlue"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="flex-1">
                <label htmlFor="contactNo" className="text-sm font-medium darklabel">
                  Contact Number
                </label>
                <input
                  type="text"
                  id="contactNo"
                  className="p-3 border border-gray-700 darkthemeinput rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customBlue"
                  placeholder="Enter your contact number"
                  value={contactNo}
                  onChange={(e) => setContactNo(e.target.value)}
                />
              </div>
            </div>

            <div className="flex space-x-6">
              <div className="flex-1">
                <label htmlFor="referralCode" className="text-sm font-medium darklabel">
                  Referral Code
                </label>
                <input
                  type="text"
                  id="referralCode"
                  className="p-3 border border-gray-700 darkthemeinput rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customBlue"
                  placeholder="Enter referral code"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                />
              </div>

              <div className="flex-1">
                <label htmlFor="address" className="text-sm font-medium darklabel">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  className="p-3 border border-gray-700 darkthemeinput rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customBlue"
                  placeholder="Enter your address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>

            <div className="flex space-x-6">
              <div className="flex-1">
                <label htmlFor="city" className="text-sm font-medium darklabel">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  className="p-3 border border-gray-700 darkthemeinput rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customBlue"
                  placeholder="Enter your city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              <div className="flex-1">
                <label htmlFor="postalCode" className="text-sm font-medium darklabel">
                  Postal Code
                </label>
                <input
                  type="text"
                  id="postalCode"
                  className="p-3 border border-gray-700 darkthemeinput rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customBlue"
                  placeholder="Enter your postal code"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>
            </div>

            <div className="flex space-x-6">
              <div className="flex-1">
                <label htmlFor="country" className="text-sm font-medium darklabel">
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  className="p-3 border border-gray-700 darkthemeinput rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customBlue"
                  placeholder="Enter your country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>

              <div className="flex-1">
                <label htmlFor="password" className="text-sm font-medium darklabel">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="p-3 border border-gray-700 darkthemeinput rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customBlue"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex space-x-6">
              <div className="flex-1">
                <label htmlFor="confirmPassword" className="text-sm font-medium darklabel">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="p-3 border border-gray-700 darkthemeinput rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customBlue"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div className="flex-1"></div>
            </div>

            <button
              type="submit"
              className="w-full p-3 bg-customBlue text-white rounded-md mt-4 transition duration-300 hover:bg-customBlue/80 focus:outline-none focus:ring-2 focus:ring-customBlue disabled:bg-purple-300"
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Register"}
            </button>

            {isLoading && <Loader />}
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <Link
                to={redirect ? `/login?redirect=${redirect}` : "/login"}
                className="text-customBlue hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Register;