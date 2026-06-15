export default function AuthLayout({ children }) {
  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f5f6fa"
    }}>
      <div style={{
        width: "350px",
        padding: "30px",
        background: "white",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)"
      }}>
        
        {/* Logo + App Name */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <h2>Finance Manager</h2>
        </div>

        {children}
      </div>
    </div>
  );
}