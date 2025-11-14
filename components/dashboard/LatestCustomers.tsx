"use client";

import { CustomerItem } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function LatestCustomers({ data }: { data: CustomerItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Customers</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {data.length === 0 && (
          <p className="text-muted-foreground text-sm">No customers found</p>
        )}

        {data.map((c) => (
          <div
            key={c._id}
            className="flex justify-between border-b pb-2 text-sm"
          >
            <span>{c.username}</span>
            <span className="text-xs text-muted-foreground">
              {new Date(c.createdAt).toLocaleDateString()}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
