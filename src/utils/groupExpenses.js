export const groupExpensesByDate = (expenses) => {
  return expenses.reduce((acc, expense) => {
    const dateKey = expense.date;
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(expense);
    return acc;
  }, {});
};

export const formatDateHeader = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', { 
    day: 'numeric', 
    month: 'numeric',
    year: 'numeric'
  });
};

