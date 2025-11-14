// // "use client";

// // import { useState, useEffect } from "react";
// // import { StatsCards } from "@/components/stats-cards";
// // import { RecentActivity, Activity } from "@/components/recent-activity";
// // import { QuickActions } from "@/components/quick-actions";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select";
// // import {
// //   seasonAPI,
// //   customerAPI,
// //   withdrawalAPI,
// //   adminStatsAPI,
// // } from "@/lib/api";
// // import Loader from "@/components/loader";

// // const SEASON_STORAGE_KEY = "selectedSeason";

// // interface Customer {
// //   _id: string;
// //   username: string;
// //   createdAt: string;
// //   status: string;
// // }

// // interface Withdrawal {
// //   _id: string;
// //   amount: number;
// //   createdAt: string;
// //   status: string;
// //   customer?: {
// //     username?: string;
// //   };
// // }

// // interface Stats {
// //   totalPromoters: number;
// //   totalCustomers: number;
// //   netAmount: number;
// // }

// // interface Season {
// //   _id: string;
// //   season: string;
// // }

// // export default function DashboardPage() {
// //   const [selectedSeason, setSelectedSeason] = useState<string | null>(null);
// //   const [loading, setLoading] = useState(true);
// //   const [stats, setStats] = useState<Stats>({
// //     totalPromoters: 0,
// //     totalCustomers: 0,
// //     netAmount: 0,
// //   });
// //   const [activities, setActivities] = useState<Activity[]>([]);
// //   const [seasons, setSeasons] = useState<Season[]>([]);
// //   const [seasonsLoading, setSeasonsLoading] = useState(false);

// //   // ✅ Normalize status safely
// //   const normalizeStatus = (
// //     status?: string
// //   ): "pending" | "approved" | "rejected" | undefined => {
// //     if (!status) return undefined;
// //     const lower = status.toLowerCase();
// //     if (["pending", "approved", "rejected"].includes(lower))
// //       return lower as "pending" | "approved" | "rejected";
// //     return undefined;
// //   };

// //   // Load saved season
// //   useEffect(() => {
// //     const saved = localStorage.getItem(SEASON_STORAGE_KEY);
// //     if (saved) setSelectedSeason(saved);
// //   }, []);

// //   // Fetch all seasons
// //   useEffect(() => {
// //     const fetchSeasons = async () => {
// //       setSeasonsLoading(true);
// //       try {
// //         const data = await seasonAPI.getAll();
// //         const allSeasons = (data?.seasons ?? []) as Season[];
// //         setSeasons(allSeasons);

// //         if (!selectedSeason && data?.curSeason?._id) {
// //           setSelectedSeason(data.curSeason._id);
// //           localStorage.setItem(SEASON_STORAGE_KEY, data.curSeason._id);
// //         }
// //       } catch (err) {
// //         console.error("Error fetching seasons:", err);
// //       } finally {
// //         setSeasonsLoading(false);
// //       }
// //     };

// //     fetchSeasons();
// //   }, [selectedSeason]);

// //   // Fetch dashboard data when season changes
// //   useEffect(() => {
// //     if (!selectedSeason) return;

// //     const fetchDashboardData = async () => {
// //       setLoading(true);
// //       try {
// //         const statsRes = await adminStatsAPI.getAdminStats(selectedSeason);

// //         setStats({
// //           totalPromoters: statsRes.totalPromoters ?? 0,
// //           totalCustomers: statsRes.totalCustomers ?? 0,
// //           netAmount: statsRes.totalAmount ?? 0,
// //         });

// //         const [customers, withdrawals] = await Promise.all([
// //           customerAPI.getNew() as Promise<Customer[]>,
// //           withdrawalAPI.getAll(selectedSeason) as Promise<Withdrawal[]>,
// //         ]);

// //         const activityList: Activity[] = [];

// //         customers?.forEach((c) => {
// //           activityList.push({
// //             id: c._id,
// //             type: "customer_approval",
// //             description: `New customer request from ${c.username}`,
// //             timestamp: c.createdAt,
// //             status: normalizeStatus(c.status),
// //           });
// //         });

// //         withdrawals?.forEach((w) => {
// //           activityList.push({
// //             id: w._id,
// //             type: "withdrawal_request",
// //             description: `Withdrawal request of ₹${w.amount} by ${
// //               w.customer?.username || "Unknown"
// //             }`,
// //             timestamp: w.createdAt,
// //             status: normalizeStatus(w.status),
// //           });
// //         });

