"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import EditSection from "./EditSection";

interface ProfileHeroProps {
  profile: any;
}

export default function ProfileHero({ profile }: ProfileHeroProps) {
  if (!profile) return null;

  const isCompany = profile.profile_type === "company";
  const isOwnProfile = profile.is_self || profile.isOwner;
  const router = useRouter();

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#1089D3] to-[#0B6CA8] shadow-xl">
      
      {/* COVER IMAGE */}
      {/* <div className="w-full h-28 md:h-36 bg-gradient-to-r from-[#1089D3] to-[#0B6CA8] opacity-70" /> */}
      <div className="p-2">

      <EditSection profile={profile}  />
      
      </div>
      {/* AVATAR + INFO */}
      <div className="relative left-0 right-0 -top-20 flex flex-col md:flex-row items-center md:items-start justify-center gap-8 px-6 text-center md:text-left p-5">

        {/* LEFT COLUMN — AVATAR */}
        <div className="flex flex-col items-center md:items-start">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <Image
              src={
                profile.profile_picture_url ||
                profile.logo_url ||
                profile.avatar_url ||
                "/images/default_avatar.png"
              }
              alt="avatar"
              width={130}
              height={130}
              className="object-cover"
            />
          </div>
        </div>

        {/* RIGHT COLUMN — TEXT INFO */}
        <div className="flex flex-col items-center md:items-start">
          <h1 className="mt-4 md:mt-0 text-2xl md:text-3xl font-bold text-white drop-shadow-md">
            {isCompany
              ? profile.company_name
              : `${profile.first_name} ${profile.last_name}`}
          </h1>

          <p className="text-white/90 text-sm md:text-base mt-1">
            {isCompany
              ? (profile.industry_category?.[0] || "")
              : (profile.headline || "")
            }
          </p>

          {(profile.location_city || profile.location_country) && (
            <p className="text-white/80 text-xs md:text-sm mt-1">
              📍 {profile.location_city}, {profile.location_country}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 mt-3">
            {profile.verified && (
              <span className="px-3 py-1 text-xs bg-white/20 text-white rounded-full backdrop-blur-md border border-white/30">
                ✔ Verified
              </span>
            )}

            {profile.early_adopter && (
              <span className="px-3 py-1 text-xs bg-yellow-400 text-gray-900 font-semibold rounded-full">
                ⭐ Early Adopter
              </span>
            )}

            {profile.premium_tier && (
              <span className="px-3 py-1 text-xs bg-white text-[#1089D3] rounded-full font-semibold">
                🔥 {profile.premium_tier}
              </span>
            )}
          </div>
        </div>

        
      </div>

      {/* Spacer to push content down under avatar */}
      <div className="h-10" />

    </div>
  );
}