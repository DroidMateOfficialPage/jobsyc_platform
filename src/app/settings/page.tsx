"use client";

import SidebarLeft from "@/components/main_layout/SidebarLeft";
import SettingsSidebar from "@/app/settings/components/SideBar";
import { useEffect, useState } from "react";

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
        
        {/* SETTINGS SIDEBAR */}
        <SettingsSidebar />

        {/* MAIN SETTINGS AREA */}
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Postavke profila
          </h1>

          <p className="text-gray-600 dark:text-gray-300">
            Izaberite kategoriju iz menija lijevo da uredite detalje svog profila.
          </p>
        </div>
      </div>
    </div>
  );
}