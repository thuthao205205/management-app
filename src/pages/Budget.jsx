import Layout from "../components/layout/Layout";
import { useMemo, useState } from "react";
import { EmptyState } from "../components/common/EmptyState";
import { categories } from "../data/mockData";


import {
  calculateBudgetOverview,
  categories as allCategories,
  getDaysInMonth,
  getMissingBudgetExpenseCategoryIdsForMonth
} from "../data/mockData";


const formatMoney = (n) => {
  const num = Number(n) || 0;
  return num.toLocaleString("vi-VN") + "đ";
};

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

function pad2(n) {
  return String(n).padStart(2, "0");
}

const getBudgetColor = (ratio) => {
  if (ratio < 0.6) {
    return {
      bg: "#dcfce7",
      text: "#15803d"
    };
  }

  if (ratio < 0.8) {
    return {
      bg: "#fef3c7",
      text: "#b45309"
    };
  }

  return {
    bg: "#fee2e2",
    text: "#dc2626"
  };
};

const getBudgetProgressFillColor = (ratio) => {
  if (ratio < 0.6) return "#10b981";
  if (ratio < 0.8) return "#f59e0b";
  return "#ef4444";
};

export default function Budget() {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  // Mock expense categories from shared engine
  const expenseCategories = useMemo(() => allCategories.filter((c) => c.type === "expense"), []);

  const overview = useMemo(() => {
    return calculateBudgetOverview({ month: selectedMonth, year: selectedYear, categories: expenseCategories });
  }, [expenseCategories, selectedMonth, selectedYear]);

  const { spentByCategory, daysInMonth } = overview;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingBudgetId, setEditingBudgetId] = useState(null);

  // Local UI-only budget edits (since engine is mock read-only)
  const [localBudgets, setLocalBudgets] = useState([]);

  const mergedBudgetsForMonth = useMemo(() => {
    // Budget nguồn (mock engine) cho UI demo
    // NOTE: lưu/xóa/sửa sẽ thao tác lên localBudgets; engine chỉ cung cấp danh sách để render lần đầu.
    const engineBudgets = overview.budgets || [];
    if (!localBudgets.length) return engineBudgets;

    const key = (b) => `${b.categoryId}-${b.month}-${b.year}`;
    const map = new Map(engineBudgets.map((b) => [key(b), b]));
    for (const b of localBudgets) map.set(key(b), b);
    return Array.from(map.values());
  }, [overview.budgets, localBudgets]);

  const budgetsForMonth = mergedBudgetsForMonth;

  const totalLimitMerged = useMemo(
    () => budgetsForMonth.reduce((sum, b) => sum + Number(b.limitAmount || 0), 0),
    [budgetsForMonth]
  );
  const totalSpentMerged = useMemo(
    () => budgetsForMonth.reduce((sum, b) => sum + Number(spentByCategory.get(b.categoryId) || 0), 0),
    [budgetsForMonth, spentByCategory]
  );

  const remainingMerged = totalLimitMerged - totalSpentMerged;
  const totalUsageRatioMerged =
    totalLimitMerged > 0
      ? totalSpentMerged / totalLimitMerged
      : 0;

  const remainingTextColor =
    remainingMerged >= 0 ? "#16a34a" : "#dc2626";



  const [formCategoryId, setFormCategoryId] = useState(expenseCategories[0]?.id || 1);
  const [formLimit, setFormLimit] = useState(0);
  const [formMonth, setFormMonth] = useState(selectedMonth);
  const [formYear, setFormYear] = useState(selectedYear);

  const openCreate = () => {
    const missingIds = getMissingBudgetExpenseCategoryIdsForMonth(selectedMonth, selectedYear);
    const firstMissingId = missingIds[0] || expenseCategories[0]?.id || 1;
    setIsEditing(false);
    setEditingBudgetId(null);
    setFormCategoryId(firstMissingId);
    setFormLimit(0);
    setFormMonth(selectedMonth);
    setFormYear(selectedYear);
    setIsModalOpen(true);
  };

  const openEdit = (budget) => {
    setIsEditing(true);
    setEditingBudgetId(budget.id);
    setFormCategoryId(budget.categoryId);
    setFormLimit(budget.limitAmount);
    setFormMonth(budget.month);
    setFormYear(budget.year);
    setIsModalOpen(true);
  };

  const openCreateFromChip = (categoryId) => {
    setIsEditing(false);
    setEditingBudgetId(null);
    setFormCategoryId(categoryId);
    setFormLimit(0);
    setFormMonth(selectedMonth);
    setFormYear(selectedYear);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const formDaysInMonth = useMemo(() => getDaysInMonth(formYear, formMonth), [formYear, formMonth]);
  const previewPerDay = useMemo(() => {
    const x = Number(formLimit) || 0;
    return formDaysInMonth > 0 ? Math.floor(x / formDaysInMonth) : 0;
  }, [formLimit, formDaysInMonth]);

  const formValid = useMemo(() => {
    const positive = Number(formLimit) > 0;
    return Boolean(formCategoryId) && positive && Number(formMonth) > 0 && Boolean(formYear);
  }, [formCategoryId, formLimit, formMonth, formYear]);

  const handleSave = () => {
    if (!formValid) return;

    setLocalBudgets((prev) => {
      const key = (b) => `${b.categoryId}-${b.month}-${b.year}`;
      const next = [...prev];
      if (isEditing) {
        const idx = next.findIndex((b) => String(b.id) === String(editingBudgetId));

        const updated = {
          id: editingBudgetId || Date.now(),
          categoryId: Number(formCategoryId),
          limitAmount: Number(formLimit),
          month: Number(formMonth),
          year: Number(formYear)
        };
        if (idx >= 0) next[idx] = updated;
        else next.push(updated);
        return next;
      }

      // create
      const row = {
        id: Date.now(),
        categoryId: Number(formCategoryId),
        limitAmount: Number(formLimit),
        month: Number(formMonth),
        year: Number(formYear)
      };
      // replace if same key exists
      const idx = next.findIndex((b) => key(b) === key(row));
      if (idx >= 0) next[idx] = row;
      else next.push(row);
      return next;
    });

    setIsModalOpen(false);
  };

  const missingCategories = useMemo(() => {
    const missingIds = getMissingBudgetExpenseCategoryIdsForMonth(selectedMonth, selectedYear);
    return expenseCategories.filter((c) => missingIds.includes(c.id));
  }, [expenseCategories, selectedMonth, selectedYear]);

  const overThresholdItems = useMemo(() => {
    return mergedBudgetsForMonth
      .map((b) => {
        const spent = Number(spentByCategory.get(b.categoryId) || 0);
        const ratio = b.limitAmount > 0 ? spent / b.limitAmount : 0;
        return { budget: b, spent, ratio };
      })
      .filter((x) => x.ratio >= 0.8)
      .sort((a, b) => b.ratio - a.ratio);
  }, [mergedBudgetsForMonth, spentByCategory]);

  const monthsOptions = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);
  const yearsOptions = useMemo(() => [Number(selectedYear) - 1, Number(selectedYear), Number(selectedYear) + 1], [selectedYear]);


  return (
    <Layout>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        {/* Topbar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>

          <div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#111827", marginBottom: 2 }}>Ngân sách</div>
            <div style={{ color: "#6b7280", fontSize: 14 }}>Theo dõi hạn mức chi tiêu theo danh mục</div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              style={{ padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14 }}
            >
              {monthsOptions.map((m) => (
                <option key={m} value={m}>
                  {m.toString().padStart(2, "0")}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              style={{ padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14 }}
            >
              {yearsOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={openCreate}
              style={{
                padding: "10px 16px",
                border: "none",
                background: "#3b82f6",
                color: "white",
                borderRadius: 12,
                fontWeight: 800,
                cursor: "pointer"
              }}
            >
              + Đặt ngân sách
            </button>
          </div>
        </div>

        {/* Summary cards */}
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <div style={{ background: "#ffffff", padding: 24, borderRadius: 12, flex: 1, minWidth: 220, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 14, color: "#6b7280", fontWeight: 700 }}>Tổng hạn mức</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: "#6b7280", marginTop: 6 }}>{formatMoney(totalLimitMerged)}</div>

          </div>

          <div style={{ background: "#ffffff", padding: 24, borderRadius: 12, flex: 1, minWidth: 220, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 14, color: "#6b7280", fontWeight: 700 }}>Đã chi tiêu</div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 900,
                color:
                  totalUsageRatioMerged < 0.6 ? "#10b981" : totalUsageRatioMerged < 0.8 ? "#d97706" : "#dc2626",
                marginTop: 6
              }}
            >
              {formatMoney(totalSpentMerged)}
            </div>

          </div>

          <div style={{ background: "#ffffff", padding: 24, borderRadius: 12, flex: 1, minWidth: 220, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 14, color: "#6b7280", fontWeight: 700 }}>Còn lại</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: remainingTextColor, marginTop: 6 }}>{formatMoney(remainingMerged)}</div>

            <div style={{ color: "#6b7280", marginTop: 4, fontSize: 13, fontWeight: 700 }}>
              Còn {daysInMonth} ngày trong tháng
            </div>
          </div>
        </div>

        {/* Budget cards */}
        <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 12 }}>
          {budgetsForMonth.length === 0 ? (
            <EmptyState
              title="Bạn chưa đặt ngân sách cho tháng này"
              buttonText="Bắt đầu đặt ngân sách"
              onClick={openCreate}
              icon="🎯"
              description="" 
            />
          ) : (
            <>
              {budgetsForMonth
                .slice()
                .sort((a, b) => {
                  // sort by ratio desc
                  const ra = (spentByCategory.get(a.categoryId) || 0) / (a.limitAmount || 1);
                  const rb = (spentByCategory.get(b.categoryId) || 0) / (b.limitAmount || 1);
                  return rb - ra;
                })
                .map((b) => {
                  const cat = categories.find((c) => c.id === b.categoryId);
                  const spent = Number(spentByCategory.get(b.categoryId) || 0);
                  const ratio = b.limitAmount > 0 ? spent / b.limitAmount : 0;
                  const pct = Math.round(ratio * 100);
                  const cl = getBudgetColor(ratio);
                  const fillColor = getBudgetProgressFillColor(ratio);
                  const fillWidth = clamp(pct, 0, 100);
                  const progressStyle = {
                    height: 10,
                    borderRadius: 999,
                    background: "#e5e7eb",
                    overflow: "hidden"
                  };

                  const fillStyle = {
                    width: `${fillWidth}%`,
                    height: "100%",
                    background: fillColor,
                    transition: "width 220ms ease"
                  };

                  return (
                    <div key={b.id} style={{ background: "white", padding: 18, borderRadius: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                      {/* Header */}
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                          <div
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: 12,
                              background: "rgba(59,130,246,0.10)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 20
                            }}
                          >
                            {cat?.icon || "🎯"}
                          </div>
                          <div>
                            <div style={{ fontWeight: 900, color: "#111827" }}>{cat?.name || "Danh mục"}</div>
                            <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>{formatMoney(spent)} / {formatMoney(b.limitAmount)}</div>
                          </div>
                        </div>

                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 900,
                            padding: "6px 10px",
                            borderRadius: 999,
                            background: cl.bg,
                            color: cl.text,
                            whiteSpace: "nowrap"
                          }}
                        >
                          {pct < 60 ? "Đang tốt" : pct < 80 ? "Cần chú ý" : pct < 100 ? (pct < 99 ? "Sắp vượt ngưỡng" : "Sắp vượt ngưỡng") : "Đã vượt ngân sách"}
                        </span>
                      </div>

                      {/* Progress */}
                      <div style={{ marginTop: 14 }}>
                        <div style={progressStyle}>
                          <div
                            style={{
                              ...fillStyle,
                              ...(ratio >= 1 ? { animation: "bbblink 1.1s ease-in-out infinite" } : {})
                            }}
                          />
                        </div>
                        <div style={{ marginTop: 8, textAlign: "center", fontSize: 13, fontWeight: 800, color: "#0f172a" }}>
                          {pct >= 100 ? "100%" : `${pct}%`} đã sử dụng
                        </div>
                      </div>

                      {/* Details */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginTop: 14 }}>
                        <div style={{ color: "#0f172a", fontWeight: 900, fontSize: 13 }}>
                          Đã chi: {formatMoney(spent).replace("đ", " đ")}
                        </div>
                        <div style={{ color: "#0f172a", fontWeight: 900, fontSize: 13 }}>
                          Hạn mức: {formatMoney(b.limitAmount).replace("đ", " đ")}
                        </div>
                        <div style={{ flex: 1, textAlign: "center", fontWeight: 900, fontSize: 13, color: spent - b.limitAmount >= 0 ? "#dc2626" : "#059669" }}>
                          Còn lại: {formatMoney(b.limitAmount - spent)}
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <button
                            type="button"
                            onClick={() => openEdit(b)}
                            title="Sửa"
                            style={{
                              border: "1px solid #93c5fd",
                              background: "#eff6ff",
                              color: "#1d4ed8",
                              padding: "8px 10px",
                              borderRadius: 12,
                              fontWeight: 900,
                              cursor: "pointer"
                            }}
                          >
                            ✏️
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              // Xóa trong local state; cũng dùng cho record engine (vì record engine sẽ được thay bằng localBudgets theo key)
                              setLocalBudgets((prev) => {
                                const key = (bb) => `${bb.categoryId}-${bb.month}-${bb.year}`;
                                const targetKey = key(b);
                                return prev.filter((x) => key(x) !== targetKey);
                              });
                            }}

                            title="Xóa ngân sách"
                            style={{
                              border: "1px solid #fca5a5",
                              background: "rgba(239,68,68,0.08)",
                              color: "#dc2626",
                              padding: "8px 10px",
                              borderRadius: 12,
                              fontWeight: 900,
                              cursor: "pointer"
                            }}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

              {/* Missing budgets chips */}
              <div style={{ marginTop: 6 }}>
                <div style={{ fontWeight: 900, color: "#111827", marginBottom: 10 }}>Danh mục chưa có hạn mức</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {missingCategories.length === 0 ? (
                    <div style={{ color: "#6b7280", fontSize: 13, fontWeight: 700 }}>Không có</div>
                  ) : (
                    missingCategories.map((c) => (
                      <div
                        key={c.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "10px 12px",
                          borderRadius: 999,
                          border: "1px solid #e5e7eb",
                          background: "#ffffff"
                        }}
                      >
                        <div style={{ width: 22, textAlign: "center" }}>{c.icon}</div>
                        <div style={{ fontWeight: 900, color: "#0f172a", fontSize: 13 }}>{c.name}</div>
                        <button
                          type="button"
                          onClick={() => openCreateFromChip(c.id)}
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: "50%",
                            border: "none",
                            background: "#3b82f6",
                            color: "white",
                            fontWeight: 900,
                            cursor: "pointer"
                          }}
                          title="Đặt ngân sách"
                        >
                          +
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Warning card */}
        {budgetsForMonth.length > 0 && overThresholdItems.length > 0 ? (
          <div style={{ marginTop: 16, background: "white", padding: 16, borderRadius: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ fontSize: 18 }}>⚠️</div>
              <div style={{ fontWeight: 1000, color: "#111827" }}>Cần chú ý</div>
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, color: "#0f172a", fontWeight: 800 }}>
              {overThresholdItems.map((x) => {
                const cat = categories.find((c) => c.id === x.budget.categoryId);
                const percent = Math.round(x.ratio * 100);
                return (
                  <li key={x.budget.id} style={{ marginBottom: 6 }}>
                    {cat?.name || "Danh mục"}: {percent}% đã sử dụng
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </div>

      {/* Modal */}
      {isModalOpen ? (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            zIndex: 50
          }}
        >
          <style>{`@keyframes bbblink{0%,100%{opacity:1}50%{opacity:0.25}}`}</style>
          <div style={{ background: "white", width: 560, maxWidth: "100%", borderRadius: 16, padding: 18, position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ fontWeight: 1000, fontSize: 18, color: "#111827" }}>{isEditing ? "Chỉnh sửa ngân sách" : "Đặt ngân sách"}</div>
              <button
                type="button"
                onClick={closeModal}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  border: "1px solid #e5e7eb",
                  background: "#f8fafc",
                  cursor: "pointer",
                  fontWeight: 1000
                }}
                aria-label="Đóng"
              >
                ✕
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ gridColumn: "span 2" }}>
                <div style={{ fontSize: 13, color: "#6b7280", fontWeight: 800, marginBottom: 6 }}>Chọn danh mục</div>
                <select
                  value={formCategoryId}
                  onChange={(e) => setFormCategoryId(Number(e.target.value))}
                  disabled={!isEditing}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 12,
                    border: "1px solid #e5e7eb",
                    background: !isEditing ? "#f3f4f6" : "#fff",
                    fontWeight: 800
                  }}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.icon} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ gridColumn: "span 1" }}>
                <div style={{ fontSize: 13, color: "#6b7280", fontWeight: 800, marginBottom: 6 }}>Số tiền hạn mức</div>
                <input
                  type="number"
                  value={formLimit}
                  onChange={(e) => setFormLimit(e.target.value === "" ? 0 : Number(e.target.value))}
                  placeholder="VD: 2.000.000"
                  min={1}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 12, border: "1px solid #e5e7eb", fontWeight: 800 }}
                />
              </div>

              <div style={{ gridColumn: "span 1" }}>
                <div style={{ fontSize: 13, color: "#6b7280", fontWeight: 800, marginBottom: 6 }}>Áp dụng cho tháng</div>
                <div style={{ display: "flex", gap: 10 }}>
                  <select
                    value={formMonth}
                    onChange={(e) => setFormMonth(Number(e.target.value))}
                    style={{ width: "50%", padding: "10px 12px", borderRadius: 12, border: "1px solid #e5e7eb", fontWeight: 800 }}
                  >
                    {monthsOptions.map((m) => (
                      <option key={m} value={m}>
                        {pad2(m)}
                      </option>
                    ))}
                  </select>
                  <select
                    value={formYear}
                    onChange={(e) => setFormYear(Number(e.target.value))}
                    style={{ width: "50%", padding: "10px 12px", borderRadius: 12, borderRadius: 12, border: "1px solid #e5e7eb", fontWeight: 800 }}
                  >
                    {yearsOptions.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ gridColumn: "span 2" }}>
                <div style={{ fontSize: 13, color: "#6b7280", fontWeight: 800, marginBottom: 6 }}>Preview nhanh</div>
                <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", padding: 12, borderRadius: 14, fontWeight: 900, color: "#1d4ed8" }}>
                  Với hạn mức {formatMoney(formLimit)}, mỗi ngày bạn có thể chi tối đa {formatMoney(previewPerDay)}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 14 }}>
              <button
                type="button"
                onClick={closeModal}
                style={{ padding: "10px 16px", borderRadius: 12, border: "1px solid #e5e7eb", background: "white", fontWeight: 900, cursor: "pointer" }}
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={!formValid}
                onClick={handleSave}
                style={{
                  padding: "10px 16px",
                  borderRadius: 12,
                  border: "none",
                  background: formValid ? "#3b82f6" : "#93c5fd",
                  color: "white",
                  fontWeight: 1000,
                  cursor: formValid ? "pointer" : "not-allowed"
                }}
              >
                Lưu ngân sách
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </Layout>
  );
}


