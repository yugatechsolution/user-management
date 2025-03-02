import Constants from "../utils/Constants";
import axios from "axios";

export const fetchContacts = async (setLoading, setContacts) => {
  setLoading(true);
  try {
    const token = localStorage.getItem(Constants.TOKEN_PROPERTY);
    const response = await axios.get(
      process.env.REACT_APP_BACKEND_URL + process.env.REACT_APP_CONTACTS_URI,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    setContacts(response.data);
  } catch (error) {
    console.error("Error fetching contacts", error);
  } finally {
    setLoading(false);
  }
};

export const handleFileChange = (
  event,
  setSelectedFile,
  setPreviewContacts,
) => {
  const file = event.target.files[0];
  setSelectedFile(file);

  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const rows = text.split("\n").slice(1);
      const preview = rows
        .map((row) => {
          const [name, phoneNumber] = row.split(",");
          return { name, phoneNumber };
        })
        .filter((contact) => contact.name && contact.phoneNumber);
      setPreviewContacts(preview);
    };
    reader.readAsText(file);
  }
};

export const handleFileUpload = async (
  selectedFile,
  setSelectedFile,
  setPreviewContacts,
  setLoading,
  setContacts,
) => {
  if (!selectedFile) return;

  const formData = new FormData();
  formData.append("file", selectedFile);

  try {
    const token = localStorage.getItem(Constants.TOKEN_PROPERTY);
    const response = await axios.post(
      process.env.REACT_APP_BACKEND_URL +
        process.env.REACT_APP_CONTACTS_BULK_UPLOAD_URI,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      },
    );
    console.log(response.data);
    const successful = response.data.savedContacts.length;
    const failed = response.data.errors.length;
    alert(
      `Successfully saved ${successful} contacts and failed to save ${failed} contacts.`,
    );
    fetchContacts(setLoading, setContacts);
    setSelectedFile(null);
    setPreviewContacts([]);
  } catch (error) {
    console.error("Error uploading file", error);
  }
};

export const handleEdit = (contact, setEditingContact, setEditedName) => {
  setEditingContact(contact.phoneNumber);
  setEditedName(contact.name);
};

export const handleSaveEdit = async (
  editingContact,
  editedName,
  setEditingContact,
  setLoading,
  setContacts,
) => {
  try {
    const token = localStorage.getItem(Constants.TOKEN_PROPERTY);
    await axios.put(
      process.env.REACT_APP_BACKEND_URL + process.env.REACT_APP_CONTACTS_URI,
      null,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { phoneNumber: editingContact, name: editedName },
      },
    );
    fetchContacts(setLoading, setContacts);
    setEditingContact(null);
  } catch (error) {
    console.error("Error updating contact", error);
  }
};

export const handleAddContact = async (
  newName,
  newContactId,
  setNewName,
  setNewContactId,
  setLoading,
  setContacts,
) => {
  try {
    const token = localStorage.getItem(Constants.TOKEN_PROPERTY);
    await axios.post(
      process.env.REACT_APP_BACKEND_URL + process.env.REACT_APP_CONTACTS_URI,
      {
        name: newName,
        phoneNumber: newContactId,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    setNewName("");
    setNewContactId("");
    fetchContacts(setLoading, setContacts);
  } catch (error) {
    console.error("Error adding contact", error);
  }
};

export const handleDelete = async (contactId, setLoading, setContacts) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this contact?",
  );
  if (!confirmDelete) return;

  try {
    const token = localStorage.getItem(Constants.TOKEN_PROPERTY);
    await axios.delete(
      process.env.REACT_APP_BACKEND_URL + process.env.REACT_APP_CONTACTS_URI,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { phoneNumber: contactId },
      },
    );
    fetchContacts(setLoading, setContacts);
  } catch (error) {
    console.error("Error deleting contact", error);
  }
};
