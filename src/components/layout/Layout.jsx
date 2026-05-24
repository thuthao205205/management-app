import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div style={{
      display: "flex",
      width: "100%",
      minHeight: "100vh"
    }}>  
      <Sidebar />
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column"
      }}>   
        <Navbar />
        <div style={{
          padding: "20px",
          background: "#f1f5f9",
          flex: 1
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}