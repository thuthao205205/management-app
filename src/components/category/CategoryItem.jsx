export default function CategoryItem({ item }) {
  return (
    <div style={{
      background: "white",
      padding: "10px",
      marginBottom: "10px",
      display: "flex",
      justifyContent: "space-between"
    }}>
      <div>
        {item.name}
      </div>

      <div>
        ✏️ ❌
      </div>
    </div>
  );
}