import { categories } from "../../data/mockData";

export default function ExpenseItem({ item }) {
    const category = categories.find(c => c.id == item.categoryId);
  return (
    <div style={{
      background: "white",
      padding: "10px",
      marginBottom: "10px",
      display: "flex",
      justifyContent: "space-between"
    }}>
      <div>
        <b>{item.name}</b>
        <div>{item.date}</div>
      </div>
      <div>
        <b>{item.name}</b>
        <div>category?.name</div>
      </div>

      <div style={{ color: "red" }}>
        {item.amount} đ
      </div>
    </div>
  );
}