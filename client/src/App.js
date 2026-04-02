import GalaxyBackground from "./components/GalaxyBackground";

function App() {
  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <GalaxyBackground />

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
        }}
      >
        <h1>Login Page</h1>
      </div>
    </div>
  );
}

export default App;