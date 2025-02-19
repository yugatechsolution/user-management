import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
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
            const response = await axios.get(process.env.REACT_APP_BACKEND_URL + "/api/contacts", {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log(`Contacts fetched: ${JSON.stringify(response.data)}`)
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
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {contacts.map((contact, index) => (
                            <TableRow key={index}>
                                <TableCell>{contact.name}</TableCell>
                                <TableCell>{contact.phoneNumber}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {loading && <p>Loading...</p>}
        </div>
    );
}
