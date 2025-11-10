
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { customerAPI } from "@/lib/api";
import {
  ArrowLeft,
} from "lucide-react";

interface Installment {
  _id: string;
  installmentNo: number;
  amount: string;
  paymentDate: string;
}

interface Customer {
  _id: string;
  username: string;
  email: string;
  mobile: string;
  cardNo?: string;
  state: string;
  city: string;
  address: string;
  pincode: number;
  firstPayment: string;
  status: "pending" | "approved" | "rejected";
  promoterName?: string;
  seasonNames?: string;
  createdAt: string;
  approvedAt?: string;
  installments?: Installment[];
}

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) fetchCustomer(params.id as string);
  }, [params.id]);

  const fetchCustomer = async (id: string) => {
    try {
      setLoading(true);
      const response = await customerAPI.getById(id);
      setCustomer(response.customer);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch customer");
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error || !customer)
    return (
      <div className="p-6 text-center">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <p>{error || "Customer not found"}</p>
      </div>
    );

  return (
    <div className="space-y-6 p-4 mt-15 lg:mt-0">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{customer.username}</h1>
          <p className="text-muted-foreground">Customer Details</p>
        </div>
      </div>

      {/* Customer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Email</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{customer.email}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mobile</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{customer.mobile}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Card Number</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{customer.cardNo || "Not provided"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Address</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              {customer.address}, {customer.city}, {customer.state} -{" "}
              {customer.pincode}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={getStatusColor(customer.status)}>
              {customer.status}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>First Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <p>₹{customer.firstPayment}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assigned Promoter</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{customer.promoterName || "Not assigned"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Seasons</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{customer.seasonNames || "Not assigned"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Registration Date</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{new Date(customer.createdAt).toLocaleDateString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Installments */}
      {customer.installments && customer.installments.length > 0 && (
        <>
          <h2 className="text-xl font-bold mt-6">Installments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customer.installments.map((inst) => (
              <Card key={inst._id}>
                <CardHeader>
                  <CardTitle>Installment #{inst.installmentNo}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Amount: ₹{inst.amount}</p>
                  <p>
                    Payment Date:{" "}
                    {new Date(inst.paymentDate).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
