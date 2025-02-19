import { useEffect, useState } from "react";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import axios from "axios";
import Constants from "../utils/Constants";

export default function Contacts() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem(Constants.TOKEN_PROPERTY);
            const response = await axios.get(process.env.REACT_APP_BACKEND_URL + process.env.REACT_APP_CONTACTS_URI, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setContacts(response.data);
        } catch (error) {
            console.error("Error fetching contacts", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const token = localStorage.getItem(Constants.TOKEN_PROPERTY);
            const response = await axios.post(process.env.REACT_APP_BACKEND_URL +process.env.REACT_APP_CONTACTS_BULK_UPLOAD_URI, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log(response.data)
            const successful = response.data.savedContacts.length;
            const failed = response.data.errors.length;
            alert(`Successfully saved ${successful} contacts and failed to save ${failed} contacts.`);
            fetchContacts();
        } catch (error) {
            console.error("Error uploading file", error);
        }
    };

    const handleDelete = async (contactId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this contact?");
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem(Constants.TOKEN_PROPERTY);
            await axios.delete(process.env.REACT_APP_BACKEND_URL + process.env.REACT_APP_CONTACTS_URI, {
                headers: { Authorization: `Bearer ${token}` },
                params: { phoneNumber: contactId }
            });
            fetchContacts();
        } catch (error) {
            console.error("Error deleting contact", error);
        }
    };

    return (
        <div>
            <h2>Contacts</h2>
            <input type="file" accept=".csv" onChange={handleFileUpload} />
            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Phone Number</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {contacts.map((contact, index) => (
                            <TableRow key={index}>
                                <TableCell>{contact.name}</TableCell>
                                <TableCell>{contact.phoneNumber}</TableCell>
                                <TableCell>
                                    <Button color="error" onClick={() => handleDelete(contact.phoneNumber)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {loading && <p>Loading...</p>}
        </div>
    );
}
