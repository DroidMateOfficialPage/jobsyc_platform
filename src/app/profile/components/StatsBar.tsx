

"use client";

interface StatsBarProps {
  profile: any;
}

export default function StatsBar({ profile }: StatsBarProps) {
  if (!profile) return null;

  const stats = [
    {
      label: "Pregledi profila",
      value: profile.profile_views || 0,
    },
    {
      label: "Match-evi",
      value: profile.matches || 0,
    },
    {
      label: profile.profile_type === "company" ? "Otvorene pozicije" : "Aplikacije",
      value: profile.applications || profile.open_positions || 0,
    },
  ];

  return (
    <div className="w-full bg-white dark:bg-[#111] rounded-2xl shadow-md px-6 py-4 flex items-center justify-between gap-4">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="flex flex-col items-center flex-1 text-center"
        >
          <span className="text-xl md:text-2xl font-bold text-[#1089D3]">
            {stat.value}
          </span>
          <span className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mt-1">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}