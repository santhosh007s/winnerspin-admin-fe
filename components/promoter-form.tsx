// "use client";

// import type React from "react";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Loader2 } from "lucide-react";

// interface PromoterFormData {
//   userid: string;
//   username: string;
//   password: string;
//   email: string;
//   mobNo: string;
//   status: "approved" | "unapproved";
//   isActive: boolean; // ✅ new
//   address?: string;
//   city?: string;
//   state?: string;
//   pincode?: string;
// }

// interface PromoterFormProps {
//   initialData?: Partial<PromoterFormData>;
//   onSubmit: (data: PromoterFormData) => Promise<void>;
//   isEditing?: boolean;
// }

// export function PromoterForm({
//   initialData,
//   onSubmit,
//   isEditing = false,
// }: PromoterFormProps) {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [formData, setFormData] = useState<PromoterFormData>({
//     userid: initialData?.userid || "",
//     username: initialData?.username || "",
//     password: "",
//     email: initialData?.email || "",
//     mobNo: initialData?.mobNo || "",
//     status: initialData?.status || "unapproved",
//     isActive: initialData?.isActive ?? true, // ✅ default true
//     address: initialData?.address || "",
//     city: initialData?.city || "",
//     state: initialData?.state || "",
//     pincode: initialData?.pincode || "",
//   });

//   useEffect(() => {
//     if (isEditing && initialData) {
//       setFormData((prev) => ({
//         ...prev,
//         userid: initialData.userid ?? prev.userid,
//         username: initialData.username ?? prev.username,
//         email: initialData.email ?? prev.email,
//         mobNo: initialData.mobNo ?? prev.mobNo,
//         status: initialData.status ?? prev.status,
//         isActive: initialData.isActive ?? prev.isActive,
//         address: initialData.address ?? prev.address,
//         city: initialData.city ?? prev.city,
//         state: initialData.state ?? prev.state,
//         pincode: initialData.pincode ?? prev.pincode,
//         password: "",
//       }));
//     }
//   }, [isEditing, initialData]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     try {
//       await onSubmit(formData);
//       router.push("/admin/promoters");
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "An error occurred");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = <K extends keyof PromoterFormData>(
//     field: K,
//     value: PromoterFormData[K]
//   ) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   return (
//     <Card className="max-w-2xl mx-auto">
//       <CardHeader>
//         <CardTitle>
//           {isEditing ? "Edit Promoter" : "Create New Promoter"}
//         </CardTitle>
//         <CardDescription>
//           {isEditing
//             ? "Update promoter information"
//             : "Add a new promoter to the system"}
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* ID & Username */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="userid">Promoter ID</Label>
//               <Input
//                 id="userid"
//                 value={formData.userid}
//                 onChange={(e) => handleChange("userid", e.target.value)}
//                 placeholder="PROMO001"
//                 required
//                 disabled={isEditing}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="username">Username</Label>
//               <Input
//                 id="username"
//                 value={formData.username}
//                 onChange={(e) => handleChange("username", e.target.value)}
//                 placeholder="promoter1"
//                 required
//               />
//             </div>
//           </div>

//           {/* Email & Mobile */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={(e) => handleChange("email", e.target.value)}
//                 placeholder="promoter@example.com"
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="mobNo">Mobile Number</Label>
//               <Input
//                 id="mobNo"
//                 value={formData.mobNo}
//                 onChange={(e) => handleChange("mobNo", e.target.value)}
//                 placeholder="9876543210"
//                 required
//               />
//             </div>
//           </div>

//           {/* Address */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="address">Address</Label>
//               <Input
//                 id="address"
//                 value={formData.address}
//                 onChange={(e) => handleChange("address", e.target.value)}
//                 placeholder="Street and area"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="city">City</Label>
//               <Input
//                 id="city"
//                 value={formData.city}
//                 onChange={(e) => handleChange("city", e.target.value)}
//                 placeholder="City"
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="state">State</Label>
//               <Input
//                 id="state"
//                 value={formData.state}
//                 onChange={(e) => handleChange("state", e.target.value)}
//                 placeholder="State"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="pincode">Pincode</Label>
//               <Input
//                 id="pincode"
//                 value={formData.pincode}
//                 onChange={(e) => handleChange("pincode", e.target.value)}
//                 placeholder="600001"
//               />
//             </div>
//           </div>

//           {/* Password & Status */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <Input
//                 id="password"
//                 type="password"
//                 value={formData.password}
//                 onChange={(e) => handleChange("password", e.target.value)}
//                 placeholder={
//                   isEditing
//                     ? "Leave blank to keep current password"
//                     : "Enter password"
//                 }
//                 required={!isEditing}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="status">Status</Label>
//               <Select
//                 value={formData.status}
//                 onValueChange={(value) => handleChange("status", value as any)}
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="unapproved">unapproved</SelectItem>
//                   <SelectItem value="approved">approved</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="isActive">Activate / Deactivate</Label>
//               <Select
//                 value={formData.isActive ? "active" : "inactive"}
//                 onValueChange={(value) =>
//                   handleChange("isActive", value === "active")
//                 }
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="active">Activate</SelectItem>
//                   <SelectItem value="inactive">Deactivate</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           {error && (
//             <Alert variant="destructive">
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           )}

