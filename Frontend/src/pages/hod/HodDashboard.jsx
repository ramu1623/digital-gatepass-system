import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getHodRequests, hodAction } from "../../services/hodService";
import { Link } from "react-router-dom";
import { to12Hour } from "../../../utils/timeUtils";
import SimpleModal from "../../components/common/SimpleModal";

const HodDashboard = () => {
  const { token, logout, user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('prompt'); // 'prompt' or 'alert'
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [activeRequest, setActiveRequest] = useState(null);
  const [actionType, setActionType] = useState(''); // 'Approved' or 'Rejected'

  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    getHodRequests(token).then(setRequests);
  }, [token]);

  const initiateAction = (requestId, decision) => {
    setActiveRequest(requestId);
    setActionType(decision);
    setModalType('prompt');
    setModalTitle(`Enter Remarks for ${decision}`);
    setModalMessage('');
    setModalOpen(true);
  };

  const submitAction = async (remarks) => {
    const data = await hodAction(token, activeRequest, {
      decision: actionType,
      remarks,
    });

    if (!data.success) {
      setModalType('alert');
      setModalTitle('Error');
      setModalMessage(data.message || "Action failed");
      return;
    }

    setModalType('alert');
    setModalTitle('Success');
    setModalMessage(`Request ${actionType} Successfully!`);
    
    setRequests(requests.filter((r) => r.requestId !== activeRequest));
  };

  // 🎨 Priority badge class
  const getPriorityClass = (priority) => {
    if (priority === "High") return "priority high";
    if (priority === "Low") return "priority low";
    return "priority normal";
  };

  return (
    <div className="hod-dashboard">
      <button onClick={logout} className="logout-btn">
        Logout
      </button>

      <h2>HOD Dashboard</h2>

      <div className="hod-info">
        <h3>Welcome, {user?.name}</h3>
        <div className="user-details">
          <p><strong>Branch:</strong> {user?.branch}</p>
        </div>
      </div>

      <div className="dashboard-actions">
        <h3>Pending Requests</h3>
        <Link to="/hod/history" className="action-btn secondary">
          View History
        </Link>
      </div>

      {requests.length === 0 && <p>No pending requests</p>}

      {requests.map((req) => (
        <div
          key={req.requestId}
          className="card gatepass-card pending"
        >
          {/* ✅ HEADER */}
          <div className="gatepass-header">
            <div className="student-info">
              {req.student?.photo ? (
                <img
                  src={`${BASE_URL}${req.student.photo}`}
                  alt="Student"
                  className="profile-img small"
                />
              ) : (
                <div className="no-photo small">No Photo</div>
              )}

              <div>
                <h4>
                  {req.student.name} ({req.student.rollNo})
                </h4>

                <span className="gatepass-id">
                  Gate Pass ID: <strong>{req.requestId}</strong>
                </span>
              </div>
            </div>

            {/* 🤖 ML PRIORITY BADGE */}
            <span className={getPriorityClass(req.priority)}>
              Reason Priority: {req.priority || "Normal"}
            </span>
          </div>

          {/* ✅ BODY */}
          <div className="gatepass-body">
            <p>
              <strong>Reason:</strong> {req.reason}
            </p>

            <p>
              <strong>Applied On:</strong> {req.appliedDate}
            </p>

            <p>
              <strong>Out Time:</strong>{" "}
              {to12Hour(req.outTime)}
            </p>

            <p>
              <strong>Duration:</strong>{" "}
              {req.durationLabel}
            </p>

            <p>
              <strong>Expected Return:</strong>{" "}
              {req.isWholeDay
                ? "Whole Day (Till 4:30 PM)"
                : to12Hour(req.expectedReturnTime)}
            </p>

            <p>
              <strong>Coordinator Decision:</strong>{" "}
              {req.coordinator?.decision || "Pending"}
            </p>
          </div>

          {/* ✅ ACTIONS */}
          <div className="action-group">
            <button
              className="action-btn approve"
              onClick={() => initiateAction(req.requestId, "Approved")}
            >
              Approve
            </button>

            <button
              className="action-btn reject"
              onClick={() => initiateAction(req.requestId, "Rejected")}
            >
              Reject
            </button>
          </div>
        </div>
      ))}

      <SimpleModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        type={modalType}
        message={modalMessage}
        onSubmit={submitAction}
      />
    </div>
  );
};

export default HodDashboard;
