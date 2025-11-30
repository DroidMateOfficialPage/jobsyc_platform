"use client";

import Image from "next/image";

interface ProfileHeroProps {
  profile: any;
}

export default function ProfileHero({ profile }: ProfileHeroProps) {
  if (!profile) return null;

  const isCompany = profile.profile_type === "company";
  const isOwnProfile = profile.is_self || profile.isOwner;

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#1089D3] to-[#0B6CA8] shadow-xl">
      
      {/* COVER IMAGE */}
      <div className="w-full h-40 md:h-56 bg-gradient-to-r from-[#1089D3] to-[#0B6CA8] opacity-70" />

      {/* AVATAR + INFO */}
      <div className="absolute left-0 right-0 -bottom-10 flex flex-col items-center text-center px-6">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
          <Image
            src={profile.avatar_url || "/images/default_avatar.png"}
            alt="avatar"
            width={130}
            height={130}
            className="object-cover"
          />
        </div>

        <h1 className="mt-4 text-2xl md:text-3xl font-bold text-white drop-shadow-md">
          {isCompany
            ? profile.company_name
            : `${profile.first_name} ${profile.last_name}`}
        </h1>

        <p className="text-white/90 text-sm md:text-base mt-1">
          {isCompany ? profile.industry : profile.headline || "Candidate"}
        </p>

        {/* LOCATION */}
        {profile.location && (
          <p className="text-white/80 text-xs md:text-sm mt-1">
            📍 {profile.location}
          </p>
        )}

        {/* BADGES */}
        <div className="flex items-center gap-2 mt-3">
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

        {/* ACTION BUTTONS — hide if viewing own profile */}
        {!isOwnProfile && (
          <div className="flex gap-4 mt-8 pb-10">
            <button className="px-6 py-3 bg-white text-[#1089D3] rounded-full font-semibold shadow-md hover:bg-gray-100 transition">
              Poruka
            </button>

            <button className="px-6 py-3 bg-white/20 text-white rounded-full backdrop-blur-md border border-white/30 hover:bg-white/30 transition">
              ❤️ Superlike
            </button>
          </div>
        )}
      </div>

      {/* Spacer to push content down under avatar */}
      <div className="h-20" />
    </div>
  );
}