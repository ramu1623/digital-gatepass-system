// Student-related API calls

const BASE_URL = import.meta.env.VITE_API_URL;

export const getStudentDashboard = async (token) => {
  const res = await fetch(`${BASE_URL}/api/student/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.json();
};

export const applyGatePass = async (token, payload) => {
  try {
    const res = await fetch(`${BASE_URL}/api/student/apply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        reason: payload.reason,
        fromDate: payload.fromDate,
        toDate: payload.toDate,
        outTime: payload.outTime,
        durationHours: payload.durationHours
      })
    });

    return res.json();
  } catch (error) {
    return {
      success: false,
      message: "Network error while applying gate pass"
    };
  }
};

export const getStudentGatePasses = async (token) => {
  const res = await fetch(`${BASE_URL}/api/student/gatepasses`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.json();
};
