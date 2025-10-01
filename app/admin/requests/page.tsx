"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // ✅ correct import
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CustomerTable } from "@/components/customer-table";
import { ApprovalDialog } from "@/components/approval-dialog";
import { RejectionDialog } from "@/components/rejection-dialog";
import { customerAPI } from "@/lib/api";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Customer {
  _id: string;
  username: string;
  email: string;
  cardNo?: string;
  status: "pending" | "approved" | "rejected";
  promoterId?: string;
  promoterName?: string;
  seasonId?: string;
  seasonName?: string;
  createdAt: string;
}

export default function RequestsPage() {
  const router = useRouter(); // ✅ initialize router
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approvalCustomer, setApprovalCustomer] = useState<Customer | null>(
    null
  );
  const [rejectionCustomer, setRejectionCustomer] = useState<Customer | null>(
    null
  );

  useEffect(() => {
    fetchNewCustomers();
  }, []);

  const fetchNewCustomers = async () => {
    try {
      setLoading(true);
      const response = await customerAPI.getNew();
      setCustomers(response.customers || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch new customers"
      );
    } finally {
      setLoading(false);
    }
  };

  // const handleApprove = async (
  //   customerId: string,
  //   promoterId: string,
  //   seasonId: string
  // ) => {
  //   try {
  //     await customerAPI.approve({ customerId, promoterId, seasonId });
  //     setCustomers((prev) => prev.filter((c) => c._id !== customerId));
  //     setApprovalCustomer(null);
  //   } catch (err) {
  //     setError(
  //       err instanceof Error ? err.message : "Failed to approve customer"
  //     );
  //   }
  // };
const handleApprove = async (customer: {
  _id: string;
  promoter: string;
  seasons: string[];
}) => {
  const customerId = customer._id.toString();
  const promoterId = customer.promoter?.toString() || "";
  const seasonId = customer.seasons[0]?.toString() || "";

  console.log("Customer ID:", customerId);
  console.log("Promoter ID:", promoterId);
  console.log("Season ID:", seasonId);

  await customerAPI.approve({ customerId, promoterId, seasonId });
};

  const handleReject = async (customerId: string) => {
    try {
      await customerAPI.reject(customerId);
      setCustomers((prev) => prev.filter((c) => c._id !== customerId));
      setRejectionCustomer(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to reject customer"
      );
    }
  };

  const stats = {
    pending: customers.length,
    processed: 0, // Placeholder; you can calculate or fetch this if needed
  };

  return (
    <div className="space-y-6 p-4">
      <Button
        type="button"
        variant="outline"
        onClick={() => router.back()} // ✅ no need to pass a path, works like browser back
      >
        Back
      </Button>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Customer Requests
        </h1>
        <p className="text-muted-foreground">
          Review and approve pending customer applications
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex justify-between items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Requests
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex justify-between items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Approved Today
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.processed}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex justify-between items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Rejected Today
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">0</div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Customer Requests</CardTitle>
          <CardDescription>
            {customers.length === 0
              ? "No pending requests at the moment"
              : "Review and approve customer applications below"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {customers.length === 0 && !loading ? (
            <div className="text-center py-12">
              <CheckCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                All caught up!
              </h3>
              <p className="text-muted-foreground">
                No pending customer requests to review.
              </p>
            </div>
          ) : (
            <CustomerTable
              customers={customers}
              loading={loading}
              onApprove={setApprovalCustomer}
              onReject={setRejectionCustomer}
              handleApprove={handleApprove}
              fetchNewCustomers={fetchNewCustomers}
            />
          )}
        </CardContent>
      </Card>

      {/* Rejection Dialog */}
      <RejectionDialog
        customer={rejectionCustomer}
        open={!!rejectionCustomer}
        onOpenChange={(open) => !open && setRejectionCustomer(null)}
        onReject={handleReject}
      />

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}
