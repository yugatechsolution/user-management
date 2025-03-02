import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Constants from "../utils/Constants";
import Contacts from "./Contacts";

export default function Dashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [selectedTab, setSelectedTab] = useState("Dashboard");

  useEffect(() => {
    const token = localStorage.getItem(Constants.TOKEN_PROPERTY);
    if (!token) {
      navigate("/");
    } else {
      setUsername(localStorage.getItem(Constants.USERNAME_PROPERTY) || "User");
      setEmail(
        localStorage.getItem(Constants.EMAIL_PROPERTY) || "user@example.com",
      );
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f4f4f4" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            backgroundColor: "#2c3e50",
            color: "white",
          },
        }}
      >
        <List>
          {[
            "Dashboard",
            "Analytics",
            "Chats",
            "Campaigns",
            "Customers",
            "Templates",
            "Chatbot",
            "Forms",
            "Manage",
            "Contacts",
          ].map((text) => (
            <ListItem
              button
              key={text}
              onClick={() => setSelectedTab(text)}
              sx={{ "&:hover": { backgroundColor: "#34495e" }, color: "white" }}
            >
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <AppBar
          position="static"
          sx={{ backgroundColor: "#1abc9c", color: "white" }}
        >
          <Toolbar>
            <IconButton edge="start" color="inherit">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Business Profile
            </Typography>
            <Typography variant="body1" sx={{ mr: 2 }}>
              {username} ({email})
            </Typography>
            <Button
              color="inherit"
              onClick={handleLogout}
              sx={{
                backgroundColor: "#e74c3c",
                color: "white",
                "&:hover": { backgroundColor: "#c0392b" },
              }}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>

        {/* Conditional Rendering */}
        {selectedTab === "Dashboard" ? (
          <Box
            sx={{
              mt: 3,
              p: 3,
              boxShadow: 2,
              borderRadius: 2,
              backgroundColor: "#fff",
            }}
          >
            <Typography variant="h5">Welcome, {username}!</Typography>
            <Typography variant="body1">
              Manage your business profile and settings here.
            </Typography>
          </Box>
        ) : selectedTab === "Contacts" ? (
          <Contacts />
        ) : (
          <Typography variant="h6" sx={{ mt: 3 }}>
            {selectedTab} - Coming Soon!
          </Typography>
        )}
      </Box>
    </Box>
  );
}
