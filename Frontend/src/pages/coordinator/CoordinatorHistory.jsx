import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getCoordinatorHistory } from "../../services/coordinatorService";
import GatePassCard from "../../components/gatepass/GatePassCard";
import { Link } from "react-router-dom";

const CoordinatorHistory = () => {
  const { token } = useContext(AuthContext);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    getCoordinatorHistory(token).then(setHistory);
  }, [token]);

  return (
    <div className="coordinator-dashboard">
      <h2>Coordinator History</h2>

      <Link to="/coordinator/dashboard" className="action-btn secondary" style={{ marginBottom: "20px" }}>
        ← Back
      </Link>

      {history.length === 0 && <p>No history found</p>}

      {history.map((gp) => (
        <GatePassCard
          key={gp.requestId}
          gatePass={gp}
        />
      ))}
    </div>
  );
};

export default CoordinatorHistory;
