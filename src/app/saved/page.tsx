"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import SidebarLeft from "@/components/main_layout/SidebarLeft";
import RightSuggestions from "@/components/main_layout/RightSuggestions";
import ProfileCard from "@/components/card_layout/ProfileCard";
import Image from "next/image";

export default function SavedPage() {
  const [profileType, setProfileType] = useState<"candidate" | "company" | null>(null);
  const [savedProfiles, setSavedProfiles] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // ------------------------------------------------
  // 1. Load user profile_type from users
  // ------------------------------------------------
  useEffect(() => {
    const loadType = async () => {
      const { data: { user }} = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("users")
        .select("profile_type")
        .eq("id", user.id)
        .single();

      if (data?.profile_type === "candidate") setProfileType("candidate");
      else if (data?.profile_type === "company") setProfileType("company");
    };

    loadType();
  }, []);

  // ------------------------------------------------
  // 2. Load saved IDs for logged user
  // ------------------------------------------------
  useEffect(() => {
    if (!profileType) return;

    const loadSaved = async () => {
      setLoading(true);
      const { data: { user }} = await supabase.auth.getUser();
      if (!user) return;

      const myTable = profileType === "candidate" ? "candidate_profile" : "company_profile";

      const { data: me } = await supabase
        .from(myTable)
        .select("saved")
        .eq("user_id", user.id)
        .single();

      const savedIds: string[] = me?.saved || [];
      if (savedIds.length === 0) {
        setSavedProfiles([]);
        setLoading(false);
        return;
      }

      // Fetch opposite profiles
      const targetTable = profileType === "candidate" ? "company_profile" : "candidate_profile";

      const { data: profiles } = await supabase
        .from(targetTable)
        .select("*")
        .in("user_id", savedIds);

      setSavedProfiles(profiles || []);
      setLoading(false);
    };

    loadSaved();
  }, [profileType]);

  if (loading) return <div className="p-10">Učitavanje...</div>;

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-[#0d0d0d]">
      <SidebarLeft />

      <div className="flex-1 ml-0 md:ml-[80px] lg:ml-[120px] xl:ml-[250px] p-10 overflow-y-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Sačuvani profili
        </h1>

        {savedProfiles.length === 0 && (
          <p className="text-gray-600 dark:text-gray-300">Nema sačuvanih profila.</p>
        )}

        {/* GRID OF SMALL CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedProfiles.map((p) => (
            <div
              key={p.user_id}
              className="p-4 rounded-xl bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-md transition cursor-pointer flex gap-4"
              onClick={() => setSelected(p)}
            >
              {/* Thumbnail */}
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 dark:bg-white/10 flex-shrink-0">
                <Image
                  src={
                    p.logo_url ||
                    p.profile_picture_url ||
                    "/images/default-user.jpg"
                  }
                  alt="avatar"
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </div>

              {/* Text */}
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {p.company_name || `${p.first_name} ${p.last_name}`}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {p.industry_category?.[0] || "Industrija nije navedena"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <RightSuggestions />

      {/* PROFILE MODAL */}
      {selected && (
        <div
          className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm flex items-center justify-center px-6"
          onClick={() => setSelected(null)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <ProfileCard
              type={profileType === "candidate" ? "company" : "candidate"}
              data={selected}
            />
          </div>
        </div>
      )}
    </div>
  );
}