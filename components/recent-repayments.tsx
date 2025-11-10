"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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

interface RecentRepaymentsProps {
  repayments: Repayment[];
  loading: boolean;
  onApprove: (installmentId: string, promoterId: string) => void;
  approvingIds: string[];
}

export function RecentRepayments({
  repayments,
  loading,
  onApprove,
  approvingIds,
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
                      // ✅ Replaced variant="success" with default variant + custom styles
                      variant="default"
                      className="bg-green-600 hover:bg-green-700 text-white"
                      disabled={approvingIds.includes(r._id)}
                      onClick={() => onApprove(r._id, r.customer.promoter)}
                    >
                      {approvingIds.includes(r._id)
                        ? "Approving..."
                        : "Approve"}
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
