// "use client";

// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   LayoutDashboard,
//   Users,
//   Calendar,
//   UserCheck,
//   CreditCard,
//   ArrowUpDown,
//   LogOut,
//   Menu,
//   Banknote,
//   File,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { cn } from "@/lib/utils";
// import { logout } from "@/store/authSlice";
// import type { RootState } from "@/store/store";
// import Image from "next/image";

// // const router = useRouter();


// const navigation = [
//   { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
//   { name: "Promoters", href: "/admin/promoters", icon: Users },
//   { name: "Seasons", href: "/admin/seasons", icon: Calendar },
//   { name: "Customers", href: "/admin/customers", icon: UserCheck },
//   { name: "Withdrawals", href: "/admin/withdrawals", icon: CreditCard },
//   { name: "Transactions", href: "/admin/transactions", icon: ArrowUpDown },
//   { name: "Repayments", href: "/admin/repayments", icon: Banknote },
//   { name: "Poster-upload", href: "/admin/upload-poster", icon: File },
// ];

// export function AdminSidebar() {
//   const pathname = usePathname();
//   const dispatch = useDispatch();
//   const { username } = useSelector((state: RootState) => state.auth);
//   const [mobileOpen, setMobileOpen] = useState(false);
// const router = useRouter();
//   const handleLogout = () => {
//     dispatch(logout());
//     router.push("/");
//   };

//   const SidebarContent = () => (
//     <div className="flex flex-col h-full">
//       {/* Logo Section */}
//       <div className="flex flex-col items-center justify-center  border-b-2 border-border">
//         <Image
//           src="/Logo.png"
//           alt="Logo"
//           width={160}
//           height={160}
//           className="object-contain w-140 mb-[-70px] mt-[-60px] flex flex-col items-center justify-center "
//         />
//         <h2 className="text-lg font-semibold text-foreground mb-4">
//           {" "}
//           Winnerspin Admin Panel
//         </h2>
//         {/* <p className="text-sm text-muted-foreground">Welcome, {username}</p> */}
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 p-4 space-y-2">
//         {navigation.map((item) => {
//           const isActive = pathname === item.href;
//           return (
//             <Link
//               key={item.name}
//               href={item.href}
//               className={cn(
//                 "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
//                 isActive
//                   ? "bg-primary text-primary-foreground"
//                   : "text-muted-foreground hover:text-foreground hover:bg-accent"
//               )}
//               onClick={() => setMobileOpen(false)}
//             >
//               <item.icon className="h-4 w-4" />
//               {item.name}
//             </Link>
//           );
//         })}
//       </nav>

//       {/* Logout */}
//       <div className="p-4 border-t border-border">
//         <Button
//           variant="ghost"
//           className="w-full justify-start gap-3 bg-red-600  text-black hover:bg-red-600 hover:text-black hover:scale-105"
//           onClick={handleLogout}
//         >
//           <LogOut className="h-4 w-4" />
//           Logout
//         </Button>
//       </div>
//     </div>
//   );

//   return (
//     <>
//       {/* Desktop Sidebar */}
//       <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:bg-card lg:border-r-2 lg:border-border">
//         <SidebarContent />
//       </div>

//       {/* Mobile Sidebar */}
//       <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
//         <SheetTrigger asChild>
//           <Button
//             variant="ghost"
//             size="icon"
//             className="lg:hidden fixed top-4 left-4 z-50"
//           >
//             <Menu className="h-5 w-5" />
//           </Button>
//         </SheetTrigger>
//         <SheetContent side="left" className="p-0 w-64">
//           <SidebarContent />
//         </SheetContent>
//       </Sheet>
//     </>
//   );
// }

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDispatch,  } from "react-redux";
import {
  LayoutDashboard,
  Users,
  Calendar,
  UserCheck,
  CreditCard,
  ArrowUpDown,
  LogOut,
  Menu,
  Banknote,
  File,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { logout } from "@/store/authSlice";
import Image from "next/image";

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

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Promoters", href: "/admin/promoters", icon: Users },
  { name: "Seasons", href: "/admin/seasons", icon: Calendar },
  { name: "Customers", href: "/admin/customers", icon: UserCheck },
  { name: "Withdrawals", href: "/admin/withdrawals", icon: CreditCard },
  { name: "Transactions", href: "/admin/transactions", icon: ArrowUpDown },
  { name: "Repayments", href: "/admin/repayments", icon: Banknote },
  { name: "Poster-upload", href: "/admin/upload-poster", icon: File },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const router = useRouter();

  const handleLogoutConfirm = () => {
    dispatch(logout());
    setShowLogoutConfirm(false);
    router.push("/");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo Section */}
      <div className="flex flex-col items-center justify-center border-b-2 border-border">
        <Image
          src="/Logo.png"
          alt="Logo"
          width={160}
          height={160}
          className="object-contain w-140 mb-[-70px] mt-[-60px]"
        />
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Winnerspin Admin Panel
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
              onClick={() => setMobileOpen(false)}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 bg-red-600 text-black hover:bg-red-600 hover:text-black hover:scale-105"
          onClick={() => setShowLogoutConfirm(true)}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:bg-card lg:border-r-2 lg:border-border">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed top-4 left-4 z-50"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to log out? You will be redirected to the
              login page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogoutConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
