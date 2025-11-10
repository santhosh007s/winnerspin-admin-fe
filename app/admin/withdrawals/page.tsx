
"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  const [loading, setLoading] = useState<boolean>(true);
  const [exporting, setExporting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);

      const season = localStorage.getItem("selectedSeason");
      if (!season) throw new Error("No season selected in local storage");

      const withdrawalsRes = await withdrawalAPI.getAll(season);
      const withdrawalsList: GlobalWithdrawal[] = Array.isArray(
        withdrawalsRes.withdraw
      )
        ? withdrawalsRes.withdraw
        : [];

      setWithdrawals(withdrawalsList);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch withdrawals"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (withdrawalId: string) => {
    try {
      await withdrawalAPI.update(withdrawalId, "approved");
      setWithdrawals((prev) =>
        prev.map((w) =>
          w._id === withdrawalId
            ? { ...w, status: "approved", approvedAt: new Date().toISOString() }
            : w
        )
      );
    } catch {
      setError("Failed to approve withdrawal");
    }
  };

  const handleReject = async (withdrawalId: string) => {
    try {
      await withdrawalAPI.update(withdrawalId, "rejected");
      setWithdrawals((prev) =>
        prev.map((w) =>
          w._id === withdrawalId
            ? { ...w, status: "rejected", rejectedAt: new Date().toISOString() }
            : w
        )
      );
    } catch {
      setError("Failed to reject withdrawal");
    }
  };

  const pendingWithdrawals = withdrawals.filter((w) => w.status === "pending");
  const processedWithdrawals = withdrawals.filter(
    (w) => w.status === "approved" || w.status === "rejected"
  );

  // ✅ Only include columns shown in the UI table
  const rowsForExport = useMemo(() => {
    return withdrawals.map((w) => {
      const promoterName =
        typeof w.requester === "object"
          ? w.requester?.username ?? "Unknown"
          : w.promoterName ?? "Unknown";

      const amount = w.amount ?? 0;

      const status =
        w.status?.charAt(0).toUpperCase() + w.status?.slice(1) || "Unknown";

      const requestDate = new Date(
        w.requestDate ?? w.createdAt
      ).toLocaleDateString("en-IN", { dateStyle: "medium" });

      let processedDate = "Not approved yet";
      if (w.status === "approved" && w.approvedAt) {
        processedDate = new Date(w.approvedAt).toLocaleDateString("en-IN", {
          dateStyle: "medium",
        });
      } else if (w.status === "rejected") {
        processedDate = "Rejected";
      }

      return {
        Promoter: promoterName,
        Amount: amount,
        Status: status,
        "Request Date": requestDate,
        "Processed Date": processedDate,
      };
    });
  }, [withdrawals]);

  const handleExportExcel = async () => {
    try {
      if (withdrawals.length === 0) {
        alert("No withdrawals to export");
        return;
      }

      setExporting(true);
      const XLSX = await import("xlsx");

      const ws = XLSX.utils.json_to_sheet(rowsForExport);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Withdrawals");

      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");
      const filename = `withdrawals_${now.getFullYear()}-${pad(
        now.getMonth() + 1
      )}-${pad(now.getDate())}_${pad(now.getHours())}${pad(
        now.getMinutes()
      )}.xlsx`;

      XLSX.writeFile(wb, filename);
    } catch (e) {
      const msg =
        e instanceof Error
          ? e.message
          : "Failed to export withdrawals to Excel";
      alert(msg);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6 relative mt-15 lg:mt-0">
      <Loader show={loading} />

      {/* Header + Export Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Winnerspin Withdrawals
          </h1>
          <p className="text-muted-foreground">
            Manage promoter withdrawal requests and payment processing
          </p>
        </div>

        <Button
          variant="outline"
          onClick={handleExportExcel}
          disabled={exporting || withdrawals.length === 0}
          title={
            withdrawals.length === 0
              ? "No data to export"
              : "Export withdrawals to Excel"
          }
        >
          <Download className="mr-2 h-4 w-4" />
          {exporting ? "Exporting..." : "Export Excel"}
        </Button>
      </div>

      <WithdrawalStats withdrawals={withdrawals} loading={loading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All ({withdrawals.length})</TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({pendingWithdrawals.length})
              </TabsTrigger>
              <TabsTrigger value="processed">
                Processed ({processedWithdrawals.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Withdrawals</CardTitle>
                  <CardDescription>
                    Withdrawal requests awaiting approval
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <WithdrawalTable
                    withdrawals={pendingWithdrawals}
                    loading={loading}
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="all">
              <Card>
                <CardHeader>
                  <CardTitle>All Withdrawals</CardTitle>
                  <CardDescription>Complete withdrawal history</CardDescription>
                </CardHeader>
                <CardContent>
                  <WithdrawalTable
                    withdrawals={withdrawals}
                    loading={loading}
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="processed">
              <Card>
                <CardHeader>
                  <CardTitle>Processed Withdrawals</CardTitle>
                  <CardDescription>
                    Approved and rejected withdrawal requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <WithdrawalTable
                    withdrawals={processedWithdrawals}
                    loading={loading}
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <RecentWithdrawals
            withdrawals={pendingWithdrawals}
            loading={loading}
            onApprove={handleApprove}
            onReject={handleReject}
          />
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
