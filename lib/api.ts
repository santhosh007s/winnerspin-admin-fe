export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://65.1.111.185/admin";

export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const token = localStorage.getItem("adminToken");

  const config: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(token && { token }), // send as "token" header as well
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `API Error: ${response.statusText}`);
  }

  return response.json();
};

// Dashboard API functions
export const dashboardAPI = {
  getStats: () => apiRequest("/stats"),
  getAllPromoters: () => apiRequest("/all-promoters"),
  getNewCustomers: () => apiRequest("/new-customers"),
  getAllWithdrawals: () => apiRequest("/all-withdrawal"),
  getTransactions: () => apiRequest("/transactions"),
  getSeasonEarnings: () => apiRequest("/season-earnings"),
};

export const promoterAPI = {
  // Get all promoters for a season
  getAll: (seasonId: string) =>
    apiRequest(`/all-promoters?seasonId=${encodeURIComponent(seasonId)}`),

  // Create a new promoter
  create: (data: unknown) =>
    apiRequest("/create-promoter", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Toggle promoter active status
  toggleStatus: (promoterId: string, isActive: boolean) =>
    apiRequest("/toggle-promoter", {
      method: "POST",
      body: JSON.stringify({ promoterId, isActive }),
    }),

  // Get a single promoter by ID, optionally for a season
  getById: (id: string, params?: { seasonId?: string }) => {
    const query = params?.seasonId
      ? `?seasonId=${encodeURIComponent(params.seasonId)}`
      : "";
    return apiRequest(`/get-promoter/${id}${query}`);
  },

  // Update promoter profile: fields + status + isActive + season
  updateProfile: (
    id: string,
    data: Partial<{
      userid: string;
      username: string;
      email: string;
      mobNo: string;
      status?: "approved" | "unapproved";
      isActive?: boolean;
      selectedSeason?: string;
    }>
  ) =>
    apiRequest("/update-promoter-profile", {
      method: "POST",
      body: JSON.stringify({ promoterId: id, ...data }),
    }),
};

export const seasonAPI = {
  getAll: () => apiRequest("/all-seasons"),
  create: (data: unknown) =>
    apiRequest("/create-season", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: unknown) =>
    apiRequest("/update-season", {
      method: "POST",
      body: JSON.stringify({
        ...(typeof data === "object" && data !== null ? data : {}),
        seasonId: id,
      }),
    }),
  getById: (id: string) => apiRequest(`/season/${id}`),
  delete: (id: string) =>
    apiRequest(`/season/${id}/delete`, {
      method: "POST",
      body: JSON.stringify({ seasonId: id }), // optional, can be used on server
    }),
  getPreviousPromoters: () => apiRequest("/prev-promoters"),
};

function getSeasonId(): string | null {
  const season = localStorage.getItem("selectedSeason");
  return season;
}
// Customer API functions
export const customerAPI = {
  getAll: () => {
    const seasonId = getSeasonId();
    return apiRequest(
      `/all-customers${seasonId ? `?seasonId=${seasonId}` : ""}`
    );
  },
  getNew: () => {
    const seasonId = getSeasonId();
    return apiRequest(
      `/new-customers${seasonId ? `?seasonId=${seasonId}` : ""}`
    );
  },
  approve: ({
    customerId,
    promoterId,
    seasonId,
  }: {
    customerId: string;
    promoterId: string;
    seasonId: string;
  }) =>
    apiRequest(`/approve-customer`, {
      method: "POST",
      body: JSON.stringify({ customerId, promoterId, seasonId }),
    }),
  reject: (customerId: string) =>
    apiRequest("/reject-customer", {
      method: "POST",
      body: JSON.stringify({ customerId }),
    }),
  getById: (id: string) => apiRequest(`/customer/${id}`),
  search: (query: string) =>
    apiRequest(`/customers/search?q=${encodeURIComponent(query)}`),
};

// Withdrawal API functions
export const withdrawalAPI = {
  getAll: (season?: string) =>
    apiRequest(`/all-withdrawal${season ? `?seasonId=${season}` : ""}`),
  update: (withdrawId: string, status: "approved" | "rejected" | "pending") =>
    apiRequest("/update-withdrawal", {
      method: "POST",
      body: JSON.stringify({ withdrawId, check: status }),
    }),
  getById: (id: string) => apiRequest(`/withdrawal/${id}`),
};

// Activities API functions
export const activitiesAPI = {
  getAll: () => apiRequest("/activities"),
};
//transactionAPI api function
export const transactionAPI = {
  getAll: () => {
    const selectedSeasonId = localStorage.getItem("selectedSeason");
    return apiRequest(
      `/all-transactions${
        selectedSeasonId ? `?seasonId=${selectedSeasonId}` : ""
      }`
    );
  },

  getByFilter: (filters: {
    seasonId?: string;
    promoterId?: string;
    customerId?: string;
    type?: "credit" | "debit";
    startDate?: string;
    endDate?: string;
  }) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, String(value));
    });
    return apiRequest(`/transactions?${params.toString()}`);
  },
  getEarningsSummary: () => apiRequest("/earnings-summary"),
  getById: (id: string) => apiRequest(`/transaction/${id}`),
};

// Admin API functions
export const adminAPI = {
  login: (username: string, password: string) =>
    apiRequest("/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),
  getWallet: () => apiRequest("/admin-wallet"),
};

export const posterAPI = {
  upload: async (file: File, audience: "promoter" | "customer") => {
    const formData = new FormData();
    formData.append("poster", file);
    formData.append("audience", audience);

    // Get selected season from localStorage
    const selectedSeason = localStorage.getItem("selectedSeason");
    if (selectedSeason) {
      formData.append("season", selectedSeason); // send season ID
    }

    const token = localStorage.getItem("adminToken");

    const res = await fetch(`${API_BASE_URL}/upload-poster`, {
      method: "POST",
      body: formData,
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(token && { token }),
        // Don't set 'Content-Type', browser handles multipart automatically
      },
    });

    if (!res.ok) {
      const errorData = await res
        .json()
        .catch(() => ({ message: res.statusText }));
      throw new Error(errorData.message || `Upload Error: ${res.statusText}`);
    }

    return res.json();
  },
};

export const repaymentAPI = {
  getAll: (seasonId: string | null) =>
    apiRequest(`/all-repayments${seasonId ? `?seasonId=${seasonId}` : ""}`),

  approve: (installmentId: string, promoterId: string) =>
    apiRequest(`/approve-repayment`, {
      method: "POST",
      body: JSON.stringify({ installmentId, promoterId }),
    }),
};

export const adminStatsAPI = {
  // Get totalPromoters, totalCustomers, totalAmount for selected season
  getAdminStats: (seasonId: string) =>
    apiRequest(`/admin-stats${seasonId ? `?seasonId=${seasonId}` : ""}`),
};
