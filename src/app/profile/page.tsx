"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

import dynamic from "next/dynamic";
const SidebarLeft = dynamic(() => import("@/components/main_layout/SidebarLeft"), {
  ssr: false,
});

// import EditSection from "./components/EditSection";


import ProfileHero from "./components/ProfileHero";
import StatsBar from "./components/StatsBar";
import AboutSection from "./components/AboutSection";
import SkillsMatrix from "./components/SkillsMatrix";
import ExperienceSection from "./components/ExperienceSection";
import PortfolioGallery from "./components/PortfolioGallery";
import BadgesRow from "./components/BadgeRow";
import SocialLinks from "./components/SocialLinks";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
      if (!user) {
        setLoading(false);
        return;
      }

      // 1. Fetch user row (profile_type, basic info)
      const { data: userRow, error: userErr } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (userErr || !userRow) {
        setLoading(false);
        return;
      }

      // 2. Fetch candidate or company profile based on profile_type
      let profileData = null;

      if (userRow.profile_type === "candidate") {
        const { data } = await supabase
          .from("candidate_profile")
          .select("*")
          .eq("user_id", user.id)
          .single();
        profileData = { ...userRow, ...data };
      } else if (userRow.profile_type === "company") {
        const { data } = await supabase
          .from("company_profile")
          .select("*")
          .eq("user_id", user.id)
          .single();
        profileData = { ...userRow, ...data };
      }

      setProfile(profileData);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-gray-500">
        You must be logged in to view your profile.
      </div>
    );
  }

  return (
    <div className="w-full flex">
      <div className="w-[280px] h-screen sticky top-0 hidden lg:block">
        <SidebarLeft />
      </div>

      {/* MAIN CONTENT */}
      <div
        className="flex-1 flex flex-col gap-10 px-4 py-8 md:px-10 lg:px-16"
        style={{
          maxWidth: "1200px",
        }}
      >
        <ProfileHero profile={profile} />
        <StatsBar profile={profile} />
        <BadgesRow badges={profile?.badges || []} />
        <AboutSection profile={profile} />
        <SkillsMatrix skills={profile?.skills || []} />
        <ExperienceSection experience={profile?.experience || []} />
        <PortfolioGallery projects={profile?.projects || []} />
        <SocialLinks links={profile?.links || []} />
      </div>
    </div>
  );
}