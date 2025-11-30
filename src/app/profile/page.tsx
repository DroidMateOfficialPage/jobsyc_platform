"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

import SidebarLeft from "@/components/main_layout/SidebarLeft";

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

  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      {/* LEFT SIDEBAR – only desktop */}
      {isDesktop && (
        <div className="w-[280px] h-screen sticky top-0">
          <SidebarLeft />
        </div>
      )}

      {/* MAIN CONTENT */}
      <div
        className="flex-1 flex flex-col gap-10 px-4 py-8 md:px-10 lg:px-16"
        style={{
          maxWidth: "1200px",
        }}
      >
        <ProfileHero profile={profile} />
        <StatsBar profile={profile} />
        <AboutSection profile={profile} />
        <SkillsMatrix skills={profile?.skills || []} />
        <ExperienceSection experience={profile?.experience || []} />
        <PortfolioGallery projects={profile?.projects || []} />
        <BadgesRow badges={profile?.badges || []} />
        <SocialLinks links={profile?.links || []} />
      </div>
    </div>
  );
}