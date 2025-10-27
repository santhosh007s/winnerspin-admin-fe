"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransactionTable } from "@/components/transaction-table";
import { TransactionStats } from "@/components/transaction-stats";
import { EarningsSummary } from "@/components/earnings-summary";
import { RecentTransactions } from "@/components/recent-transactions";
import { transactionAPI, seasonAPI, promoterAPI } from "@/lib/api";
import Loader from "@/components/loader"; // ✅ use your global loader

interface Transaction {
  id: string;
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
  description?: string;
  status: "completed" | "pending" | "failed" | string;
  creditedTo?: "admin" | "promoter";
}

interface ServerPromoter {
  _id: string;
  userid?: string;
  username?: string;
}

interface ServerCustomer {
  _id: string;
  username?: string;
}

interface ServerTransaction {
  _id: string;
  season: { _id: string; season: string };
  promoter?: ServerPromoter;
  customer?: ServerCustomer;
  amount: number;
  to: "promoter" | "admin";
  createdAt: string;
  [k: string]: unknown;
}

interface ServerWithdrawal {
  _id: string;
  amount: string | number;
  requester: ServerPromoter;
  createdAt: string;
  status?: string;
  [k: string]: unknown;
}

interface Season {
  _id: string;
  Season?: string;
  name?: string;
  title?: string;
  [k: string]: unknown;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [promoters, setPromoters] = useState<ServerPromoter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const season = localStorage.getItem("selectedSeason");

      const [transactionRes, seasonsRes, promotersRes] = await Promise.all([
        transactionAPI.getAll(season) as Promise<{
          message?: string;
          transactions?: ServerTransaction[];
          withdrawals?: ServerWithdrawal[];
        }>,
        seasonAPI.getAll() as Promise<unknown>,
        promoterAPI.getAll(season) as Promise<unknown>,
      ]);

      const serverTransactions: ServerTransaction[] =
        transactionRes?.transactions || [];
      const serverWithdrawals: ServerWithdrawal[] =
        transactionRes?.withdrawals || [];

      // ✅ Map credits
      const mappedCredits: Transaction[] = serverTransactions.map((tx) => {
        const creditedTo: "admin" | "promoter" =
          tx.to === "admin" ? "admin" : "promoter";
        const from = tx.customer?.username ?? "customer";
        const to = creditedTo === "admin" ? "admin" : "promoter";
        return {
          id: tx._id,
          type: "credit",
          creditedTo,
          amount: tx.amount,
          from,
          to,
          seasonId: tx.season?._id,
          seasonName: tx.season?.season,
          promoterId: tx.promoter?._id,
          promoterName: tx.promoter?.username ?? tx.promoter?.userid,
          customerId: tx.customer?._id,
          customerName: tx.customer?.username,
          date: tx.createdAt,
          status: "completed",
        };
      });

      // ✅ Map debits (withdrawals)
      const mappedDebits: Transaction[] = serverWithdrawals.map((w) => {
        const amountNum =
          typeof w.amount === "string"
            ? parseFloat(w.amount) || 0
            : Number(w.amount || 0);
        return {
          id: w._id,
          type: "debit",
          amount: amountNum,
          from: "admin",
          to: w.requester?.username ?? w.requester?.userid ?? "promoter",
          seasonId: w.season?._id,
          seasonName: w.season?.season,
          promoterId: w.requester?._id,
          promoterName: w.requester?.username ?? w.requester?.userid,
          customerId: undefined,
          customerName: undefined,
          date: w.createdAt,
          status:
            w.status === "approved"
              ? "completed"
              : (w.status as Transaction["status"]) || "completed",
        };
      });

      // ✅ Combine + sort by date
      const combined = [...mappedCredits, ...mappedDebits].sort((a, b) => {
        const da = new Date(a.date).getTime();
        const db = new Date(b.date).getTime();
        return db - da;
      });

      setTransactions(combined);

      // ✅ Normalize season and promoter data
      const seasonsArray: Season[] = Array.isArray((seasonsRes as any)?.seasons)
        ? (seasonsRes as any).seasons
        : Array.isArray(seasonsRes)
        ? (seasonsRes as Season[])
        : [];

      const promotersArray: ServerPromoter[] = Array.isArray(
        (promotersRes as any)?.allPromoters
      )
        ? (promotersRes as any).allPromoters
        : Array.isArray((promotersRes as any)?.promoters)
        ? (promotersRes as any).promoters
        : Array.isArray(promotersRes)
        ? (promotersRes as ServerPromoter[])
        : [];

      setSeasons(seasonsArray);
      setPromoters(promotersArray);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch transaction data"
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Stats
  const totalCount = transactions.length;
  const creditTransactions = transactions.filter((t) => t.type === "credit");
  const debitTransactions = transactions.filter((t) => t.type === "debit");
  const creditedToAdminCount = creditTransactions.filter(
    (t) => t.creditedTo === "admin"
  ).length;
  const creditedToPromoterCount = creditTransactions.filter(
    (t) => t.creditedTo === "promoter"
  ).length;

  return (
    <div className="space-y-6 relative">
      {/* ✅ Loader overlay */}
      <Loader show={loading} />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Transactions</h1>
        <p className="text-muted-foreground">
          Track all financial transactions and earnings across the system
        </p>
      </div>

      {/* Stats */}
      <TransactionStats transactions={transactions} loading={loading} />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">
                All Transactions ({totalCount})
              </TabsTrigger>
              <TabsTrigger value="admin">
                Credited to Admin ({creditedToAdminCount})
              </TabsTrigger>
              <TabsTrigger value="promoter">
                Credited to Promoter ({creditedToPromoterCount})
              </TabsTrigger>
              <TabsTrigger value="debits">
                Debits ({debitTransactions.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <Card>
                <CardHeader>
                  <CardTitle>All Transactions</CardTitle>
                  <CardDescription>
                    Complete transaction history (credits + withdrawals)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TransactionTable
                    transactions={transactions}
                    loading={loading}
                    seasons={seasons}
                    promoters={promoters}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="admin">
              <Card>
                <CardHeader>
                  <CardTitle>Credited to Admin</CardTitle>
                  <CardDescription>
                    Transactions credited to admin
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TransactionTable
                    transactions={creditTransactions.filter(
                      (t) => t.creditedTo === "admin"
                    )}
                    loading={loading}
                    seasons={seasons}
                    promoters={promoters}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="promoter">
              <Card>
                <CardHeader>
                  <CardTitle>Credited to Promoter</CardTitle>
                  <CardDescription>
                    Transactions credited to promoters
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TransactionTable
                    transactions={creditTransactions.filter(
                      (t) => t.creditedTo === "promoter"
                    )}
                    loading={loading}
                    seasons={seasons}
                    promoters={promoters}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="debits">
              <Card>
                <CardHeader>
                  <CardTitle>Debits (Withdrawals)</CardTitle>
                  <CardDescription>
                    All withdrawal payouts (debited from admin)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TransactionTable
                    transactions={debitTransactions}
                    loading={loading}
                    seasons={seasons}
                    promoters={promoters}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div>
          <RecentTransactions transactions={transactions} loading={loading} />
        </div>
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}
