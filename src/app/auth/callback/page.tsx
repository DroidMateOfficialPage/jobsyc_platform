"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function CallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Provjera verifikacije...");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;

      if (!session) {
        setStatus("Nalog nije verifikovan.");
        router.push("/auth/verify-email");
        return;
      }

      const userId = session.user.id;

      // CHECK IN USERS TABLE
      const { data: userRow, error } = await supabase
        .from("users")
        .select("profile_type")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.log("USER TABLE ERROR:", error);
      }

      if (!userRow) {
        setStatus("Profil nije pronađen u bazi.");
        return;
      }

      if (userRow.profile_type === "candidate") {
        router.push("/register_candidate");
        return;
      }

      if (userRow.profile_type === "company") {
        router.push("/register_company");
        return;
      }

      setStatus("Profil nema postavljen tip.");
    };

    checkAuth();
  }, [router]);

  return (
    <div style={{ padding: 40, textAlign: "center", fontSize: 20 }}>
      {status}
    </div>
  );
}
