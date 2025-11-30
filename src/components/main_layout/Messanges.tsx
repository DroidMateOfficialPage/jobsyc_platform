"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

export default function Messanges() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Bubble */}
      <button
        onClick={() => setOpen(!open)}
        className="
          fixed bottom-6 right-6 z-50 
          w-14 h-14 rounded-full 
          bg-blue-600 hover:bg-blue-700 
          md:flex hidden
          items-center justify-center 
          shadow-lg transition-all
        "
      >
        <MessageCircle className="text-white" size={24} />
      </button>

      {/* Slide-up Panel */}
      {open && (
        <div
          className="
            fixed bottom-24 right-6 z-50 
            w-80 h-96 
            rounded-xl 
            bg-white dark:bg-[#0f0f0f] 
            border border-black/10 dark:border-white/10
            shadow-xl
            flex flex-col
          "
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-black/10 dark:border-white/10">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Poruke
            </h2>
            <button onClick={() => setOpen(false)}>
              <X className="text-gray-700 dark:text-gray-300" size={20} />
            </button>
          </div>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            <div className="p-3 rounded-lg bg-black/5 dark:bg-white/5">
              <p className="text-gray-900 dark:text-white font-medium">
                Nema novih poruka
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-black/10 dark:border-white/10 text-sm text-gray-500 dark:text-gray-400">
            Klikni na kontakt da započneš razgovor.
          </div>
        </div>
      )}
    </>
  );
}