"use client";

import { useCallback, useEffect, useState } from "react";
import { promoterAPI } from "@/lib/api";
import { PromoterTable } from "@/components/promoter-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Loader from "@/components/loader"; // ✅ use your global loader

type Promoter = {
  _id: string;
  userid: string;
  username: string;
  email: string;
  mobNo: string;
  status: "approved" | "unapproved" | "inactive";
  isActive: boolean;
  balance: number;
  customers: string[];
};

export default function PromotersPage() {
  const [approvedPromoters, setApprovedPromoters] = useState<Promoter[]>([]);
  const [nonApprovedPromoters, setNonApprovedPromoters] = useState<Promoter[]>(
    []
  );
  const [inactivePromoters, setInactivePromoters] = useState<Promoter[]>([]);
  const [allInactivePromoters, setAllInactivePromoters] = useState<Promoter[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPromoters = useCallback(async () => {
    try {
      setLoading(true);

      const selectedSeason = localStorage.getItem("selectedSeason");
      if (!selectedSeason) {
        throw new Error("No season selected in local storage");
      }

      const response = await promoterAPI.getAll(selectedSeason);
      console.log("Promoters API response:", response);

      const normalize = (
        list: Promoter[],
        status: "approved" | "unapproved" | "inactive",
        isActive: boolean
      ): Promoter[] =>
        list.map((p) => ({
          _id: String(p?._id ?? ""),
          userid: String(p?.userid ?? p?.username ?? ""),
          username: String(p?.username ?? ""),
          email: String(p?.email ?? ""),
          mobNo: String(p?.mobNo ?? ""),
          status,
          isActive,
          balance: Number(p?.balance ?? 0),
          customers: Array.isArray(p?.customers) ? p.customers : [],
        }));

      setApprovedPromoters(
        normalize(response.approvedPromoters ?? [], "approved", true)
      );
      setNonApprovedPromoters(
        normalize(response.nonApprovedPromoters ?? [], "unapproved", true)
      );
      setInactivePromoters(
        normalize(response.inactivePromoters ?? [], "inactive", false)
      );
      setAllInactivePromoters(
        normalize(response.allInactivePromoters ?? [], "inactive", true)
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch promoters"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPromoters();
  }, [fetchPromoters]);

  // const stats = {
  //   total:
  //     approvedPromoters.length +
  //     nonApprovedPromoters.length +
  //     inactivePromoters.length,
  //   approved: approvedPromoters.length,
  //   unapproved: nonApprovedPromoters.length,
  //   inactive: inactivePromoters.length,
  //   allInactive: allInactivePromoters.length,
  // };

  return (
    <div className="space-y-8 relative mt-15 lg:mt-0">
      {/* ✅ Loader Overlay */}
      <Loader show={loading} />

      {/* Header + Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Winnerspin Promoters
          </h1>
          <p className="text-muted-foreground">
            Manage promoters in your systems
          </p>
        </div>

        <Link href="/admin/create-promoter">
          <Button>Create Promoter</Button>
        </Link>
      </div>

      {/* Content */}
      <div className="space-y-10">
        {/* <StatsCards stats={stats} /> */}

        {error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <PromoterTable
            approvedPromoters={approvedPromoters}
            nonApprovedPromoters={nonApprovedPromoters}
            inactivePromoters={inactivePromoters}
            allInactivePromoters={allInactivePromoters}
            loading={loading}
            onDelete={(id) => {
              setApprovedPromoters((prev) => prev.filter((p) => p._id !== id));
              setNonApprovedPromoters((prev) =>
                prev.filter((p) => p._id !== id)
              );
              setInactivePromoters((prev) => prev.filter((p) => p._id !== id));
            }}
          />
        )}
      </div>
    </div>
  );
}
