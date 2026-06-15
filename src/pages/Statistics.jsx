import Layout from "../components/layout/Layout";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { getTransactions } from "../services/transactionService";
import { getCategories } from "../services/categoryService";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  LineChart, Line,
} from "recharts";

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORY_COLORS = [
  "#6366f1", "#f43f5e", "#10b981", "#f59e0b",
  "#3b82f6", "#ec4899", "#14b8a6", "#8b5cf6",
];

const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: `Tháng ${i + 1}`,
}));

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - i);

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatVND = (amount) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);

const formatVNDShort = (amount) => {
  if (Math.abs(amount) >= 1_000_000_000)
    return `${(amount / 1_000_000_000).toFixed(1)}T`;
  if (Math.abs(amount) >= 1_000_000)
    return `${(amount / 1_000_000).toFixed(1)}Tr`;
  if (Math.abs(amount) >= 1_000)
    return `${(amount / 1_000).toFixed(0)}K`;
  return `${amount}`;
};

const filterByMonth = (transactions, month, year) =>
  transactions.filter((t) => {
    const d = new Date(t.transactionDate);
    return d.getMonth() + 1 === month && d.getFullYear() === year;
  });

const sumByType = (transactions, type) =>
  transactions
    .filter((t) => t.type === type)
    .reduce((sum, t) => sum + t.amount, 0);

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ title, value, color, icon, change }) {
  const isPositive = change >= 0;
  return (
    <div className="stat-card">
      <div className="stat-card__header">
        <span className="stat-card__icon">{icon}</span>
        <span className="stat-card__title">{title}</span>
      </div>
      <div className="stat-card__value" style={{ color }}>
        {formatVND(value)}
      </div>
      {change !== undefined && (
        <div className={`stat-card__change ${isPositive ? "positive" : "negative"}`}>
          {isPositive ? "▲" : "▼"} {Math.abs(change).toFixed(1)}% so với tháng trước
        </div>
      )}
    </div>
  );
}

function ChartCard({ title, children, isEmpty }) {
  return (
    <div className="chart-card">
      <h3 className="chart-card__title">{title}</h3>
      {isEmpty ? (
        <div className="empty-state">
          <span>📭</span>
          <p>Không có dữ liệu trong kỳ này</p>
        </div>
      ) : (
        children
      )}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      {label && <p className="custom-tooltip__label">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: {formatVND(p.value)}
        </p>
      ))}
    </div>
  );
};

