"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import SidebarLeft from "@/components/main_layout/SidebarLeft";
import RightSuggestions from "@/components/main_layout/RightSuggestions";
import { useRouter } from "next/navigation";

export default function NewJobPage() {
  const router = useRouter();

  const [profileType, setProfileType] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [workMode, setWorkMode] = useState("");
  const [salary, setSalary] = useState("");
  const [industry, setIndustry] = useState("");
  const [industries, setIndustries] = useState([]);

  // LOCATION STATES
  const [locationQuery, setLocationQuery] = useState("");
  const [locationResults, setLocationResults] = useState([]);
  const [locationCity, setLocationCity] = useState("");
  const [locationCountry, setLocationCountry] = useState("");

  const [loading, setLoading] = useState(false);

  const [employmentTypes, setEmploymentTypes] = useState([]);
  const [workModes, setWorkModes] = useState([]);
  const [salaryRanges, setSalaryRanges] = useState([]);

  // LOAD PROFILE TYPE
  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: usr } = await supabase
        .from("users")
        .select("profile_type")
        .eq("id", user.id)
        .single();

      setProfileType(usr?.profile_type || null);
    };

    load();
  }, []);

  // LOAD JSON FILES
  useEffect(() => {
    const loadJson = async (file, setter) => {
      const res = await fetch(`/data/${file}`);
      const data = await res.json();
      setter(data);
    };

    loadJson("employment_type.json", setEmploymentTypes);
    loadJson("location_industry_standard.json", setWorkModes);
    loadJson("salary.json", setSalaryRanges);
    loadJson("industry.json", setIndustries);
  }, []);

  // LOAD GOOGLE MAPS API
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!document.getElementById("google-places-script")) {
      const script = document.createElement("script");
      script.id = "google-places-script";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

  // AUTOCOMPLETE CITY SEARCH
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
        componentRestrictions: { country: ["ba", "rs", "hr", "me", "si", "at", "de"] }
      },
      (predictions) => {
        setLocationResults(predictions || []);
      }
    );
  }, [locationQuery]);

  // SELECT A LOCATION
  const handleLocationSelect = (loc) => {
    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );

    service.getDetails(
      {
        placeId: loc.place_id,
        fields: ["address_components"]
      },
      (details) => {
        const city =
          details.address_components.find((a) => a.types.includes("locality"))
            ?.long_name || loc.description;

        const country =
          details.address_components.find((a) => a.types.includes("country"))
            ?.long_name || "";

        setLocationCity(city);
        setLocationCountry(country);
        setLocationQuery(`${city}, ${country}`);
        setLocationResults([]);
      }
    );
  };

  // POST JOB
  const handlePostJob = async () => {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user || profileType !== "company") {
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("jobs").insert([
      {
        company_id: user.id,
        title,
        description,
        employment_type: [employmentType],
        work_mode: [workMode],
        salary_range: salary,
        industry: [industry],
        location_city: locationCity,
        location_country: locationCountry,
      },
    ]);

    setLoading(false);

    if (!error) {
      alert("✔ Oglas uspješno objavljen!");
      router.push("/jobs");
    } else {
      alert("❌ Greška pri objavljivanju oglasa.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-[#0d0d0d] flex-col md:flex-row">
      <SidebarLeft />

      <div className="flex w-full md:ml-[250px] xl:mr-[300px] p-4 md:p-10 flex-col md:flex-row gap-6">
        <div className="flex-1 w-full md:max-w-2xl bg-white dark:bg-[#0f0f0f] shadow-md dark:shadow-none border border-gray-200 dark:border-white/10 rounded-xl p-4 md:p-8 overflow-y-auto">

          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Objavi novi oglas
          </h1>

          {profileType !== "company" ? (
            <div className="text-center text-gray-600 dark:text-gray-300">
              ❗ Samo poslodavci mogu objavljivati oglase.
            </div>
          ) : (
            <div className="flex flex-col gap-6">

              <InputField label="Naslov oglasa" value={title} onChange={setTitle} maxLength={100} />

              <InputField label="Opis" value={description} onChange={setDescription} textarea maxLength={250} />

              {/* EMPLOYMENT TYPE */}
              <SelectField
                label="Tip zaposlenja"
                value={employmentType}
                onChange={setEmploymentType}
                options={employmentTypes}
              />

              {/* WORK MODE */}
              <SelectField
                label="Način rada"
                value={workMode}
                onChange={setWorkMode}
                options={workModes}
              />

              {/* SALARY */}
              <SelectField
                label="Plata"
                value={salary}
                onChange={setSalary}
                options={salaryRanges}
              />

              <SelectField
                label="Industrija"
                value={industry}
                onChange={setIndustry}
                options={industries}
              />

              {/* LOCATION FIELD */}
              <div className="flex flex-col gap-2">
                <label className="font-medium text-gray-700 dark:text-gray-300">Lokacija</label>

                <input
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  placeholder="Unesite grad..."
                  className="p-3 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-gray-800 dark:text-gray-200"
                />

                {locationResults.length > 0 && (
                  <div className="bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-white/10 rounded-lg shadow-md max-h-52 overflow-y-auto">
                    {locationResults.map((loc, index) => (
                      <div
                        key={index}
                        className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                        onClick={() => handleLocationSelect(loc)}
                      >
                        {loc.description}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handlePostJob}
                disabled={loading}
                className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg mt-4"
              >
                {loading ? "Objavljivanje..." : "Objavi oglas"}
              </button>
            </div>
          )}
        </div>

        <div className="hidden xl:block">
          <RightSuggestions />
        </div>
      </div>
    </div>
  );
}

// ------------------------
// INPUT FIELD COMPONENT
// ------------------------
function InputField({ label, value, onChange, placeholder = "", textarea = false, maxLength }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-medium text-gray-700 dark:text-gray-300">{label}</label>

      <div className="relative flex flex-col">
        {textarea ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
            className="p-3 h-32 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-[#1a1a1a] 
                       text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-400 outline-none"
          />
        ) : (
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
            className="p-3 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-[#1a1a1a] 
                       text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-400 outline-none"
          />
        )}

        {maxLength && (
          <div className="text-xs text-gray-500 dark:text-gray-400 ml-auto mt-1">
            {value.length}/{maxLength}
          </div>
        )}
      </div>
    </div>
  );
}

// ------------------------
// SELECT FIELD COMPONENT
// ------------------------
function SelectField({ label, value, onChange, options }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-medium text-gray-700 dark:text-gray-300">{label}</label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="p-3 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-400 outline-none"
      >
        <option value="">Odaberi...</option>

        {options.map((opt, index) => {
          const label = typeof opt === "string" ? opt : opt.label;
          return (
            <option key={index} value={label}>
              {label}
            </option>
          );
        })}
      </select>
    </div>
  );
}