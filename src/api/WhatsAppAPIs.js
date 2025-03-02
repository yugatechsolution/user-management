import axios from "axios";
import Constants from "../utils/Constants";

export const broadcastWhatsAppMessage = async (messageRequest, setLoading) => {
  try {
    console.log(messageRequest);
    setLoading(true);
    const token = localStorage.getItem(Constants.TOKEN_PROPERTY); // Adjust if needed

    const response = await axios.post(
      process.env.REACT_APP_BACKEND_URL + "/api/whatsapp/broadcast",
      messageRequest,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error broadcasting WhatsApp message", error);
    throw error;
  } finally {
    setLoading(false);
  }
};
