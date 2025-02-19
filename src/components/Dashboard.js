import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, Box, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Constants from "../utils/Constants";

export default function Dashboard() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem(Constants.TOKEN_PROPERTY);
        if (!token) {
            navigate("/");
        } else {
            setUsername(localStorage.getItem(Constants.USERNAME_PROPERTY) || "User");
            setEmail(localStorage.getItem(Constants.EMAIL_PROPERTY) || "user@example.com");
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <Box sx={{ display: "flex" }}>
            {/* Sidebar */}
            <Drawer variant="permanent" anchor="left" sx={{ width: 240, flexShrink: 0 }}>
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
                    ].map((text, index) => (
                        <ListItem button key={index}>
                            <ListItemText primary={text} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>

            {/* Main Content */}
            <Box sx={{ flexGrow: 1, p: 3 }}>
                <AppBar position="static" sx={{ backgroundColor: "#fff", color: "#000" }}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(!drawerOpen)}>
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            Business Profile
                        </Typography>
                        <Typography variant="body1" sx={{ mr: 2 }}>
                            {username} ({email})
                        </Typography>
                        <Button color="inherit" onClick={handleLogout}>
                            Logout
                        </Button>
                    </Toolbar>
                </AppBar>

                <Box sx={{ mt: 3, p: 3, boxShadow: 2, borderRadius: 2, backgroundColor: "#fff" }}>
                    <Typography variant="h5">Welcome, {username}!</Typography>
                    <Typography variant="body1">Manage your business profile and settings here.</Typography>
                </Box>
            </Box>
        </Box>
    );
}
