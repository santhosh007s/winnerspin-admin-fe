// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { CustomerTable } from "@/components/customer-table";
// import { Users } from "lucide-react";
// import { customerAPI } from "@/lib/api";
// import Loader from "@/components/loader"; // ✅ global loader import

// interface Customer {
//   _id: string;
//   username: string;
//   email: string;
//   cardNo?: string;
//   status: "pending" | "approved" | "rejected";
//   promoterId?: string;
//   promoterName?: string;
//   seasonId?: string;
//   seasonName?: string;
//   createdAt: string;
// }

// export default function CustomersPage() {
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();

//   useEffect(() => {
//     loadCustomers();
//   }, []);

//   const loadCustomers = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       // ✅ get seasonId from localStorage
//       const seasonId = localStorage.getItem("selectedSeason");

//       // ✅ Fixed: handle optional param safely
//       let response;
//       if (seasonId) {
//         response = await customerAPI.getAllBySeason(seasonId);
//       } else {
//         response = await customerAPI.getAll();
//       }

//       setCustomers(response.customers || []);
//     } catch (err) {
//       console.error("Error fetching customers:", err);
//       setError(
//         err instanceof Error ? err.message : "Failed to fetch customers"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const stats = {
//     total: customers.length,
//     approved: customers.filter((c) => c.status === "approved").length,
//     pending: customers.filter((c) => c.status === "pending").length,
//     rejected: customers.filter((c) => c.status === "rejected").length,
//   };

//   const goToRequests = () => {
//     router.push("/admin/requests");
//   };

//   return (
//     <>
//       {/* 🌟 Global loader overlay */}
//       <Loader show={loading} />

//       {!loading && (
//         <div className="space-y-6 mt-15 lg:mt-0">
//           {/* Header */}
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             <div>
//               <h1 className="text-3xl font-bold text-foreground">Customers</h1>
//               <p className="text-muted-foreground">
//                 Manage pending customers in your system
//               </p>
//             </div>
//             <button
//               onClick={goToRequests}
//               className="px-4 py-2 bg-black text-white rounded-md hover:bg-black/15 hover:text-black"
//             >
//               Check New Customer Requests
//             </button>
//           </div>

//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">
//                   Total Customers
//                 </CardTitle>
//                 <Users className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">{stats.total}</div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Error */}
//           {error && (
//             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//               <span>{error}</span>
//             </div>
//           )}

//           {/* Empty State */}
//           {!error && customers.length === 0 && (
//             <Card>
//               <CardContent className="pt-6">
//                 <div className="text-center py-12">
//                   <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//                   <h3 className="text-xl font-medium text-gray-700 mb-2">
//                     No customers found
//                   </h3>
//                   <p className="text-gray-500 mb-6">
//                     No customers found — try refreshing or go to Requests.
//                   </p>
//                   <button
//                     onClick={loadCustomers}
//                     className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-500"
//                   >
//                     Refresh
//                   </button>
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           {/* Customers Table */}
//           {!error && customers.length > 0 && (
//             <Card>
//               <CardHeader>
//                 <CardTitle>Approved Customers</CardTitle>
//                 <CardDescription>View and manage all customers</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <CustomerTable
//                   customers={customers}
//                   loading={false}
//                   showActions={true}
//                 />
//               </CardContent>
//             </Card>
//           )}
//         </div>
//       )}
//     </>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CustomerTable } from "@/components/customer-table";
import { Users } from "lucide-react";
import { customerAPI } from "@/lib/api";
import Loader from "@/components/loader"; // ✅ global loader import

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

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError(null);

      // ✅ your getAll() already handles seasonId internally
      const response = await customerAPI.getAll();
      setCustomers(response.customers || []);
    } catch (err) {
      console.error("Error fetching customers:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch customers"
      );
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: customers.length,
    approved: customers.filter((c) => c.status === "approved").length,
    pending: customers.filter((c) => c.status === "pending").length,
    rejected: customers.filter((c) => c.status === "rejected").length,
  };

  const goToRequests = () => {
    router.push("/admin/requests");
  };

  return (
    <>
      {/* 🌟 Global loader overlay */}
      <Loader show={loading} />

      {!loading && (
        <div className="space-y-6 mt-15 lg:mt-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Winnerspin Customers
              </h1>
              <p className="text-muted-foreground">
                Manage pending customers in your system
              </p>
            </div>
            <button
              onClick={goToRequests}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-black/15 hover:text-black"
            >
              Check New Customer Requests
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Customers
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <span>{error}</span>
            </div>
          )}

          {/* Empty State */}
          {!error && customers.length === 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 mb-2">
                    No customers found
                  </h3>
                  <p className="text-gray-500 mb-6">
                    No customers found — try refreshing or go to Requests.
                  </p>
                  <button
                    onClick={loadCustomers}
                    className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-500"
                  >
                    Refresh
                  </button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Customers Table */}
          {!error && customers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Approved Customers</CardTitle>
                <CardDescription>View and manage all customers</CardDescription>
              </CardHeader>
              <CardContent>
                <CustomerTable
                  customers={customers}
                  loading={false}
                  showActions={true}
                />
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </>
  );
}
