import Layout from "../components/layout/Layout";

export default function Budget() {
  return (
    <Layout>
      <div>
        <h1 style={{ marginBottom: '24px', fontSize: '24px', color: '#1f2937' }}>💳 Ngân sách</h1>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ 
            background: 'white', 
            padding: '24px', 
            borderRadius: '12px', 
            flex: 1, 
            minWidth: '300px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3>Ngân sách tháng</h3>
            <div style={{ 
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', 
              color: 'white', 
              padding: '20px', 
              borderRadius: '8px', 
              textAlign: 'center',
              fontSize: '24px',
              fontWeight: 'bold'
            }}>
              10,000,000đ
            </div>
            <div style={{ 
              height: '12px', 
              background: '#e5e7eb', 
              borderRadius: '6px', 
              marginTop: '16px',
              overflow: 'hidden'
            }}>
              <div style={{ 
                width: '65%', 
                height: '100%', 
                background: '#10b981' 
              }}></div>
            </div>
            <p style={{ marginTop: '8px', color: '#6b7280' }}>65% đã sử dụng (6,500,000đ)</p>
          </div>
          <div style={{ 
            background: 'white', 
            padding: '24px', 
            borderRadius: '12px', 
            flex: 1, 
            minWidth: '300px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3>Thêm ngân sách</h3>
            <button style={{
              width: '100%',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '12px',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              + Tạo mới
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

