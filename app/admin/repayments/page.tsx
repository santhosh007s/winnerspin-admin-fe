"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { repaymentAPI, promoterAPI } from "@/lib/api";
import { RepaymentTable } from "@/components/repayment-table";
import { RecentRepayments } from "@/components/recent-repayments";
import Loader from "@/components/loader"; // ✅ global loader

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
}

export default function RepaymentsPage() {
  const [repayments, setRepayments] = useState<Repayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approvingIds, setApprovingIds] = useState<string[]>([]);

  const seasonId =
    typeof window !== "undefined"
      ? localStorage.getItem("selectedSeason")
      : null;

  useEffect(() => {
    fetchRepayments();
  }, []);

  const fetchRepayments = async () => {
    try {
      setLoading(true);
      const [repaymentsRes, promotersRes] = await Promise.all([
        repaymentAPI.getAll(seasonId),
        promoterAPI.getAll(seasonId),
      ]);

      const enriched = (repaymentsRes.repayments || []).map((r: any) => {
        const promoter = promotersRes.allPromoters?.find(
          (p: any) => p._id === r.customer.promoter
        );
        return {
          ...r,
          promoterName: promoter?.username || "Unknown",
        };
      });

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

  // ✅ Show loader when loading data or approving
  const showLoader = loading || approvingIds.length > 0;

  return (
    <div className="relative space-y-6 px-4 sm:px-6 lg:px-8 py-6">
      {/* ✅ Global Loader */}
      <Loader show={showLoader} />

      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Repayments
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
          Manage customer repayments and promoter commission approvals
        </p>
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
