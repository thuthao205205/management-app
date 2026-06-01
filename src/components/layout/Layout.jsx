import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div style={{
      width: "100%",
      minHeight: "100vh",
      display: "flex",
      background: "#f1f5f9",
    }}>
      <Sidebar />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          marginLeft: 240,
          minWidth: 0,
        }}
      >
        <Navbar />
        <div style={{
          padding: "20px",
          background: "#f1f5f9",
          flex: 1,
          minWidth: 0,
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}

