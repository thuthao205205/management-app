export const categories = [
  { id: 1, name: "Ăn uống", type: "expense", icon: "🍜", isDefault: true },
  { id: 2, name: "Xăng xe", type: "expense", icon: "⛽", isDefault: true },
  { id: 3, name: "Mua sắm", type: "expense", icon: "🛍️", isDefault: true },
  { id: 4, name: "Lương", type: "income", icon: "💰", isDefault: true }
];

// -------------------------
// Mock data engine (frontend only)
// -------------------------

const pad2 = (n) => String(n).padStart(2, "0");

export const defaultBudgetMonthKeys = (month, year) => ({ month: Number(month), year: Number(year) });

// Mock budgets stored in-memory shape.
// In real app, budgets would come from Firestore.
const seedBudgets = (month, year) => {
  const m = Number(month);
  const y = Number(year);

  // Deterministic sample amounts by month/year
  const seed = y * 100 + m;
  const mulA = 1 + ((seed % 7) * 0.05);
  const mulB = 1 + (((seed + 3) % 7) * 0.05);
  const mulC = 1 + (((seed + 5) % 7) * 0.05);

  // Only return budgets for demo months (so empty-state can be shown too)
  // e.g. choose: show budgets for all except some months
  const showBudgets = (seed % 4) !== 1;
  if (!showBudgets) return [];

  return [
    {
      id: 1000 + seed,
      categoryId: 1,
      month: m,
      year: y,
      limitAmount: Math.round(3000000 * mulA)
    },
    {
      id: 2000 + seed,
      categoryId: 2,
      month: m,
      year: y,
      limitAmount: Math.round(1800000 * mulB)
    },
    {
      id: 3000 + seed,
      categoryId: 3,
      month: m,
      year: y,
      limitAmount: Math.round(2500000 * mulC)
    }
  ];
};

// Mock expenses generator for a month.
// Returns totals by categoryId to simulate “Đã chi” computation.
export const getExpensesTotalsByCategoryForMonth = (month, year) => {
  const m = Number(month);
  const y = Number(year);
  const seed = y * 100 + m;

  // Base totals
  const catIds = categories.filter((c) => c.type === "expense").map((c) => c.id);
  const result = new Map();

  for (const id of catIds) {
    const c = id % 3;
    const base = 800000 + (seed % 7) * 120000;
    const modifier = (c * 0.35 + 0.6);
    // Add some noise
    const noise = ((seed + id) % 13) * 0.02;
    const total = Math.round(base * modifier * (0.68 + noise));
    result.set(id, total);
  }

  // Force at least one threshold exceed for some months
  // e.g. if seed%3==0 => category 1 is near/over 80%
  if (seed % 3 === 0) {
    // make it around 0.87 * some reasonable limit; exact limit comes from budgets
    // so we multiply later relative to budgets in UI calculations.
    result.set(1, Math.round(999999999));
  }

  return result;
};

export const getBudgetsForMonth = (month, year) => {
  return seedBudgets(month, year);
};

export const calculateBudgetOverview = ({ month, year, categories: expenseCategories }) => {
  const budgets = getBudgetsForMonth(month, year);

  const spentByCategory = getExpensesTotalsByCategoryForMonth(month, year);

  // If we forced category 1 total to huge sentinel above, normalize it to budget-driven ratio.
  // This keeps demo stable while still triggering warning cards.
  const b1 = budgets.find((b) => b.categoryId === 1);
  if (b1 && spentByCategory.get(1) > 100000000) {
    spentByCategory.set(1, Math.round(b1.limitAmount * 0.87));
  }

  const totalLimit = budgets.reduce((sum, b) => sum + Number(b.limitAmount || 0), 0);
  const totalSpent = budgets.reduce((sum, b) => sum + Number(spentByCategory.get(b.categoryId) || 0), 0);

  const remaining = totalLimit - totalSpent;
  const ratio = totalLimit > 0 ? totalSpent / totalLimit : 0;

  return {
    budgets,
    spentByCategory,
    totalLimit,
    totalSpent,
    remaining,
    totalUsageRatio: ratio,
    daysInMonth: getDaysInMonth(year, month)
  };
};

export const getDaysInMonth = (year, monthIndex1to12) => {
  const m = Number(monthIndex1to12);
  const dt = new Date(Number(year), m, 0); // m is 1..12
  return dt.getDate();
};

