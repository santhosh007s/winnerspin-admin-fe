"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownLeft, DollarSign, TrendingUp } from "lucide-react"

interface Transaction {
  type: "credit" | "debit"
  amount: number
  date: string
}

interface TransactionStatsProps {
  transactions: Transaction[]
  loading?: boolean
}

export function TransactionStats({ transactions, loading }: TransactionStatsProps) {
  const stats = {
    total: transactions.length,
    credits: transactions.filter((t) => t.type === "credit").length,
    debits: transactions.filter((t) => t.type === "debit").length,
    totalAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
    creditAmount: transactions.filter((t) => t.type === "credit").reduce((sum, t) => sum + t.amount, 0),
    debitAmount: transactions.filter((t) => t.type === "debit").reduce((sum, t) => sum + t.amount, 0),
    netAmount: 0,
  }

  stats.netAmount = stats.creditAmount - stats.debitAmount

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-muted animate-pulse rounded w-24" />
              <div className="h-4 w-4 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted animate-pulse rounded w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">${stats.totalAmount.toLocaleString()} total volume</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Credits</CardTitle>
          <ArrowUpRight className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.credits}</div>
          <p className="text-xs text-muted-foreground">${stats.creditAmount.toLocaleString()} received</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Debits</CardTitle>
          <ArrowDownLeft className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stats.debits}</div>
          <p className="text-xs text-muted-foreground">${stats.debitAmount.toLocaleString()} paid out</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Amount</CardTitle>
          <TrendingUp className={`h-4 w-4 ${stats.netAmount >= 0 ? "text-green-600" : "text-red-600"}`} />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${stats.netAmount >= 0 ? "text-green-600" : "text-red-600"}`}>
            ${Math.abs(stats.netAmount).toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">{stats.netAmount >= 0 ? "Profit" : "Loss"}</p>
        </CardContent>
      </Card>
    </div>
  )
}