//           <div className="flex gap-4 pt-4">
//             <Button type="submit" disabled={loading}>
//               {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//               {isEditing ? "Update Promoter" : "Create Promoter"}
//             </Button>
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => router.back()}
//             >
//               Cancel
//             </Button>
//           </div>
//         </form>
//       </CardContent>
//     </Card>
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

interface PromoterFormData {
  userid: string;
  username: string;
  password: string;
  email: string;
  mobNo: string;
  status: "approved" | "unapproved";
  isActive: boolean;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

interface PromoterFormProps {
  initialData?: Partial<PromoterFormData>;
  onSubmit: (data: PromoterFormData) => Promise<void>;
  isEditing?: boolean;
}

export function PromoterForm({
  initialData,
  onSubmit,
  isEditing = false,
}: PromoterFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<PromoterFormData>({
    userid: initialData?.userid || "",
    username: initialData?.username || "",
    password: "",
    email: initialData?.email || "",
    mobNo: initialData?.mobNo || "",
    status: initialData?.status || "unapproved",
    isActive: initialData?.isActive ?? true,
    address: initialData?.address || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    pincode: initialData?.pincode || "",
  });

  useEffect(() => {
    if (isEditing && initialData) {
      setFormData((prev) => ({
        ...prev,
        userid: initialData.userid ?? prev.userid,
        username: initialData.username ?? prev.username,
        email: initialData.email ?? prev.email,
        mobNo: initialData.mobNo ?? prev.mobNo,
        status: initialData.status ?? prev.status,
        isActive: initialData.isActive ?? prev.isActive,
        address: initialData.address ?? prev.address,
        city: initialData.city ?? prev.city,
        state: initialData.state ?? prev.state,
        pincode: initialData.pincode ?? prev.pincode,
        password: "",
      }));
    }
  }, [isEditing, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSubmit(formData);
      router.push("/admin/promoters");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = <K extends keyof PromoterFormData>(
    field: K,
    value: PromoterFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {isEditing ? "Edit Promoter" : "Create New Promoter"}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? "Update promoter information"
            : "Add a new promoter to the system"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ID & Username */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="userid">Promoter ID</Label>
              <Input
                id="userid"
                name="userid"
                value={formData.userid}
                onChange={(e) => handleChange("userid", e.target.value)}
                placeholder="PROMO001"
                required
                disabled={isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={(e) => handleChange("username", e.target.value)}
                placeholder="promoter1"
                required
              />
            </div>
          </div>

          {/* Email & Mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="promoter@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobNo">Mobile Number</Label>
              <Input
                id="mobNo"
                name="mobNo"
                value={formData.mobNo}
                onChange={(e) => handleChange("mobNo", e.target.value)}
                placeholder="9876543210"
                required
              />
            </div>
          </div>

          {/* Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="Street and area"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
                placeholder="City"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={(e) => handleChange("state", e.target.value)}
                placeholder="State"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode</Label>
              <Input
                id="pincode"
                name="pincode"
                value={formData.pincode}
                onChange={(e) => handleChange("pincode", e.target.value)}
                placeholder="600001"
              />
            </div>
          </div>

          {/* Password, Status, Activate */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder={
                  isEditing
                    ? "Leave blank to keep current password"
                    : "Enter password"
                }
                required={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "approved" | "unapproved") =>
                  handleChange("status", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unapproved">unapproved</SelectItem>
                  <SelectItem value="approved">approved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="isActive">Activate / Deactivate</Label>
              <Select
                value={formData.isActive ? "active" : "inactive"}
                onValueChange={(value: "active" | "inactive") =>
                  handleChange("isActive", value === "active")
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Activate</SelectItem>
                  <SelectItem value="inactive">Deactivate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Update Promoter" : "Create Promoter"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