export const formatMonthYearLabel = (month, year) => {
  return `Tháng ${pad2(month)}/${year}`;
};

export const getBudgetStatus = (ratio) => {
  if (ratio >= 1) return { key: "over", label: "Đã vượt ngân sách", pillBg: "#b91c1c", pillText: "#dc2626" };
  if (ratio >= 0.8) return { key: "soon", label: "Sắp vượt ngưỡng", pillBg: "#dc2626", pillText: "#dc2626" };
  if (ratio >= 0.6) return { key: "care", label: "Cần chú ý", pillBg: "#f59e0b", pillText: "#d97706" };
  return { key: "good", label: "Đang tốt", pillBg: "#059669", pillText: "#059669" };
};

export const getBudgetProgressFillColor = (ratio) => {
  if (ratio >= 1) return "#dc2626";
  if (ratio >= 0.8) return "#ef4444";
  if (ratio >= 0.6) return "#f59e0b";
  return "#10b981";
};

export const getMissingBudgetExpenseCategoryIdsForMonth = (month, year) => {
  const expenseCats = categories.filter((c) => c.type === "expense");
  const budgets = getBudgetsForMonth(month, year);
  const has = new Set(budgets.map((b) => b.categoryId));
  return expenseCats.filter((c) => !has.has(c.id));
};

// -------------------------
// Mock expenses/incomes items (frontend only)
// -------------------------

const hashSeed = (s) => {
  // simple deterministic hash
  let h = 0;
  const str = String(s);
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
};

const makeDateStr = (year, month, dayOffset) => {
  const y = Number(year);
  const m = Number(month);
  const baseDay = 1 + (dayOffset % 27);
  const d = Math.min(baseDay, getDaysInMonth(y, m));
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
};

const getCategoryById = (id) => categories.find((c) => c.id === id);

const generateTransactionsForMonthYear = ({ type, month, year }) => {
  const t = type === "expense" ? "expense" : "income";
  const catIds = categories.filter((c) => c.type === t).map((c) => c.id);

  const seed = hashSeed(`${t}-${year}-${month}`);
  const countBase = (seed % 5) + 5; // 5..9 categories items-ish

  // Create deterministic items; distribute by category
  const items = [];
  let idCounter = 1 + (seed % 1000);

  for (let i = 0; i < countBase; i++) {
    const catId = catIds[i % catIds.length] ?? catIds[0];
    const cat = getCategoryById(catId);

    const dayOffset = seed + i * 7;
    const date = makeDateStr(year, month, dayOffset);

    const amountBase = 200000 + ((seed + i * 13) % 900000);
    const variance = 0.4 + (((seed + i) % 100) / 100) * 0.9;
    const amount = Math.round(amountBase * variance * (t === "income" ? 4 : 1));

    const notePool =
      t === "expense"
        ? ["Ăn uống", "Di chuyển", "Mua sắm", "Giải trí", "Nhu cầu", "Gadget"]
        : ["Lương", "Thưởng", "Freelance", "Hoàn tiền", "Lãi", "Khác"];

    const note = notePool[(seed + i) % notePool.length];

    const name = t === "expense" ? `${cat?.name || "Danh mục"} - ${i + 1}` : `${cat?.name || "Danh mục"} - ${i + 1}`;

    items.push({
      id: idCounter++,
      name,
      amount,
      categoryId: Number(catId),
      date,
      note
    });
  }

  // Ensure at least one item exists per non-empty category list
  return items.sort((a, b) => (a.date < b.date ? 1 : -1));
};

export const getExpensesForMonthYear = ({ month, year }) => {
  return generateTransactionsForMonthYear({ type: "expense", month, year });
};

export const getIncomesForMonthYear = ({ month, year }) => {
  return generateTransactionsForMonthYear({ type: "income", month, year });
};

export const getTransactionCountByCategoryForMonthYear = ({ type, month, year }) => {
  const items = type === "expense" ? getExpensesForMonthYear({ month, year }) : getIncomesForMonthYear({ month, year });
  const map = new Map();
  for (const it of items) {
    map.set(Number(it.categoryId), (map.get(Number(it.categoryId)) || 0) + 1);
  }
  return map;
};


