// ============================================================
// API BASE URL
// ============================================================

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000/api";


// ============================================================
// REUSABLE API FETCH
//
// Handles:
// 1. Access token
// 2. Access token expiration
// 3. Refresh token
// 4. Automatic retry
// 5. JSON requests
// 6. FormData / file uploads
// ============================================================

export const apiFetch = async (endpoint, options = {}) => {

  let accessToken = localStorage.getItem("accessToken");

  // ==========================================================
  // CHECK REQUEST BODY TYPE
  // ==========================================================

  const isFormData =
    options.body instanceof FormData;


  // ==========================================================
  // PREPARE HEADERS
  // ==========================================================

  const headers = {
    ...(options.headers || {}),
  };


  // ==========================================================
  // JSON CONTENT TYPE
  //
  // IMPORTANT:
  // Do NOT set Content-Type manually for FormData.
  // Browser will automatically add multipart boundary.
  // ==========================================================

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }


  // ==========================================================
  // ACCESS TOKEN
  // ==========================================================

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }


  // ==========================================================
  // FIRST REQUEST
  // ==========================================================

  let response;

  try {

    response = await fetch(
      `${API_BASE_URL}${endpoint}`,
      {
        ...options,
        headers,
      }
    );

  } catch (error) {

    console.error(
      "API NETWORK ERROR:",
      error
    );

    throw new Error(
      "Unable to connect to the server. Please make sure Django is running.",
      { cause: error }
    );
  }


  // ==========================================================
  // REQUEST SUCCESS / NON-401 RESPONSE
  // ==========================================================

  if (response.status !== 401) {
    return response;
  }


  // ==========================================================
  // ACCESS TOKEN EXPIRED
  // TRY REFRESH TOKEN
  // ==========================================================

  const refreshToken =
    localStorage.getItem("refreshToken");


  if (!refreshToken) {

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    throw new Error(
      "Your login session has expired. Please login again."
    );

  }


  // ==========================================================
  // REFRESH ACCESS TOKEN
  // ==========================================================

  let refreshResponse;

  try {

    refreshResponse = await fetch(
      `${API_BASE_URL}/accounts/token/refresh/`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          refresh: refreshToken,
        }),
      }
    );

  } catch (error) {

    console.error(
      "TOKEN REFRESH NETWORK ERROR:",
      error
    );

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    throw new Error(
      "Unable to connect to the server while refreshing your session.",
      { cause: error }
    );

  }


  // ==========================================================
  // READ REFRESH RESPONSE
  // ==========================================================

  const refreshData =
    await refreshResponse
      .json()
      .catch(() => ({}));


  // ==========================================================
  // REFRESH FAILED
  // ==========================================================

  if (
    !refreshResponse.ok ||
    !refreshData.access
  ) {

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    throw new Error(
      "Your login session has expired. Please login again."
    );

  }


  // ==========================================================
  // SAVE NEW ACCESS TOKEN
  // ==========================================================

  accessToken =
    refreshData.access;

  localStorage.setItem(
    "accessToken",
    accessToken
  );


  // ==========================================================
  // PREPARE RETRY HEADERS
  // ==========================================================

  const retryHeaders = {
    ...(options.headers || {}),
    Authorization:
      `Bearer ${accessToken}`,
  };


  // ==========================================================
  // JSON CONTENT TYPE FOR RETRY
  // ==========================================================

  if (!isFormData) {

    retryHeaders["Content-Type"] =
      "application/json";

  }


  // ==========================================================
  // RETRY ORIGINAL REQUEST
  // ==========================================================

  try {

    response = await fetch(
      `${API_BASE_URL}${endpoint}`,
      {
        ...options,
        headers: retryHeaders,
      }
    );

  } catch (error) {

    console.error(
      "API RETRY NETWORK ERROR:",
      error
    );

    throw new Error(
      "Unable to connect to the server. Please make sure Django is running.",
      { cause: error }
    );

  }


  return response;
};


// ============================================================
// COORDINATOR DASHBOARD
// ============================================================

