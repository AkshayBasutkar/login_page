import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import Home from "./Home";
import "./App.css";

function App() {
  // page can be: "login", "register", "home"
  const [page, setPage] = useState("login");
  const [token, setToken] = useState("");

  // called after successful login
  const handleLogin = (userToken) => {
    setToken(userToken);
    setPage("home");
  };

  // called when user clicks logout
  const handleLogout = () => {
    setToken("");
    setPage("login");
  };

  // switch between login and register pages
  const goToRegister = () => setPage("register");
  const goToLogin = () => setPage("login");

  return (
    <div className="app">
      {page === "login" && (
        <Login onLogin={handleLogin} goToRegister={goToRegister} />
      )}

      {page === "register" && (
        <Register goToLogin={goToLogin} />
      )}

      {page === "home" && (
        <Home token={token} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;