import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../services/authService";
import registerIllustration from "../../assests/Sign up-rafiki.png";

const Register = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("student");
  // ... (rest of the state and handlers remain the same) ...
  // Actually, I need to match the existing file content structure exactly for replace_file_content.
  // I will use a larger context to wrap the return statement.

  const [photo, setPhoto] = useState(null);

  const [form, setForm] = useState({
    rollNo: "",
    id: "",
    name: "",
    email: "",
    password: "",
    branch: "",
    section: "",
    year: "",
    semester: "",
    coordinatingSection: "",

    // ✅ NEW FIELDS
    parentMobile: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];

    if (file && file.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5MB");
      e.target.value = null;
      return;
    }

    setPhoto(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("role", role);

    Object.keys(form).forEach((key) => {
      if (form[key]) formData.append(key, form[key]);
    });

    if (role === "student" && photo) {
      formData.append("photo", photo);
    }

    const data = await registerUser(formData);

    if (!data.success) {
      alert(data.message || "Registration failed");
      return;
    }

    alert("Registration successful. Please login.");
    navigate("/");
  };

  return (
    <div className="auth-page">
      {/* LEFT ILLUSTRATION */}
      <div className="auth-left">
        <img src={registerIllustration} alt="Register Illustration" />
      </div>

      {/* RIGHT FORM */}
      <div className="auth-right">
        <div className="auth-container">
          <h2>Register</h2>

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="student">Student</option>
              <option value="coordinator">Coordinator</option>
              <option value="hod">HOD</option>
            </select>

            {role === "student" && (
              <input
                name="rollNo"
                placeholder="Roll No"
                onChange={handleChange}
                required
              />
            )}

            {(role === "coordinator" || role === "hod") && (
              <input
                name="id"
                placeholder="ID"
                onChange={handleChange}
                required
              />
            )}

            <input
              name="name"
              placeholder="Name"
              onChange={handleChange}
              required
            />

            <input
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />

            <input
              name="branch"
              placeholder="Branch"
              onChange={handleChange}
              required
            />

            {/* ================= STUDENT EXTRA FIELDS ================= */}
            {role === "student" && (
              <>
                <input
                  name="section"
                  placeholder="Section"
                  onChange={handleChange}
                  required
                />

                <input
                  name="year"
                  placeholder="Year"
                  onChange={handleChange}
                  required
                />

                <input
                  name="semester"
                  placeholder="Semester"
                  onChange={handleChange}
                  required
                />

                {/* ✅ NEW: Parent Mobile */}
                <input
                  name="parentMobile"
                  placeholder="Parent Mobile Number"
                  onChange={handleChange}
                  required
                />

                <label style={{ display: "block", marginTop: "10px", marginBottom: "5px", fontSize: "14px", color: "#555" }}>Upload Profile Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
              </>
            )}

            {/* ================= COORDINATOR EXTRA FIELDS ================= */}
            {role === "coordinator" && (
              <>
                <input
                  name="coordinatingSection"
                  placeholder="Coordinating Section"
                  onChange={handleChange}
                />
              </>
            )}

            <button type="submit">Register</button>
          </form>

          <p>
            Already registered? <Link to="/">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
