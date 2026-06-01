// Utilities for Budget page to compute budget overview from mock data.
// This file exists to provide stable named exports used by Budget.jsx.

import { categories, expenses, incomes, budgets } from "../data/mockData";

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

function pad2(n) {
  return String(n).padStart(2, "0");
}

export function formatMonthYearLabel(month, year) {
  const mm = pad2(month);
  return `${mm}/${year}`;
}

export function getDaysInMonth(year, month) {
  // month is 1..12
  return new Date(Number(year), Number(month), 0).getDate();
}

export function getBudgetStatus(ratio) {
  if (ratio >= 1) return "over";
  if (ratio >= 0.8) return "warning";
  if (ratio >= 0.6) return "ok";
  return "good";
}

export function getBudgetProgressFillColor(ratio) {
  // simple palette
  if (ratio >= 1) return "#ef4444"; // red
  if (ratio >= 0.8) return "#f59e0b"; // amber
  if (ratio >= 0.6) return "#22c55e"; // green
  return "#16a34a";
}

export function getBudgetColor(ratio) {
  const status = getBudgetStatus(ratio);
  if (status === "over") return { bg: "rgba(239,68,68,0.12)", text: "#dc2626" };
  if (status === "warning") return { bg: "rgba(245,158,11,0.12)", text: "#b45309" };
  if (status === "ok") return { bg: "rgba(34,197,94,0.12)", text: "#15803d" };
  return { bg: "rgba(22,163,74,0.10)", text: "#16a34a" };
}

export function calculateBudgetOverview({ month, year, categories: expenseCategories }) {
  // Determine budgets for month/year.
  // Budget entries in mockData are generic; Budget.jsx treats each category budget for a month.
  // We'll synthesize month/year budgets from existing `budgets`.

  const expenseCats = expenseCategories || categories.filter((c) => c.type === "expense");

  // Engine budgetsForMonth: one per expense category.
  const budgetsForMonth = expenseCats.map((c) => {
    const base = budgets.find((b) => Number(b.categoryId) === c.id);
    return {
      id: base?.id ?? Date.now() + c.id,
      categoryId: c.id,
      month,
      year,
      limitAmount: base?.limit ?? base?.limitAmount ?? 0,
      // keep spent calculation from expenses for month/year
      spent: 0,
    };
  });

  const spentByCategory = new Map();

  expenses
    .filter((e) => {
      const d = new Date(e.date);
      return d.getMonth() + 1 === Number(month) && d.getFullYear() === Number(year);
    })
    .forEach((e) => {
      const catId = Number(e.categoryId);
      spentByCategory.set(catId, (spentByCategory.get(catId) || 0) + Number(e.amount || 0));
    });

  // Attach spent
  for (const b of budgetsForMonth) {
    const spent = spentByCategory.get(b.categoryId) || 0;
    b.spent = spent;
    b.limitAmount = Number(b.limitAmount || 0);
  }

  const totalLimit = budgetsForMonth.reduce((sum, b) => sum + Number(b.limitAmount || 0), 0);
  const totalSpent = budgetsForMonth.reduce((sum, b) => sum + Number(b.spent || 0), 0);
  const remaining = totalLimit - totalSpent;
  const totalUsageRatio = totalLimit > 0 ? totalSpent / totalLimit : 0;

  return {
    budgetsForMonth,
    budgets: budgetsForMonth,
    spentByCategory,
    totalLimit,
    totalSpent,
    remaining,
    totalUsageRatio,
    daysInMonth: getDaysInMonth(year, month),
    // compatibility exports expected by Budget.jsx
    daysInMonth: getDaysInMonth(year, month),
  };
}

export function getMissingBudgetExpenseCategoryIdsForMonth(month, year) {
  // In mock, we consider a category missing if it has no base budget for it.
  // Budget.jsx uses this to offer "chip" creation.
  const expenseCats = categories.filter((c) => c.type === "expense");
  return expenseCats
    .filter((c) => {
      const base = budgets.find((b) => Number(b.categoryId) === c.id);
      // if base exists, not missing
      return !base;
    })
    .map((c) => c.id);
}

export { clamp };

