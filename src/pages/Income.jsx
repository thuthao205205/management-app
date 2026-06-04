import Layout from "../components/layout/Layout";
import { useMemo, useState, useEffect } from "react";
import TransactionList from "../components/transaction/TransactionList";
import TransactionForm from "../components/transaction/TransactionForm";
import { useAuth } from "../context/AuthContext";
import {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction
} from "../services/transactionService";
import {
  getCategories
} from "../services/categoryService";


export default function Income() {
  const [month, setMonth] = useState("");
  const now = new Date();
  const [year, setYear] = useState(
    String(now.getFullYear())
  );
  const [categoryId, setCategoryId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();
  const [incomes, setIncomes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);

      const transactionData =
        await getTransactions(user.uid);

      const categoryData =
        await getCategories(user.uid);

      setIncomes(
        transactionData.filter(
          item => item.type === "income"
        )
      );

      setCategories(
        categoryData.filter(
          item => item.type === "income"
        )
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  
  const filteredIncomes = useMemo(() => {
    return incomes.filter((income) => {
      const incomeDate = new Date(income.transactionDate);
      const incomeMonth = (incomeDate.getMonth() + 1).toString().padStart(2, "0");
      const incomeYear = incomeDate.getFullYear().toString();

      const matchesMonth = !month || incomeMonth === month;
      const matchesYear = !year || incomeYear === year;
      const matchesCategory = !categoryId || income.categoryId.toString() === categoryId;
      const matchesSearch =
        !searchTerm ||
        income.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (income.note && income.note.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesMonth && matchesYear && matchesCategory && matchesSearch;
    });
  }, [incomes, month, year, categoryId, searchTerm]);

  const totalAmount = useMemo(() => filteredIncomes.reduce((sum, i) => sum + (i.amount || 0), 0), [filteredIncomes]);

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const handleAdd = async (newItem) => {
    try {
      const created =
        await addTransaction({
          ...newItem,
          uid: user.uid,
          type: "income"
        });

      setIncomes((prev) => [
        ...prev,
        created
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (
    updatedItem
  ) => {
    try {
      await updateTransaction(
        updatedItem.id,
        updatedItem
      );

      setIncomes((prev) =>
        prev.map((item) =>
          item.id === updatedItem.id
            ? updatedItem
            : item
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async ( id ) => {
    if (!confirm("Xóa khoản thu này?"))
      return;

    try {
      await deleteTransaction(id);

      setIncomes((prev) =>
        prev.filter(
          (item) => item.id !== id
        )
      );
    } catch (error) {
      console.error(error);
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
            onClick={() => {
              setEditingItem(null);
              setShowForm(true);
            }}

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
        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : (
          <TransactionList
            expenses={filteredIncomes}
            categories={categories}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {/* Modal */}
        {showForm && (
          <TransactionForm
            editingItem={editingItem}
            onClose={() => {
              setShowForm(false);
              setEditingItem(null);
            }}
            onAdd={handleAdd}
            onUpdate={handleUpdate}
            categories={categories}
            type="income"
          />
        )}

      </div>
    </Layout>
  );
}
