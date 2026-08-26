const API_BASE_URL = "http://127.0.0.1:8000/api";

export const getCoordinatorDashboard = async () => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Access token not found. Please login again.");
  }

  const response = await fetch(
    `${API_BASE_URL}/accounts/coordinator-dashboard/`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch coordinator dashboard (${response.status})`
    );
  }

  return await response.json();
};