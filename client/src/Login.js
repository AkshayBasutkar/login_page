import { useState } from "react";
import axios from "axios";
import Galaxy from "./Galaxy";

function Login({ onLogin, goToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    // simple check
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const res = await axios.post("/api/login", {
        email,
        password,
      });

      // send token to App.js
      onLogin(res.data.token);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong");
      }
    }
  };

  return (
    <div className="form-container">
      <div className="galaxy-bg">
        <Galaxy transparent={false} />
      </div>
      <div className="form-box">
        <h2>Login</h2>

        {error && <p className="error-msg">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>

        <p className="switch-text">
          Don't have an account?{" "}
          <span onClick={goToRegister} className="link">
            Register here
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;