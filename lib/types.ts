// =============================
// 🧩 SEASON INTERFACE
// =============================
export interface Season {
  _id: string;
  season?: string; // normalized lowercase key
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
  id: string;
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
  date: string;
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
  requestDate?: string;
  approvedAt?: string;
  promoterName?: string;
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
    season: string;
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
// 🧩 CUSTOMER INTERFACE (Unified)
// =============================
export interface Customer {
  _id: string;
  customerid?: string;
  username: string;
  email: string;
  mobNo?: string;
  cardNo?: string;

  // ✅ Make this REQUIRED (not optional)
  status: "pending" | "approved" | "rejected";

  promoterId?: string | null;
  promoterName?: string;
  seasonId?: string | null;
  seasonName?: string;
  createdAt: string;
  updatedAt?: string;
  promoter?: Promoter;
  seasons?: Season[];
  isApproved?: boolean;
}

// =============================
// 🧩 OPTIONAL FRONTEND EXTENSIONS
// =============================
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
