// services/categoryService.js

import { categories } from "../data/mockData";

export const categoryService = {
  getAll() {
    return categories;
  },

  getExpenseCategories() {
    return categories.filter(
      (c) => c.type === "expense"
    );
  },

  getIncomeCategories() {
    return categories.filter(
      (c) => c.type === "income"
    );
  },

  getById(id) {
    return categories.find(
      (c) => c.id === id
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