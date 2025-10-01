"use client";

import { useState, useEffect } from "react";
import { StatsCards } from "@/components/stats-cards";
import { RecentActivity } from "@/components/recent-activity";
import { QuickActions } from "@/components/quick-actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { dashboardAPI, seasonAPI, customerAPI, withdrawalAPI, adminStatsAPI } from "@/lib/api";

const SEASON_STORAGE_KEY = "selectedSeason";

export default function DashboardPage() {
  const [selectedSeason, setSelectedSeason] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>({
    totalPromoters: 0,
    totalCustomers: 0,
    netAmount: 0,
  });
  const [activities, setActivities] = useState<any[]>([]);
  const [seasons, setSeasons] = useState<any[]>([]);
  const [seasonsLoading, setSeasonsLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(SEASON_STORAGE_KEY);
    if (saved) setSelectedSeason(saved);
  }, []);

  useEffect(() => {
    const fetchSeasons = async () => {
      setSeasonsLoading(true);
      try {
        const data = await seasonAPI.getAll();
        const allSeasons = data?.seasons ?? [];
        setSeasons(allSeasons);

        if (!selectedSeason && data?.curSeason?._id) {
          setSelectedSeason(data.curSeason._id);
        }
      } catch (err) {
        console.error("Error fetching seasons:", err);
      } finally {
        setSeasonsLoading(false);
      }
    };

    fetchSeasons();
  }, [selectedSeason]);

  useEffect(() => {
    if (!selectedSeason) return;

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // ✅ Fetch all 3 stats from backend
        const statsRes = await adminStatsAPI.getAdminStats(selectedSeason);
        setStats({
          totalPromoters: statsRes.totalPromoters ?? 0,
          totalCustomers: statsRes.totalCustomers ?? 0,
          netAmount: statsRes.totalAmount ?? 0,
        });

        // Optional: fetch recent activities
        const [customers, withdrawals] = await Promise.all([
          customerAPI.getNew(),
          withdrawalAPI.getAll(selectedSeason),
        ]);

        const activityList: any[] = [];

        customers?.forEach((c) => {
          activityList.push({
            id: c._id,
            type: "customer_approval",
            description: `New customer request from ${c.username}`,
            timestamp: c.createdAt,
            status: c.status,
          });
        });

        withdrawals?.forEach((w) => {
          activityList.push({
            id: w._id,
            type: "withdrawal_request",
            description: `Withdrawal request of ₹${w.amount} by ${w.customer?.username}`,
            timestamp: w.createdAt,
            status: w.status,
          });
        });

        setActivities(
          activityList.sort(
            (a, b) => +new Date(b.timestamp) - +new Date(a.timestamp)
          )
        );
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [selectedSeason]);

  const handleSeasonChange = (seasonId: string) => {
    setSelectedSeason(seasonId);
    localStorage.setItem(SEASON_STORAGE_KEY, seasonId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Overview of the system</p>
        </div>

        <Select value={selectedSeason ?? ""} onValueChange={handleSeasonChange}>
          <SelectTrigger className="w-[240px]" disabled={seasonsLoading}>
            <SelectValue
              placeholder={seasonsLoading ? "Loading..." : "Select season"}
            />
          </SelectTrigger>
          <SelectContent>
            {seasons.map((s) => (
              <SelectItem key={s._id} value={s._id}>
                {s.season}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <StatsCards stats={stats} loading={loading} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity activities={activities} loading={loading} />
        <QuickActions />
      </div>
    </div>
  );
}
