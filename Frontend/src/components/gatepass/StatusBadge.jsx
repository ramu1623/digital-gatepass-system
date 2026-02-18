const StatusBadge = ({ status }) => {
  let color = "gray";

  // ✅ Approved
  if (status === "Approved") color = "green";

  // ❌ Rejections
  if (
    status === "Rejected by Coordinator" ||
    status === "Rejected by HOD"
  ) {
    color = "red";
  }

  // ⏳ Pending states
  if (
    status === "Pending" ||
    status === "Pending Coordinator" ||
    status === "Pending HOD"
  ) {
    color = "orange";
  }

  return (
    <span
      style={{
        color,
        fontWeight: "bold",
        padding: "4px 8px",
        borderRadius: "6px",
        fontSize: "0.85rem"
      }}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
