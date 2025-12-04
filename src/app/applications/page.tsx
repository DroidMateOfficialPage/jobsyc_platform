"use client";

import { useEffect, useState } from "react";
import SidebarLeft from "@/components/main_layout/SidebarLeft";
import RightSuggestions from "@/components/main_layout/RightSuggestions";
import ProfileCard from "@/components/card_layout/ProfileCard";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

export default function ApplicationsPage() {
  const [profileType, setProfileType] = useState(null);

  const [profiles, setProfiles] = useState([]);        // for candidates
  const [applications, setApplications] = useState([]); // for companies

  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load profile_type
  useEffect(() => {
    const load = async () => {
      const { data: { user }} = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("users")
        .select("profile_type")
        .eq("id", user.id)
        .single();

      setProfileType(data?.profile_type || null);
    };
    load();
  }, []);

  // -------------------------------
  // ⭐ CANDIDATE — liked + superliked
  // -------------------------------
  useEffect(() => {
    if (profileType !== "candidate") return;

    const loadApplications = async () => {
      setLoading(true);

      const { data: { user }} = await supabase.auth.getUser();
      if (!user) return;

      const { data: me } = await supabase
        .from("candidate_profile")
        .select("liked, superliked")
        .eq("user_id", user.id)
        .single();

      const liked = me?.liked || [];
      const superliked = me?.superliked || [];

      const combined = [...new Set([...liked, ...superliked])];

      if (combined.length === 0) {
        setProfiles([]);
        setLoading(false);
        return;
      }

      const { data: listed } = await supabase
        .from("company_profile")
        .select("*")
        .in("user_id", combined);

      setProfiles(listed || []);
      setLoading(false);
    };

    loadApplications();
  }, [profileType]);

  // -------------------------------
  // ⭐ COMPANY — applicants to jobs
  // -------------------------------
  useEffect(() => {
    if (profileType !== "company") return;

    const loadCompanyApplications = async () => {
      setLoading(true);

      const { data: { user }} = await supabase.auth.getUser();
      if (!user) return;

      // Load all jobs by this company
      const { data: jobs } = await supabase
        .from("jobs")
        .select("id, title")
        .eq("company_id", user.id);

      if (!jobs || jobs.length === 0) {
        setApplications([]);
        setLoading(false);
        return;
      }

      const jobIds = jobs.map((j) => j.id);

      // Load all applications for those jobs
      const { data: apps } = await supabase
        .from("applications")
        .select("*")
        .in("job_id", jobIds);

      if (!apps || apps.length === 0) {
        setApplications([]);
        setLoading(false);
        return;
      }

      // Load candidate profiles for all candidate_ids
      const candidateIds = [...new Set(apps.map((a) => a.candidate_id))];

      const { data: candidates } = await supabase
        .from("candidate_profile")
        .select("*")
        .in("user_id", candidateIds);

      // Map everything together
      const detailed = apps.map((app) => {
        const profile = candidates.find((c) => c.user_id === app.candidate_id);
        const job = jobs.find((j) => j.id === app.job_id);

        return {
          ...app,
          candidate: profile,
          jobTitle: job?.title || "Nepoznat oglas",
        };
      });

      setApplications(detailed);
      setLoading(false);
    };

    loadCompanyApplications();
  }, [profileType]);

  // -------------------------------
  // RENDER
  // -------------------------------
  if (loading)
    return (
      <div className="p-10 text-gray-700 dark:text-gray-300">Učitavanje...</div>
    );

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-[#0d0d0d]">
      <SidebarLeft />

      <div className="flex-1 ml-0 md:ml-[80px] lg:ml-[120px] xl:ml-[250px] p-10 overflow-y-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {profileType === "candidate"
            ? "Prijave (Like + Superlike)"
            : "Kandidati koji su se prijavili na vaše oglase"}
        </h1>

        {/* -------------------- */}
        {/* ⭐ CANDIDATE VIEW */}
        {/* -------------------- */}
        {profileType === "candidate" && (
          <>
            {profiles.length === 0 && (
              <p className="text-gray-600 dark:text-gray-400">
                Još nema profila koje si lajkovao/la ili superlajkovao/la.
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {profiles.map((p) => (
                <div
                  key={p.user_id}
                  className="p-4 rounded-xl bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-md transition cursor-pointer flex gap-4"
                  onClick={() => setSelected(p)}
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 dark:bg-white/10 flex-shrink-0">
                    <Image
                      src={
                        p.logo_url ||
                        p.profile_picture_url ||
                        "/images/default-user.jpg"
                      }
                      alt="avatar"
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {p.company_name ||
                        `${p.first_name || ""} ${p.last_name || ""}`.trim()}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {p.industry_category?.[0] || "Industrija nije navedena"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* -------------------- */}
        {/* ⭐ COMPANY VIEW */}
        {/* -------------------- */}
        {profileType === "company" && (
          <>
            {applications.length === 0 && (
              <p className="text-gray-600 dark:text-gray-400">
                Još nema prijava na vaše oglase.
              </p>
            )}

            <div className="space-y-4">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="p-4 rounded-xl bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-md transition cursor-pointer flex items-center gap-4"
                  onClick={() => setSelected(app.candidate)}
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 dark:bg-white/10">
                    <Image
                      src={
                        app.candidate?.profile_picture_url ||
                        "/images/default-user.jpg"
                      }
                      alt="candidate"
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-grow">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {app.candidate?.first_name} {app.candidate?.last_name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Prijava za oglas:{" "}
                      <span className="font-medium">{app.jobTitle}</span>
                    </p>
                  </div>

                  <div className="text-xs py-1 px-3 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                    {new Date(app.created_at).toLocaleDateString("bs-BA")}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <RightSuggestions />

      {selected && (
        <div
          className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm flex items-center justify-center px-6"
          onClick={() => setSelected(null)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <ProfileCard
              type={profileType === "candidate" ? "company" : "candidate"}
              data={selected}
            />
          </div>
        </div>
      )}
    </div>
  );
}