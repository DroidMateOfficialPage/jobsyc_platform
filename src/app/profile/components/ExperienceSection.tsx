"use client";

interface ExperienceSectionProps {
  experience: any[];
}

export default function ExperienceSection({ experience }: ExperienceSectionProps) {
  if (!experience || experience.length === 0) return null;

  return (
    <div className="w-full bg-white dark:bg-[#111] rounded-2xl shadow-md p-6 md:p-8">
      <h2 className="text-xl md:text-2xl font-bold text-[#1089D3] mb-6">
        Radno iskustvo
      </h2>

      <div className="flex flex-col gap-6">
        {experience.map((exp: any) => (
          <ExperienceCard key={exp.id} exp={exp} />
        ))}
      </div>
    </div>
  );
}

function ExperienceCard({ exp }: { exp: any }) {
  return (
    <div className="flex flex-col bg-gray-50 dark:bg-white/5 rounded-xl p-5 shadow-sm">
      
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {exp.position || "Pozicija"}
        </h3>

        <span className="text-sm text-gray-500 dark:text-gray-400 italic">
          {exp.start_date} — {exp.end_date || "Trenutno"}
        </span>
      </div>

      <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base mt-2">
        {exp.company || "Kompanija nije navedena"}
      </p>

      {exp.description && (
        <p className="text-gray-700 dark:text-gray-400 text-sm md:text-base mt-3 leading-relaxed">
          {exp.description}
        </p>
      )}

      {exp.tech_stack && (
        <div className="flex flex-wrap gap-2 mt-3">
          {exp.tech_stack.map((t: string, i: number) => (
            <span
              key={i}
              className="px-3 py-1 bg-white dark:bg-[#222] border border-gray-200 dark:border-white/10 rounded-full text-xs text-gray-600 dark:text-gray-300"
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
