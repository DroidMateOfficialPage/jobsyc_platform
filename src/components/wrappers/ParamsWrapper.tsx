"use client";

import { useSearchParams } from "next/navigation";

export default function ParamsWrapper({ children }: any) {
  const searchParams = useSearchParams();
  const selectedIndustry = searchParams.get("industry_category");

  return children(selectedIndustry);
}
