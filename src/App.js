import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "" });
  const [searchName, setSearchName] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    // Fetch users on component mount
    axios
      .get("http://localhost:3333/api/v1/users")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the users!", error);
      });
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
      <h1>User Management</h1>

      <div>
        <h2>Create User</h2>
        <input
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <button onClick={handleCreateUser}>Add User</button>
      </div>

      <div>
        <h2>Search User by Name</h2>
        <input
          type="name"
          placeholder="Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <button onClick={handleSearchUser}>Search</button>

        {searchResult && (
          <div>
            <h3>Search Result</h3>
            <p>Name: {searchResult.name}</p>
            <p>Email: {searchResult.email}</p>
          </div>
        )}
      </div>

      <div>
        <h2>Users List</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.name} - {user.email}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
