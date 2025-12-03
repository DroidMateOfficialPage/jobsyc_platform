"use client";

import { User, Star } from "lucide-react";
import { useState, useEffect } from "react";
import ProfileCard from "@/components/card_layout/ProfileCard";
import { supabase } from "@/lib/supabaseClient";

export default function RightSuggestions() {
  const [selected, setSelected] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [profileType, setProfileType] = useState(null);

  // -------------------------------------------------------
  // NORMALIZATION FUNCTION — merges user + profile table
  // -------------------------------------------------------
  const mergeProfile = (user, profile) => {
    if (!profile) return user;

    return {
      ...user,
      ...profile,

      // Normalize fields so matching works properly
      location: profile.location || [],
      work_mode: profile.work_mode || [],
      industries: profile.industries || [],
      industry_category: profile.industry_category || [],
    };
  };

  // -------------------------------------------------------
  // MATCH CALCULATOR
  // -------------------------------------------------------
  const calculateMatch = (profile, user) => {
    if (!profile || !user) return 0;

    let score = 0;
    let total = 0;

    const check = (a, b) => {
      return Array.isArray(a) &&
        Array.isArray(b) &&
        a.some((x) => b.includes(x));
    };

    // Industry Category
    total++;
    if (check(profile.industry_category, user.industry_category)) score++;

    // Location
    total++;
    if (check(profile.location, user.location)) score++;

    // Work Mode
    total++;
    if (check(profile.work_mode, user.work_mode)) score++;

    return Math.round((score / total) * 100);
  };

  // -------------------------------------------------------
  // LOAD CURRENT USER (USERS TABLE) + REAL PROFILE
  // -------------------------------------------------------
  useEffect(() => {
    const load = async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) return;

      // Load from USERS
      const { data: userRow } = await supabase
        .from("users")
        .select("*")
        .eq("id", auth.user.id)
        .single();

      if (!userRow) return;

      setProfileType(userRow.profile_type);

      let fullProfile = null;

      if (userRow.profile_type === "candidate") {
        const { data: profileData } = await supabase
          .from("candidate_profile")
          .select("*")
          .eq("user_id", userRow.id)
          .single();

        fullProfile = mergeProfile(userRow, profileData);
      }

      if (userRow.profile_type === "company") {
        const { data: profileData } = await supabase
          .from("company_profile")
          .select("*")
          .eq("user_id", userRow.id)
          .single();

        fullProfile = mergeProfile(userRow, profileData);
      }

      setCurrentUser(fullProfile);
    };

    load();
  }, []);

  // -------------------------------------------------------
  // LOAD TARGET PROFILES FOR MATCHING
  // -------------------------------------------------------
  useEffect(() => {
    if (!profileType || !currentUser) return;

    const loadProfiles = async () => {
      const targetTable =
        profileType === "candidate"
          ? "company_profile"
          : "candidate_profile";

      const { data, error } = await supabase
        .from(targetTable)
        .select("*")
        .limit(30);

      if (error || !data) {
        setProfiles([]);
        return;
      }

      const mapped = data.map((p) => {
        const normalized = mergeProfile({}, p);
        return {
          ...normalized,
          match: calculateMatch(normalized, currentUser),
        };
      });

      setProfiles(mapped.sort((a, b) => b.match - a.match));
    };

    loadProfiles();
  }, [profileType, currentUser]);

  // -------------------------------------------------------
  // RENDER
  // -------------------------------------------------------
  return (
    <aside className="hidden xl:flex fixed right-0 top-0 h-screen w-[300px] border-l border-black/10 dark:border-white/10 bg-white dark:bg-[#0f0f0f] px-6 py-6 overflow-y-auto flex-col z-[50]">

      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
        Preporučeni profili
      </h2>

      <div className="flex flex-col gap-5">
        {profiles.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Trenutno nema preporučenih profila.
          </p>
        )}

        {profiles.map((profile, index) => (
          <div
            key={index}
            onClick={() => setSelected(profile)}
            className="flex items-center justify-between p-3 rounded-lg border border-black/10 dark:border-white/10 hover:shadow-md transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center overflow-hidden">
                {(profile.logo_url || profile.profile_picture_url || profile.logo_file) ? (
                  <img
                    src={
                      profile.logo_url ||
                      profile.profile_picture_url ||
                      (typeof profile.logo_file === "string"
                        ? profile.logo_file
                        : profile.logo_file
                        ? URL.createObjectURL(new Blob([profile.logo_file]))
                        : "/default-avatar.png")
                    }
                    alt=""
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <User className="text-gray-700 dark:text-gray-300" size={20} />
                )}
              </div>

              <div className="flex flex-col">
                <span className="font-medium text-gray-900 dark:text-white">
                  {profile.company_name ||
                    (profile.first_name && profile.last_name
                      ? profile.first_name + " " + profile.last_name
                      : "Nepoznat korisnik")}
                </span>

                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {profile.industry_category?.[0] || "Industrija nije navedena"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold">
              <Star size={16} />
              <span>{profile.match}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* FULL PROFILE MODAL */}
      {selected && (
        <div
          className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm flex items-center justify-center px-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            <ProfileCard
              type={profileType === "candidate" ? "company" : "candidate"}
              data={selected}
            />
          </div>
        </div>
      )}
    </aside>
  );
}