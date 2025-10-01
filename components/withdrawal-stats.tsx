// "use client";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { DollarSign, Clock, CheckCircle, XCircle } from "lucide-react";

// interface WithdrawalStatsProps {
//   withdrawals: Array<{
//     amount: number;
//     status: "pending" | "approved" | "rejected";
//   }>;
//   loading?: boolean;
// }

// export function WithdrawalStats({
//   withdrawals,
//   loading,
// }: WithdrawalStatsProps) {
//   const stats = {
//     total: withdrawals.length,
//     pending: withdrawals.filter((w) => w.status === "pending").length,
//     approved: withdrawals.filter((w) => w.status === "approved").length,
//     totalAmount: withdrawals.reduce((sum, w) => sum + w.amount, 0),
//     pendingAmount: withdrawals
//       .filter((w) => w.status === "pending")
//       .reduce((sum, w) => sum + w.amount, 0),
//     approvedAmount: withdrawals
//       .filter((w) => w.status === "approved")
//       .reduce((sum, w) => sum + w.amount, 0),
//   };

//   if (loading) {
//     return (
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         {[...Array(4)].map((_, i) => (
//           <Card key={i}>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <div className="h-4 bg-muted animate-pulse rounded w-24" />
//               <div className="h-4 w-4 bg-muted animate-pulse rounded" />
//             </CardHeader>
//             <CardContent>
//               <div className="h-8 bg-muted animate-pulse rounded w-16" />
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
//           <DollarSign className="h-4 w-4 text-muted-foreground" />
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold">{stats.total}</div>
//           <p className="text-xs text-muted-foreground">
//             ₹{stats.totalAmount.toLocaleString()} total
//           </p>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <CardTitle className="text-sm font-medium">Pending</CardTitle>
//           <Clock className="h-4 w-4 text-yellow-600" />
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold text-yellow-600">
//             {stats.pending}
//           </div>
//           <p className="text-xs text-muted-foreground">
//             ₹{stats.pendingAmount.toLocaleString()} pending
//           </p>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <CardTitle className="text-sm font-medium">Approved</CardTitle>
//           <CheckCircle className="h-4 w-4 text-green-600" />
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold text-green-600">
//             {stats.approved}
//           </div>
//           <p className="text-xs text-muted-foreground">
//             ₹{stats.approvedAmount.toLocaleString()} paid
//           </p>
//         </CardContent>
//       </Card>

//       {/* <Card>
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <CardTitle className="text-sm font-medium">Approved</CardTitle>
//           <CheckCircle className="h-4 w-4 text-green-600" />
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold text-green-600">
//             {stats.approved}
//           </div>
//           <p className="text-xs text-muted-foreground">
//             ${stats.approvedAmount.toLocaleString()} paid
//           </p>
//         </CardContent>
//       </Card> */}
//     </div>
//   );
// }

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndianRupeeIcon, Clock, CheckCircle, XCircle } from "lucide-react";

interface WithdrawalStatsProps {
  withdrawals: Array<{
    amount: number | string; // allow both string/number just in case
    status: "pending" | "approved" | "rejected";
  }>;
  loading?: boolean;
}

export function WithdrawalStats({
  withdrawals,
  loading,
}: WithdrawalStatsProps) {
  const stats = {
    totalCount: withdrawals.length,
    totalAmount: withdrawals.reduce((sum, w) => sum + Number(w.amount), 0),

    pendingCount: withdrawals.filter((w) => w.status === "pending").length,
    pendingAmount: withdrawals
      .filter((w) => w.status === "pending")
      .reduce((sum, w) => sum + Number(w.amount), 0),

    approvedCount: withdrawals.filter((w) => w.status === "approved").length,
    approvedAmount: withdrawals
      .filter((w) => w.status === "approved")
      .reduce((sum, w) => sum + Number(w.amount), 0),

    rejectedCount: withdrawals.filter((w) => w.status === "rejected").length,
    rejectedAmount: withdrawals
      .filter((w) => w.status === "rejected")
      .reduce((sum, w) => sum + Number(w.amount), 0),
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-muted animate-pulse rounded w-24" />
              <div className="h-4 w-4 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted animate-pulse rounded w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Requests */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
          <IndianRupeeIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalCount}</div>
          <p className="text-xs text-muted-foreground">
            ₹{stats.totalAmount.toLocaleString("en-IN")} total
          </p>
        </CardContent>
      </Card>

      {/* Pending */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending</CardTitle>
          <Clock className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">
            {stats.pendingCount}
          </div>
          <p className="text-xs text-muted-foreground">
            ₹{stats.pendingAmount.toLocaleString("en-IN")} pending
          </p>
        </CardContent>
      </Card>

      {/* Approved */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Approved</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {stats.approvedCount}
          </div>
          <p className="text-xs text-muted-foreground">
            ₹{stats.approvedAmount.toLocaleString("en-IN")} paid
          </p>
        </CardContent>
      </Card>

      {/* Rejected */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          <XCircle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {stats.rejectedCount}
          </div>
          <p className="text-xs text-muted-foreground">
            ₹{stats.rejectedAmount.toLocaleString("en-IN")} rejected
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
