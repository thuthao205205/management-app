import Layout from "../components/layout/Layout";

export default function Profile() {
  return (
    <Layout>
      <div>
        <h1 style={{ marginBottom: '24px', fontSize: '24px', color: '#1f2937' }}>👤 Hồ sơ</h1>
        <div style={{ 
          background: 'white', 
          padding: '32px', 
          borderRadius: '12px', 
          maxWidth: '500px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
<h3>Thông tin cá nhân</h3>
          <p><strong>Tên:</strong> Nguyễn Văn A</p>
          <p><strong>Email:</strong> user@example.com</p>
          <p><strong>Thành viên từ:</strong> 15/04/2024</p>
          <button style={{
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            marginTop: '20px'
          }}>
            ✏️ Cập nhật thông tin
          </button>
        </div>
      </div>
    </Layout>
  );
}

