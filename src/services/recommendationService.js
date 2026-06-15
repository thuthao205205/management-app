
export const generateRecommendations = ({
    budgets = [],
    report = null,
    categoryStats = [],
    lastMonthIncome = 0,
    currentMonthIncome = 0,
    lastMonthExpense = 0,
    currentMonthExpense = 0
}) => {
  const recommendations = [];

  // =========================
  // RULE 1: Vượt ngân sách
  // =========================
  budgets.forEach((budget) => {
    if (budget.usageRate > 100) {
      recommendations.push({
        type: "danger",
        title: "Vượt ngân sách",
        message: `Bạn đã vượt ngân sách danh mục "${budget.categoryName}" ${Math.round(
          budget.usageRate - 100
        )}%`
      });
    }
  });

  // =========================
  // RULE 2: Sắp vượt ngân sách
  // =========================
  budgets.forEach((budget) => {
    if (
      budget.usageRate >= 80 &&
      budget.usageRate <= 100
    ) {
      recommendations.push({
        type: "warning",
        title: "Cảnh báo ngân sách",
        message: `Ngân sách "${budget.categoryName}" đã sử dụng ${Math.round(
          budget.usageRate
        )}%`
      });
    }
  });

  // =========================
  // RULE 3: Tỷ lệ tiết kiệm thấp
  // =========================
  if (
    report &&
    report.totalIncome > 0 &&
    report.savingRate < 10
  ) {
    recommendations.push({
      type: "warning",
      title: "Tiết kiệm thấp",
      message:
        "Tỷ lệ tiết kiệm dưới 10%. Bạn nên cắt giảm các khoản chi không cần thiết."
    });
  }

  // =========================
  // RULE 4: Tỷ lệ tiết kiệm tốt
  // =========================
  if (
    report &&
    report.totalIncome > 0 &&
    report.savingRate >= 30
  ) {
    recommendations.push({
      type: "success",
      title: "Tài chính tích cực",
      message:
        "Bạn đang duy trì tỷ lệ tiết kiệm tốt. Hãy cân nhắc tăng quỹ dự phòng hoặc đầu tư."
    });
  }

  // =========================
  // RULE 5: Danh mục chi tiêu quá lớn
  // =========================
  categoryStats.forEach((category) => {
    if (category.percent > 40) {
      recommendations.push({
        type: "info",
        title: "Chi tiêu tập trung",
        message: `Danh mục "${category.name}" chiếm ${Math.round(
          category.percent
        )}% tổng chi tiêu. Hãy xem xét tối ưu khoản mục này.`
      });
    }
  });

  // =========================
  // RULE 6: Không có khuyến nghị
  // =========================
  if (recommendations.length === 0) {
    recommendations.push({
      type: "success",
      title: "Tài chính ổn định",
      message:
        "Tình hình tài chính hiện tại khá cân đối. Hãy tiếp tục duy trì thói quen chi tiêu hợp lý."
    });
  }

  if (
    lastMonthExpense > 0 &&
    currentMonthExpense >
        lastMonthExpense * 1.2
    ) {
    recommendations.push({
        id: "RULE_03",
        type: "warning",
        title: "Chi tiêu tăng mạnh",
        message:
        "Chi tiêu tháng này tăng hơn 20% so với tháng trước"
    });
    }

    if (
    lastMonthIncome > 0 &&
    currentMonthIncome <
        lastMonthIncome * 0.8
    ) {
    recommendations.push({
        id: "RULE_04",
        type: "warning",
        title: "Thu nhập giảm",
        message:
        "Thu nhập tháng này thấp hơn tháng trước"
    });
    }

    if (report.savingRate < 10) {
    recommendations.push({
        id: "RULE_05",
        type: "warning",
        title: "Tiết kiệm thấp",
        message:
        "Tỷ lệ tiết kiệm dưới 10%"
    });
    }

  return recommendations;
};


