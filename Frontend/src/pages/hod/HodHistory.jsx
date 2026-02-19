import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getHodHistory } from "../../services/hodService";
import GatePassCard from "../../components/gatepass/GatePassCard";
import { Link } from "react-router-dom";

const HodHistory = () => {
  const { token } = useContext(AuthContext);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    getHodHistory(token).then(setHistory);
  }, [token]);

  return (
    <div className="hod-dashboard">
      <div className="dashboard-header">
        <h2>HOD History</h2>
        <Link to="/hod/dashboard" className="action-btn secondary">
          ← Back
        </Link>
      </div>

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

export default HodHistory;
