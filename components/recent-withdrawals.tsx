"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ExtendedWithdrawal } from "./withdrawal-table";

interface RecentWithdrawalsProps {
  withdrawals: ExtendedWithdrawal[];
  loading?: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function RecentWithdrawals({
  withdrawals,
  loading,
  onApprove,
  onReject,
}: RecentWithdrawalsProps) {
  if (loading) return <p>Loading...</p>;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Withdrawals</CardTitle>
        <CardDescription>Latest withdrawal requests</CardDescription>
      </CardHeader>
      <CardContent>
        {withdrawals.slice(0, 5).map((w) => (
          <div key={w._id} className="flex justify-between items-center mb-3">
            <div>
              <p className="font-medium">
                {w.requester?.username || "Unknown Promoter"}
              </p>
              <p className="text-sm text-muted-foreground">
                ₹{w.amount.toLocaleString()} —{" "}
                {
                  // ✅ Safely handle possibly undefined requestDate
                  formatDistanceToNow(
                    new Date(w.requestDate ?? w.createdAt ?? Date.now()),
                    { addSuffix: true }
                  )
                }
              </p>
            </div>

            {w.status === "pending" ? (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => onApprove(w._id)}
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onReject(w._id)}
                >
                  Reject
                </Button>
              </div>
            ) : (
              <Badge variant="secondary" className={getStatusColor(w.status)}>
                {w.status}
              </Badge>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
