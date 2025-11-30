import SidebarLeft from "@/components/main_layout/SidebarLeft";
import RightSuggestions from "@/components/main_layout/RightSuggestions";
import { supabaseServer } from "@/lib/supabaseServer";

import ProfileHero from "../components/ProfileHero";
import StatsBar from "../components/StatsBar";
import AboutSection from "../components/AboutSection";
import SkillsMatrix from "../components/SkillsMatrix";
import ExperienceSection from "../components/ExperienceSection";
import PortfolioGallery from "../components/PortfolioGallery";
import BadgesRow from "../components/BadgeRow";
import SocialLinks from "../components/SocialLinks";

export default async function ProfilePage({ params }) {
  // ---------------------------
  // SLUG
  // ---------------------------
  const slug = params.slug;

  if (!slug || typeof slug !== "string") {
    return <div className="p-10">Profil nije pronađen.</div>;
  }

  const slugParts = slug.split("-");
  const idSuffix = slugParts[slugParts.length - 1];

  // ---------------------------
  // SERVER SUPABASE CLIENT
  // ---------------------------
  const supabase = supabaseServer();

  // ---------------------------
  // NAĐI USER PO SUFFIXU ID-a
  // ---------------------------
  const { data: userRow, error: userErr } = await supabase
    .from("users")
    .select("*")
    .ilike("id::text", `%${idSuffix}`)
    .maybeSingle();

  if (!userRow) {
    return <div className="p-10">Profil nije pronađen.</div>;
  }

  // ---------------------------
  // UČITAJ DETALJAN PROFIL
  // ---------------------------
  const table =
    userRow.profile_type === "candidate"
      ? "candidate_profile"
      : "company_profile";

  const { data: profileRow, error: profileErr } = await supabase
    .from(table)
    .select("*")
    .eq("user_id", userRow.id)
    .single();

  const profile = { ...userRow, ...profileRow };

  // ---------------------------
  // UI RENDER
  // ---------------------------
  return (
    <div className="w-full flex">
      {/* LEFT SIDEBAR */}
      <div className="hidden lg:block w-[280px] h-screen sticky top-0">
        <SidebarLeft />
      </div>

      {/* MAIN CONTENT */}
      <div
        className="flex-1 flex flex-col gap-10 px-4 py-8 md:px-10 lg:px-16"
        style={{ maxWidth: "1200px" }}
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

      {/* RIGHT SIDEBAR */}
      <div className="hidden xl:block w-[300px] h-screen sticky top-0">
        <RightSuggestions />
      </div>
    </div>
  );
}