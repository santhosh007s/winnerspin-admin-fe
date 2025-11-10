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
import { repaymentAPI, promoterAPI } from "@/lib/api";
import { RepaymentTable } from "@/components/repayment-table";
import { RecentRepayments } from "@/components/recent-repayments";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface Promoter {
  _id: string;
  username: string;
}

interface Repayment {
  _id: string;
  customer: {
    _id: string;
    username: string;
    promoter: string;
    cardNo: string;
  };
  season: {
    _id: string;
    season: string;
    promotersRepaymentCommission: number;
    amount: number;
  };
  paymentDate: string;
  installmentNo: number;
  amount: string;
  isVerified: boolean;
  promoterName?: string;
}

interface RepaymentResponse {
  repayments: Repayment[];
}

interface PromoterResponse {
  allPromoters: Promoter[];
}

export default function RepaymentsPage() {
  const [repayments, setRepayments] = useState<Repayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approvingIds, setApprovingIds] = useState<string[]>([]);
  const [exporting, setExporting] = useState(false);

  const seasonId =
    typeof window !== "undefined"
      ? localStorage.getItem("selectedSeason") ?? ""
      : "";

  useEffect(() => {
    fetchRepayments();
  }, );

  const fetchRepayments = async () => {
    try {
      setLoading(true);
      const validSeasonId = seasonId || "";

      const [repaymentsRes, promotersRes]: [
        RepaymentResponse,
        PromoterResponse
      ] = await Promise.all([
        repaymentAPI.getAll(validSeasonId),
        promoterAPI.getAll(validSeasonId),
      ]);

      const enriched: Repayment[] = (repaymentsRes.repayments || []).map(
        (r: Repayment) => {
          const promoter = promotersRes.allPromoters?.find(
            (p: Promoter) => p._id === r.customer.promoter
          );
          return {
            ...r,
            promoterName: promoter?.username || "Unknown",
          };
        }
      );

      setRepayments(enriched);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch repayments"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (installmentId: string, promoterId: string) => {
    setApprovingIds((prev) => [...prev, installmentId]);

    try {
      await repaymentAPI.approve(installmentId, promoterId);
      await fetchRepayments();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to approve repayment"
      );
    } finally {
      setApprovingIds((prev) => prev.filter((id) => id !== installmentId));
    }
  };

  const pendingRepayments = repayments.filter((r) => !r.isVerified);
  const processedRepayments = repayments.filter((r) => r.isVerified);
  const showLoader = loading || approvingIds.length > 0 || exporting;

  // ✅ Prepare export rows (with Status column)
  const rowsForExport = useMemo(() => {
    return repayments.map((r) => {
      const customerName = r.customer?.username ?? "Unknown";
      const card = r.customer?.cardNo ?? "N/A";
      const customerCol = `${customerName} (${card})`;

      const season = r.season?.season ?? "N/A";
      const installment = r.installmentNo ?? "";

      const amountNum = Number.isFinite(Number(r.amount))
        ? Number(r.amount)
        : parseFloat(String(r.amount)) || 0;
      const amountFormatted = `₹${amountNum.toLocaleString()}`;

      const status = r.isVerified ? "Approved" : "Pending";

      return {
        "Customer Name & Card No": customerCol,
        Season: season,
        Installment: installment,
        Amount: amountFormatted,
        Status: status,
      };
    });
  }, [repayments]);

  const handleExportExcel = async () => {
    try {
      if (repayments.length === 0) {
        alert("No repayments to export");
        return;
      }
      setExporting(true);
      const XLSX = await import("xlsx");

      const ws = XLSX.utils.json_to_sheet(rowsForExport);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Repayments");

      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");
      const filename = `repayments_${now.getFullYear()}-${pad(
        now.getMonth() + 1
      )}-${pad(now.getDate())}_${pad(now.getHours())}${pad(
        now.getMinutes()
      )}.xlsx`;

      XLSX.writeFile(wb, filename);
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Failed to export repayments to Excel";
      alert(msg);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="relative space-y-6 px-4 sm:px-6 lg:px-8 py-6 mt-15 lg:mt-0">
      {/* ✅ Global Loader */}
      <Loader show={showLoader} />

      {/* Header */}
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Winnerspin Repayments
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
            Manage customer repayments and promoter commission approvals
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleExportExcel}
            disabled={exporting || repayments.length === 0}
            title={
              repayments.length === 0
                ? "No data to export"
                : "Export repayments to Excel"
            }
          >
            <Download className="mr-2 h-4 w-4" />
            {exporting ? "Exporting..." : "Export Excel"}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Repayments Section */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="flex flex-wrap gap-2 sm:gap-4">
              <TabsTrigger value="all" className="flex-1 sm:flex-none">
                All ({repayments.length})
              </TabsTrigger>
              <TabsTrigger value="pending" className="flex-1 sm:flex-none">
                Pending ({pendingRepayments.length})
              </TabsTrigger>
              <TabsTrigger value="processed" className="flex-1 sm:flex-none">
                Processed ({processedRepayments.length})
              </TabsTrigger>
            </TabsList>

            {/* Pending */}
            <TabsContent value="pending" className="mt-4">
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">
                    Pending Repayments
                  </CardTitle>
                  <CardDescription>
                    Repayments awaiting approval
                  </CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <RepaymentTable
                    repayments={pendingRepayments}
                    loading={loading}
                    onApprove={handleApprove}
                    approvingIds={approvingIds}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* All */}
            <TabsContent value="all" className="mt-4">
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">
                    All Repayments
                  </CardTitle>
                  <CardDescription>Complete repayment history</CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <RepaymentTable
                    repayments={repayments}
                    loading={loading}
                    onApprove={handleApprove}
                    approvingIds={approvingIds}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Processed */}
            <TabsContent value="processed" className="mt-4">
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">
                    Processed Repayments
                  </CardTitle>
                  <CardDescription>
                    Approved repayments with commission split
                  </CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <RepaymentTable
                    repayments={processedRepayments}
                    loading={loading}
                    onApprove={handleApprove}
                    approvingIds={approvingIds}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <RecentRepayments
            repayments={pendingRepayments}
            loading={loading}
            onApprove={handleApprove}
            approvingIds={approvingIds}
          />
        </aside>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-lg text-sm sm:text-base">
          {error}
        </div>
      )}
    </div>
  );
}
