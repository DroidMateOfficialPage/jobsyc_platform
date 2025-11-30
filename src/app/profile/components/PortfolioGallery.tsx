

"use client";

interface PortfolioGalleryProps {
  projects: any[];
}

export default function PortfolioGallery({ projects }: PortfolioGalleryProps) {
  if (!projects || projects.length === 0) return null;

  return (
    <div className="w-full bg-white dark:bg-[#111] rounded-2xl shadow-md p-6 md:p-8">
      <h2 className="text-xl md:text-2xl font-bold text-[#1089D3] mb-4">
        Portfolio / Projekti
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project: any) => (
          <PortfolioCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}

function PortfolioCard({ project }: { project: any }) {
  return (
    <div className="flex flex-col bg-gray-50 dark:bg-white/5 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
      {/* IMAGE */}
      {project.image_url ? (
        <img
          src={project.image_url}
          alt={project.title}
          className="w-full h-40 object-cover"
        />
      ) : (
        <div className="w-full h-40 bg-gray-200 dark:bg-white/10 flex items-center justify-center text-gray-500">
          No Image
        </div>
      )}

      {/* CONTENT */}
      <div className="p-4 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {project.title || "Naziv projekta"}
        </h3>

        {project.description && (
          <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
            {project.description}
          </p>
        )}

        {project.link && (
          <a
            href={project.link}
            target="_blank"
            className="mt-3 text-[#1089D3] text-sm font-medium hover:underline"
          >
            Pogledaj projekat →
          </a>
        )}
      </div>
    </div>
  );
}