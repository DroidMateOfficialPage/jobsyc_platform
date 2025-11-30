"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  MessageCircle,
  Bell,
  FileText,
  Bookmark,
  BookOpen,
  Sparkles,
  Star,
  User,
  Settings,
  LogOut,
  Newspaper,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import FooterMobile from "@/components/main_layout/FooterMobile";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

const navItemsTop = [
  { name: "Početna", href: "/home", icon: Home },  
  { name: "Oglasi", href: "/jobs", icon: Newspaper },
  { name: "Pretraga", href: "/search", icon: Search },
  { name: "Poruke", href: "/messages", icon: MessageCircle },
  { name: "Obavještenja", href: "/notifications", icon: Bell },
  { name: "Prijave", href: "/applications", icon: FileText },
  { name: "Blog", href: "https://news.droidmate.dev", icon: BookOpen, external: true },
  { name: "Savjeti & Testovi", href: "/comingsoon", icon: Sparkles, comingSoon: true },
  { name: "Sačuvano", href: "/saved", icon: Bookmark },
  { name: "Pretplate", href: "https://jobsyc.co/pretplate", icon: Star },
];


const navItemsBottom = [
  { name: "Profil", href: "/profile", icon: User },
  { name: "Postavke", href: "/settings", icon: Settings },
  { name: "Odjava", href: "/logout", icon: LogOut },
];

