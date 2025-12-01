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

      // Detect provider
      const provider = user.app_metadata?.provider || "email";

      // EMAIL LOGIN — email/password login MUST go to verify screen until verified
      if (provider === "email") {
        if (!user.email_confirmed_at) {
          setStatus("Molimo potvrdite email adresu.");
          router.push("/auth/verify-email");
          return;
        }
      }

      // Check if user exists in users table
      const { data: existing, error: selErr } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      // If no row exists → create minimal user row
      if (!existing) {
        const fullName =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          `${user.user_metadata?.given_name || ""} ${user.user_metadata?.family_name || ""}`.trim();

        const slug = (fullName || "user")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");

        await supabase.from("users").insert({
          id: userId,
          full_name: fullName || "",
          email: user.email,
          phone: user.phone || null,
          profile_type: null,
          slug,
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

      // Fallback for verified email login
      if (provider === "email" && existing.profile_type) {
        router.push("/home");
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
