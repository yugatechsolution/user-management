import axios from "axios";
import Constants from "../utils/Constants";

export const sendWhatsAppTextMessage = async (phoneNumber, message) => {
  const messageRequest = {
    phoneNumbers: [phoneNumber],
    requestType: "TEXT",
    textMessageRequest: {
      textBody: message
    }
  }
  try {
    console.log(messageRequest);
    const token = localStorage.getItem(Constants.TOKEN_PROPERTY); // Adjust if needed

    const response = await axios.post(
      process.env.REACT_APP_BACKEND_URL + "/api/whatsapp/message",
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
    console.log("WhatsApp message finished");
  }
};
