// Coordinator-related API calls

const BASE_URL = import.meta.env.VITE_API_URL;

export const getCoordinatorRequests = async (token) => {
  const res = await fetch(`${BASE_URL}/api/coordinator/requests`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.json();
};

export const coordinatorAction = async (token, gatePassId, payload) => {
  const res = await fetch(`${BASE_URL}/api/coordinator/action/${gatePassId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
  return res.json();
};

export const getCoordinatorHistory = async (token) => {
  const res = await fetch(`${BASE_URL}/api/coordinator/history`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.json();
};
