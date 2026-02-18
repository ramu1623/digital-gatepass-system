import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getStudentDashboard } from "../../services/studentService";
import { Link } from "react-router-dom";

const StudentDashboard = () => {
    const { token, logout } = useContext(AuthContext);
    const [student, setStudent] = useState(null);

    // ✅ BACKEND BASE URL (local / prod)
    const BASE_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        getStudentDashboard(token).then(setStudent);
    }, [token]);

    if (!student) return <p>Loading...</p>;

    return (
        <div className="student-dashboard">
            <div className="dashboard-header">
                <h2>Student Dashboard</h2>
                <button onClick={logout} className="logout-btn">
                    Logout
                </button>
            </div>

            {/* Profile Card */}
            <div className="card student-details">
                {/* ✅ STUDENT PHOTO */}
                <div className="student-photo">
                    {student.photo ? (
                        <img
                            src={`${BASE_URL}${student.photo}`}
                            alt="Student"
                            className="profile-img"
                        />
                    ) : (
                        <div className="no-photo">No Photo</div>
                    )}
                </div>

                <div>
                    <p><strong>Name:</strong> {student.name}</p>
                    <p><strong>Roll No:</strong> {student.rollNo}</p>
                    <p><strong>Email:</strong> {student.email}</p>
                </div>

                <div>
                    <p><strong>Branch:</strong> {student.branch}</p>
                    <p><strong>Section:</strong> {student.section}</p>
                    <p><strong>Year:</strong> {student.year}</p>
                    <p><strong>Semester:</strong> {student.semester}</p>
                </div>
            </div>

            <h3>Assigned Faculty</h3>

            <div className="card student-faculty">
                <p><strong>Coordinator:</strong> {student.coordinator?.name}</p>
                <p><strong>HOD:</strong> {student.hod?.name}</p>
            </div>

            <nav className="student-actions">
                <Link to="/student/apply" className="action-btn">
                    Apply Gate Pass
                </Link>
                <Link to="/student/history" className="action-btn secondary">
                    My Gate Passes
                </Link>
            </nav>
        </div>
    );
};

export default StudentDashboard;
