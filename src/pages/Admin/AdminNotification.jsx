// import { useState } from "react";
// import axios from "axios";
// import { BASE_URL } from "../../redux/constants";

// const AdminBroadcastNotification = () => {
//   const [title, setTitle] = useState("");
//   const [message, setMessage] = useState("");
//   const [isSending, setIsSending] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [showError, setShowError] = useState(false);

//   const handleSendNotification = async () => {
//     if (!title || !message) {
//       alert("Please provide both title and message");
//       return;
//     }
    
//     try {
//       setIsSending(true);
//       await axios.post(`${BASE_URL}/api/notification/send-to-all`, { title, message });
//       setShowSuccess(true);
//       setTitle("");
//       setMessage("");
//       setTimeout(() => setShowSuccess(false), 3000);
//     } catch (error) {
//       console.error("Failed to send notification", error);
//       setShowError(true);
//       setTimeout(() => setShowError(false), 3000);
//     } finally {
//       setIsSending(false);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-8 darktheme bg-opacity-80 rounded-lg shadow-lg border-2 border-gray-600">
//       <h2 className="text-2xl font-semibold mb-6 text-center text-customBlue">
//         Broadcast Notification to All Customers
//       </h2>

//       <div className="space-y-6">
//         <div className="flex flex-col space-y-2">
//           <label htmlFor="title" className="text-sm font-medium darklabel">
//             Notification Title
//           </label>
//           <input
//             type="text"
//             id="title"
//             placeholder="Enter notification title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             className="p-3 border-2 border-gray-700 darkthemeinput rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customBlue"
//           />
//         </div>

//         <div className="flex flex-col space-y-2">
//           <label htmlFor="message" className="text-sm font-medium darklabel">
//             Notification Message
//           </label>
//           <textarea
//             id="message"
//             placeholder="Enter notification message"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             rows={5}
//             className="p-3 border-2 border-gray-700 darkthemeinput rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customBlue resize-none"
//           />
//         </div>

//         {showSuccess && (
//           <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded">
//             <p className="font-semibold">Success!</p>
//             <p>Notification has been sent to all customers.</p>
//           </div>
//         )}

//         {showError && (
//           <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
//             <p className="font-semibold">Error!</p>
//             <p>Failed to send notification. Please try again.</p>
//           </div>
//         )}

//         <div className="flex justify-end mt-6">
//           <button
//             onClick={handleSendNotification}
//             disabled={isSending || !title || !message}
//             className="w-full p-3 bg-customBlue text-white rounded-md transition duration-300 hover:bg-customBlue/80 focus:outline-none focus:ring-2 focus:ring-customBlue disabled:bg-gray-400 disabled:cursor-not-allowed"
//           >
//             {isSending ? (
//               <span className="flex items-center justify-center">
//                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Sending...
//               </span>
//             ) : (
//               "Send to All Customers"
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminBroadcastNotification;

import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../redux/constants";

const AdminBroadcastNotification = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleSendNotification = async () => {
    if (!title || !message) {
      alert("Please provide both title and message");
      return;
    }
    
    try {
      setIsSending(true);
      await axios.post(`${BASE_URL}/api/notification/send-to-all`, { title, message });
      setShowSuccess(true);
      setTitle("");
      setMessage("");
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to send notification", error);
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto">
        {/* AdminMenu would go here */}
        <div className="w-full">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            {/* <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Broadcast Notification</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Send notifications to all your customers
              </p>
            </div> */}
            
            <div className="px-6 py-5">
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Notification Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    placeholder="Enter notification title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="p-2 border border-gray-300 dark:border-gray-600 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Notification Message
                  </label>
                  <textarea
                    id="message"
                    placeholder="Enter notification message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="p-2 border border-gray-300 dark:border-gray-600 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <button
                  onClick={handleSendNotification}
                  disabled={isSending || !title || !message}
                  className="w-full p-2 bg-blue-600 text-white rounded-md transition duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSending ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    "Send to All Customers"
                  )}
                </button>
              </div>
            </div>

            {(showSuccess || showError) && (
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900">
                {showSuccess && (
                  <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-3 rounded">
                    <p className="font-medium">Success!</p>
                    <p className="text-sm">Notification has been sent to all customers.</p>
                  </div>
                )}

                {showError && (
                  <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded">
                    <p className="font-medium">Error!</p>
                    <p className="text-sm">Failed to send notification. Please try again.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBroadcastNotification;