import { useState, useEffect } from "react";

export default function TransactionForm({ editingItem, onClose, onAdd, onUpdate, categories, type = "expense" }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");
  const transactionLabel = type === "income" ? "thu nhập" : "chi tiêu";

  // Load editing data
  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name || "");
      setAmount((editingItem.amount || 0).toString());
      setCategoryId(editingItem.categoryId || "");
      setDate(editingItem.date || new Date().toISOString().split("T")[0]);
      setNote(editingItem.note || "");
    } else {
      // Reset for add
      setName("");
      setAmount("");
      setCategoryId("");
      setDate(new Date().toISOString().split("T")[0]);
      setNote("");
    }
  }, [editingItem]);

  const handleSave = () => {
    if (!name.trim() || !amount || !categoryId || !date) {
      alert("Vui lòng nhập đầy đủ thông tin bắt buộc (*)");
      return;
    }

    const transactionData = {
      id: editingItem?.id || Date.now(),
      name: name.trim(),
      amount: Number(amount),
      categoryId,
      transactionDate: date,
      note: note.trim(),
      type
    };

    if (editingItem) {
      onUpdate(transactionData);
    } else {
      onAdd(transactionData);
    }
    onClose();
  };

  return (
    <div style={{
      position: "fixed", 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0,
      background: "rgba(0,0,0,0.5)", 
      display: "flex", 
      justifyContent: "center",
      alignItems: "center", 
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: "white", 
        padding: "32px", 
        width: "100%", 
        maxWidth: "480px",
        borderRadius: "16px", 
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <h3 style={{ 
          margin: "0 0 24px 0", 
          fontSize: "24px", 
          color: "#1f2937",
          fontWeight: '600'
        }}>
          {editingItem ? `Sửa khoản ${transactionLabel}` : `Thêm khoản ${transactionLabel} mới`}
        </h3>

        {/* Name */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>Tên khoản {transactionLabel} *</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={type === "income" ? "Ví dụ: Lương tháng 6, Thưởng..." : "Ví dụ: Ăn sáng, Xăng xe..."}
            style={{ 
              width: "100%", 
              padding: "12px 16px", 
              border: "2px solid #e5e7eb", 
              borderRadius: "8px",
              fontSize: '16px',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
        </div>

        {/* Amount */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>Số tiền *</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            style={{ 
              width: "100%", 
              padding: "12px 16px", 
              border: "2px solid #e5e7eb", 
              borderRadius: "8px",
              fontSize: '16px'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
        </div>

        {/* Category */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>Danh mục *</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            style={{ 
              width: "100%", 
              padding: "12px 16px", 
              border: "2px solid #e5e7eb", 
              borderRadius: "8px",
              fontSize: '16px',
              background: 'white'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          >
            <option value="">Chọn danh mục...</option>
            {(categories || []).filter(c => c.type === type).map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>Ngày *</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ 
              width: "100%", 
              padding: "12px 16px", 
              border: "2px solid #e5e7eb", 
              borderRadius: "8px",
              fontSize: '16px'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
        </div>

        {/* Note */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>Ghi chú</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={type === "income" ? "Chi tiết khoản thu nhập..." : "Chi tiết khoản chi tiêu..."}
            rows={3}
            style={{ 
              width: "100%", 
              padding: "12px 16px", 
              border: "2px solid #e5e7eb", 
              borderRadius: "8px",
              fontSize: '16px',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "16px", justifyContent: "flex-end" }}>
          <button 
            onClick={onClose}
            style={{
              padding: "12px 28px", 
              border: "2px solid #d1d5db", 
              borderRadius: "8px",
              background: "white", 
              color: "#374151", 
              fontWeight: "500",
              fontSize: "15px",
              cursor: "pointer",
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#f9fafb';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'white';
              e.target.style.transform = 'none';
            }}
          >
            Hủy
          </button>
          <button 
            onClick={handleSave}
            style={{
              padding: "12px 28px", 
              border: "none", 
              borderRadius: "8px",
              background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)", 
              color: "white", 
              fontWeight: "600",
              fontSize: "15px",
              cursor: "pointer",
              boxShadow: "0 4px 14px 0 rgba(59,130,246,0.4)",
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px 0 rgba(59,130,246,0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'none';
              e.target.style.boxShadow = '0 4px 14px 0 rgba(59,130,246,0.4)';
            }}
          >
            {editingItem ? "Cập nhật" : "Thêm mới"}
          </button>
        </div>
      </div>
    </div>
  );
}

