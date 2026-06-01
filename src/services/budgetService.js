// services/budgetService.js

import {
  budgets,
  categories
} from "../data/mockData";

export const budgetService = {
  getAll() {
    return budgets;
  },

  getBudgetWithCategory() {
    return budgets.map((budget) => ({
      ...budget,
      category: categories.find(
        (c) => c.id === budget.categoryId
      )
    }));
  },

  getByCategory(categoryId) {
    return budgets.find(
      (b) => b.categoryId === categoryId
    );
  },

  create(data) {
    return {
      id: Date.now(),
      ...data
    };
  },

  update(id, data) {
    return {
      id,
      ...data
    };
  },

  delete(id) {
    return true;
  }
};