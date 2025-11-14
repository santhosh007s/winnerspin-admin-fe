"use client";

import { useEffect, useState } from "react";
import Loader from "@/components/loader";
import { dashboardAPI } from "@/lib/api";

import {
  DashboardApiResponse,
  StatsResponse,
  DashboardRecent,
} from "@/lib/types";

import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { LatestTransactions } from "@/components/dashboard/LatestTransactions";
import { LatestCustomers } from "@/components/dashboard/LatestCustomers";
import { LatestWithdrawals } from "@/components/dashboard/LatestWithdrawals";
import { QuickActions } from "@/components/quick-actions";

export function DashboardContent({ seasonId }: { seasonId: string }) {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [recent, setRecent] = useState<DashboardRecent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!seasonId) return;

    const loadDashboard = async () => {
      setLoading(true);
      setError(null);

      try {
        const res: DashboardApiResponse = await dashboardAPI.getDashboard(
          seasonId
        );

        if (!res.success) {
          throw new Error("Dashboard API returned unsuccessful response");
        }

        setStats(res.stats);
        setRecent(res.recent);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [seasonId]);

  if (loading) return <Loader show />;

  if (error)
    return (
      <div className="p-4 text-red-600 font-semibold">
        Error loading dashboard: {error}
      </div>
    );

  if (!stats || !recent)
    return (
      <div className="p-4 text-muted-foreground">
        No dashboard data available.
      </div>
    );

  return (
    <div className="space-y-6">
      <StatsOverview stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LatestTransactions data={recent.transactions} />
        <LatestCustomers data={recent.customers} />
        <LatestWithdrawals data={recent.withdrawals} />
        <QuickActions />
      </div>
    </div>
  );
}
