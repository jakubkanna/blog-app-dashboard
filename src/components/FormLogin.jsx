import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSuccessLogin = (data) => {
    setToken(data.token);
    localStorage.setItem("token", data.token);
    navigate(-1);
  };
  const handleFailedLogin = (error) => {
    console.error("Authentication failed:", error);
    setToken(null);
    localStorage.removeItem("token");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestBody = {
      username: username,
      password: password,
    };

    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      handleSuccessLogin(data);
    } catch (error) {
      handleFailedLogin(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Login</button>
        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
