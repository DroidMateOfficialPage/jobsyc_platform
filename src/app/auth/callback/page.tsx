"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function CallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Provjera profila...");

  useEffect(() => {
    const processOAuth = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;

      if (!session) {
        setStatus("Nema aktivne sesije.");
        router.push("/");
        return;
      }

      const user = session.user;
      const userId = user.id;
      const fullName = user.user_metadata.full_name || "";
      const email = user.email || "";

      // ---- CHECK IF USER EXISTS IN USERS TABLE ----
      const { data: existingUser, error: userFetchError } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (userFetchError) {
        console.error("Error checking user:", userFetchError);
      }

      // ---- IF USER DOESN'T EXIST → CREATE IT ----
      if (!existingUser) {
        const slug = fullName
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9\-]/g, "");

        const { error: insertUserError } = await supabase
          .from("users")
          .insert({
            id: userId,
            full_name: fullName,
            email: email,
            profile_type: "candidate",
            slug: slug,
            badge_id: null,
            package_tier: null,
            is_limited_early_member: false,
            verified: true,
            has_completed_onboarding: false,
          });

        if (insertUserError) {
          console.error("Error inserting user:", insertUserError);
        }

        // ---- CREATE CANDIDATE PROFILE AS WELL ----
        const nameParts = fullName.split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        await supabase.from("candidate_profile").insert({
          user_id: userId,
          first_name: firstName,
          last_name: lastName,
          email: email,
          profile_completion: 0,
          badge_url:
            "https://mxiwzeapmfevwfbltcyl.supabase.co/storage/v1/object/public/badges/founder_badge.png",
          has_completed_onboarding: false,
        });

        // After account creation → onboarding
        router.push("/onboarding");
        return;
      }

      // ---- IF USER EXISTS, CHECK PROFILE TYPE ----
      if (existingUser.profile_type === "candidate") {
        router.push("/onboarding");
        return;
      }

      if (existingUser.profile_type === "company") {
        router.push("/register_company");
        return;
      }

      setStatus("Profil nema konfigurisan tip.");
    };

    processOAuth();
  }, [router]);

  return (
    <div style={{ padding: 40, textAlign: "center", fontSize: 20 }}>
      {status}
    </div>
  );
}
