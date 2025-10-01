"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { PromoterForm } from "@/components/promoter-form";
import { promoterAPI } from "@/lib/api";

export default function EditPromoterPage() {
  const params = useParams();
  const [promoter, setPromoter] = useState<Partial<any> | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState<string | null>(null);

  useEffect(() => {
    const storedSeason = localStorage.getItem("selectedSeason");
    setSelectedSeason(storedSeason);
  }, []);

  useEffect(() => {
    if (params.id && selectedSeason) {
      fetchPromoter(params.id as string, selectedSeason);
    }
  }, [params.id, selectedSeason]);

  const fetchPromoter = async (id: string, seasonId: string) => {
    try {
      const response = await promoterAPI.getById(id, { seasonId });
      const raw = (response as any)?.promoter ?? response;

      setPromoter({
        userid: String(raw?.userid ?? ""),
        username: String(raw?.username ?? ""),
        email: String(raw?.email ?? ""),
        mobNo: String(raw?.mobNo ?? ""),
        status: raw?.status === "approved" ? "approved" : "unapproved",
        isActive: raw?.isActive ?? true,
        address: raw?.address ?? "",
        city: raw?.city ?? "",
        state: raw?.state ?? "",
        pincode: raw?.pincode ?? "",
      });
    } catch (err) {
      console.error("Failed to fetch promoter:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    if (!selectedSeason) return console.error("No season selected");

    await promoterAPI.updateProfile(params.id as string, {
      userid: data.userid,
      username: data.username,
      email: data.email,
      mobNo: data.mobNo,
      status: data.status,
      isActive: data.isActive,
      address: data.address,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      selectedSeason,
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted animate-pulse rounded w-1/3" />
        <div className="h-96 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Edit Promoter</h1>
        <p className="text-muted-foreground">Update promoter information</p>
      </div>
      <PromoterForm initialData={promoter} onSubmit={handleSubmit} isEditing />
    </div>
  );
}
