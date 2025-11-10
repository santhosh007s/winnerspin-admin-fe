"use client";

import { Button } from "@/components/ui/button";

interface Repayment {
  _id: string;
  customer: {
    _id: string;
    username: string;
    promoter: string;
    cardNo: string;
  };
  season: {
    _id: string;
    season: string;
  };
  installmentNo: number;
  amount: string;
  isVerified: boolean;
}

interface RepaymentTableProps {
  repayments: Repayment[];
  loading: boolean;
  onApprove: (installmentId: string, promoterId: string) => void;
  approvingIds: string[];
}

export function RepaymentTable({
  repayments,
  loading,
  onApprove,
  approvingIds,
}: RepaymentTableProps) {
  if (loading) return <p>Loading...</p>;
  if (repayments.length === 0) return <p>No repayments found</p>;

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full border-collapse text-sm sm:text-base">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-2">Customer Name & Card No</th>
            <th className="text-left p-2">Season</th>
            <th className="text-left p-2">Installment</th>
            <th className="text-left p-2">Amount</th>
            <th className="text-left p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {repayments.map((r) => (
            <tr key={r._id} className="border-b">
              <td className="p-2">
                {r.customer.username} ({r.customer.cardNo})
              </td>
              <td className="p-2">{r.season.season}</td>
              <td className="p-2">{r.installmentNo}</td>
              <td className="p-2">₹{r.amount}</td>
              <td className="p-2">
                {!r.isVerified ? (
                  <Button
                    // ✅ Use allowed variant + success styles manually
                    variant="default"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    size="sm"
                    disabled={approvingIds.includes(r._id)} // disable when clicked
                    onClick={() => onApprove(r._id, r.customer.promoter)}
                  >
                    {approvingIds.includes(r._id) ? "Approving..." : "Approve"}
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
