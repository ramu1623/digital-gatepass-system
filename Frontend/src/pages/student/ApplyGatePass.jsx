import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { applyGatePass } from "../../services/studentService";
import { useNavigate, Link } from "react-router-dom";

const COLLEGE_END_TIME = 16 * 60 + 30; // 4:30 PM

// 🔁 24-hour → 12-hour formatter (UI only)
const formatTo12Hour = (time) => {
  if (!time) return "";

  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;

  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
};

const ApplyGatePass = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    reason: "",
    outTime: "",
    duration: ""
  });

  const [endPreview, setEndPreview] = useState("");
  const [isWholeDay, setIsWholeDay] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔄 Calculate end time / whole day preview
  useEffect(() => {
    if (!form.outTime || !form.duration) {
      setEndPreview("");
      setIsWholeDay(false);
      return;
    }

    const [h, m] = form.outTime.split(":").map(Number);
    const outMinutes = h * 60 + m;
    const durationMinutes = Number(form.duration) * 60;
    const endMinutes = outMinutes + durationMinutes;

    if (endMinutes >= COLLEGE_END_TIME) {
      setIsWholeDay(true);
      setEndPreview("Whole Day");
    } else {
      const eh = Math.floor(endMinutes / 60);
      const em = endMinutes % 60;

      setIsWholeDay(false);
      setEndPreview(
        formatTo12Hour(
          `${String(eh).padStart(2, "0")}:${String(em).padStart(2, "0")}`
        )
      );
    }
  }, [form.outTime, form.duration]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.outTime || !form.duration || Number(form.duration) <= 0) {
      alert("Out time and valid duration are required");
      return;
    }

    // ✅ IMPORTANT: map duration → durationHours
    const payload = {
      reason: form.reason,
      outTime: form.outTime,                 // 24-hour format
      durationHours: Number(form.duration)   // 👈 FIX
    };
    console.log("FINAL PAYLOAD TO API:", payload);

    const data = await applyGatePass(token, payload);

    if (!data.success) {
      alert(data.message || "Failed to apply gate pass");
      return;
    }

    alert("Gate pass applied successfully");
    navigate("/student/dashboard");
  };

  return (
    <div className="student-dashboard">
      <h2>Apply Gate Pass</h2>

      <div className="card">
        <form onSubmit={handleSubmit} className="form-grid">
          <label>
            Reason
            <textarea
              name="reason"
              placeholder="Enter reason"
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Out Time
            <input
              type="time"
              name="outTime"
              onChange={handleChange}
              required
            />
          </label>

          {form.outTime && (
            <div className="info-text">
              <strong>Selected Out Time:</strong>{" "}
              {formatTo12Hour(form.outTime)}
            </div>
          )}

          <label>
            Duration (hours)
            <input
              type="number"
              name="duration"
              min="1"
              placeholder="e.g. 2"
              onChange={handleChange}
              required
            />
          </label>

          {endPreview && (
            <div className="info-text">
              <strong>Validation:</strong>{" "}
              {isWholeDay ? (
                <span style={{ color: "orange", fontWeight: "bold" }}>
                  Whole Day (Till 4:30 PM)
                </span>
              ) : (
                <>Until <strong>{endPreview}</strong></>
              )}
            </div>
          )}

          <button type="submit" className="action-btn">
            Apply Gate Pass
          </button>
        </form>
      </div>

      <Link to="/student/dashboard" className="action-btn secondary">
        ← Back
      </Link>
    </div>
  );
};

export default ApplyGatePass;
