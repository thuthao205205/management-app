export const categories = [
  {
    id: 1,
    name: "Ăn uống",
    type: "expense",
    icon: "🍜",
    isDefault: true,
  },
  {
    id: 2,
    name: "Di chuyển",
    type: "expense",
    icon: "🚗",
    isDefault: true,
  },
  {
    id: 3,
    name: "Giải trí",
    type: "expense",
    icon: "🎮",
    isDefault: true,
  },
  {
    id: 4,
    name: "Lương",
    type: "income",
    icon: "💰",
    isDefault: true,
  },
  {
    id: 5,
    name: "Thưởng",
    type: "income",
    icon: "🎁",
    isDefault: true,
  },
];
export const expenses = [
  {
    id: 1,
    name: "Ăn trưa",
    amount: 50000,
    categoryId: 1,
    date: "2026-04-28",
    note: "Cơm văn phòng",
  },
  {
    id: 2,
    name: "Đổ xăng",
    amount: 100000,
    categoryId: 2,
    date: "2026-04-28",
    note: "Xe máy",
  },
  {
    id: 3,
    name: "Xem phim",
    amount: 120000,
    categoryId: 3,
    date: "2026-04-27",
    note: "CGV",
  },
];

export const incomes = [
  {
    id: 1,
    name: "Lương tháng 4",
    amount: 12000000,
    categoryId: 4,
    date: "2026-04-01",
    note: "Công ty ABC",
  },
  {
    id: 2,
    name: "Thưởng KPI",
    amount: 2000000,
    categoryId: 5,
    date: "2026-04-15",
    note: "",
  },
];
export const budgets = [
  {
    id: 1,
    categoryId: 1,
    limit: 3000000,
    spent: 1800000,
  },
  {
    id: 2,
    categoryId: 2,
    limit: 1000000,
    spent: 700000,
  },
  {
    id: 3,
    categoryId: 3,
    limit: 1500000,
    spent: 1400000,
  },
];

export const alerts = [
  {
    id: 1,
    message: "Chi tiêu ăn uống đã đạt 80% ngân sách.",
  },
  {
    id: 2,
    message: "Chi phí giải trí tăng 25% so với tháng trước.",
  },
];

export const recentTransactions = [
  {
    id: 1,
    type: "expense",
    name: "Ăn trưa",
    amount: 50000,
    date: "2026-04-28",
  },
  {
    id: 2,
    type: "income",
    name: "Lương tháng 4",
    amount: 12000000,
    date: "2026-04-01",
  },
];

// ---- Budget engine compatibility exports ----
export {
  calculateBudgetOverview,
  formatMonthYearLabel,
  getDaysInMonth,
  getBudgetProgressFillColor,
  getBudgetStatus,
  getMissingBudgetExpenseCategoryIdsForMonth,
} from "../utils/mockBudgetEngine";

