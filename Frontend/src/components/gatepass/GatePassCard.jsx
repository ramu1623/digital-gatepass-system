import StatusBadge from "./StatusBadge";
import { to12Hour } from "../../../utils/timeUtils";


const GatePassCard = ({ gatePass }) => {
  const getDisplayStatus = () => {
    if (gatePass.status === "Rejected by Coordinator") {
      return "Rejected by Coordinator";
    }

    if (gatePass.status === "Rejected by HOD") {
      return "Rejected by HOD";
    }

    if (gatePass.status === "Approved") {
      return "Approved";
    }

    if (gatePass.coordinator?.decision === "Pending") {
      return "Pending Coordinator";
    }

    if (
      gatePass.coordinator?.decision === "Approved" &&
      gatePass.hod?.decision === "Pending"
    ) {
      return "Pending HOD";
    }

    return "Pending";
  };

  const displayStatus = getDisplayStatus();

  // 🎨 Priority badge class
  const getPriorityClass = (priority) => {
    if (priority === "High") return "priority high";
    if (priority === "Low") return "priority low";
    return "priority normal";
  };

  return (
    <div
      className={`gatepass-card card ${displayStatus
        .toLowerCase()
        .replace(/\s/g, "-")}`}
    >
      {/* ✅ HEADER */}
      <div className="gatepass-header">
        <div>
          <h4>{gatePass.student.name}</h4>
          <span className="gatepass-id">
            Gate Pass ID: <strong>{gatePass.requestId}</strong>
          </span>
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {/* 🤖 ML PRIORITY */}
          <span className={getPriorityClass(gatePass.priority)}>
            Reason Priority: {gatePass.priority || "Normal"}
          </span>

          <StatusBadge status={displayStatus} />
        </div>
      </div>

      {/* ✅ BODY */}
      <div className="gatepass-body">
        <p>
          <strong>Roll No:</strong> {gatePass.student.rollNo}
        </p>

        <p>
          <strong>Reason:</strong> {gatePass.reason}
        </p>

        <p>
          <strong>Applied On:</strong> {gatePass.appliedDate}
        </p>

        <p>
          <strong>Out Time:</strong>{" "}
          {to12Hour(gatePass.outTime)}
        </p>

        <p>
          <strong>Duration:</strong>{" "}
          {gatePass.durationLabel}
        </p>

        <p>
          <strong>Expected Return:</strong>{" "}
          {gatePass.isWholeDay ? (
            <span style={{ color: "orange", fontWeight: "bold" }}>
              Whole Day (Till 4:30 PM)
            </span>
          ) : (
            <strong>{to12Hour(gatePass.expectedReturnTime)}</strong>
          )}
        </p>
      </div>
    </div>
  );
};

export default GatePassCard;
