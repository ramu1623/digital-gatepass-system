const BASE_URL = import.meta.env.VITE_API_URL;

const API_HEADERS = {
  "Content-Type": "application/json"
};

// --------------------
// LOGIN
// --------------------
export const loginUser = async (payload) => {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: API_HEADERS,
    body: JSON.stringify(payload)
  });

  return res.json();
};

// --------------------
// REGISTER
// --------------------
export const registerUser = async (formData) => {
  try {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Registration failed"
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      message: "Network error"
    };
  }
};
