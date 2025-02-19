import { useEffect, useState } from "react";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography } from "@mui/material";
import axios from "axios";
import Constants from "../utils/Constants";

export default function Contacts() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewContacts, setPreviewContacts] = useState([]);

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

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target.result;
                const rows = text.split("\n").slice(1);
                const preview = rows.map(row => {
                    const [name, phoneNumber] = row.split(",");
                    return { name, phoneNumber };
                }).filter(contact => contact.name && contact.phoneNumber);
                setPreviewContacts(preview);
            };
            reader.readAsText(file);
        }
    };

    const handleFileUpload = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const token = localStorage.getItem(Constants.TOKEN_PROPERTY);
            const response = await axios.post(process.env.REACT_APP_BACKEND_URL + process.env.REACT_APP_CONTACTS_BULK_UPLOAD_URI, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log(response.data);
            const successful = response.data.savedContacts.length;
            const failed = response.data.errors.length;
            alert(`Successfully saved ${successful} contacts and failed to save ${failed} contacts.`);
            fetchContacts();
            setSelectedFile(null);
            setPreviewContacts([]);
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

    const handleDownloadSample = () => {
        const csvContent = "data:text/csv;charset=utf-8,Name,Phone Number\nJohn Doe,1234567890\nJane Doe,0987654321";
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "sample_contacts.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <h2>Contacts</h2>
                <Box display="flex" alignItems="center" gap={2}>
                    <Button variant="contained" sx={{ backgroundColor: "#0288d1", color: "white" }} onClick={handleDownloadSample}>
                        Download Sample File
                    </Button>
                    <Button
                        variant="contained"
                        component="label"
                        sx={{ backgroundColor: "#43a047", color: "white" }}
                    >
                        Choose File
                        <input type="file" accept=".csv" hidden onChange={handleFileChange} />
                    </Button>
                    {selectedFile && <span>{selectedFile.name}</span>}
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: "#d32f2f", color: "white" }}
                        onClick={handleFileUpload}
                        disabled={!selectedFile}
                    >
                        Upload Contacts
                    </Button>
                </Box>
            </Box>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table size="small">
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
            {previewContacts.length > 0 && (
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", mt: 2 }}>
                    New contacts that would be added as part of bulk uploading the file '{selectedFile?.name}':
                </Typography>
            )}
            <TableContainer component={Paper} sx={{ mt: 1 }}>
                <Table size="small">
                    <TableBody>
                        {previewContacts.map((contact, index) => (
                            <TableRow key={`preview-${index}`} sx={{ backgroundColor: "#e3f2fd" }}>
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