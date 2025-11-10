// =============================
// 🧩 SEASON INTERFACE
// =============================
export interface Season {
  _id: string;
  Season?: string;
  amount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// =============================
// 🧩 PROMOTER INTERFACE
// =============================
export interface Promoter {
  _id: string;
  userid: string;
  username?: string;
  email: string;
  mobNo: string;
  balance: number;
  isActive: boolean;
  seasonData?: Array<{
    season: string;
    status: "approved" | "unapproved";
  }>;
}

// =============================
// 🧩 TRANSACTION INTERFACE
// =============================
export interface Transaction {
  id: string; // frontend ID key (for React)
  _id: string;
  type: "credit" | "debit";
  amount: number;
  from: string;
  to: string;
  seasonId?: string;
  seasonName?: string;
  promoterId?: string;
  promoterName?: string;
  customerId?: string;
  customerName?: string;
  date: string; // display / sorting
  status: "pending" | "completed" | "failed";
  transactionType?:
    | "customer-payment"
    | "promoter-repayment"
    | "admin-credit"
    | "withdrawal";
  creditedTo?: "admin" | "promoter";
  createdAt?: string;
  updatedAt?: string;
  description?: string;
}

// =============================
// 🧩 WITHDRAWAL INTERFACE
// =============================
// (merged both duplicate definitions and made optional fields consistent)
export interface Withdrawal {
  _id: string;
  promoterId: string;
  requester: {
    _id: string;
    userid?: string;
    username?: string;
  };
  amount: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
  processedDate?: string;
  notes?: string;
  promoterUsername?: string;
}

// =============================
// 🧩 REPAYMENT INTERFACE
// =============================
export interface Repayment {
  _id: string;
  promoter: {
    _id: string;
    username: string;
    userid: string;
  };
  season: {
    _id: string;
    Season: string;
  };
  amount: number;
  status: "pending" | "approved" | "rejected";
  installments: Array<{
    _id: string;
    amount: number;
    status: "paid" | "unpaid";
    dueDate: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

// =============================
// 🧩 CUSTOMER INTERFACE
// =============================
export interface Customer {
  _id: string;
  customerid: string;
  username: string;
  email: string;
  mobNo: string;
  promoterId: string | null;
  seasonId: string | null;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

// =============================
// 🧩 OPTIONAL FRONTEND EXTENSIONS
// =============================
// Used for table & UI mapping safety (optional fields, added names)

export interface ExtendedWithdrawal extends Omit<Withdrawal, "requester"> {
  requester: {
    _id?: string;
    userid?: string;
    username?: string;
  };
}

export interface ExtendedTransaction extends Transaction {
  seasonName?: string;
  promoterName?: string;
  customerName?: string;
}
