import Layout from "../components/layout/Layout";
import { useState, useMemo } from "react";
import { categories } from "../data/mockData";
import ExpenseList from "../components/expense/ExpenseList";
import ExpenseForm from "../components/expense/ExpenseForm";

export default function Expenses() {
  // Mock data đa dạng cho test filters
  const [expenses, setExpenses] = useState([
    { id: 1, name: "Ăn sáng McD", amount: 85000, categoryId: 1, date: "2024-04-20", note: "Big Mac" },
    { id: 2, name: "Xăng xe", amount: 250000, categoryId: 2, date: "2024-04-20", note: "Full bình" },
    { id: 3, name: "Mua áo", amount: 450000, categoryId: 3, date: "2024-04-19", note: "Shopee" },
    { id: 4, name: "Cà phê Highlands", amount: 65000, categoryId: 1, date: "2024-04-18", note: "Gmeet team" },
    { id: 5, name: "Xăng xe lần 2", amount: 180000, categoryId: 2, date: "2024-04-18", note: "" },
    { id: 6, name: "Laptop mới", amount: 18500000, categoryId: 3, date: "2024-03-25", note: "MacBook Air" },
    { id: 7, name: "Phở bò", amount: 55000, categoryId: 1, date: "2024-03-20", note: "" },
  ]);

  // Filters
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("2024");
  const [categoryId, setCategoryId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Filtered + Total
  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      const expenseMonth = (expenseDate.getMonth() + 1).toString().padStart(2, '0');
      const expenseYear = expenseDate.getFullYear().toString();
      
      const matchesMonth = !month || expenseMonth === month;
      const matchesYear = !year || expenseYear === year;
      const matchesCategory = !categoryId || expense.categoryId.toString() === categoryId;
      const matchesSearch = !searchTerm || 
        expense.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (expense.note && expense.note.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesMonth && matchesYear && matchesCategory && matchesSearch;
    });
  }, [expenses, month, year, categoryId, searchTerm]);

  const totalAmount = useMemo(() => 
    filteredExpenses.reduce((sum, e) => sum + e.amount, 0), [filteredExpenses]
  );

  // Modal state
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const handleAdd = (newItem) => {
    setExpenses([...expenses, newItem]);
  };

  const handleUpdate = (updatedItem) => {
    setExpenses(expenses.map(e => e.id === updatedItem.id ? updatedItem : e));
  };

  const handleDelete = (id) => {
    if (confirm('Xóa khoản chi này?')) {
      setExpenses(expenses.filter(e => e.id !== id));
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
          <h1 style={{ margin: 0, fontSize: '24px', color: '#1f2937' }}>Quản lý chi tiêu</h1>
          <button 
            onClick={() => { setEditingItem(null); setShowForm(true); }}
            style={{
              background: '#3b82f6', 
              color: 'white', 
              padding: '12px 24px', 
              borderRadius: '8px', 
              border: 'none', 
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(59,130,246,0.3)'
            }}
          >
            + Thêm chi tiêu
          </button>
        </div>

        {/* Filters row */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <select 
            value={month} 
            onChange={e => setMonth(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', minWidth: '120px' }}
          >
            <option value="">Month</option>
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
            {categories.filter(c => c.type === 'expense').map(cat => (
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
          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', 
          padding: '16px 24px', 
          borderRadius: '12px', 
          marginBottom: '24px',
          fontSize: '20px',
          fontWeight: '700',
          color: '#dc2626',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
        }}>
          💰 Tổng chi {month ? `Tháng ${month.padStart(2,'0')}` : 'Hiện tại'}/{year}: <span style={{ fontSize: '24px' }}>{totalAmount.toLocaleString('vi-VN')}đ</span>
        </div>

        {/* List */}
        <ExpenseList 
          expenses={filteredExpenses}
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
          />
        )}
      </div>
    </Layout>
  );
}

