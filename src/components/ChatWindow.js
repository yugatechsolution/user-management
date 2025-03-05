import { useEffect, useState } from "react";
import { Box, Button, CircularProgress, TextField, Typography } from "@mui/material";
import { getChats, sendMessage } from "../api/ChatAPIs";
import {fetchContacts} from "../api/ContactsAPIs";

export default function ChatWindow() {
    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [chats, setChats] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loadingContacts, setLoadingContacts] = useState(false);
    const [loadingChats, setLoadingChats] = useState(false);

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

    const handleSelectContact = async (contact) => {
        setSelectedContact(contact);
        setLoadingChats(true);
        try {
            const data = await getChats(contact['phone_number']);
            console.log("Chats=", data);
            setChats(data);
        } catch (error) {
            console.error("Error fetching chats", error);
        } finally {
            setLoadingChats(false);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;
        try {
            const msg = await sendMessage(selectedContact['phone_number'], newMessage);
            setChats([...chats, msg]);
        } catch (error) {
            console.error("Error sending message", error);
        }
        setNewMessage("");
    };

    return (
        <Box display="flex" height="100vh" border="1px solid #ddd">
            {/* Contacts List */}
            <Box width="30%" p={2} borderRight="1px solid #ddd">
                <Typography variant="h6">Chats</Typography>
                {loadingContacts ? (
                    <CircularProgress size={24} />
                ) : (
                    contacts.map((contact) => (
                        <Button key={contact['phone_number']} onClick={() => handleSelectContact(contact)}>
                            {contact.name}
                        </Button>
                    ))
                )}
            </Box>

            {/* Chat Window */}
            <Box width="70%" p={2} display="flex" flexDirection="column">
                {selectedContact ? (
                    <>
                        <Typography variant="h6">Chat with {selectedContact.name}</Typography>
                        {loadingChats ? (
                            <CircularProgress size={24} />
                        ) : (
                            <Box flex={1} overflow="auto" border="1px solid #ddd" p={2}>
                                {chats.map((chat, index) => (
                                    <Typography key={index}>{chat['message_body']}</Typography>
                                ))}
                            </Box>
                        )}
                        <Box display="flex" mt={2}>
                            <TextField
                                fullWidth
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                            />
                            <Button onClick={handleSendMessage}>Send</Button>
                        </Box>
                    </>
                ) : (
                    <Typography>Select a contact to start chatting</Typography>
                )}
            </Box>
        </Box>
    );
}