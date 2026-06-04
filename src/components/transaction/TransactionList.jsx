import ExpenseItem from "./TransactionItem";
import { groupExpensesByDate, formatDateHeader } from "../../utils/groupExpenses";

export default function TransactionList({ expenses, categories, onEdit, onDelete }) {
  const grouped = groupExpensesByDate(expenses);

  if (expenses.length === 0) {
    return <div style={{ textAlign: 'center', color: '#6b7280', padding: '40px' }}>Không có khoản chi nào</div>;
  }

  return (
    <div>
      {Object.entries(grouped).map(([date, items]) => (
        <div key={date} style={{ marginBottom: '32px' }}>
          <div style={{
            background: '#f1f5f9',
            padding: '12px 16px',
            fontWeight: 'bold',
            color: '#374151',
            borderRadius: '6px 6px 0 0',
            marginBottom: '-1px'
          }}>
            {formatDateHeader(date)} ({items.length} khoản)
          </div>
          {items.map(item => (
            <ExpenseItem 
              key={item.id}
              item={item}
              category={categories.find(c => c.id === item.categoryId)}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