export default function SidebarLeft({ mobileOverride = false }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  useEffect(() => {
    const fetchResults = async () => {
      if (searchQuery.trim() === "") {
        setSearchResults([]);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, company_name, industry, industry_category, location, profile_type, avatar_url")
        .or(`
          first_name.ilike.%${searchQuery}%,
          last_name.ilike.%${searchQuery}%,
          company_name.ilike.%${searchQuery}%,
          industry.ilike.%${searchQuery}%,
          industry_category.ilike.%${searchQuery}%,
          location.ilike.%${searchQuery}%
        `)
        .limit(20);

      if (!error) {
        setSearchResults(data || []);
      }
    };

    const delay = setTimeout(fetchResults, 300);
    return () => clearTimeout(delay);
  }, [searchQuery]);
  const router = useRouter();

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    return pathname.startsWith(path) && path !== "/";
  };

  const NavItem = ({ item }: any) => {
    const Icon = item.icon;

    if (item.name === "Pretraga") {
      return (
        <>
          <button
            onClick={() => setShowSearch(true)}
            className={`flex w-full text-left items-center gap-4 p-3 rounded-lg transition-all
              ${isActive(item.href)
                ? "bg-black/5 text-black font-medium dark:bg-white/10 dark:text-white"
                : "text-gray-700 hover:bg-black/5 hover:text-black dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white"
              }
            `}
          >
            <Icon size={22} />
            <span className="text-sm">{item.name}</span>
          </button>

          {showSearch && (
            <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-start justify-center pt-40">
              <div className="w-full max-w-lg bg-white dark:bg-[#1a1a1a] p-6 rounded-xl shadow-xl">
                <div className="flex items-center gap-3 bg-black/5 dark:bg-white/10 rounded-lg px-4 py-3">
                  <Search size={20} className="text-gray-600 dark:text-gray-300" />
                  <input
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    type="text"
                    placeholder="Traži profile, poslove, firme..."
                    className="bg-transparent outline-none w-full text-base dark:text-white"
                  />
                  <button
                    onClick={() => {
                      setShowSearch(false);
                      setSearchQuery("");
                    }}
                  >
                    <X size={20} className="text-gray-700 dark:text-gray-300" />
                  </button>
                </div>

                <div className="mt-4 max-h-72 overflow-y-auto">
                  {searchQuery.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Ukucaj nešto da počnemo tražiti.
                    </p>
                  ) : searchResults.length === 0 ? (
                    <p className="text-sm text-gray-600 dark:text-gray-300 opacity-70">
                      Nema rezultata.
                    </p>
                  ) : (
                    searchResults.map((profile: any) => (
                      <Link
                        key={profile.id}
                        href={`/profile/${profile.id}`}
                        onClick={() => setShowSearch(false)}
                        className="flex items-center gap-3 p-3 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg"
                      >
                        <img
                          src={profile.avatar_url || "/images/default_avatar.png"}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex flex-col">
                          <span className="font-medium text-sm dark:text-white">
                            {profile.profile_type === "company"
                              ? profile.company_name
                              : `${profile.first_name} ${profile.last_name}`}
                          </span>
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {profile.location || profile.industry || "Nepoznato"}
                          </span>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      );
    }

    return (
      <>
        {item.name === "Odjava" ? (
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/");
            }}
            className={`flex w-full text-left items-center gap-4 p-3 rounded-lg transition-all
              ${isActive(item.href)
                ? "bg-black/5 text-black font-medium dark:bg-white/10 dark:text-white"
                : "text-gray-700 hover:bg-black/5 hover:text-black dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white"
              }
            `}
          >
            <Icon size={22} />
            <span className="text-sm">{item.name}</span>
          </button>
        ) : (
          <Link
            href={item.href}
            target={item.external ? "_blank" : undefined}
            className={`flex items-center gap-4 p-3 rounded-lg transition-all
              ${isActive(item.href)
                ? "bg-black/5 text-black font-medium dark:bg-white/10 dark:text-white"
                : "text-gray-700 hover:bg-black/5 hover:text-black dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white"
              }
            `}
          >
            <Icon size={22} />
            <span className="text-sm flex items-center gap-2">
              {item.name}
              {item.comingSoon && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-600 text-white dark:bg-blue-500">
                  Uskoro
                </span>
              )}
            </span>
          </Link>
        )}
      </>
    );
  };

  return (
    <>
      {!mobileOverride ? (
        <aside
          className={`${mobileOverride ? "flex" : "hidden xl:flex"} fixed left-0 top-0 h-screen w-[250px]
          border-r border-black/10 dark:border-white/10 
          bg-white dark:bg-[#0f0f0f] px-4 py-6 flex-col overflow-y-auto justify-between z-50`}
        >
          {/* GORNJI NAV */}
          <div className="flex flex-col gap-1">
            <div className="mb-6 px-2">
              <Link href="/home">
                <img 
                  src="/images/logo_with_watermark_2_2.png" 
                  alt="JobSyc logo" 
                  className="w-42 cursor-pointer dark:opacity-100 opacity-90"
                />
              </Link>
            </div>
            {navItemsTop.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </div>
          {/* DONJI NAV */}
          <div className="flex flex-col gap-1 border-t border-black/10 dark:border-white/5 pt-4">
            {navItemsBottom.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </div>
        </aside>
      ) : (
        <div className="flex flex-col justify-between w-full h-full overflow-y-auto">
          {/* GORNJI NAV */}
          <div className="flex flex-col gap-1">
            <div className="mb-6 px-2">
              <Link href="/home">
                <img 
                  src="/images/logo_with_watermark_2_2.png" 
                  alt="JobSyc logo" 
                  className="w-42 cursor-pointer dark:opacity-100 opacity-90"
                />
              </Link>
            </div>
            {navItemsTop.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </div>
          {/* DONJI NAV */}
          <div className="flex flex-col gap-1 border-t border-black/10 dark:border-white/5 pt-4">
            {navItemsBottom.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* TABLET HAMBURGER BUTTON (bottom-left) */}
      <button
        onClick={() => setOpen(true)}
        className={`
          hidden md:flex xl:hidden ${mobileOverride ? "hidden" : ""}
          fixed bottom-6 left-6 z-50
          w-14 h-14 rounded-full
          bg-blue-600 dark:bg-blue-500
          shadow-lg backdrop-blur-sm
          items-center justify-center
          hover:bg-blue-700 transition
        `}
      >
        <Menu className="text-white" size={26} />
      </button>

      {open && (
        <div className="xl:hidden fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm flex">
          <div className="w-[250px] h-full bg-white dark:bg-[#0f0f0f] p-6 border-r border-black/10 dark:border-white/10 flex flex-col justify-between">
            
            <div className="flex justify-between items-center mb-6">
              <img src="/images/logo_with_watermark_2_2.png" alt="JobSyc" className="w-32 dark:opacity-100 opacity-90" />
              <button onClick={() => setOpen(false)}>
                <X className="text-black dark:text-white" size={26} />
              </button>
            </div>

            <div className="flex flex-col gap-1">
              {navItemsTop.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </div>

            <div className="flex flex-col gap-1 border-t border-black/10 dark:border-white/5 pt-4 mt-6">
              {navItemsBottom.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </div>

          </div>

          <div className="flex-1" onClick={() => setOpen(false)} />
        </div>
      )}
      {/* MOBILE FOOTER NAV (phones only) */}
      <div className={`${mobileOverride ? "hidden" : "md:hidden"} fixed bottom-0 left-0 right-0 z-50`}>
        <FooterMobile />
      </div>
    </>
  );
}