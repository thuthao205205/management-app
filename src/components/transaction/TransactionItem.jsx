export default function TransactionItem({ item, category, onEdit, onDelete }) {
  return (
    <div className="card" style={{
      padding: "16px 20px",
      marginBottom: "1px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      {/* Left: Icon + Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>

        <span style={{ fontSize: '24px' }}>{category?.icon || '💸'}</span>
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' }}>{item.name}</div>
          <div style={{ color: '#6b7280', fontSize: '14px' }}>{category?.name}</div>
          {item.note && (
            <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: '2px' }}>
              {item.note}
            </div>
          )}
        </div>
      </div>

      {/* Right: Amount + Actions */}
      <div style={{ textAlign: 'right', minWidth: '160px' }}>
        <div style={{
          color: item.type === "income" ? "green" : "red",
          fontWeight: "bold",
          fontSize: '18px',
          marginBottom: '8px'
        }}>
          {item.amount.toLocaleString()}đ
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button 
            className="btn btn-primary"
            onClick={() => onEdit(item)}
            style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px' }}
            title="Sửa"
          >
            ✏️
          </button>
          <button 
            className="btn btn-danger"
            onClick={() => onDelete(item.id)}
            style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px' }}
            title="Xóa"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}

