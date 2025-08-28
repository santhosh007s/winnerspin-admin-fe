"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Search, ArrowUpRight, ArrowDownLeft } from "lucide-react"

interface Transaction {
  id: string
  type: "credit" | "debit"
  amount: number
  from: string
  to: string
  seasonId: string
  seasonName?: string
  promoterId?: string
  promoterName?: string
  customerId?: string
  customerName?: string
  date: string
  description?: string
  status: "completed" | "pending" | "failed"
}

interface TransactionTableProps {
  transactions: Transaction[]
  loading?: boolean
  seasons?: Array<{ _id: string; Season: string }>
  promoters?: Array<{ _id: string; username: string }>
}

export function TransactionTable({ transactions, loading, seasons = [], promoters = [] }: TransactionTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [seasonFilter, setSeasonFilter] = useState("all")
  const [promoterFilter, setPromoterFilter] = useState("all")

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.amount.toString().includes(searchTerm) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === "all" || transaction.type === typeFilter
    const matchesSeason = seasonFilter === "all" || transaction.seasonId === seasonFilter
    const matchesPromoter = promoterFilter === "all" || transaction.promoterId === promoterFilter

    return matchesSearch && matchesType && matchesSeason && matchesPromoter
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case "credit":
        return "bg-green-100 text-green-800"
      case "debit":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="h-10 bg-muted animate-pulse rounded flex-1" />
          <div className="h-10 bg-muted animate-pulse rounded w-32" />
          <div className="h-10 bg-muted animate-pulse rounded w-32" />
          <div className="h-10 bg-muted animate-pulse rounded w-32" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-muted animate-pulse rounded" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="credit">Credit</SelectItem>
            <SelectItem value="debit">Debit</SelectItem>
          </SelectContent>
        </Select>
        <Select value={seasonFilter} onValueChange={setSeasonFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Season" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Seasons</SelectItem>
            {seasons.map((season) => (
              <SelectItem key={season._id} value={season._id}>
                {season.Season}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={promoterFilter} onValueChange={setPromoterFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Promoter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Promoters</SelectItem>
            {promoters.map((promoter) => (
              <SelectItem key={promoter._id} value={promoter._id}>
                {promoter.username}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Season</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-mono text-sm">{transaction.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {transaction.type === "credit" ? (
                        <ArrowUpRight className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowDownLeft className="h-4 w-4 text-red-600" />
                      )}
                      <Badge variant="secondary" className={getTypeColor(transaction.type)}>
                        {transaction.type}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">${transaction.amount.toLocaleString()}</TableCell>
                  <TableCell>{transaction.from}</TableCell>
                  <TableCell>{transaction.to}</TableCell>
                  <TableCell>{transaction.seasonName || "N/A"}</TableCell>
                  <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getStatusColor(transaction.status)}>
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination placeholder */}
      {filteredTransactions.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Showing {filteredTransactions.length} transactions</p>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
