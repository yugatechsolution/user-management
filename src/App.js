import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import LoginPage from "./LoginPage";

const App = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "" });
  const [searchName, setSearchName] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    // Fetch users on component mount
    
  }, []);

  // Handle creating a new user
  const handleCreateUser = () => {
    axios
      .post("http://localhost:3333/api/v1/users", newUser)
      .then((response) => {
        setUsers([...users, response.data]);
        setNewUser({ name: "", email: "" });
      })
      .catch((error) => {
        console.error("There was an error creating the user!", error);
      });
  };

  // Handle searching for a user by name
  const handleSearchUser = () => {
    axios
      .get(`http://localhost:3333/api/v1/users/${searchName}`)
      .then((response) => {
        setSearchResult(response.data);
      })
      .catch((error) => {
        console.error("There was an error searching for the user!", error);
      });
  };

  return (
    <div className="App">
      <LoginPage />
    </div>
  );
};

export default App;
