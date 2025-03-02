import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  fetchContacts,
  handleAddContact,
  handleDelete,
  handleEdit,
  handleFileChange,
  handleFileUpload,
  handleSaveEdit,
} from "../api/ContactsAPIs";

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewContacts, setPreviewContacts] = useState([]);
  const [editingContact, setEditingContact] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [newContactName, setNewContactName] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");

  useEffect(() => {
    fetchContacts(setLoading, setContacts);
  }, []);

  const handleDownloadSample = () => {
    const csvContent =
      "data:text/csv;charset=utf-8,Name,Phone Number\nJohn Doe,1234567890\nJane Doe,0987654321";
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
        <h2>List of all your CONTACTS</h2>
        <Box display="flex" alignItems="center" gap={2}>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#0288d1", color: "white" }}
            onClick={handleDownloadSample}
          >
            Download Sample File
          </Button>
          <Button
            variant="contained"
            component="label"
            sx={{ backgroundColor: "#43a047", color: "white" }}
          >
            Choose File
            <input
              type="file"
              accept=".csv"
              hidden
              onChange={(event) =>
                handleFileChange(event, setSelectedFile, setPreviewContacts)
              }
            />
          </Button>
          {selectedFile && <span>{selectedFile.name}</span>}
          <Button
            variant="contained"
            sx={{ backgroundColor: "#d32f2f", color: "white" }}
            onClick={() =>
              handleFileUpload(
                selectedFile,
                setSelectedFile,
                setPreviewContacts,
                setLoading,
                setContacts,
              )
            }
            disabled={!selectedFile}
          >
            Upload Contacts
          </Button>
        </Box>
      </Box>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#0288d1" }}>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                Name
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                Phone Number
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", color: "white" }}
                align="center"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact.phoneNumber}>
                <TableCell>
                  {editingContact === contact.phoneNumber ? (
                    <TextField
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      size="small"
                    />
                  ) : (
                    contact.name
                  )}
                </TableCell>
                <TableCell>{contact.phoneNumber}</TableCell>
                <TableCell align="center">
                  {editingContact === contact.phoneNumber ? (
                    <Button
                      color="primary"
                      onClick={() =>
                        handleSaveEdit(
                          editingContact,
                          editedName,
                          setEditingContact,
                          setLoading,
                          setContacts,
                        )
                      }
                    >
                      Save
                    </Button>
                  ) : (
                    <Button
                      color="primary"
                      onClick={() =>
                        handleEdit(contact, setEditingContact, setEditedName)
                      }
                    >
                      Edit
                    </Button>
                  )}
                  <Button
                    color="error"
                    onClick={() =>
                      handleDelete(contact.phoneNumber, setLoading, setContacts)
                    }
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell>
                <TextField
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  size="small"
                  placeholder="Enter name"
                />
              </TableCell>
              <TableCell>
                <TextField
                  value={newContactPhone}
                  onChange={(e) => setNewContactPhone(e.target.value)}
                  size="small"
                  placeholder="Enter phone number"
                />
              </TableCell>
              <TableCell align="center">
                <Button
                  color="success"
                  onClick={() =>
                    handleAddContact(
                      newContactName,
                      newContactPhone,
                      setNewContactName,
                      setNewContactPhone,
                      setLoading,
                      setContacts,
                    )
                  }
                >
                  ADD NEW CONTACT
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      {previewContacts.length > 0 && (
        <Typography variant="subtitle2" sx={{ fontWeight: "bold", mt: 2 }}>
          New contacts that would be added as part of bulk uploading the file '
          {selectedFile?.name}':
        </Typography>
      )}
      <TableContainer component={Paper} sx={{ mt: 1 }}>
        <Table size="small">
          <TableBody>
            {previewContacts.map((contact, index) => (
              <TableRow
                key={`preview-${index}`}
                sx={{ backgroundColor: "#e3f2fd" }}
              >
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
