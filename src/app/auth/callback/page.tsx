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

      const user = session.user;
      const userId = user.id;

      // Check if user exists in users table
      const { data: existing, error: selErr } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      // If no row exists → create minimal user row
      if (!existing) {
        await supabase.from("users").insert({
          id: userId,
          full_name: user.user_metadata.full_name || "",
          email: user.email,
          phone: user.phone || null,
          profile_type: null,
          slug: (user.user_metadata.full_name || "user")
            .toLowerCase()
            .replace(/ /g, "-")
        });
        router.push("/choose-profile");
        return;
      }

      // Row exists, check profile_type
      if (!existing.profile_type) {
        router.push("/choose-profile");
        return;
      }

      if (existing.profile_type === "candidate") {
        router.push("/register_candidate");
        return;
      }

      if (existing.profile_type === "company") {
        router.push("/register_company");
        return;
      }

      setStatus("Profil nije pronađen.");
    };

    checkAuth();
  }, [router]);

  return (
    <div style={{ padding: 40, textAlign: "center", fontSize: 20 }}>
      {status}
    </div>
  );
}
