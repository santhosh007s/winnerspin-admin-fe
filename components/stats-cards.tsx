
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Wallet } from "lucide-react"; // removed unused Clock
import { useEffect } from "react";

interface StatsCardsProps {
  stats: {
    totalPromoters?: number;
    totalCustomers?: number;
    pendingApprovals?: number;
    pendingWithdrawals?: number;
    netAmount?: number;
  };
  loading?: boolean;
}

interface CardData {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
  prefix?: string;
  suffix?: string;
}

export function StatsCards({ stats, loading }: StatsCardsProps) {
  useEffect(() => {
    console.log("Stats props updated:", stats);
  }, [stats]);

  const cards: CardData[] = [
    {
      title: "Total Promoters",
      value: stats.totalPromoters ?? 0,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers ?? 0,
      icon: UserCheck,
      color: "text-green-600",
    },
    {
      title: "Admin Wallet",
      value: Math.abs(stats.netAmount ?? 0),
      icon: Wallet,
      color: (stats.netAmount ?? 0) >= 0 ? "text-green-600" : "text-red-600",
      prefix: "₹",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${card.color}`}>
              {loading ? (
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              ) : (
                <>
                  {card.prefix ?? ""}
                  {card.value.toLocaleString()}
                  {card.suffix ?? ""}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
