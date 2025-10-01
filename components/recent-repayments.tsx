// "use client";

// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// interface RecentRepaymentsProps {
//   repayments: any[];
//   loading: boolean;
//   onApprove: (installmentId: string, promoterId: string) => void;
// }

// export function RecentRepayments({
//   repayments,
//   loading,
//   onApprove,
// }: RecentRepaymentsProps) {
//   return (
//     <Card className="h-full">
//       <CardHeader>
//         <CardTitle>Recent Repayments</CardTitle>
//       </CardHeader>
//       <CardContent>
//         {loading ? (
//           <p>Loading repayments...</p>
//         ) : repayments.length === 0 ? (
//           <p>No pending repayments</p>
//         ) : (
//           <ul className="space-y-4">
//             {repayments.map((r) => (
//               <li
//                 key={r._id}
//                 className="flex justify-between items-center border-b pb-2"
//               >
//                 <div>
//                   <p className="font-medium">
//                     {r.customer.username} ({r.customer.cardNo})
//                   </p>
//                   <p className="text-sm text-muted-foreground">
//                     Installment #{r.installmentNo} — ₹{r.amount}
//                   </p>
//                   <p className="text-xs text-muted-foreground">
//                     Season: {r.season.season}
//                   </p>
//                 </div>
//                 <div>
//                   {!r.isVerified ? (
//                     <Button
//                       size="sm"
//                       variant="success"
//                       onClick={() => onApprove(r._id, r.customer.promoter)}
//                     >
//                       Approve
//                     </Button>
//                   ) : (
//                     <span className="text-green-600">Approved</span>
//                   )}
//                 </div>
//               </li>
//             ))}
//           </ul>
//         )}
//       </CardContent>
//     </Card>
//   );
// }
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface RecentRepaymentsProps {
  repayments: any[];
  loading: boolean;
  onApprove: (installmentId: string, promoterId: string) => void;
}

export function RecentRepayments({
  repayments,
  loading,
  onApprove,
}: RecentRepaymentsProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Repayments</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading repayments...</p>
        ) : repayments.length === 0 ? (
          <p>No pending repayments</p>
        ) : (
          <ul className="space-y-4">
            {repayments.map((r) => (
              <li
                key={r._id}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b pb-2 gap-2"
              >
                <div className="text-sm">
                  <p className="font-medium">
                    {r.customer.username} ({r.customer.cardNo})
                  </p>
                  <p className="text-muted-foreground">
                    Installment #{r.installmentNo} — ₹{r.amount}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Season: {r.season.season}
                  </p>
                </div>
                <div className="sm:text-right">
                  {!r.isVerified ? (
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => onApprove(r._id, r.customer.promoter)}
                    >
                      Approve
                    </Button>
                  ) : (
                    <span className="text-green-600 text-sm">Approved</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
