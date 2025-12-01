"use client";

import dynamic from "next/dynamic";
const SidebarLeft = dynamic(() => import("@/components/main_layout/SidebarLeft"), {
  ssr: false,
});
import SettingsSidebar from "@/app/settings/components/SideBar";
import { useEffect, useState } from "react";

const BasicSettings = dynamic(() => import("@/app/settings/basic/page"), { ssr: false });

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#0f0f0f]">
      {/* LEFT MAIN SIDEBAR */}
      <SidebarLeft />

      {/* SETTINGS CONTENT WRAPPER */}
      <div className="flex w-full ml-0 md:ml-[80px] lg:ml-[120px] xl:ml-[250px]">
        {/* SETTINGS SIDEBAR, hidden on small screens */}
        <div className="hidden md:block">
          <SettingsSidebar />
        </div>

        {/* MAIN SETTINGS AREA */}
        <div className="flex-1 p-6">
          {/* Mobile/tablet top dropdown navigation */}
          <div className="md:hidden w-full mb-4">
            <select
              onChange={(e) => window.location.href = `/settings/${e.target.value}`}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-[#1a1a1a]"
            >
              <option value="basic">Osnovni podaci</option>
              <option value="experience">Iskustvo</option>
              <option value="skills">Vještine</option>
              <option value="preferences">Preferencije</option>
              <option value="portfolio">Portfolio</option>
              <option value="socials">Društvene mreže</option>
            </select>
          </div>
          <BasicSettings />
        </div>
      </div>
    </div>
  );
}