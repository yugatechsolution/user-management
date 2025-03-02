import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Constants from "../utils/Constants";

export default function AuthPage() {
  const [tab, setTab] = useState(0);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(Constants.TOKEN_PROPERTY);
    if (token) navigate("/dashboard");
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || (tab === 1 && password !== confirmPassword)) {
      setError(
        tab === 1 && password !== confirmPassword
          ? "Passwords do not match"
          : "All fields are required",
      );
      return;
    }
    setError("");
    setLoading(true);
    try {
      const handleLoginData = (data) => {
        localStorage.setItem(Constants.TOKEN_PROPERTY, data.token);
        localStorage.setItem(Constants.USERNAME_PROPERTY, data.username);
        localStorage.setItem(Constants.EMAIL_PROPERTY, data.email);
        console.log("Local cache stored. Navigating to /dashboard");
        navigate("/dashboard");
      };
      if (tab === 0) {
        const { data } = await axios.post(
          Constants.BACKEND_URL + Constants.AUTH_LOGIN_URI,
          null,
          { params: { id: email, password } },
        );
        handleLoginData(data);
      } else {
        const { data } = await axios.post(
          Constants.BACKEND_URL + Constants.AUTH_REGISTER_URI,
          {
            username,
            email,
            password,
          },
        );
        handleLoginData(data);
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Operation failed: " + error.response?.status,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 8,
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} centered>
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>
        {error && <Alert severity="error">{error}</Alert>}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ width: "100%", mt: 2 }}
        >
          {tab === 0 ? (
            <TextField
              fullWidth
              label="Username or Email"
              variant="outlined"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          ) : (
            <>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                fullWidth
                label="Username"
                variant="outlined"
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </>
          )}
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {tab === 1 && (
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              variant="outlined"
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading
              ? tab === 0
                ? "Logging in..."
                : "Registering..."
              : tab === 0
                ? "Login"
                : "Register"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
