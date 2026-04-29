import Layout from "../components/layout/Layout";
import { useState, useMemo } from "react";
import { categories } from "../data/mockData";
import ExpenseList from "../components/expense/ExpenseList";
import ExpenseForm from "../components/expense/ExpenseForm";

export default function Income() {
  // Mock data đa dạng cho test filters - INCOME
  const [incomes, setIncomes] = useState([
    { id: 1, name: "Lương tháng 4", amount: 8500000, categoryId: 4, date: "2024-04-25", note: "Công ty ABC" },
    { id: 2, name: "Thưởng hiệu suất", amount: 2500000, categoryId: 4, date: "2024-04-20", note: "Q1" },
    { id: 3, name: "Freelance design", amount: 4500000, categoryId: 4, date: "2024-04-19", note: "Upwork" },
    { id: 4, name: "Lãi tiết kiệm", amount: 650000, categoryId: 4, date: "2024-04-18", note: "Ngân hàng X" },
    { id: 5, name: "Bán đồ cũ", amount: 1800000, categoryId: 4, date: "2024-04-18", note: "Chợ Tốt" },
    { id: 6, name: "Lương tháng 3", amount: 8200000, categoryId: 4, date: "2024-03-25", note: "Công ty ABC" },
    { id: 7, name: "Hoàn tiền Shopee", amount: 550000, categoryId: 4, date: "2024-03-20", note: "" },
  ]);

  // Filters
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("2024");
  const [categoryId, setCategoryId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Filtered + Total
  const filteredIncomes = useMemo(() => {
    return incomes.filter(income => {
      const incomeDate = new Date(income.date);
      const incomeMonth = (incomeDate.getMonth() + 1).toString().padStart(2, '0');
      const incomeYear = incomeDate.getFullYear().toString();
      
      const matchesMonth = !month || incomeMonth === month;
      const matchesYear = !year || incomeYear === year;
      const matchesCategory = !categoryId || income.categoryId.toString() === categoryId;
      const matchesSearch = !searchTerm || 
        income.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (income.note && income.note.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesMonth && matchesYear && matchesCategory && matchesSearch;
    });
  }, [incomes, month, year, categoryId, searchTerm]);

  const totalAmount = useMemo(() => 
    filteredIncomes.reduce((sum, i) => sum + i.amount, 0), [filteredIncomes]
  );

  // Modal state
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const handleAdd = (newItem) => {
    setIncomes([...incomes, newItem]);
  };

  const handleUpdate = (updatedItem) => {
    setIncomes(incomes.map(i => i.id === updatedItem.id ? updatedItem : i));
  };

  const handleDelete = (id) => {
    if (confirm('Xóa khoản thu này?')) {
      setIncomes(incomes.filter(i => i.id !== id));
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  return (
    <Layout>
      <div>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ margin: 0, fontSize: '24px', color: '#1f2937' }}>Quản lý thu nhập</h1>
          <button 
            onClick={() => { setEditingItem(null); setShowForm(true); }}
            style={{
              background: '#22c55e', 
              color: 'white', 
              padding: '12px 24px', 
              borderRadius: '8px', 
              border: 'none', 
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(34,197,94,0.3)'
            }}
          >
            + Thêm thu nhập
          </button>
        </div>

        {/* Filters row */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <select 
            value={month} 
            onChange={e => setMonth(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', minWidth: '120px' }}
          >
            <option value="">Tháng</option>
            {Array.from({length: 12}, (_, i) => (
              <option key={i+1} value={(i+1).toString().padStart(2, '0')}>
                Th {i+1}
              </option>
            ))}
          </select>

          <input 
            type="number" 
            value={year}
            onChange={e => setYear(e.target.value)}
            placeholder="2024"
            style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', width: '100px' }}
          />

          <select 
            value={categoryId} 
            onChange={e => setCategoryId(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', minWidth: '140px' }}
          >
            <option value="">Danh mục</option>
            {categories.filter(c => c.type === 'income').map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <input 
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="🔍 Tìm kiếm..."
            style={{ padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '6px', flex: 1, minWidth: '200px' }}
          />
        </div>

        {/* Total */}
        <div style={{ 
          background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', 
          padding: '16px 24px', 
          borderRadius: '12px', 
          marginBottom: '24px',
          fontSize: '20px',
          fontWeight: '700',
          color: '#16a34a',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
        }}>
          💵 Tổng thu {month ? `Tháng ${month.padStart(2,'0')}` : 'Hiện tại'}/{year}: <span style={{ fontSize: '24px' }}>{totalAmount.toLocaleString('vi-VN')}đ</span>
        </div>

        {/* List */}
        <ExpenseList 
          expenses={filteredIncomes}
          categories={categories}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Modal */}
        {showForm && (
          <ExpenseForm
            editingItem={editingItem}
            onClose={() => { setShowForm(false); setEditingItem(null); }}
            onAdd={handleAdd}
            onUpdate={handleUpdate}
            type="income"
          />
        )}
      </div>
    </Layout>
  );
}
