"use client";

import SidebarLeft from "@/components/main_layout/SidebarLeft";
import RightSuggestions from "@/components/main_layout/RightSuggestions";
import { MessageSquare } from "lucide-react";

export default function MessagesPage() {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-[#0d0d0d]">
      {/* WRAPPER KAO NA HOME STRANICI */}
      <div className="flex flex-col w-full">
        <div className="relative z-0">
          <SidebarLeft />

          {/* GLAVNI SREDNJI DIO */}
          <div
            className="
              ml-0 mr-0
              md:ml-[80px]
              lg:ml-[120px]
              xl:ml-[250px]
              xl:mr-[300px]
              flex items-center justify-center
              min-h-screen
              p-6
            "
          >
            <div className="flex flex-col items-center text-center max-w-md">
              <MessageSquare
                size={80}
                className="text-blue-600 dark:text-blue-400 mb-6 opacity-80"
              />

              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                Poruke uskoro dolaze
              </h1>

              <p className="text-sm text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                Radimo na uvođenju sigurnog, real-time sistema poruka između
                kandidata i poslodavaca.
                <br />
                Uskoro ćeš moći komunicirati direktno u JobSyc aplikaciji!
              </p>

              <a
                href="/applications"
                className="
                  px-5 py-2
                  bg-blue-600 hover:bg-blue-700
                  text-white text-sm font-medium
                  rounded-lg shadow-md
                  transition
                "
              >
                Pogledaj prijave
              </a>
            </div>
          </div>

          {/* DESNI SIDEBAR */}
          <div className="z-10 relative">
            <RightSuggestions />
          </div>
        </div>
      </div>
    </div>
  );
}