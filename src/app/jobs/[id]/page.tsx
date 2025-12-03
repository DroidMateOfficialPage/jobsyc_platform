"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SidebarLeft from "@/components/main_layout/SidebarLeft";

export default function JobDetailsPage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loadingApply, setLoadingApply] = useState(false);

  useEffect(() => {
    const loadJob = async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select(`
          id,
          title,
          description,
          industry,
          seniority,
          employment_type,
          work_mode,
          location_city,
          location_country,
          salary_range,
          company:company_profile (
            company_name,
            logo_url,
            bio,
            website,
            location_city,
            location_country
          )
        `)
        .eq("id", id)
        .single();

      setJob(data);
    };
    loadJob();
  }, [id]);

  // APPLY TO JOB
  const handleApply = async () => {
    setLoadingApply(true);

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      alert("Prijavite se kako biste aplicirali.");
      setLoadingApply(false);
      return;
    }

    const candidateId = userData.user.id;

    const { error } = await supabase.from("applications").insert({
      job_id: job.id,
      candidate_id: candidateId,
      status: "submitted",
    });

    setLoadingApply(false);

    if (error) {
      console.error(error);
      return alert("Greška pri slanju prijave.");
    }

    alert("Vaša prijava je uspješno poslata 🎉");
  };

  if (!job) return <p className="text-white p-6">Učitavanje...</p>;

  return (
    <div className="flex h-screen overflow-y-auto bg-white dark:bg-[#0B0E11] text-black dark:text-white transition-colors duration-300">
      {/* LEFT SIDEBAR */}
      <div className="hidden lg:block w-[280px] border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0B0E11]/40 backdrop-blur-xl ">
        <SidebarLeft />
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 px-6 py-10 max-w-3xl mx-auto transition-all duration-300 mb-8 mt-8">

        {/* HEADER */}
        <div className="flex items-center gap-5 mb-10 p-5 rounded-2xl bg-gray-100 dark:bg-[#111418] border border-gray-200 dark:border-gray-700 shadow-md">
          <img
            src={job.company.logo_url}
            alt="logo"
            className="w-20 h-20 rounded-2xl object-cover border border-gray-300 dark:border-white/20 shadow-lg"
          />
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight leading-tight drop-shadow-sm">
              {job.title}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">{job.company.company_name}</p>
          </div>
        </div>

        {/* BADGES */}
        <div className="flex flex-wrap gap-3 mb-8 mt-8">
          {job.industry?.map((i, idx) => (
            <span
              key={idx}
              className="px-3 py-1 rounded-full text-sm bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-white/10 shadow-sm"
            >
              {i}
            </span>
          ))}

          {job.seniority && (
            <span className="px-3 py-1 rounded-full text-sm bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-white/10 shadow-sm">
              {job.seniority}
            </span>
          )}

          {job.employment_type?.map((type, idx) => (
            <span
              key={idx}
              className="px-3 py-1 rounded-full text-sm bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-white/10 shadow-sm"
            >
              {type}
            </span>
          ))}

          {job.work_mode?.map((wm, idx) => (
            <span
              key={idx}
              className="px-3 py-1 rounded-full text-sm bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-white/10 shadow-sm"
            >
              {wm}
            </span>
          ))}
        </div>

        {/* LOCATION + SALARY */}
        <div className="flex items-center gap-6 text-lg mb-10 text-gray-600 dark:text-gray-300 mb-8 mt-8">
          <div className="flex items-center gap-2">
            <span>📍</span>
            {job.location_city}, {job.location_country}
          </div>
          {job.salary_range && (
            <div className="flex items-center gap-2">
              <span>💰</span>
              {job.salary_range}
            </div>
          )}
        </div>

        {/* DESCRIPTION */}
        <div className="p-6 rounded-2xl mb-10 leading-relaxed bg-gray-100 dark:bg-[#111418] border border-gray-300 dark:border-gray-700 shadow-lg backdrop-blur-md mb-8 mt-8">
          <h2 className="text-2xl font-semibold mb-3">Opis posla</h2>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {job.description}
          </p>
        </div>

        {/* COMPANY INFO */}
        <div className="p-6 rounded-2xl leading-relaxed bg-gray-100 dark:bg-[#111418] border border-gray-300 dark:border-gray-700 shadow-lg backdrop-blur-md mb-8 mt-8">
          <h2 className="text-2xl font-semibold mb-3">O kompaniji</h2>

          {job.company.bio && (
            <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-line">
              {job.company.bio}
            </p>
          )}

          <div className="text-gray-700 dark:text-gray-300 space-y-2">
            <p><strong>🌐 Website:</strong> {job.company.website || "N/A"}</p>
            <p>
              <strong>📍 Lokacija:</strong> {job.company.location_city},{" "}
              {job.company.location_country}
            </p>
          </div>
        </div>

        {/* APPLY BUTTON */}
        <div className="flex justify-center pb-20 mb-8 mt-8">
          <button
            onClick={handleApply}
            disabled={loadingApply}
            className="
              px-16 py-4 rounded-2xl font-semibold text-lg
              bg-[#1089d3] hover:bg-[#0d6ea8] disabled:bg-gray-400
              text-white shadow-lg hover:shadow-2xl active:scale-95
              transition-all duration-300 px-6 py-3
            "
          >
            {loadingApply ? "Slanje..." : "Prijavi se na oglas"}
          </button>
        </div>
      </div>
    </div>
  );
}