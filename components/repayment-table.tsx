// "use client";

// import { Button } from "@/components/ui/button";

// interface RepaymentTableProps {
//   repayments: any[];
//   loading: boolean;
//   onApprove: (installmentId: string, promoterId: string) => void;
// }

// export function RepaymentTable({
//   repayments,
//   loading,
//   onApprove,
// }: RepaymentTableProps) {
//   if (loading) return <p>Loading...</p>;
//   if (repayments.length === 0) return <p>No repayments found</p>;

//   return (
//     <table className="w-full border-collapse">
//       <thead>
//         <tr>
//           <th>Customer</th>
//           <th>Season</th>
//           <th>Installment</th>
//           <th>Amount</th>
//           <th>Actions</th>
//         </tr>
//       </thead>
//       <tbody>
//         {repayments.map((r) => (
//           <tr key={r._id} className="border-b">
//             <td>{r.customer.username}</td>
//             <td>{r.season.season}</td>
//             <td>{r.installmentNo}</td>
//             <td>₹{r.amount}</td>
//             <td>
//               {!r.isVerified && (
//                 <Button
//                   size="sm"
//                   variant="success"
//                   onClick={() => onApprove(r._id, r.customer.promoter)}
//                 >
//                   Approve
//                 </Button>
//               )}
//               {r.isVerified && <span className="text-green-600">Approved</span>}
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// }
"use client";

import { Button } from "@/components/ui/button";

interface RepaymentTableProps {
  repayments: any[];
  loading: boolean;
  onApprove: (installmentId: string, promoterId: string) => void;
}

export function RepaymentTable({
  repayments,
  loading,
  onApprove,
}: RepaymentTableProps) {
  if (loading) return <p>Loading...</p>;
  if (repayments.length === 0) return <p>No repayments found</p>;

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full border-collapse text-sm sm:text-base">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-2">Customer</th>
            <th className="text-left p-2">Season</th>
            <th className="text-left p-2">Installment</th>
            <th className="text-left p-2">Amount</th>
            <th className="text-left p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {repayments.map((r) => (
            <tr key={r._id} className="border-b">
              <td className="p-2">{r.customer.username}</td>
              <td className="p-2">{r.season.season}</td>
              <td className="p-2">{r.installmentNo}</td>
              <td className="p-2">₹{r.amount}</td>
              <td className="p-2">
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