// //         setActivities(
// //           activityList.sort(
// //             (a, b) => +new Date(b.timestamp) - +new Date(a.timestamp)
// //           )
// //         );
// //       } catch (err) {
// //         console.error("Error fetching dashboard data:", err);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchDashboardData();
// //   }, [selectedSeason]);

// //   const handleSeasonChange = (seasonId: string) => {
// //     setSelectedSeason(seasonId);
// //     localStorage.setItem(SEASON_STORAGE_KEY, seasonId);
// //   };

// //   return (
// //     <>
// //       <Loader show={loading || seasonsLoading} />

// //       {!loading && (
// //         <div className="space-y-6 mt-15 lg:mt-0">
// //           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
// //             <div>
// //               <h1 className="text-3xl font-bold text-foreground">
// //                 Winnerspin Admin Dashboard
// //               </h1>
// //               <p className="text-muted-foreground">Overview of the system</p>
// //             </div>

// //             <Select
// //               value={selectedSeason ?? ""}
// //               onValueChange={handleSeasonChange}
// //             >
// //               <SelectTrigger className="w-[240px]" disabled={seasonsLoading}>
// //                 <SelectValue
// //                   placeholder={seasonsLoading ? "Loading..." : "Select season"}
// //                 />
// //               </SelectTrigger>
// //               <SelectContent>
// //                 {seasons.map((s) => (
// //                   <SelectItem key={s._id} value={s._id}>
// //                     {s.season}
// //                   </SelectItem>
// //                 ))}
// //               </SelectContent>
// //             </Select>
// //           </div>

// //           <StatsCards stats={stats} loading={loading} />

// //           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// //             <RecentActivity activities={activities} loading={loading} />
// //             <QuickActions />
// //           </div>
// //         </div>
// //       )}
// //     </>
// //   );
// // }

// "use client";

// import { useState, useEffect } from "react";
// import Loader from "@/components/loader";
// import { seasonAPI } from "@/lib/api";
// import { DashboardContent } from "@/components/dashboard/dashboardcontent";
// export default function DashboardPage() {
//   const [seasonId, setSeasonId] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function loadSeason() {
//       try {
//         const res = await seasonAPI.getAll();

//         // auto pick latest season
//         const cur = res?.curSeason?._id;
//         const stored = localStorage.getItem("selectedSeason");

//         const selected = stored || cur;

//         if (selected) {
//           setSeasonId(selected);
//           localStorage.setItem("selectedSeason", selected);
//         }
//       } catch (err) {
//         console.error("Error loading seasons:", err);
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadSeason();
//   }, []);

//   if (loading || !seasonId) return <Loader show />;

//   return (
//     <div className="p-4 lg:p-6">
//       <DashboardContent seasonId={seasonId} />
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import Loader from "@/components/loader";
import { seasonAPI } from "@/lib/api";
import { DashboardContent } from "@/components/dashboard/dashboardcontent";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Season {
  _id: string;
  season: string;
}

export default function DashboardPage() {
  const [seasonId, setSeasonId] = useState<string>("");
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(true);
  const [seasonLoading, setSeasonLoading] = useState(false);

  // Load all seasons + choose active season
  useEffect(() => {
    async function loadSeasons() {
      setSeasonLoading(true);
      try {
        const res = await seasonAPI.getAll();

        const list = res?.seasons ?? [];
        setSeasons(list);

        // Determine selected season
        const stored = localStorage.getItem("selectedSeason");
        const cur = res?.curSeason?._id;

        const selected = stored || cur || (list[0]?._id ?? "");

        setSeasonId(selected);

        if (selected) {
          localStorage.setItem("selectedSeason", selected);
        }
      } catch (err) {
        console.error("Error loading seasons:", err);
      } finally {
        setLoading(false);
        setSeasonLoading(false);
      }
    }

    loadSeasons();
  }, []);

  // Handle selecting a new season
  const handleSeasonChange = (id: string) => {
    setSeasonId(id);
    localStorage.setItem("selectedSeason", id);
  };

  if (loading || !seasonId) return <Loader show />;

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header + Season Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Winnerspin Admin Dashboard
          </h1>
          <p className="text-muted-foreground">Overview of system activity</p>
        </div>

        <Select value={seasonId} onValueChange={handleSeasonChange}>
          <SelectTrigger className="w-[240px]" disabled={seasonLoading}>
            <SelectValue
              placeholder={seasonLoading ? "Loading..." : "Select season"}
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

      {/* Dashboard Data Renderer */}
      <DashboardContent seasonId={seasonId} />
    </div>
  );
}
