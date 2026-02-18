// Shared gate pass APIs (used by student / security / common views)

const BASE_URL = import.meta.env.VITE_API_URL;

// Get single gate pass by MongoDB _id
export const getGatePassById = async (token, gatePassId) => {
  const res = await fetch(`${BASE_URL}/api/gatepass/${gatePassId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.json();
};

// Update in-time when student returns to college
export const updateInTime = async (token, gatePassId) => {
  const res = await fetch(`${BASE_URL}/api/gatepass/in-time/${gatePassId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.json();
};
