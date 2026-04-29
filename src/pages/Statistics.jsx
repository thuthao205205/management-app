import Layout from "../components/layout/Layout";

export default function Statistics() {
  return (
    <Layout>
      <div>
        <h1 style={{ marginBottom: '24px', fontSize: '24px', color: '#1f2937' }}>📊 Thống kê</h1>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ 
            background: 'white', 
            padding: '24px', 
            borderRadius: '12px', 
            flex: '1', 
            minWidth: '300px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3>Biểu đồ chi tiêu</h3>
            <div style={{ height: '200px', background: '#f1f5f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
              📈 Pie Chart (sẽ implement với Recharts)
            </div>
          </div>
          <div style={{ 
            background: 'white', 
            padding: '24px', 
            borderRadius: '12px', 
            flex: '1', 
            minWidth: '300px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3>Xu hướng</h3>
            <div style={{ height: '200px', background: '#f1f5f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
              📉 Line Chart
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

