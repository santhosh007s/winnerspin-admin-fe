"use client";

import { useState, useEffect, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WithdrawalTable } from "@/components/withdrawal-table";
import { WithdrawalStats } from "@/components/withdrawal-stats";
import { RecentWithdrawals } from "@/components/recent-withdrawals";
import { withdrawalAPI } from "@/lib/api";
import Loader from "@/components/loader";
import { Withdrawal as GlobalWithdrawal } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function WithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<GlobalWithdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // =============================
  // FETCH ALL WITHDRAWALS
  // =============================
  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        setLoading(true);
        const season = localStorage.getItem("selectedSeason") || "";
        const res = await withdrawalAPI.getAll(season);

        const list = Array.isArray(res.withdraw) ? res.withdraw : [];
        setWithdrawals(list);
      } catch {
        setError("Failed to fetch withdrawals");
      } finally {
        setLoading(false);
      }
    };

    fetchWithdrawals();
  }, []);

  // =============================
  // APPROVE / REJECT HANDLERS
  // =============================
  const handleApprove = async (id: string) => {
    try {
      await withdrawalAPI.update(id, "approved");

      setWithdrawals((prev) =>
        prev.map((w) =>
          w._id === id
            ? {
                ...w,
                status: "approved",
                approvedAt: new Date().toISOString(),
              }
            : w
        )
      );
    } catch {
      setError("Failed to approve withdrawal");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await withdrawalAPI.update(id, "rejected");

      setWithdrawals((prev) =>
        prev.map((w) =>
          w._id === id
            ? {
                ...w,
                status: "rejected",
                approvedAt: undefined,
              }
            : w
        )
      );
    } catch {
      setError("Failed to reject withdrawal");
    }
  };

  // =============================
  // FILTERS
  // =============================
  const pending = withdrawals.filter((w) => w.status === "pending");
  const approved = withdrawals.filter((w) => w.status === "approved");
  const rejected = withdrawals.filter((w) => w.status === "rejected");
  const all = withdrawals;

  // =============================
  // EXPORT DATA PREPARATION
  // =============================
  const rowsForExport = useMemo(() => {
    return withdrawals.map((w) => {
      const promoter = w.requester?.username || "Unknown";

      const requestDate = new Date(w.createdAt).toLocaleDateString("en-IN", {
        dateStyle: "medium",
      });

      let processed = "Not processed";

      if (w.status === "approved" && w.approvedAt) {
        processed = new Date(w.approvedAt).toLocaleDateString("en-IN", {
          dateStyle: "medium",
        });
      } else if (w.status === "rejected") {
        processed = "Rejected";
      }

      return {
        Promoter: promoter,
        Amount: w.amount,
        Status: w.status,
        "Request Date": requestDate,
        "Processed Date": processed,
      };
    });
  }, [withdrawals]);

  // =============================
  // EXPORT TO EXCEL
  // =============================
  const handleExportExcel = async () => {
    if (!withdrawals.length) return alert("No withdrawals to export");

    try {
      setExporting(true);
      const XLSX = await import("xlsx");

      const ws = XLSX.utils.json_to_sheet(rowsForExport);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Withdrawals");

      XLSX.writeFile(wb, "withdrawals.xlsx");
    } finally {
      setExporting(false);
    }
  };

  // =============================
  // RENDER
  // =============================
  return (
    <div className="space-y-6 relative mt-15 lg:mt-0">
      <Loader show={loading} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between">
        <div>
          <h1 className="text-3xl font-bold">Winnerspin Withdrawals</h1>
          <p className="text-muted-foreground">
            Manage promoter withdrawal requests
          </p>
        </div>

        <Button
          onClick={handleExportExcel}
          disabled={exporting || !withdrawals.length}
        >
          <Download className="mr-2 h-4 w-4" />
          {exporting ? "Exporting..." : "Export Excel"}
        </Button>
      </div>

      <WithdrawalStats withdrawals={withdrawals} loading={loading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All ({all.length})</TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({pending.length})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved ({approved.length})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected ({rejected.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <WithdrawalTable
                withdrawals={all}
                loading={loading}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            </TabsContent>

            <TabsContent value="pending">
              <WithdrawalTable
                withdrawals={pending}
                loading={loading}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            </TabsContent>

            <TabsContent value="approved">
              <WithdrawalTable
                withdrawals={approved}
                loading={loading}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            </TabsContent>

            <TabsContent value="rejected">
              <WithdrawalTable
                withdrawals={rejected}
                loading={loading}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            </TabsContent>
          </Tabs>
        </div>

        <RecentWithdrawals
          withdrawals={pending}
          loading={loading}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}
