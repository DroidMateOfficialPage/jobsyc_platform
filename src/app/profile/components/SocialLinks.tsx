

"use client";

interface SocialLinksProps {
  links: any[];
}

export default function SocialLinks({ links }: SocialLinksProps) {
  if (!links || links.length === 0) return null;

  return (
    <div className="w-full bg-white dark:bg-[#111] rounded-2xl shadow-md p-6 md:p-8">
      <h2 className="text-xl md:text-2xl font-bold text-[#1089D3] mb-4">
        Društvene mreže & kontakt
      </h2>

      <div className="flex flex-wrap gap-4">
        {links.map((link: any) => (
          <SocialItem key={link.id} link={link} />
        ))}
      </div>
    </div>
  );
}

function SocialItem({ link }: { link: any }) {
  const icons: any = {
    website: "🌐",
    linkedin: "🔗",
    github: "💻",
    instagram: "📸",
    facebook: "📘",
    twitter: "🐦",
    email: "✉️",
  };

  const icon = icons[link.type] || "🔗";

  return (
    <a
      href={link.url}
      target="_blank"
      className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-xl shadow-sm hover:bg-gray-100 dark:hover:bg-white/10 transition text-sm font-medium text-gray-700 dark:text-gray-200"
    >
      <span className="text-lg">{icon}</span>
      <span className="truncate max-w-[150px]">{link.label || link.url}</span>
    </a>
  );
}