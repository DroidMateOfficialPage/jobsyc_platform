"use client";

import { useEffect, useState } from "react";
import ProfileCard from "@/components/card_layout/ProfileCard";
import { supabase } from "@/lib/supabaseClient";
import SwipeableCard from "@/components/card_layout/SwipeableCard";

import SidebarLeft from "@/components/main_layout/SidebarLeft";
import TopIndustries from "@/components/main_layout/TopIndustries";
import RightSuggestions from "@/components/main_layout/RightSuggestions";
import Messanges from "@/components/main_layout/Messanges";
import { useSearchParams } from "next/navigation";

export default function HomePage() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileType, setProfileType] = useState(null);
  const [currentUserProfile, setCurrentUserProfile] = useState(null);

  const searchParams = useSearchParams();
  const selectedIndustry = searchParams.get("industry_category");

  // ----------------------------
  //  LOAD USER TYPE FROM USERS
  // ----------------------------
  useEffect(() => {
    const loadUser = async () => {
      const { data: { user }} = await supabase.auth.getUser();
      if (!user) return;

      const { data: userRow } = await supabase
        .from("users")
        .select("profile_type")
        .eq("id", user.id)
        .single();

      if (userRow?.profile_type === "candidate") setProfileType("candidate");
      else if (userRow?.profile_type === "company") setProfileType("company");
    };

    loadUser();
  }, []);

  // ---------------------------------------
  //  LOAD CURRENT LOGGED-IN USER FULL ROW
  // ---------------------------------------
  useEffect(() => {
    if (!profileType) return;

    const loadMyProfile = async () => {
      const { data: { user }} = await supabase.auth.getUser();
      if (!user) return;

      const table = profileType === "candidate" ? "candidate_profile" : "company_profile";

      const { data } = await supabase
        .from(table)
        .select("*")
        .eq("user_id", user.id)
        .single();

      setCurrentUserProfile(data || null);
    };

    loadMyProfile();
  }, [profileType]);

  // ---------------------------------------
  //   LOAD OPPOSITE PROFILES (NEW DATABASE)
  // ---------------------------------------
  useEffect(() => {
    if (!profileType || !currentUserProfile) return;

    const loadProfiles = async () => {
      setLoading(true);

      const oppositeTable =
        profileType === "candidate" ? "company_profile" : "candidate_profile";

      const { data, error } = await supabase.from(oppositeTable).select("*");

      if (error) {
        setProfiles([]);
        setLoading(false);
        return;
      }

      const mapped =
        profileType === "candidate"
          ? data.map((p) => ({
              id: p.user_id,
              company_name: p.company_name,
              employees: p.employees,
              industries: p.industries || [],
              industry_category: p.industry_category || [],
              work_mode: p.work_mode || [],
              location: p.location || [],
              logo_file: p.logo_file,
            }))
          : data.map((k) => ({
              id: k.user_id,
              first_name: k.first_name,
              last_name: k.last_name,
              education: k.education || [],
              experience: k.experience || [],
              skills: k.skills || [],
              industries: k.industries || [],
              industry_category: k.industry_category || [],
              job_type: k.job_type || [],
              work_mode: k.work_mode || [],
              location: k.location || [],
              salary: k.salary || [],
            }));

      // filter by saved/liked/passed/superliked profiles
      const savedList = currentUserProfile?.saved_profiles || [];
      const likedList = currentUserProfile?.liked || [];
      const passedList = currentUserProfile?.passed || [];
      const superList = currentUserProfile?.superliked || [];

      const excludeIds = new Set([
        ...savedList,
        ...likedList,
        ...passedList,
        ...superList
      ]);

      let filtered = mapped.filter((p) => !excludeIds.has(p.id));

      // industry filter
      if (selectedIndustry) {
        filtered = filtered.filter(
          (p) =>
            Array.isArray(p.industry_category) &&
            p.industry_category.includes(selectedIndustry)
        );
      }

      setProfiles(filtered);
      setLoading(false);
    };

    loadProfiles();
  }, [profileType, currentUserProfile, selectedIndustry]);

  // ---------------------------------------
  // RECORD SWIPES (SAVE IN NEW TABLES)
  // ---------------------------------------
  async function recordUserAction(action, targetId) {
    const { data: { user }} = await supabase.auth.getUser();
    if (!user) return;

    const table = profileType === "candidate" ? "candidate_profile" : "company_profile";

    const { data: row } = await supabase
      .from(table)
      .select(action)
      .eq("user_id", user.id)
      .single();

    const existingList = Array.isArray(row?.[action]) ? row[action] : [];
    if (!existingList.includes(targetId)) {
      const updated = [...existingList, targetId];

      await supabase
        .from(table)
        .update({ [action]: updated })
        .eq("user_id", user.id);
    }
  }

  async function recordSwipe(dir, targetId) {
    const { data: { user }} = await supabase.auth.getUser();
    if (!user) return;

    const tableOfTarget =
      profileType === "candidate" ? "company_profile" : "candidate_profile";

    let column = "";
    if (dir === "left") column = "passed_by";
    if (dir === "right") column = "liked_by";
    if (dir === "up") column = "super_liked_by";

    const { data: targetRow } = await supabase
      .from(tableOfTarget)
      .select(column)
      .eq("user_id", targetId)
      .single();

    const list = Array.isArray(targetRow?.[column]) ? targetRow[column] : [];

    if (!list.includes(user.id)) {
      const updatedList = [...list, user.id];
      await supabase
        .from(tableOfTarget)
        .update({ [column]: updatedList })
        .eq("user_id", targetId);
    }
  }

  const handleSwipe = async (dir, id) => {
    if (!id) return;

    if (dir === "right") await recordUserAction("liked", id);
    if (dir === "left") await recordUserAction("passed", id);
    if (dir === "up") await recordUserAction("superliked", id);

    await recordSwipe(dir, id);

    setProfiles((prev) => prev.filter((p) => p.id !== id));
  };

  if (loading) return <div>Učitavanje...</div>;
  const noMore = profiles.length === 0;

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-white/5">
      <div className="flex flex-col w-full">
        <div className="relative z-0">
          <SidebarLeft />

          <div className="p-6 ml-0 mr-0 md:ml-[80px] lg:ml-[120px] xl:ml-[250px] xl:mr-[300px]">
            <TopIndustries />

            <div className="flex justify-center mt-6 relative z-0">
              <div className="relative" style={{ width: 380, height: 520 }}>
                {noMore && (
                  <div style={{ textAlign: "center", color: "#555", fontSize: 18 }}>
                    {selectedIndustry
                      ? `Nema profila za industriju: ${selectedIndustry}.`
                      : profileType === "candidate"
                      ? "Nema više poslodavaca."
                      : "Nema više kandidata."}
                  </div>
                )}

                {!noMore &&
                  profiles.slice(0, 3).map((p, i) => (
                    <SwipeableCard
                      key={p.id}
                      index={i}
                      onSwipe={handleSwipe}
                      profile={p}
                      card={
                        <ProfileCard
                          type={profileType === "candidate" ? "company" : "candidate"}
                          data={p}
                        />
                      }
                    />
                  ))}
              </div>
            </div>
          </div>

          <div className="z-10 relative">
            <RightSuggestions />
            <Messanges />
          </div>
        </div>
      </div>
    </div>
  );
}