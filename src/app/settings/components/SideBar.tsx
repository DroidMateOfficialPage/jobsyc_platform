"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Briefcase, Sparkles, SlidersHorizontal } from "lucide-react";

const links = [
  { href: "/settings/basic", label: "Osnovni podaci", icon: User },
  { href: "/settings/experience", label: "Iskustvo", icon: Briefcase },
  { href: "/settings/skills", label: "Vještine", icon: Sparkles },
  { href: "/settings/preferences", label: "Preferencije", icon: SlidersHorizontal },
  { href: "/settings/portfolio", label: "Portfolio", icon: Sparkles },
  { href: "/settings/socials", label: "Društvene mreže", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r h-full hidden md:flex flex-col gap-4 p-4 bg-white dark:bg-[#0f0f0f]">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
        Postavke profila
      </h2>

      <nav className="flex flex-col gap-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname.includes(href);

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition
                ${active 
                  ? "bg-blue-600 text-white shadow-sm" 
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
                }
              `}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}