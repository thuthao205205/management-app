// services/incomeService.js

import { incomes } from "../data/mockData";

export const incomeService = {
  getAll() {
    return incomes;
  },

  getById(id) {
    return incomes.find(
      (item) => item.id === id
    );
  },

  getByMonthYear(month, year) {
    return incomes.filter((item) => {
      const date = new Date(item.date);

      return (
        date.getMonth() + 1 === month &&
        date.getFullYear() === year
      );
    });
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