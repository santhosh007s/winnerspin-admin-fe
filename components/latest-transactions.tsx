"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Transaction {
  _id: string;
  amount: number;
  type: "credit" | "debit";
  user?: string;
  createdAt: string;
}

export function LatestTransactions({
  transactions,
  loading,
}: {
  transactions: Transaction[];
  loading: boolean;
}) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Latest Transactions
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {loading && (
          <p className="text-sm text-muted-foreground text-center">
            Loading transactions...
          </p>
        )}

        {!loading && transactions.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No recent transactions found
          </p>
        )}

        {!loading &&
          transactions.map((txn) => (
            <div
              key={txn._id}
              className="flex items-center justify-between border-b pb-2"
            >
              {/* Amount + Customer */}
              <div>
                <p className="font-medium">₹{txn.amount.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">
                  {txn.user || "Unknown User"}
                </p>
              </div>

              {/* Type + Date */}
              <div className="text-right">
                <p
                  className={`text-sm font-semibold ${
                    txn.type === "credit" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {txn.type.toUpperCase()}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(txn.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
      </CardContent>
    </Card>
  );
}
