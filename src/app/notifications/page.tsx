"use client";

import SidebarLeft from "@/components/main_layout/SidebarLeft";
import RightSuggestions from "@/components/main_layout/RightSuggestions";
import { Bell } from "lucide-react";

export default function NotificationsPage() {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#111]">
      {/* LEFT SIDEBAR – Desktop only */}
        <SidebarLeft />

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col md:ml-[220px] lg:ml-[260px] xl:ml-[280px]">

        {/* Page Heading */}
        <div className="px-6 pt-6 pb-2">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Obavještenja
          </h1>
        </div>

        {/* CONTENT WRAPPER */}
        <div className="flex flex-1">

          {/* EMPTY STATE */}
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <Bell size={70} className="text-gray-400 dark:text-gray-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-2">
              Trenutno nema obavještenja
            </h2>

            <p className="text-gray-500 dark:text-gray-400 max-w-xs text-sm">
              Kada dobijete nove lajkove, superlajkove, prijave na posao ili mečeve — pojaviće se ovdje.
            </p>
          </div>

          {/* RIGHT SUGGESTIONS – Desktop only */}
          <div className="hidden xl:block">
            <RightSuggestions />
          </div>
        </div>
      </div>
    </div>
  );
}