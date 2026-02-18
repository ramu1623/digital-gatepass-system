// HOD-related API calls

const BASE_URL = import.meta.env.VITE_API_URL;

export const getHodRequests = async (token) => {
  const res = await fetch(`${BASE_URL}/api/hod/requests`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.json();
};

export const hodAction = async (token, gatePassId, payload) => {
  const res = await fetch(`${BASE_URL}/api/hod/action/${gatePassId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
  return res.json();
};

export const getHodHistory = async (token) => {
  const res = await fetch(`${BASE_URL}/api/hod/history`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.json();
};
