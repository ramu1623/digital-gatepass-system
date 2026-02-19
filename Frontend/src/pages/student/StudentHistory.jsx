import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getStudentGatePasses } from "../../services/studentService";
import GatePassCard from "../../components/gatepass/GatePassCard";
import { Link } from "react-router-dom";

const StudentHistory = () => {
  const { token } = useContext(AuthContext);
  const [gatepasses, setGatepasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGatePasses = async () => {
      setLoading(true);
      const data = await getStudentGatePasses(token);
      setGatepasses(Array.isArray(data) ? data : []);
      setLoading(false);
    };

    fetchGatePasses();
  }, [token]);

  return (
    <div className="student-dashboard">
      <div className="dashboard-header">
        <h2>My Gate Passes</h2>
        <Link to="/student/dashboard" className="action-btn secondary">
          ← Back
        </Link>
      </div>

      {loading && <p>Loading gate passes...</p>}

      {!loading && gatepasses.length === 0 && (
        <p>No gate passes found</p>
      )}

      {!loading &&
        gatepasses.map((gp) => (
          <GatePassCard
            key={gp.requestId}   // ✅ Unique ID
            gatePass={gp}        // includes outTime, duration, endTime, isWholeDay
          />
        ))}
    </div>
  );
};

export default StudentHistory;
