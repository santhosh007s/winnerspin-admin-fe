"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

interface Withdrawal {
  _id: string;
  promoterId: string;
  promoterName?: string;
  promoterUsername?: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  requestDate: string;
}

interface RecentWithdrawalsProps {
  withdrawals: Withdrawal[];
  loading?: boolean;
  onApprove: (withdrawalId: string) => void;
  onReject: (withdrawalId: string) => void;
}

export function RecentWithdrawals({
  withdrawals,
  loading,
  onApprove,
  onReject,
}: RecentWithdrawalsProps) {
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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Withdrawals</CardTitle>
          <CardDescription>Latest withdrawal requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-muted animate-pulse rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-muted animate-pulse rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                </div>
                <div className="h-6 bg-muted animate-pulse rounded w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const recentWithdrawals = withdrawals.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Withdrawals</CardTitle>
        <CardDescription>
          Latest withdrawal requests requiring attention
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentWithdrawals.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No recent withdrawals
            </p>
          ) : (
            recentWithdrawals.map((withdrawal) => (
              <div
                key={withdrawal._id}
                className="flex items-center justify-between space-x-4"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {withdrawal.promoterUsername?.charAt(0).toUpperCase() ||
                        "?"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {withdrawal.promoterUsername || "Unknown Promoter"}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground">
                        ${withdrawal.amount.toLocaleString()}
                      </p>
                      <Badge
                        variant="secondary"
                        className={getStatusColor(withdrawal.status)}
                      >
                        {withdrawal.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(withdrawal.requestDate), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
                {withdrawal.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onApprove(withdrawal._id)}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onReject(withdrawal._id)}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
