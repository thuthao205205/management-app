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
          <div className="surface" style={{
            padding: '12px 16px',
            fontWeight: 'bold',
            borderRadius: '12px 12px 0 0',
            marginBottom: '-1px'
          }}>

            Tổng số giao dịch ({items.length} khoản)
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

