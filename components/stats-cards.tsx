// "use client";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Users, UserCheck, Clock, Wallet } from "lucide-react";

// interface StatsCardsProps {
//   stats: {
//     totalPromoters?: number;
//     totalCustomers?: number;
//     pendingApprovals?: number;
//     pendingWithdrawals?: number;
//     netAmount?: number;
//   };
//   loading?: boolean;
// }

// export function StatsCards({ stats, loading }: StatsCardsProps) {
//   const cards = [
//     {
//       title: "Total Promoters",
//       value: stats.totalPromoters ?? 0,
//       icon: Users,
//       color: "text-blue-600",
//       prefix: "",
//     },
//     {
//       title: "Total Customers",
//       value: stats.totalCustomers ?? 0,
//       icon: UserCheck,
//       color: "text-green-600",
//       prefix: "",
//     },
//     {
//       title: "Pending Approvals",
//       value: stats.pendingApprovals ?? 0,
//       icon: Clock,
//       color: "text-orange-600",
//       prefix: "",
//     },
//     {
//       title: "Admin Wallet",
//       value: Math.abs(stats.netAmount ?? 0),
//       icon: Wallet,
//       color: (stats.netAmount ?? 0) >= 0 ? "text-green-600" : "text-red-600",
//       prefix: "₹",
//       suffix: (stats.netAmount ?? 0) >= 0 ? " (Profit)" : " (Loss)",
//     },
//   ];
//   console.log(cards);
//   console.log(stats);

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//       {cards.map((card) => (
//         <Card key={card.title}>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground">
//               {card.title}
//             </CardTitle>
//             <card.icon className={`h-4 w-4 ${card.color}`} />
//           </CardHeader>
//           <CardContent>
//             <div className={`text-2xl font-bold ${card.color}`}>
//               {loading ? (
//                 <div className="h-8 w-16 bg-muted animate-pulse rounded" />
//               ) : (
//                 <>
//                   {card.prefix}
//                   {(card.value ?? 0).toLocaleString()}
//                   {card.suffix && card.suffix}
//                 </>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );
// }

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Clock, Wallet } from "lucide-react";
import { useEffect } from "react";

interface StatsCardsProps {
  stats: {
    totalPromoters?: number;
    totalCustomers?: number;
    pendingApprovals?: number;
    pendingWithdrawals?: number;
    netAmount?: number;
  };
  loading?: boolean;
}

export function StatsCards({ stats, loading }: StatsCardsProps) {
  // Debug: ensure props update
  useEffect(() => {
    console.log("Stats props updated:", stats);
  }, [stats]);

  const cards = [
    {
      title: "Total Promoters",
      value: stats.totalPromoters ?? 0,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers ?? 0,
      icon: UserCheck,
      color: "text-green-600",
    },
    {
      title: "Admin Wallet",
      value: Math.abs(stats.netAmount ?? 0),
      icon: Wallet,
      color: (stats.netAmount ?? 0) >= 0 ? "text-green-600" : "text-red-600",
      prefix: "₹",
      // suffix: (stats.netAmount ?? 0) >= 0 ? " (Profit)" : " (Loss)",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${card.color}`}>
              {loading ? (
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              ) : (
                <>
                  {card.prefix}
                  {(card.value ?? 0).toLocaleString()}
                  {card.suffix && card.suffix}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
