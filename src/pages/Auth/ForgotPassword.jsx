import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useChangePasswordMutation,
} from "../../redux/api/usersApiSlice";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordUpdated, setIsPasswordUpdated] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const [forgotPassword] = useForgotPasswordMutation();
  const [verifyOtp] = useVerifyOtpMutation();
  const [changePassword] = useChangePasswordMutation();

  const handleSendCode = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await forgotPassword({ email }).unwrap();
      setStep(2);
    } catch (error) {
      console.error("Error sending code:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmCode = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await verifyOtp({ email, otp: code }).unwrap();
      setStep(3);
    } catch (error) {
      console.error("Error verifying code:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreatePassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match!");
      return;
    }
    setPasswordError("");
    setIsSubmitting(true);
    try {
      await changePassword({ email, newPassword: password, confirmPassword }).unwrap();
      setIsPasswordUpdated(true);
      setStep(4);
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Error updating password: " + (error.data?.message || "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleResendCode = async () => {
    setIsSubmitting(true);
    try {
      await forgotPassword({ email }).unwrap();
      alert("A new code has been sent to your email.");
    } catch (error) {
      console.error("Error resending code:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e, idx) => {
    const value = e.target.value;
    if (value.length > 1) return; // Ensure single-character input only
    const newCode = code.split(""); // Split the existing string into an array
    newCode[idx] = value || ""; // Update the specific index or set it to empty
    setCode(newCode.join("")); // Rejoin the array into a string
  };

  return (
    <div className="flex items-center justify-center darktheme">
      <section className="relative w-full max-w-2xl darktheme bg-opacity-50 rounded-lg shadow-lg p-8 border-2 border-gray-600">
        <div className="relative z-10">
          <h1 className="text-2xl font-semibold mb-6 text-center text-customBlue">
            Forgot Password
          </h1>

          {step === 1 && (
            <form onSubmit={handleSendCode} className="space-y-6">
              <div className="flex flex-col space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium darklabel"
                >
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

              <button
                type="submit"
                className={`w-full p-3 bg-customBlue text-white rounded-md mt-4 transition duration-300 hover:bg-customBlue/80 focus:outline-none focus:ring-2 focus:ring-customBlue disabled:bg-purple-300`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending Code..." : "Send Code"}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleConfirmCode} className="space-y-6">
              <div className="flex flex-col space-y-2">
                <label
                  htmlFor="code"
                  className="text-sm font-medium darklabel"
                >
                  Enter the 4-Digit Code
                </label>
                <div className="flex space-x-2">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <input
                      key={idx}
                      type="text"
                      maxLength="1"
                      className="w-12 h-12 text-center darkthemeinput border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-customBlue"
                      value={code[idx] || ""}
                      onChange={(e) => handleInputChange(e, idx)}
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className={`w-full p-3 bg-customBlue text-white rounded-md mt-4 transition duration-300 hover:bg-customBlue/80 focus:outline-none focus:ring-2 focus:ring-customBlue disabled:bg-purple-300`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Confirming Code..." : "Confirm"}
              </button>

              <div className="mt-4 text-center flex justify-center items-center space-x-2">
                <p className="text-sm text-gray-400">
                  Didn't get the code yet?
                </p>
                <button
                  type="button"
                  className="text-sm text-customBlue hover:underline"
                  onClick={handleResendCode}
                  disabled={isSubmitting}
                >
                  Resend Code
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleCreatePassword} className="space-y-6">
              <div className="flex flex-col space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium darklabel"
                >
                  New Password
                </label>
                <input
                  type="newPassword"
                  id="newPassword"
                  className="p-3 border border-gray-700 darklabel rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customBlue"
                  placeholder="Enter your new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium darklabel"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="p-3 border border-gray-700 darkthemeinput rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customBlue"
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              {passwordError && (
                <p className="text-red-500 text-sm mt-2">{passwordError}</p>
              )}

              <button
                type="submit"
                className={`w-full p-3 bg-customBlue text-white rounded-md mt-4 transition duration-300 hover:bg-customBlue/80 focus:outline-none focus:ring-2 focus:ring-customBlue disabled:bg-purple-300`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Password..." : "Create New Password"}
              </button>
            </form>
          )}

          {step === 4 && isPasswordUpdated && (
            <div className="text-center">
              <h2 className="text-2xl text-white font-semibold mb-4">
                Your Password Has Been Updated
              </h2>
              <p className="text-sm text-gray-400 mb-4">
                You can now sign in with your new password.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="w-full p-3 bg-customBlue text-white rounded-md mt-4 transition duration-300 hover:bg-customBlue/80 focus:outline-none focus:ring-2 focus:ring-customBlue"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ForgotPassword;
