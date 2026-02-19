import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  getCoordinatorRequests,
  coordinatorAction,
} from "../../services/coordinatorService";
import { Link } from "react-router-dom";
import { to12Hour } from "../../../utils/timeUtils";
import SimpleModal from "../../components/common/SimpleModal";

const CoordinatorDashboard = () => {
  const { token, logout, user } = useContext(AuthContext); // ✅ get user also
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
    getCoordinatorRequests(token).then(setRequests);
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
    // Close prompt temporarily or switch to loading state if needed.
    // For now, let's keep it simple.
    
    const data = await coordinatorAction(token, activeRequest, {
      decision: actionType,
      remarks,
    });

    if (!data.success) {
      setModalType('alert');
      setModalTitle('Error');
      setModalMessage(data.message || "Action failed");
      // Keep modal open, switch to alert mode
      return;
    }

    // Success
    setModalType('alert');
    setModalTitle('Success');
    setModalMessage(`Request ${actionType} Successfully!`);
    
    // Update list
    setRequests(requests.filter((r) => r.requestId !== activeRequest));
  };

  const getPriorityClass = (priority) => {
    if (priority === "High") return "priority high";
    if (priority === "Low") return "priority low";
    return "priority normal";
  };

  return (
    <div className="coordinator-dashboard">
      <div className="dashboard-header">
        <h2>Coordinator Dashboard</h2>
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>

      {/* ✅ ADD THIS SECTION */}
      <div className="coordinator-info">
        <h3>Welcome, {user?.name}</h3>
        <div className="user-details">
          <p><strong>Branch:</strong> {user?.branch}</p>
          <p><strong>Section:</strong> {user?.section}</p>
        </div>
      </div>

      <div className="dashboard-actions">
        <h3>Pending Requests</h3>
        <Link to="/coordinator/history" className="action-btn secondary">
          View History
        </Link>
      </div>

      {requests.length === 0 && <p>No pending requests</p>}

      {requests.map((req) => (
        <div
          key={req.requestId}
          className="card gatepass-card pending"
        >
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

            <span className={getPriorityClass(req.priority)}>
              Reason Priority: {req.priority || "Normal"}
            </span>
          </div>

          <div className="gatepass-body">
            <p>
              <strong>Reason:</strong> {req.reason}
            </p>

            <p>
              <strong>Applied On:</strong> {req.appliedDate}
            </p>

            <p>
              <strong>Out Time:</strong> {to12Hour(req.outTime)}
            </p>

            <p>
              <strong>Duration:</strong> {req.durationLabel}
            </p>

            <p>
              <strong>Expected Return:</strong>{" "}
              {req.isWholeDay
                ? "Whole Day (Till 4:30 PM)"
                : to12Hour(req.expectedReturnTime)}
            </p>
          </div>

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

export default CoordinatorDashboard;
