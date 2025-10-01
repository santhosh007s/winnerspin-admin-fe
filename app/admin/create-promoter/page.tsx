
"use client";

import { PromoterForm } from "@/components/promoter-form";
import { promoterAPI } from "@/lib/api";

export default function CreatePromoterPage() {
  const handleSubmit = async (data: any) => {
    // get season from localStorage
    const selectedSeason = localStorage.getItem("selectedSeason");
    console.log(selectedSeason);
    console.log(data);

    await promoterAPI.create({
      ...data,
      selectedSeason, // attach here
    });
  };

  return (
    <div className="space-y-6">
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