export const getCoordinatorDashboard =
  async () => {

    const response =
      await apiFetch(
        "/accounts/coordinator-dashboard/",
        {
          method: "GET",
        }
      );


    if (!response.ok) {

      const data =
        await response
          .json()
          .catch(() => ({}));

      throw new Error(
        data?.detail ||
        data?.message ||
        `Failed to fetch coordinator dashboard (${response.status})`
      );

    }


    return await response.json();

  };

export const login = async (username, password) => {
  const response = await fetch(
    `${API_BASE_URL}/accounts/login/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data?.detail || data?.message || data?.error || "Invalid username or password."
    );
  }

  if (!data.access || !data.refresh || !data.role) {
    throw new Error("Login response is missing required authentication data.");
  }

  return data;
};

// ============================================================
// ADMIN DASHBOARD
// ============================================================

export const getAdminDashboard = async () => {
  const response = await apiFetch(
    "/accounts/admin-dashboard/",
    { method: "GET" }
  );

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(
      data?.detail ||
      data?.message ||
      `Failed to fetch admin dashboard (${response.status})`
    );
  }

  return await response.json();
};

export const getStudents = async () => {
  const response = await apiFetch(
    "/accounts/students/",
    { method: "GET" }
  );

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.detail || `Failed to fetch students (${response.status})`);
  }

  return await response.json();
};

export const getCompanies = async () => {
  const response = await apiFetch(
    "/internships/companies/",
    { method: "GET" }
  );
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.detail || `Failed to fetch companies (${response.status})`);
  }
  return await response.json();
};

export const updateCompany = async (id, changes) => {
  const response = await apiFetch(
    `/internships/companies/${id}/`,
    {
      method: "PATCH",
      body: JSON.stringify(changes),
    }
  );
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.detail || `Failed to update company (${response.status})`);
  }
  return await response.json();
};

export const updateStudent = async (id, changes) => {
  const response = await apiFetch(`/accounts/students/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(changes),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.detail || `Failed to update student (${response.status})`);
  }
  return await response.json();
};

export const updateCoordinator = async (id, changes) => {
  const response = await apiFetch(`/accounts/coordinators/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(changes),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.detail || `Failed to update coordinator (${response.status})`);
  }
  return await response.json();
};

export const updateInternship = async (id, changes) => {
  const response = await apiFetch(`/internships/admin/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(changes),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.detail || `Failed to update internship (${response.status})`);
  }
  return await response.json();
};


// ============================================================
// STUDENT DASHBOARD
// ============================================================

export const getStudentDashboard =
  async () => {

    const response =
      await apiFetch(
        "/accounts/dashboard/",
        {
          method: "GET",
        }
      );


    if (!response.ok) {

      const data =
        await response
          .json()
          .catch(() => ({}));

      throw new Error(
        data?.detail ||
        data?.message ||
        `Failed to fetch student dashboard (${response.status})`
      );

    }


    return await response.json();

  };


// ============================================================
// GET MY PROFILE
// ============================================================

export const getMyProfile =
  async () => {

    const response =
      await apiFetch(
        "/accounts/profile/",
        {
          method: "GET",
        }
      );


    if (!response.ok) {

      const data =
        await response
          .json()
          .catch(() => ({}));

      throw new Error(
        data?.detail ||
        data?.message ||
        `Failed to fetch profile (${response.status})`
      );

    }


    return await response.json();

  };

  // ============================================================
// FINAL INTERNSHIP REPORT
// ============================================================

export const submitFinalReport = async ({
  internship,
  summary,
  skills,
  file,
}) => {
  const formData = new FormData();

  formData.append("internship", internship);
  formData.append("summary", summary);
  formData.append("skills", skills);
  formData.append("file", file);

  const response = await apiFetch(
    "/documents/final-report/",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const data = await response
      .json()
      .catch(() => ({}));

    throw new Error(
      data?.detail ||
      data?.message ||
      data?.non_field_errors?.[0] ||
      data?.internship?.[0] ||
      data?.summary?.[0] ||
      data?.skills?.[0] ||
      data?.file?.[0] ||
      `Failed to submit final report (${response.status})`
    );
  }

  return await response.json();
};