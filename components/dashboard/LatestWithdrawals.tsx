"use client";

import { WithdrawalItem } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function LatestWithdrawals({ data }: { data: WithdrawalItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Withdrawals</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {data.length === 0 && (
          <p className="text-muted-foreground text-sm">No withdrawals found</p>
        )}

        {data.map((w) => (
          <div
            key={w._id}
            className="flex justify-between border-b pb-2 text-sm"
          >
            <div>
              <p className="font-semibold">₹{w.amount}</p>
              <p className="text-xs text-muted-foreground">
                {w.requester?.username || "Unknown"}
              </p>
            </div>
            <span className="text-xs text-muted-foreground">
              {new Date(w.createdAt).toLocaleDateString()}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
