"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { Dialog } from "@headlessui/react";

interface EditSectionProps {
  open: boolean;
  onClose: () => void;
  profile: any;
  profileType: "candidate" | "company";
  onSave?: () => void;
}

export default function EditSection({
  open,
  onClose,
  profile,
  profileType,
  onSave,
}: EditSectionProps) {
  const [activeTab, setActiveTab] = useState<"basic" | "experience" | "social">(
    "basic"
  );

  const [saving, setSaving] = useState(false);

  // -------------------------
  // FORM STATE
  // -------------------------

  const [bio, setBio] = useState(profile?.bio || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [dateOfBirth, setDateOfBirth] = useState(profile?.date_of_birth || "");
  const [foundedYear, setFoundedYear] = useState(profile?.founded_year || "");

  const [locationQuery, setLocationQuery] = useState(
    profile?.location_city && profile?.location_country
      ? `${profile.location_city}, ${profile.location_country}`
      : ""
  );
  const [locationResults, setLocationResults] = useState<any[]>([]);

  const [industryOptions, setIndustryOptions] = useState<
    { label: string; category: string }[]
  >([]);
  const [selectedIndustries, setSelectedIndustries] = useState<
    { label: string; category: string }[]
  >([]);

  const [skills, setSkills] = useState<string[]>(
    profile?.skills || []
  );
  const [experience, setExperience] = useState<string[]>(
    profile?.experience || []
  );

  const [socialLinks, setSocialLinks] = useState(
    profile?.social_links || {
      linkedin: "",
      github: "",
      website: "",
      instagram: "",
      facebook: "",
    }
  );

  // -------------------------
  // LOAD INDUSTRY JSON
  // -------------------------

  useEffect(() => {
    const loadIndustries = async () => {
      const file = await fetch("/data/industry.json");
      const json = await file.json();
      setIndustryOptions(json.map((i: any) => ({ label: i.label, category: i.category })));

      if (profile?.industries?.length > 0) {
        const mapped = profile.industries.map((label: string) => {
          const found = json.find((j: any) => j.label === label);
          return found
            ? { label: found.label, category: found.category }
            : { label, category: "" };
        });
        setSelectedIndustries(mapped);
      }
    };
    loadIndustries();
  }, []);

  // -------------------------
  // GOOGLE LOCATIONS SCRIPT
  // -------------------------

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (document.getElementById("google-places-script")) return;

    const script = document.createElement("script");
    script.id = "google-places-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!window.google || !window.google.maps) return;
    if (!locationQuery) {
      setLocationResults([]);
      return;
    }

    const autocomplete = new window.google.maps.places.AutocompleteService();
    autocomplete.getPlacePredictions(
      {
        input: locationQuery,
        types: ["(cities)"],
        componentRestrictions: {
          country: ["ba", "rs", "hr", "me", "si", "at", "de"],
        },
      },
      (preds: any) => setLocationResults(preds || [])
    );
  }, [locationQuery]);

  const handleLocationSelect = (loc: any) => {
    const svc = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );

    svc.getDetails(
      { placeId: loc.place_id, fields: ["geometry", "address_components"] },
      (details: any) => {
        const country =
          details.address_components.find((ac: any) =>
            ac.types.includes("country")
          )?.long_name || "";
        const city =
          details.address_components.find((ac: any) =>
            ac.types.includes("locality")
          )?.long_name || loc.description;

        setLocationQuery(`${city}, ${country}`);
        setLocationResults([]);
      }
    );
  };

  // -------------------------
  // SAVE CHANGES
  // -------------------------

  const handleSave = async () => {
    setSaving(true);

    try {
      if (profileType === "candidate") {
        await supabase
          .from("candidate_profile")
          .update({
            bio,
            phone,
            date_of_birth: dateOfBirth || null,
            skills,
            experience,
            industries: selectedIndustries.map((i) => i.label),
            industry_category: selectedIndustries.map((i) => i.category),
            social_links: socialLinks,
            location_city: locationQuery.split(",")[0]?.trim() || null,
            location_country: locationQuery.split(",")[1]?.trim() || null,
          })
          .eq("user_id", profile.user_id);
      } else {
        await supabase
          .from("company_profile")
          .update({
            bio,
            phone,
            founded_year: foundedYear || null,
            industries: selectedIndustries.map((i) => i.label),
            industry_category: selectedIndustries.map((i) => i.category),
            social_links: socialLinks,
            location_city: locationQuery.split(",")[0]?.trim() || null,
            location_country: locationQuery.split(",")[1]?.trim() || null,
          })
          .eq("user_id", profile.user_id);
      }

      onSave?.();
      onClose();
    } catch (e) {
      console.error("Save error:", e);
    }

    setSaving(false);
  };

  // -------------------------
  // RENDER UI
  // -------------------------

  return (
    <Dialog open={!!open} onClose={() => setOpen(false)} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel
          className="
            w-full max-w-2xl h-[92vh]
            overflow-y-auto
            bg-white dark:bg-neutral-900
            text-gray-900 dark:text-white
            p-6 rounded-3xl shadow-xl border border-gray-300/40 dark:border-white/10
          "
        >
          {/* TABS */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-3">
              <button
                onClick={() => setActiveTab("basic")}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition 
                  ${
                    activeTab === "basic"
                      ? "bg-blue-600 text-white shadow"
                      : "bg-gray-100 dark:bg-neutral-800"
                  }`}
              >
                Osnovne informacije
              </button>

              <button
                onClick={() => setActiveTab("social")}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition 
                  ${
                    activeTab === "social"
                      ? "bg-blue-600 text-white shadow"
                      : "bg-gray-100 dark:bg-neutral-800"
                  }`}
              >
                Društvene mreže
              </button>
            </div>
          </div>

          {/* BASIC TAB */}
          {activeTab === "basic" && (
            <div className="space-y-5">
              <div>
                <label className="block mb-1 font-medium">Lokacija</label>
                <input
                  className="w-full rounded-xl border px-3 py-2 dark:bg-neutral-800 dark:border-neutral-700"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  placeholder="Grad, Država"
                />
                {locationResults.length > 0 && (
                  <div className="bg-white dark:bg-neutral-800 border rounded-xl mt-2 max-h-48 overflow-y-auto">
                    {locationResults.map((loc, i) => (
                      <div
                        key={i}
                        className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-700"
                        onClick={() => handleLocationSelect(loc)}
                      >
                        {loc.description}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* PHONE */}
              <div>
                <label className="block mb-1 font-medium">Telefon</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border px-3 py-2 dark:bg-neutral-800 dark:border-neutral-700"
                />
              </div>

              {/* BIO */}
              <div>
                <label className="block mb-1 font-medium">Biografija</label>
                <textarea
                  maxLength={250}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full rounded-xl border px-3 py-2 h-24 dark:bg-neutral-800 dark:border-neutral-700"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {bio.length}/250 karaktera
                </p>
              </div>

              {/* CONDITIONAL FIELDS */}
              {profileType === "candidate" ? (
                <div>
                  <label className="block mb-1 font-medium">Datum rođenja</label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full rounded-xl border px-3 py-2 dark:bg-neutral-800 dark:border-neutral-700"
                  />
                </div>
              ) : (
                <div>
                  <label className="block mb-1 font-medium">
                    Godina osnivanja
                  </label>
                  <input
                    type="number"
                    min="1900"
                    max="2099"
                    value={foundedYear}
                    onChange={(e) => setFoundedYear(e.target.value)}
                    className="w-full rounded-xl border px-3 py-2 dark:bg-neutral-800 dark:border-neutral-700"
                  />
                </div>
              )}
            </div>
          )}

          {/* SOCIAL TAB */}
          {activeTab === "social" && (
            <div className="space-y-5">
              {Object.entries(socialLinks).map(([key, value]) => (
                <div key={key}>
                  <label className="block mb-1 font-medium capitalize">
                    {key}
                  </label>
                  <input
                    value={value}
                    onChange={(e) =>
                      setSocialLinks({ ...socialLinks, [key]: e.target.value })
                    }
                    className="w-full rounded-xl border px-3 py-2 dark:bg-neutral-800 dark:border-neutral-700"
                  />
                </div>
              ))}
            </div>
          )}

          {/* FOOTER */}
          <div className="flex justify-end gap-3 mt-8">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-neutral-700"
            >
              Zatvori
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white shadow"
            >
              {saving ? "Spremanje..." : "Sačuvaj"}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
