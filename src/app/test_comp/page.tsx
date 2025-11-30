"use client";

import SidebarLeft from "@/components/main_layout/SidebarLeft";
import TopIndustries from "@/components/main_layout/TopIndustries";
import RightSuggestions from "@/components/main_layout/RightSuggestions";
import Messanges from "@/components/main_layout/Messanges";
import ProfileCard from "@/components/card_layout/ProfileCard";
import SwipeableCard from "@/components/card_layout/SwipeableCard";

export default function TestCompPage() {
  return (
    <div className="relative z-0">
      <SidebarLeft />

      {/* CONTENT AREA — shifted to the right */}
      <div
        className="
          p-6
          ml-0 mr-0
          md:ml-[80px]
          lg:ml-[120px]
          xl:ml-[250px]
          xl:mr-[300px]
        "
      >
        <TopIndustries />

        {/* TEST SWIPE STACK */}
        <div className="flex justify-center mt-6 relative z-0">
          <div className="relative" style={{ width: 380, height: 520 }}>
            {/* Example test card */}
            <SwipeableCard
              index={0}
              onSwipe={() => {}}
              profile={{ id: "test" }}
              card={
                <ProfileCard
                  type="candidate"
                  data={{
                    ime: "Test",
                    prezime: "Profil",
                    godine: 25,
                    obrazovanje: [],
                    vjestine: [],
                    industrija: [],
                    lokacija: [],
                    plata: [],
                    nacin_rada: [],
                    img: "/images/default-user.jpg"
                  }}
                />
              }
            />
          </div>
        </div>

      </div>
      <div className="z-10 relative">
        <RightSuggestions />
        <Messanges />
      </div>
    </div>
  );
}