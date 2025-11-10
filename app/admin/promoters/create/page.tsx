"use client";

import { PromoterForm, PromoterFormData } from "@/components/promoter-form";
import { promoterAPI } from "@/lib/api";

export default function CreatePromoterPage() {
  const handleSubmit = async (data: PromoterFormData) => {
    // Get selected season from localStorage
    const selectedSeason = localStorage.getItem("selectedSeason");
    console.log("Selected Season:", selectedSeason);
    console.log("Form Data:", data);

    await promoterAPI.create({
      ...data,
      selectedSeason, // attach season here
    });
  };

  return (
    <div className="space-y-6 mt-15 lg:mt-0">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Create Promoter</h1>
        <p className="text-muted-foreground">
          Add a new promoter to your system
        </p>
      </div>

      <PromoterForm onSubmit={handleSubmit} />
    </div>
  );
}
