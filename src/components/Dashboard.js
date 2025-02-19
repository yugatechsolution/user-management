import { useState } from "react";
import { Box, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemText, IconButton, Avatar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";

const menuItems = ["Dashboard", "Analytics", "Chats", "Campaigns", "Customers", "Templates", "Chatbot", "Forms", "Manage"];

export default function Dashboard() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const user = { name: "Varsha Sharma", email: "varsha@toptier.com" };

    return (
        <Box sx={{ display: "flex" }}>
            <AppBar position="fixed">
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                    <IconButton color="inherit" edge="start" onClick={() => setOpen(true)}>
                        <MenuIcon />
                    </IconButton>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography variant="body1" sx={{ mr: 2 }}>{user.name}</Typography>
                        <Avatar>{user.name.charAt(0)}</Avatar>
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer open={open} onClose={() => setOpen(false)} variant="temporary">
                <List>
                    {menuItems.map((text) => (
                        <ListItem button key={text} onClick={() => navigate(`/${text.toLowerCase()}`)}>
                            <ListItemText primary={text} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
                <Typography variant="h4">Welcome to your Dashboard</Typography>
            </Box>
        </Box>
    );
}
