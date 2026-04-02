import { useState, useEffect } from "react";
import axios from "axios";

function Home({ token, onLogout }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState(false);

  // load profile when page opens
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await axios.get("/api/profile", {
        headers: { authorization: token },
      });

      setName(res.data.name || "");
      setEmail(res.data.email || "");
      setPhone(res.data.phone || "");
    } catch (err) {
      console.log("Error loading profile");
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(
        "/api/profile",
        { name, phone },
        { headers: { authorization: token } }
      );

      setMessage("Profile updated!");
      setEditing(false);

      // clear message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Error updating profile");
    }
  };

  return (
    <div className="home-container">
      {/* top bar */}
      <div className="topbar">
        <h2>Welcome, {name || "User"}!</h2>
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>

      {/* profile card */}
      <div className="profile-card">
        <h3>My Profile</h3>

        {message && <p className="success-msg">{message}</p>}

        <div className="profile-field">
          <label>Name</label>
          {editing ? (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          ) : (
            <p>{name || "Not set"}</p>
          )}
        </div>

        <div className="profile-field">
          <label>Email</label>
          <p>{email}</p>
        </div>

        <div className="profile-field">
          <label>Phone</label>
          {editing ? (
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          ) : (
            <p>{phone || "Not set"}</p>
          )}
        </div>

        {editing ? (
          <div className="button-group">
            <button onClick={handleSave}>Save</button>
            <button className="cancel-btn" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </div>
        ) : (
          <button onClick={() => setEditing(true)}>Edit Profile</button>
        )}
      </div>
    </div>
  );
}

export default Home;
