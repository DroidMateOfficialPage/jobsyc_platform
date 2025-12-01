"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import SidebarLeft from "@/components/main_layout/SidebarLeft";
import RightSuggestions from "@/components/main_layout/RightSuggestions";
import Link from "next/link";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const fetchUserType = async () => {
      const { data: { user }} = await supabase.auth.getUser();
      if (!user) return;

      const { data: usr } = await supabase
        .from("users")
        .select("profile_type")
        .eq("id", user.id)
        .single();

      if (usr?.profile_type) setUserType(usr.profile_type);
    };
    fetchUserType();

    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("jobs")
      .select(`
        id,
        title,
        industry,
        location_city,
        seniority,
        created_at,
        company:company_profile (
          company_name,
          logo_url
        )
      `)
      .order("created_at", { ascending: false });

    if (!error) setJobs(data);
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-[#0d0d0d] flex-col md:flex-row">
        <SidebarLeft />

      <div className="flex-1 px-4 py-6 md:px-10 md:py-8 md:ml-[250px]">
        <h1 className="text-3xl font-bold mb-6 dark:text-white">Poslovi</h1>

        {userType === "company" && (
          <Link
            href="/jobs/new"
            className="inline-block mb-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
          >
            + Objavi oglas
          </Link>
        )}

        {loading ? (
          <p className="text-gray-600 dark:text-gray-300">Učitavanje...</p>
        ) : jobs.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">
            Trenutno nema aktivnih oglasa.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {jobs.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="p-4 md:p-5 rounded-xl bg-white dark:bg-[#1a1a1a] shadow hover:shadow-lg transition border border-gray-200 dark:border-white/10"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={
                      job.company?.logo_url ?? 
                      "/images/default-company.png"
                    }
                    className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover border border-gray-200 dark:border-white/10"
                  />
                  <div>
                    <h3 className="text-lg font-semibold dark:text-white">
                      {job.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {job.company?.company_name}
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  {job.location_city || "Lokacija nije navedena"}
                </p>

                <p className="text-sm text-blue-600 dark:text-blue-400">
                  {job.seniority || ""}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="hidden xl:block">
        <RightSuggestions />
      </div>
    </div>
  );
}