import { useState } from "react";
import axios from "axios";
import Galaxy from "./Galaxy";

function Register({ goToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async () => {
    // simple check
    if (!name || !email || !password) {
      setError("Please fill in all fields");
      setSuccess("");
      return;
    }

    try {
      await axios.post("/api/register", {
        name,
        email,
        password,
      });

      setSuccess("Registered! You can now login.");
      setError("");
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong");
      }
      setSuccess("");
    }
  };

  return (
    <div className="form-container">
      <div className="galaxy-bg">
        <Galaxy transparent={false} />
      </div>
      <div className="form-box">
        <h2>Register</h2>

        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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

        <button onClick={handleRegister}>Register</button>

        <p className="switch-text">
          Already have an account?{" "}
          <span onClick={goToLogin} className="link">
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
