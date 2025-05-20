// frontend/src/NotificationPermission.js
import { messaging, getToken } from "./firebase-config";
import axios from "axios";
import { BASE_URL } from "./redux/constants";

const requestNotificationPermission = async () => {
  const userInfo = JSON.parse(localStorage.getItem("userData"));
  const userId = userInfo.user._id;
  console.log("i am rendering.........")
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey:
          "BEjsW1fuZUFYzlgZ6TPzYr3EBPvKGmqkXRgvhbHgBGfFrJ6cCDatluhSyBbNTvK4_t55JpW9x7k78NecMrH796M",
      });

      console.log("FCM Token:", token);

      // Send only the token to backend, no userId
      await axios.post(`${BASE_URL}/api/users/save-token`, {
        userId,
        token
      });

      console.log("Token saved to backend successfully!");
      return token; // Return token to store in localStorage
    } else {
      console.warn("Notification permission denied");
      return null;
    }
  } catch (error) {
    console.error("Error requesting permission:", error);
    return null;
  }
};

export default requestNotificationPermission;
