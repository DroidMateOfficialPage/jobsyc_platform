

"use client";

interface BadgeRowProps {
  badges: any[];
}

export default function BadgesRow({ badges }: BadgeRowProps) {
  if (!badges || badges.length === 0) return null;

  return (
    <div className="w-full bg-white dark:bg-[#111] rounded-2xl shadow-md p-6 md:p-8">
      <h2 className="text-xl md:text-2xl font-bold text-[#1089D3] mb-4">
        Bedževi
      </h2>

      <div className="flex flex-wrap gap-3">
        {badges.map((badge: any) => (
          <BadgeItem key={badge.id} badge={badge} />
        ))}
      </div>
    </div>
  );
}

function BadgeItem({ badge }: { badge: any }) {
  const colors: any = {
    premium: "bg-yellow-400 text-gray-900",
    verified: "bg-green-500 text-white",
    early: "bg-purple-500 text-white",
    company: "bg-blue-500 text-white",
    default: "bg-gray-300 text-gray-900",
  };

  const style = colors[badge.type] || colors.default;

  return (
    <div
      className={`px-4 py-2 rounded-full text-sm font-semibold shadow-md ${style} flex items-center gap-2`}
    >
      {badge.icon && (
        <span className="text-lg">
          {badge.icon}
        </span>
      )}

      <span>{badge.label}</span>
    </div>
  );
}