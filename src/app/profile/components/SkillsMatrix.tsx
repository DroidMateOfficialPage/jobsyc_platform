"use client";

interface SkillsMatrixProps {
  skills: any[];
}

export default function SkillsMatrix({ skills }: SkillsMatrixProps) {
  if (!skills || skills.length === 0) return null;

  return (
    <div className="w-full bg-white dark:bg-[#111] rounded-2xl shadow-md p-6 md:p-8">
      <h2 className="text-xl md:text-2xl font-bold text-[#1089D3] mb-4">
        Vještine
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {skills.map((skill: any) => (
          <SkillCard key={skill.id} skill={skill} />
        ))}
      </div>
    </div>
  );
}

function SkillCard({ skill }: { skill: any }) {
  return (
    <div className="flex flex-col bg-gray-50 dark:bg-white/5 p-4 rounded-xl shadow-sm">
      <span className="text-sm md:text-base font-semibold text-gray-800 dark:text-gray-200">
        {skill.name}
      </span>

      <div className="mt-3 h-2 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#1089D3] rounded-full"
          style={{ width: `${skill.level || 0}%` }}
        ></div>
      </div>

      <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-2">
        Nivo: {skill.level || 0}%
      </span>
    </div>
  );
}
