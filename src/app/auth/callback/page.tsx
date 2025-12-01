"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function CallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Provjera verifikacije...");

  useEffect(() => {
    const handleCallback = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;

      if (!session) {
        setStatus("Nalog nije verifikovan.");
        return router.push("/auth/verify-email");
      }

      const user = session.user;
      const provider = user.app_metadata.provider; // <— KLJUČNI DIO
      const userId = user.id;

      // If login is email → regular email verification flow
      if (provider === "email") {
        setStatus("Email verifikovan!");
        return router.push("/auth/verify-email");
      }

      // ---------------------------
      // OAUTH LOGIN (GOOGLE/LinkedIn)
      // ---------------------------

      // Check if user already exists in USERS table
      const { data: existingUser } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      // If not found → create new user row
      if (!existingUser) {
        const fullName =
          user.user_metadata.full_name ||
          user.user_metadata.name ||
          `${user.user_metadata.given_name || ""} ${
            user.user_metadata.family_name || ""
          }`.trim() ||
          "User";

        const slug = fullName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");

        await supabase.from("users").insert({
          id: userId,
          full_name: fullName,
          email: user.email,
          profile_type: "candidate",
          slug,
          badge_id: "founder_badge",
          is_limited_early_member: true,
          verified: true,
        });

        // create candidate_profile
        await supabase.from("candidate_profile").insert({
          user_id: userId,
          first_name: fullName.split(" ")[0] || "",
          last_name: fullName.split(" ").slice(1).join(" ") || "",
          email: user.email,
          profile_picture_url: user.user_metadata.avatar_url || null,
          badge_url:
            "https://mxiwzeapmfevwfbltcyl.supabase.co/storage/v1/object/public/badges/founder_badge.png",
        });
      }

      // If user exists but onboarding is not done → send to onboarding
      const { data: userRow } = await supabase
        .from("users")
        .select("has_completed_onboarding")
        .eq("id", userId)
        .maybeSingle();

      if (!userRow?.has_completed_onboarding) {
        return router.push("/onboarding");
      }

      // Else → go home
      router.push("/home");
    };

    handleCallback();
  }, [router]);

  return (
    <div style={{ padding: 40, textAlign: "center", fontSize: 20 }}>
      {status}
    </div>
  );
}