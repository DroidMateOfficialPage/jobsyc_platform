"use client";

import { Laptop, Megaphone, LineChart, BookOpen, Stethoscope, Truck, Factory, Coffee, Globe } from "lucide-react";
import { useRouter } from "next/navigation";

const industries = [
  { name: "Sve industrije", icon: Globe, all: true },

  { name: "IT & Development", icon: Laptop },
  { name: "Marketing & Sales", icon: Megaphone },
  { name: "Biznis & Finansije", icon: LineChart },
  { name: "Edukacija", icon: BookOpen },
  { name: "Medicina", icon: Stethoscope },
  { name: "Logistika", icon: Truck },
  { name: "Proizvodnja", icon: Factory },
  { name: "Ugostiteljstvo", icon: Coffee },
];

export default function TopIndustries() {
  const router = useRouter();

  return (
    <div className="w-full overflow-x-auto py-4">
      <div className="flex gap-6 px-4 justify-start md:justify-center">

        {industries.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.name}
              onClick={() =>
                item.all
                  ? router.push("/home") 
                  : router.push(`/home?industry_category=${encodeURIComponent(item.name)}`)
              }
              className="flex flex-col items-center cursor-pointer group"
            >
              
              {/* Bubble */}
              <div
                className="
                  w-12 h-12 md:w-16 md:h-16 rounded-full 
                  bg-black/5 dark:bg-white/5 
                  border border-black/10 dark:border-white/10 
                  flex items-center justify-center
                  group-hover:border-[#4A6CF7] 
                  group-hover:shadow-[0_0_10px_#4A6CF7]
                  transition-all
                "
              >
                <Icon size={22} className="md:size-[26px] text-gray-600 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white transition" />
              </div>

              {/* Label */}
              <span className="text-[10px] md:text-xs mt-2 text-gray-700 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition">
                {item.name}
              </span>

            </div>
          );
        })}

      </div>
    </div>
  );
}