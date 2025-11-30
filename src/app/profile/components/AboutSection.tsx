

"use client";

interface AboutSectionProps {
  profile: any;
}

export default function AboutSection({ profile }: AboutSectionProps) {
  if (!profile) return null;

  const isCompany = profile.profile_type === "company";

  return (
    <div className="w-full bg-white dark:bg-[#111] rounded-2xl shadow-md p-6 md:p-8">
      <h2 className="text-xl md:text-2xl font-bold text-[#1089D3] mb-4">
        {isCompany ? "O kompaniji" : "O meni"}
      </h2>

      {/* BIO / DESCRIPTION */}
      <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed">
        {profile.bio ||
          (isCompany
            ? "Kompanija još nije unijela opis."
            : "Korisnik još nije dodao biografiju.")}
      </p>

      {/* ADDITIONAL INFO */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {isCompany ? (
          <>
            <InfoItem label="Industrija" value={profile.industry} />
            <InfoItem label="Kategorija industrije" value={profile.industry_category} />
            <InfoItem label="Lokacija" value={profile.location} />
            <InfoItem label="Veličina kompanije" value={profile.company_size} />
            <InfoItem label="Godina osnivanja" value={profile.founded_year} />
          </>
        ) : (
          <>
            <InfoItem label="Pozicija" value={profile.headline} />
            <InfoItem label="Iskustvo" value={profile.experience_level} />
            <InfoItem label="Lokacija" value={profile.location} />
            <InfoItem label="Obrazovanje" value={profile.education} />
          </>
        )}
      </div>
    </div>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  if (!value) return null;

  return (
    <div className="flex flex-col bg-gray-50 dark:bg-white/5 rounded-xl p-4 shadow-sm">
      <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
        {label}
      </span>
      <span className="text-sm md:text-base font-medium text-gray-800 dark:text-gray-200 mt-1">
        {value}
      </span>
    </div>
  );
}    