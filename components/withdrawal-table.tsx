
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Check, X, Search } from "lucide-react";
import { Withdrawal } from "@/lib/types";

// -------- Extended Type --------
export interface ExtendedWithdrawal extends Withdrawal {
  requester?: {
    _id?: string;
    userid?: string;
    username?: string;
  };
  approvedAt?: string;
  requestDate?: string;
}

interface WithdrawalTableProps {
  withdrawals: ExtendedWithdrawal[];
  loading?: boolean;
  onApprove: (withdrawalId: string) => void;
  onReject: (withdrawalId: string) => void;
}

export function WithdrawalTable({
  withdrawals,
  loading,
  onApprove,
  onReject,
}: WithdrawalTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionWithdrawal, setActionWithdrawal] = useState<{
    withdrawal: ExtendedWithdrawal;
    action: "approve" | "reject";
  } | null>(null);

  // -------- Filtering Logic --------
  const filteredWithdrawals = withdrawals.filter((withdrawal) => {
    const username = withdrawal.requester?.username || "";
    const userid = withdrawal.requester?.userid || "";
    const amountNum = Number(withdrawal.amount);

    const matchesSearch =
      username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      amountNum.toString().includes(searchTerm);

    const matchesStatus =
      statusFilter === "all" || withdrawal.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // -------- Status Badge Colors --------
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

  // -------- Correct Processed Date Logic --------
  const getProcessedDate = (w: ExtendedWithdrawal) => {
    if (w.status === "approved") {
      return w.approvedAt
        ? new Date(w.approvedAt).toLocaleDateString("en-IN", {
            dateStyle: "medium",
          })
        : "Not approved";
    }

    // pending OR rejected
    return "Not approved";
  };

  // -------- Dialog Action --------
  const handleAction = () => {
    if (!actionWithdrawal) return;

    if (actionWithdrawal.action === "approve") {
      onApprove(actionWithdrawal.withdrawal._id);
    } else {
      onReject(actionWithdrawal.withdrawal._id);
    }

    setActionWithdrawal(null);
  };

  // -------- Loading Skeleton --------
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="h-10 bg-muted animate-pulse rounded flex-1" />
          <div className="h-10 bg-muted animate-pulse rounded w-32" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-muted animate-pulse rounded" />
        ))}
      </div>
    );
  }

  // -------- Table UI --------
  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by username, promoter ID, or amount..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Promoter</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Request Date</TableHead>
              <TableHead>Processed Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredWithdrawals.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  No withdrawals found
                </TableCell>
              </TableRow>
            ) : (
              filteredWithdrawals.map((w) => (
                <TableRow key={w._id}>
                  <TableCell>
                    <p className="font-medium">
                      {w.requester?.username || "Unknown"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {w.requester?.userid || "N/A"}
                    </p>
                  </TableCell>

                  <TableCell>₹{Number(w.amount).toLocaleString()}</TableCell>

                  <TableCell>
                    <Badge className={getStatusColor(w.status)}>
                      {w.status}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    {new Date(w.requestDate ?? w.createdAt).toLocaleDateString(
                      "en-IN",
                      { dateStyle: "medium" }
                    )}
                  </TableCell>

                  <TableCell>{getProcessedDate(w)}</TableCell>

                  <TableCell className="text-right">
                    {w.status === "pending" ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-green-600"
                            onClick={() =>
                              setActionWithdrawal({
                                withdrawal: w,
                                action: "approve",
                              })
                            }
                          >
                            <Check className="mr-2 h-4 w-4" /> Approve
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() =>
                              setActionWithdrawal({
                                withdrawal: w,
                                action: "reject",
                              })
                            }
                          >
                            <X className="mr-2 h-4 w-4" /> Reject
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <span className="text-sm text-muted-foreground capitalize">
                        {w.status}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog
        open={!!actionWithdrawal}
        onOpenChange={() => setActionWithdrawal(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionWithdrawal?.action === "approve" ? "Approve" : "Reject"}{" "}
              Withdrawal
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {actionWithdrawal?.action} this
              withdrawal of ₹
              {actionWithdrawal?.withdrawal.amount.toLocaleString()} from{" "}
              {actionWithdrawal?.withdrawal.requester?.username ||
                "this promoter"}
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={handleAction}
              className={
                actionWithdrawal?.action === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-destructive text-destructive-foreground hover:bg-destructive/90"
              }
            >
              {actionWithdrawal?.action === "approve" ? "Approve" : "Reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
