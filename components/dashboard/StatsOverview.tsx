"use client";

import { StatsResponse } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function StatsOverview({ stats }: { stats: StatsResponse }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 ">
      <Card>
        <CardHeader>
          <CardTitle>Total Promoters</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold">
          {stats.totalPromoters}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Customers</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold">
          {stats.totalCustomers}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Income</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold ">
          ₹{stats.totalIncome}
        </CardContent>
      </Card>
    </div>
  );
}