const CustomPieLabel = ({ cx, cy, midAngle, outerRadius, percent }) => {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 30;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#374151" textAnchor="middle" dominantBaseline="central" fontSize={12}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

function LoadingSkeleton() {
  return (
    <div className="skeleton-wrapper">
      {[1, 2, 3].map((i) => (
        <div key={i} className="skeleton skeleton--card" />
      ))}
      <div className="skeleton skeleton--chart" />
      <div className="skeleton skeleton--chart" />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Statistics() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (!user) return;
    const loadData = async () => {
      setLoading(true);
      try {
        const [transactionData, categoryData] = await Promise.all([
          getTransactions(user.uid),
          getCategories(user.uid),
        ]);
        setTransactions(transactionData);
        setCategories(categoryData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  // ── Current month report ────────────────────────────────────────────────────
  const reportData = useMemo(() => {
    const filtered = filterByMonth(transactions, month, year);
    const totalIncome = sumByType(filtered, "income");
    const totalExpense = sumByType(filtered, "expense");
    const balance = totalIncome - totalExpense;

    // Pie chart: expenses by category
    const categoryMap = {};
    filtered
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        categoryMap[t.categoryId] = (categoryMap[t.categoryId] || 0) + t.amount;
      });

    const pieData = Object.entries(categoryMap)
      .map(([catId, amount]) => ({
        name: categories.find((c) => String(c.id) === String(catId))?.name || "Khác",
        value: amount,
      }))
      .sort((a, b) => b.value - a.value);

    return { totalIncome, totalExpense, balance, pieData };
  }, [transactions, categories, month, year]);

  // ── Previous month for comparison ─────────────────────────────────────────
  const prevMonthData = useMemo(() => {
    const prevDate = new Date(year, month - 2, 1); // month-2 because month is 1-indexed
    const pm = prevDate.getMonth() + 1;
    const py = prevDate.getFullYear();
    const prev = filterByMonth(transactions, pm, py);
    return {
      totalIncome: sumByType(prev, "income"),
      totalExpense: sumByType(prev, "expense"),
    };
  }, [transactions, month, year]);

  const calcChange = (current, prev) =>
    prev === 0 ? null : ((current - prev) / prev) * 100;

  // ── 6-month trend ─────────────────────────────────────────────────────────
  const lineData = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      const m = d.getMonth() + 1;
      const y = d.getFullYear();
      const monthTx = filterByMonth(transactions, m, y);
      return {
        month: `T${m}/${String(y).slice(2)}`,
        "Thu nhập": sumByType(monthTx, "income"),
        "Chi tiêu": sumByType(monthTx, "expense"),
      };
    });
  }, [transactions]);

  // ── Bar chart: daily breakdown for selected month ─────────────────────────
  const barData = useMemo(() => {
    const filtered = filterByMonth(transactions, month, year);
    const weekMap = {};
    filtered.forEach((t) => {
      const d = new Date(t.transactionDate);
      const week = `T${Math.ceil(d.getDate() / 7)}`;
      if (!weekMap[week]) weekMap[week] = { week, "Thu nhập": 0, "Chi tiêu": 0 };
      if (t.type === "income") weekMap[week]["Thu nhập"] += t.amount;
      else weekMap[week]["Chi tiêu"] += t.amount;
    });
    return Object.values(weekMap).sort((a, b) => a.week.localeCompare(b.week));
  }, [transactions, month, year]);

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <Layout>
      <style>{styles}</style>
      <div className="stats-page">
        {/* Header */}
        <div className="stats-header">
          <div>
            <h1 className="stats-header__title">Báo cáo tài chính</h1>
            <p className="stats-header__sub">Tổng hợp thu chi của bạn</p>
          </div>
          <div className="filter-group">

            <select
              className="filter-select"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
            <select
              className="filter-select"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {/* Stat Cards */}
            <div className="stats-grid">
              <StatCard
                title="Tổng thu nhập"
                value={reportData.totalIncome}
                color="#059669"
                icon="💰"
                change={calcChange(reportData.totalIncome, prevMonthData.totalIncome)}
              />
              <StatCard
                title="Tổng chi tiêu"
                value={reportData.totalExpense}
                color="#e11d48"
                icon="💳"
                change={calcChange(reportData.totalExpense, prevMonthData.totalExpense)}
              />
              <StatCard
                title="Tiết kiệm"
                value={reportData.balance}
                color={reportData.balance >= 0 ? "#2563eb" : "#e11d48"}
                icon="🏦"
              />
            </div>

            {/* Savings rate bar */}
            {reportData.totalIncome > 0 && (
              <div className="chart-card savings-bar-card">
                <div className="savings-bar-header">
                  <span>Tỷ lệ tiết kiệm tháng này</span>
                  <strong style={{ color: "#2563eb" }}>
                    {Math.max(0, ((reportData.balance / reportData.totalIncome) * 100)).toFixed(1)}%
                  </strong>
                </div>
                <div className="savings-bar-track">
                  <div
                    className="savings-bar-fill"
                    style={{
                      width: `${Math.min(100, Math.max(0, (reportData.balance / reportData.totalIncome) * 100))}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Pie Chart */}
            <ChartCard title="Chi tiêu theo danh mục" isEmpty={reportData.pieData.length === 0}>
              <div className="pie-layout">
                <ResponsiveContainer width="60%" height={300}>
                  <PieChart>
                    <Pie
                      data={reportData.pieData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={110}
                      innerRadius={55}
                      labelLine={false}
                      label={<CustomPieLabel />}
                    >
                      {reportData.pieData.map((_, index) => (
                        <Cell key={index} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>

                <div className="pie-legend">
                  {reportData.pieData.map((entry, index) => (
                    <div key={index} className="pie-legend__item">
                      <span
                        className="pie-legend__dot"
                        style={{ background: CATEGORY_COLORS[index % CATEGORY_COLORS.length] }}
                      />
                      <span className="pie-legend__name">{entry.name}</span>
                      <span className="pie-legend__value">{formatVNDShort(entry.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ChartCard>

            {/* Bar Chart: weekly */}
            <ChartCard title={`Thu chi theo tuần — Tháng ${month}/${year}`} isEmpty={barData.length === 0}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData} barGap={6}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="week" tick={{ fontSize: 13 }} />
                  <YAxis tickFormatter={formatVNDShort} tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="Thu nhập" fill="#10b981" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Chi tiêu" fill="#f43f5e" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Line Chart: 6-month trend */}
            <ChartCard title="Xu hướng 6 tháng gần nhất">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 13 }} />
                  <YAxis tickFormatter={formatVNDShort} tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="Thu nhập"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Chi tiêu"
                    stroke="#f43f5e"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </>
        )}
      </div>
    </Layout>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = `
  .stats-page {
    max-width: 960px;
    margin: 0 auto;
    padding: 0 0 48px;
    font-family: 'Be Vietnam Pro', 'Segoe UI', sans-serif;
  }

  /* Header */
  .stats-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 28px;
  }
  .stats-header__title {
    font-size: 26px;
    font-weight: 700;
    color: #111827;
    margin: 0 0 4px;
  }
  .stats-header__sub {
    font-size: 14px;
    color: #6b7280;
    margin: 0;
  }

  /* Filter */
  .filter-group {
    display: flex;
    gap: 10px;
  }
  .filter-select {
    padding: 8px 14px;
    border: 1.5px solid #e5e7eb;
    border-radius: 10px;
    font-size: 14px;
    background: white;
    color: #374151;
    cursor: pointer;
    outline: none;
    transition: border-color 0.2s;
  }
  .filter-select:focus {
    border-color: #6366f1;
  }

  /* Stats grid */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
    margin-bottom: 16px;
  }

  /* Stat Card */
  .stat-card {
    background: white;
    border-radius: 16px;
    padding: 20px 22px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
    border: 1px solid #f3f4f6;
    transition: box-shadow 0.2s;
  }
  .stat-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
  .stat-card__header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
  }
  .stat-card__icon { font-size: 18px; }
  .stat-card__title { font-size: 13px; color: #6b7280; font-weight: 500; }
  .stat-card__value {
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.5px;
    margin-bottom: 8px;
  }
  .stat-card__change {
    font-size: 12px;
    font-weight: 500;
  }
  .stat-card__change.positive { color: #059669; }
  .stat-card__change.negative { color: #e11d48; }

  /* Chart Card */
  .chart-card {
    background: white;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
    border: 1px solid #f3f4f6;
    margin-top: 16px;
  }
  .chart-card__title {
    font-size: 16px;
    font-weight: 600;
    color: #111827;
    margin: 0 0 20px;
  }

  /* Savings bar */
  .savings-bar-card { padding: 18px 24px; }
  .savings-bar-header {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: #374151;
    margin-bottom: 10px;
  }
  .savings-bar-track {
    height: 8px;
    background: #f3f4f6;
    border-radius: 99px;
    overflow: hidden;
  }
  .savings-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #6366f1, #3b82f6);
    border-radius: 99px;
    transition: width 0.6s ease;
  }

  /* Pie layout */
  .pie-layout {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }
  .pie-legend {
    flex: 1;
    min-width: 160px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .pie-legend__item {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .pie-legend__dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .pie-legend__name {
    font-size: 13px;
    color: #374151;
    flex: 1;
  }
  .pie-legend__value {
    font-size: 13px;
    font-weight: 600;
    color: #111827;
  }

  /* Custom tooltip */
  .custom-tooltip {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 10px 14px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    font-size: 13px;
  }
  .custom-tooltip__label {
    font-weight: 600;
    color: #111827;
    margin-bottom: 6px;
  }
  .custom-tooltip p { margin: 3px 0; }

  /* Empty state */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 0;
    color: #9ca3af;
  }
  .empty-state span { font-size: 36px; margin-bottom: 10px; }
  .empty-state p { margin: 0; font-size: 14px; }

  /* Skeleton */
  .skeleton-wrapper {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 8px;
  }
  .skeleton {
    background: linear-gradient(90deg, #f3f4f6 25%, #e9eaec 50%, #f3f4f6 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
    border-radius: 16px;
  }
  .skeleton--card { height: 100px; }
  .skeleton--chart { height: 300px; }
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  @media (max-width: 600px) {
    .stats-header { flex-direction: column; align-items: flex-start; }
    .pie-layout { flex-direction: column; }
    .pie-layout > * { width: 100% !important; }
  }
`;
