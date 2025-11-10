"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Transaction, Season, Promoter } from "@/lib/types";

interface TransactionTableProps {
  transactions: Transaction[];
  loading?: boolean;
  seasons?: Season[];
  promoters?: Promoter[];
}

export function TransactionTable({
  transactions,
  loading,
  promoters = [],
}: TransactionTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "credit" | "debit">(
    "all"
  );
  const [seasonFilter] = useState<"all" | string>("all");
  const [promoterFilter, setPromoterFilter] = useState<"all" | string>("all");

  // ✅ Fix: safely cast onValueChange handler to match Radix Select
  const handleTypeFilterChange = (value: string) => {
    if (value === "credit" || value === "debit" || value === "all") {
      setTypeFilter(value);
    }
  };

  const handlePromoterFilterChange = (value: string) => {
    setPromoterFilter(value);
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.amount.toString().includes(searchTerm) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === "all" || transaction.type === typeFilter;
    const matchesSeason =
      seasonFilter === "all" || transaction.seasonId === seasonFilter;
    const matchesPromoter =
      promoterFilter === "all" || transaction.promoterId === promoterFilter;

    return matchesSearch && matchesType && matchesSeason && matchesPromoter;
  });

  const getTypeColor = (type: Transaction["type"]) => {
    switch (type) {
      case "credit":
        return "bg-green-100 text-green-800";
      case "debit":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
    );
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

        {/* ✅ fixed: explicit handler ensures correct type */}
        <Select value={typeFilter} onValueChange={handleTypeFilterChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="credit">Credit</SelectItem>
            <SelectItem value="debit">Debit</SelectItem>
          </SelectContent>
        </Select>

        {/* Promoter filter */}
        <Select
          value={promoterFilter}
          onValueChange={handlePromoterFilterChange}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Promoter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Promoters</SelectItem>
            {promoters.map((promoter) => (
              <SelectItem key={promoter._id} value={promoter._id}>
                {promoter.username || "Unknown"}
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
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-muted-foreground"
                >
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-mono text-sm">
                    {transaction.id}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      {transaction.type === "credit" ? (
                        <ArrowDownLeft className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 text-red-600" />
                      )}
                      <Badge
                        variant="secondary"
                        className={getTypeColor(transaction.type)}
                      >
                        {transaction.type}
                      </Badge>
                    </div>
                  </TableCell>

                  <TableCell className="font-medium">
                    ₹{transaction.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>{transaction.from}</TableCell>
                  <TableCell>{transaction.to}</TableCell>
                  <TableCell>{transaction.seasonName || "N/A"}</TableCell>
                  <TableCell>
                    {new Date(transaction.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={getStatusColor(transaction.status)}
                    >
                      {transaction.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {filteredTransactions.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredTransactions.length} transactions
          </p>
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
  );
}
