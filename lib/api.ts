export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/admin"

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("adminToken")

  const config: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { token }),
      ...options.headers,
    },
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`)
  }

  return response.json()
}

// Dashboard API functions
export const dashboardAPI = {
  getStats: () => apiRequest("/stats"),
  getAllPromoters: () => apiRequest("/all-promoters"),
  getNewCustomers: () => apiRequest("/new-customers"),
  getAllWithdrawals: () => apiRequest("/all-withdrawal"),
  getTransactions: () => apiRequest("/transactions"),
  getSeasonEarnings: () => apiRequest("/season-earnings"),
}

// Promoter API functions
export const promoterAPI = {
  getAll: () => apiRequest("/all-promoters"),
  create: (data: any) => apiRequest("/create-promoter", { method: "POST", body: JSON.stringify(data) }),
  delete: (promoterId: string) =>
    apiRequest("/delete-promoter", { method: "DELETE", body: JSON.stringify({ promoterId }) }),
  getById: (id: string) => apiRequest(`/promoter/${id}`),
  update: (id: string, data: any) => apiRequest(`/promoter/${id}`, { method: "PUT", body: JSON.stringify(data) }),
}

// Season API functions
export const seasonAPI = {
  getAll: () => apiRequest("/seasons"),
  create: (data: any) => apiRequest("/create-season", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) =>
    apiRequest("/update-season", { method: "PUT", body: JSON.stringify({ ...data, seasonId: id }) }),
  getById: (id: string) => apiRequest(`/season/${id}`),
  delete: (id: string) => apiRequest(`/season/${id}`, { method: "DELETE" }),
}

// Customer API functions
export const customerAPI = {
  getAll: () => apiRequest("/customers"),
  getNew: () => apiRequest("/new-customers"),
  approve: (data: { customerId: string; promoterId: string; seasonId: string }) =>
    apiRequest("/approve-customer", { method: "POST", body: JSON.stringify(data) }),
  reject: (customerId: string) =>
    apiRequest("/reject-customer", { method: "POST", body: JSON.stringify({ customerId }) }),
  getById: (id: string) => apiRequest(`/customer/${id}`),
  search: (query: string) => apiRequest(`/customers/search?q=${encodeURIComponent(query)}`),
}

// Withdrawal API functions
export const withdrawalAPI = {
  getAll: () => apiRequest("/all-withdrawal"),
  update: (withdrawId: string, status: "approved" | "rejected") =>
    apiRequest("/update-withdrawal", { method: "PUT", body: JSON.stringify({ withdrawId, check: status }) }),
  getById: (id: string) => apiRequest(`/withdrawal/${id}`),
}

// Transaction API functions
export const transactionAPI = {
  getAll: () => apiRequest("/transactions"),
  getByFilter: (filters: {
    seasonId?: string
    promoterId?: string
    customerId?: string
    type?: "credit" | "debit"
    startDate?: string
    endDate?: string
  }) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })
    return apiRequest(`/transactions?${params.toString()}`)
  },
  getEarningsSummary: () => apiRequest("/earnings-summary"),
  getById: (id: string) => apiRequest(`/transaction/${id}`),
}
