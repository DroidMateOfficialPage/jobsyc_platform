"use client";

import { useState } from "react";
import { Home, MessageCircle, FileText, MoreHorizontal } from "lucide-react";
import SidebarLeft from "./SidebarLeft";

export default function FooterMobile() {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <>
      {/* FOOTER NAV */}
      <div className="
        w-full h-20 
        bg-white dark:bg-[#0f0f0f] 
        border-t border-black/10 dark:border-white/10
        flex items-center justify-around
        shadow-[0_-2px_10px_rgba(0,0,0,0.05)]
      ">
        
        {/* HOME */}
        <button className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-300">
          <Home size={26} />
        </button>

        {/* PRIJAVE */}
        <button className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-300">
          <FileText size={26} />
        </button>

        {/* PORUKE */}
        <button className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-300">
          <MessageCircle size={26} />
        </button>

        {/* MORE (opens sidebar) */}
        <button
          onClick={() => setOpenMenu(true)}
          className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-300"
        >
          <MoreHorizontal size={30} />
        </button>
      </div>

      {/* SLIDE-IN SIDEBAR FOR MOBILE */}
      {openMenu && (
        <div className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm flex">
          <div className="w-[260px] h-full bg-white dark:bg-[#0f0f0f] border-r border-black/10 dark:border-white/10 p-4">
            <SidebarLeft mobileOverride />
          </div>

          <div className="flex-1" onClick={() => setOpenMenu(false)} />
        </div>
      )}
    </>
  );
}
