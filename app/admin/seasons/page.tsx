"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { seasonAPI } from "@/lib/api";
import { Plus, Calendar, Play, Clock, CheckCircle } from "lucide-react";

interface SeasonItem {
  _id: string;
  season: string;
  startDate: string;
  endDate: string;
  amount?: string | number;
  totalInstallment?: string | number;
  approvedPromoters?: string[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface GetAllResponse {
  message?: string;
  seasons?: SeasonItem[];
  curSeason?: SeasonItem | null;
}

export default function SeasonsPage() {
  const [seasons, setSeasons] = useState<SeasonItem[]>([]);
  const [curSeason, setCurSeason] = useState<SeasonItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSeasons();
  }, []);

  const fetchSeasons = async () => {
    try {
      setLoading(true);
      const response = (await seasonAPI.getAll()) as GetAllResponse;
      // response.seasons matches the payload you provided
      setSeasons(response.seasons || []);
      setCurSeason(response.curSeason || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch seasons");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (seasonId: string) => {
    try {
      await seasonAPI.delete(seasonId);
      setSeasons((prev) => prev.filter((s) => s._id !== seasonId));
      if (curSeason?._id === seasonId) setCurSeason(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete season");
    }
  };

  const getSeasonStatus = (
    startDate: string | undefined,
    endDate: string | undefined
  ) => {
    if (!startDate || !endDate) return "unknown";
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return "upcoming";
    if (now > end) return "completed";
    return "active";
  };

  const stats = {
    total: seasons.length,
    active: seasons.filter(
      (s) => getSeasonStatus(s.startDate, s.endDate) === "active"
    ).length,
    upcoming: seasons.filter(
      (s) => getSeasonStatus(s.startDate, s.endDate) === "upcoming"
    ).length,
    completed: seasons.filter(
      (s) => getSeasonStatus(s.startDate, s.endDate) === "completed"
    ).length,
  };

  const formatDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString() : "-";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Seasons</h1>
          <p className="text-muted-foreground">
            Manage promotional seasons and promoter assignments
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/seasons/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Season
          </Link>
        </Button>
      </div>

      {/* Current Season (if any) */}
      {curSeason && (
        <Card>
          <CardHeader>
            <CardTitle>Current Season</CardTitle>
            <CardDescription>{curSeason.season}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <div className="text-xs text-muted-foreground">Start</div>
                <div className="font-semibold">
                  {formatDate(curSeason.startDate)}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">End</div>
                <div className="font-semibold">
                  {formatDate(curSeason.endDate)}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Amount</div>
                <div className="font-semibold">{curSeason.amount ?? "-"}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">
                  Approved Promoters
                </div>
                <div className="font-semibold">
                  {(curSeason.approvedPromoters || []).length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Seasons</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Play className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.active}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.upcoming}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {stats.completed}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Seasons Table (simple inline table to reflect API shape) */}
      <Card>
        <CardHeader>
          <CardTitle>All Seasons</CardTitle>
          <CardDescription>
            View and manage all promotional seasons
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="text-left text-sm text-muted-foreground">
                    <th className="px-2 py-2">Season</th>
                    <th className="px-2 py-2">Start</th>
                    <th className="px-2 py-2">End</th>
                    <th className="px-2 py-2">Amount</th>
                    <th className="px-2 py-2">Installments</th>
                    <th className="px-2 py-2">Approved Promoters</th>
                    <th className="px-2 py-2">Status</th>
                    <th className="px-2 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {seasons.map((s) => (
                    <tr key={s._id} className="border-t">
                      <td className="px-2 py-3">{s.season}</td>
                      <td className="px-2 py-3">{formatDate(s.startDate)}</td>
                      <td className="px-2 py-3">{formatDate(s.endDate)}</td>
                      <td className="px-2 py-3">{s.amount ?? "-"}</td>
                      <td className="px-2 py-3">{s.totalInstallment ?? "-"}</td>
                      <td className="px-2 py-3">
                        {(s.approvedPromoters || []).length}
                      </td>
                      <td className="px-2 py-3">
                        {getSeasonStatus(s.startDate, s.endDate)}
                      </td>
                      <td className="px-2 py-3">
                        <div className="flex gap-2">
                          {/* <Link href={`/admin/seasons/${s._id}`} className="text-blue-600">
                            View
                          </Link> */}
                          <button
                            onClick={() => handleDelete(s._id)}
                            className="text-destructive"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {seasons.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-2 py-4 text-center text-muted-foreground"
                      >
                        No seasons available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {error && (
        <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}
