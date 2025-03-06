import Constants from "../utils/Constants";
import axios from "axios";

export const loadChats = async (phoneNumber, setChats) => {
    const token = localStorage.getItem(Constants.TOKEN_PROPERTY);
    console.log(token);
    console.log(phoneNumber);
    const url = process.env.REACT_APP_BACKEND_URL + process.env.REACT_APP_CHATS_URI + `/${phoneNumber}`;
    console.log(url);
    const response = await axios.get(url,
        {
            headers: { Authorization: `Bearer ${token}` },
        },
    );
    console.log(response);
    setChats(response.data)
    return response.data;
};