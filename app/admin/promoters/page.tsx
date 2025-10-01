// "use client";

// import { useCallback, useEffect, useState } from "react";
// import { promoterAPI } from "@/lib/api";
// import { PromoterTable } from "@/components/promoter-table";
// import { StatsCards } from "@/components/stats-cards";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";

// type Promoter = {
//   _id: string;
//   userid: string;
//   username: string;
//   email: string;
//   mobNo: string;
//   status: "approved" | "unapproved";
//   balance: number;
//   customers: any[];
// };

// export default function PromotersPage() {
//   const [promoters, setPromoters] = useState<Promoter[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchPromoters = useCallback(async () => {
//     try {
//       setLoading(true);

//       const selectedSeason = localStorage.getItem("selectedSeason");
//       if (!selectedSeason) {
//         throw new Error("No season selected in local storage");
//       }

//       const response = await promoterAPI.getAll(selectedSeason);

//       const rawApproved = (response as any)?.approvedPromoters ?? [];
//       const rawUnapproved = (response as any)?.nonApprovedPromoters ?? [];

//       const normalize = (list: any[], status: "approved" | "unapproved") =>
//         list.map((p) => ({
//           _id: String(p?._id ?? ""),
//           userid: String(p?.userid ?? ""),
//           username: String(p?.username ?? ""),
//           email: String(p?.email ?? ""),
//           mobNo: String(p?.mobNo ?? ""),
//           status,
//           balance: Number(p?.balance ?? 0),
//           customers: Array.isArray(p?.customers) ? p.customers : [],
//         }));

//       const normalized = [
//         ...normalize(rawApproved, "approved"),
//         ...normalize(rawUnapproved, "unapproved"),
//       ];

//       setPromoters(normalized);
//     } catch (err) {
//       setError(
//         err instanceof Error ? err.message : "Failed to fetch promoters"
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchPromoters();
//   }, [fetchPromoters]);

//   const stats = {
//     total: promoters.length,
//     approved: promoters.filter((p) => p.status === "approved").length,
//     unapproved: promoters.filter((p) => p.status === "unapproved").length,
//   };

//   return (
//     <div className="space-y-8 ">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-foreground">Promoters</h1>
//           <p className="text-muted-foreground">
//             {" "}
//             Manage promoter in your system
//           </p>
//         </div>
//       </div>
//       {/* Create Button in top-right */}
//       <div className="flex justify-end">
//         <Link href="/admin/create-promoter">
//           <Button>Create Promoter</Button>
//         </Link>
//       </div>

//       {/* Page Content */}
//       <div className="space-y-10">
//         <StatsCards stats={stats} />

//         {error ? (
//           <div className="text-red-500">{error}</div>
//         ) : (
//           <PromoterTable promoters={promoters} loading={loading} />
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useCallback, useEffect, useState } from "react";
import { promoterAPI } from "@/lib/api";
import { PromoterTable } from "@/components/promoter-table";
import { StatsCards } from "@/components/stats-cards";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Promoter = {
  _id: string;
  userid: string;
  username: string;
  email: string;
  mobNo: string;
  status: "approved" | "unapproved" | "inactive";
  isActive: boolean;
  balance: number;
  customers: any[];
};

export default function PromotersPage() {
  const [approvedPromoters, setApprovedPromoters] = useState<Promoter[]>([]);
  const [nonApprovedPromoters, setNonApprovedPromoters] = useState<Promoter[]>(
    []
  );
  const [inactivePromoters, setInactivePromoters] = useState<Promoter[]>([]);
  const [allInactivePromoters, setAllInactivePromoters] = useState<Promoter[]>([]);
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
        list: any[],
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
      )
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

  const stats = {
    total:
      approvedPromoters.length +
      nonApprovedPromoters.length +
      inactivePromoters.length,
    approved: approvedPromoters.length,
    unapproved: nonApprovedPromoters.length,
    inactive: inactivePromoters.length,
    allInactive: allInactivePromoters.length,
  };

  return (
    <div className="space-y-8">
      {/* Header + Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Promoters</h1>
          <p className="text-muted-foreground">
            Manage promoters in your system
          </p>
        </div>

        <Link href="/admin/create-promoter">
          <Button>Create Promoter</Button>
        </Link>
      </div>

      {/* Content */}
      <div className="space-y-10">
        <StatsCards stats={stats} />

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
