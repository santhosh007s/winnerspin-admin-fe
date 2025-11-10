//
"use client";

import { useState } from "react";
import Link from "next/link";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MoreHorizontal, Eye, Edit, Search } from "lucide-react";
import { promoterAPI } from "@/lib/api";

export interface Promoter {
  _id: string;
  userid?: string;
  username: string;
  email: string;
  mobNo: string;
  status: "approved" | "unapproved" | "inactive";
  isActive: boolean;
  balance?: number;
  customers?: string[];
}

interface PromoterTableProps {
  approvedPromoters?: Promoter[];
  nonApprovedPromoters?: Promoter[];
  inactivePromoters?: Promoter[];
  allInactivePromoters?: Promoter[];
  loading?: boolean;
  onDelete: (promoterId: string) => void;
}

export function PromoterTable({
  approvedPromoters = [],
  nonApprovedPromoters = [],
  inactivePromoters = [],
  allInactivePromoters = [],
  loading,
  onDelete,
}: PromoterTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [deletePromoter, setDeletePromoter] = useState<Promoter | null>(null);
  const [tab, setTab] = useState<
    "all" | "approved" | "unapproved" | "inactive"
  >("all");

  const allPromoters: Promoter[] = [
    ...(approvedPromoters || []),
    ...(nonApprovedPromoters || []),
    ...(inactivePromoters || []),
  ].map((p) => ({
    balance: 0,
    customers: [],
    userid: p.userid ?? p.username,
    ...p,
  }));

  const tabFilteredPromoters: Promoter[] =
    tab === "approved"
      ? allPromoters.filter((p) => p.status === "approved" && p.isActive)
      : tab === "unapproved"
      ? allPromoters.filter((p) => p.status !== "approved" && p.isActive)
      : tab === "inactive"
      ? (allInactivePromoters as Promoter[])
      : allPromoters;

  const filteredPromoters = tabFilteredPromoters.filter((p) => {
    const s = searchTerm.toLowerCase();
    return (
      (p.username ?? "").toLowerCase().includes(s) ||
      (p.email ?? "").toLowerCase().includes(s) ||
      (p.userid ?? "").toLowerCase().includes(s)
    );
  });

  const getStatusColor = (promoter: Promoter) => {
    if (!promoter.isActive || promoter.status === "inactive")
      return " bg-red-100 text-red-800";
    switch (promoter.status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "unapproved":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleDelete = async () => {
    if (deletePromoter) {
      try {
        await promoterAPI.toggleStatus(
          deletePromoter._id,
          !deletePromoter.isActive
        );
        onDelete(deletePromoter._id);
        setDeletePromoter(null);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to delete promoter";
        alert(message);
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-muted animate-pulse rounded" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-muted animate-pulse rounded" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs
        value={tab}
        onValueChange={(v: string) =>
          setTab(v as "all" | "approved" | "unapproved" | "inactive")
        }
      >
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="unapproved">Unapproved</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search promoters by name, email, or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Promoter ID</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Customers</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPromoters.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-muted-foreground"
                >
                  No promoters found
                </TableCell>
              </TableRow>
            ) : (
              filteredPromoters.map((promoter) => (
                <TableRow key={promoter._id}>
                  <TableCell className="font-medium">
                    {promoter.userid}
                  </TableCell>
                  <TableCell>{promoter.username}</TableCell>
                  <TableCell>{promoter.email}</TableCell>
                  <TableCell>{promoter.mobNo}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={getStatusColor(promoter)}
                    >
                      {!promoter.isActive || promoter.status === "inactive"
                        ? "Inactive"
                        : promoter.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    ₹{promoter.balance?.toLocaleString() || 0}
                  </TableCell>
                  <TableCell>{promoter.customers?.length || 0}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/promoters/${promoter._id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/promoters/${promoter._id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        {/* Deactivate with confirm dialog if needed */}
                        {/* <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setDeletePromoter(promoter)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Deactivate
                        </DropdownMenuItem> */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={!!deletePromoter}
        onOpenChange={() => setDeletePromoter(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Promoter</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete promoter{" "}
              {deletePromoter?.username}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
