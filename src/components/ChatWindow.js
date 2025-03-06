import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { loadChats } from "../api/ChatAPIs";
import { fetchContacts } from "../api/ContactsAPIs";
import {sendWhatsAppTextMessage} from "../api/WhatsAppAPIs";

export default function ChatWindow() {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [chats, setChats] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [loadingChats, setLoadingChats] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const fetchContactsData = async () => {
      setLoadingContacts(true);
      try {
        const contacts = await fetchContacts(setLoadingContacts, setContacts);
        console.log(contacts);
      } catch (error) {
        console.error("Error fetching contacts", error);
      } finally {
        setLoadingContacts(false);
      }
    };

    fetchContactsData();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  const handleSelectContact = async (contact) => {
    setSelectedContact(contact);
    setLoadingChats(true);
    try {
      const data = await loadChats(contact.phoneNumber, setChats);
      console.log("Chats=", data);
    } catch (error) {
      console.error("Error fetching chats", error);
    } finally {
      setLoadingChats(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const phoneNumber = selectedContact.phoneNumber;
      const msg = await sendWhatsAppTextMessage(
        phoneNumber,
        newMessage,
          setLoadingChats
      );
      console.log("Msg sent, response=", msg);
      loadChats(phoneNumber, setChats);
    } catch (error) {
      console.error("Error sending message", error);
    }
    setNewMessage("");
  };

  return (
    <Box
      display="flex"
      height="100vh"
      sx={{
        background: "linear-gradient(to bottom, #ece5dd, #d9fdd3)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Contacts List */}
      <Box
        width="30%"
        p={2}
        borderRight="1px solid #ddd"
        sx={{ background: "#fff", boxShadow: "2px 0px 5px rgba(0,0,0,0.1)" }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
          Chats
        </Typography>
        {loadingContacts ? (
          <CircularProgress size={24} />
        ) : (
          contacts.map((contact) => (
            <Button
              key={contact.phoneNumber}
              onClick={() => handleSelectContact(contact)}
              sx={{
                width: "100%",
                justifyContent: "flex-start",
                p: 1,
                borderRadius: "8px",
                textTransform: "none",
                color: "#333",
                background: "#f1f1f1",
                mb: 1,
                "&:hover": { background: "#ddd" },
              }}
            >
              {contact.name}
            </Button>
          ))
        )}
      </Box>

      {/* Chat Window */}
      <Box width="70%" p={2} display="flex" flexDirection="column">
        {selectedContact ? (
          <>
            <Box
              sx={{
                background: "#075E54",
                color: "#fff",
                p: 2,
                borderRadius: "8px",
                mb: 2,
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Chat with {selectedContact.name}
            </Box>

            {/* Chat Messages */}
            <Box
              flex={1}
              overflow="auto"
              borderRadius="8px"
              p={2}
              display="flex"
              flexDirection="column"
              sx={{
                background:
                  "url('https://www.transparenttextures.com/patterns/white-diamond.png')",
              }}
            >
              {loadingChats ? (
                <CircularProgress size={24} />
              ) : (
                chats.map((chat, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent:
                        chat["direction"] === "OUTGOING"
                          ? "flex-end"
                          : "flex-start",
                      mb: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        bgcolor:
                          chat["direction"] === "OUTGOING" ? "#dcf8c6" : "#fff",
                        color: "#000",
                        p: 1,
                        borderRadius: "18px",
                        boxShadow: "0px 1px 3px rgba(0,0,0,0.2)",
                        maxWidth: "60%",
                        fontSize: "0.9rem",
                      }}
                    >
                      {chat["message_body"]}
                    </Typography>
                  </Box>
                ))
              )}
              <div ref={chatEndRef} />
            </Box>

            {/* Message Input */}
            <Box
              display="flex"
              mt={2}
              sx={{
                background: "#fff",
                borderRadius: "8px",
                padding: "8px",
                boxShadow: "0px 1px 3px rgba(0,0,0,0.2)",
              }}
            >
              <TextField
                fullWidth
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "18px",
                  },
                }}
              />
              <Button
                onClick={handleSendMessage}
                sx={{
                  ml: 1,
                  bgcolor: "#25D366",
                  color: "#fff",
                  "&:hover": { bgcolor: "#1ebe57" },
                  borderRadius: "50%",
                  minWidth: "50px",
                  minHeight: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                }}
              >
                📩
              </Button>
            </Box>
          </>
        ) : (
          <Typography>Select a contact to start chatting</Typography>
        )}
      </Box>
    </Box>
  );
}
