"use client";

import { TransactionItem } from "@/lib/types"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function LatestTransactions({ data }: { data: TransactionItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Transactions</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {data.length === 0 && (
          <p className="text-muted-foreground text-sm">No transactions found</p>
        )}

        {data.map((t) => (
          <div
            key={t._id}
            className="flex justify-between border-b pb-2 text-sm"
          >
            <div>
              <p className="font-semibold">₹{t.amount}</p>
              <p className="text-xs text-muted-foreground">
                {t.customer?.username || "Unknown"}
              </p>
            </div>

            <div className="text-right">
              <p
                className={
                  t.to === "admin"
                    ? "text-green-600 font-semibold"
                    : "text-red-600 font-semibold"
                }
              >
                {t.to.toUpperCase()}
              </p>
              <p className="text-xs">
                {new Date(t.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
