"use client";

import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { FiEdit3 } from "react-icons/fi";
import { supabase } from "@/lib/supabaseClient";

declare global {
  interface Window {
    google: any;
  }
}

interface EditSectionProps {
  title: string;
  // field/value/onChange više praktično ne koristimo, ali ih zadržavamo
  // da ti se ne polome postojeći importi
  field?: string;
  profile: any; // očekujemo profile.id (user_id) i profile.profile_type
  value?: any;
  onChange?: (patch: any) => void;
}

const PHONE_PREFIXES = ["+387", "+381", "+385", "+386", "+43", "+49"];

export default function EditSection({
  title,
  profile,
}: EditSectionProps) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [activeTab, setActiveTab] = useState<"basic" | "experience" | "social">(
    "basic"
  );


const [industriesList, setIndustriesList] = useState<{ label: string; category: string }[]>([]);
const [selectedIndustries, setSelectedIndustries] = useState<{ label: string; category: string }[]>([]);

  // --------- GOOGLE LOCATION ----------
  const [locationQuery, setLocationQuery] = useState("");
  const [locationResults, setLocationResults] = useState<any[]>([]);

  // --------- FORM STATE ----------
  const [initialData, setInitialData] = useState<any | null>(null);

  const [basicData, setBasicData] = useState({
  // shared
  location_city: "",
  location_country: "",
  location_lat: null as number | null,
  location_lon: null as number | null,
  location_region: "",
  phone: "",
  bio: "",
  
  idustries: [] as string[],
  industry_category: [] as string[],

  // candidate
  date_of_birth: "",

  // company
  founded_year: "",
  address: "",

  // socials
  social_linkedin: "",
  social_instagram: "",
  social_facebook: "",
  social_website: "",

  // experience & skills
  experience: "",
    skills: "",
});

  const [phonePrefix, setPhonePrefix] = useState("+387");
  const [phoneNumber, setPhoneNumber] = useState("");

  const BIO_LIMIT = 250;

  // image upload
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [currentImageUrl, setCurrentImageUrl] = useState<string>("");

  useEffect(() => {
  if (!open) return;

  const loadIndustries = async () => {
    try {
      const res = await fetch("/data/industry.json");
      const data = await res.json();
      setIndustriesList(data);
    } catch (e) {
      console.error("Industry.json load error:", e);
    }
  };

  loadIndustries();
}, [open]);

  // ---------- GOOGLE SCRIPT LOAD ----------
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
    if (!open) return;
    if (typeof window === "undefined") return;
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
      (preds: any[]) => setLocationResults(preds || [])
    );
  }, [locationQuery, open]);

  const handleLocationSelect = (loc: any) => {
    if (!window.google) return;
    const placesService = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );

    placesService.getDetails(
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

        const lat = details.geometry.location.lat();
        const lon = details.geometry.location.lng();

        setBasicData((prev) => ({
          ...prev,
          location_city: city,
          location_country: country,
          location_lat: lat,
          location_lon: lon,
          location_region: "Europe/Balkans",
        }));
        setLocationQuery(`${city}, ${country}`);
        setLocationResults([]);
      }
    );
  };

  // ---------- HELPERS ----------
  const parsePhone = (phone: string | null) => {
    if (!phone) return { prefix: "+387", number: "" };
    let chosen = "+387";
    let rest = phone;
    for (const p of PHONE_PREFIXES) {
      if (phone.startsWith(p)) {
        chosen = p;
        rest = phone.slice(p.length).trim();
        break;
      }
    }
    return { prefix: chosen, number: rest };
  };

  const combinePhone = (prefix: string, number: string) =>
    number.trim() ? `${prefix} ${number.trim()}` : "";

  const buildYearOptions = () => {
    const years: number[] = [];
    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= 1900; y--) years.push(y);
    return years;
  };

  // ---------- LOAD DATA WHEN MODAL OPENS ----------
  useEffect(() => {
    if (!open) return;
    if (!profile?.id || !profile?.profile_type) return;

    const load = async () => {
      const userId = profile.id as string;
      const isCandidate = profile.profile_type === "candidate";

      const table = isCandidate ? "candidate_profile" : "company_profile";

      const { data, error } = await supabase
        .from(table)
        .select(
        isCandidate
            ? "location_city, location_country, location_lat, location_lon, location_region, phone, date_of_birth, work_experience, profile_picture_url, industries, industry_category"
            : "location_city, location_country, location_lat, location_lon, location_region, phone, founded_year, bio, logo_url, industries, industry_category"
        )
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Load profile for EditSection error:", error);
        return;
      }

      if (!data) return;

      setInitialData(data);


    if (data.industries && Array.isArray(data.industries)) {
  const inds = data.industries.map((label: string) => {
    const category = data.industry_category?.find((cat: string) =>
      cat && cat.toLowerCase() === label.toLowerCase()
    ) || "";
    return { label, category };
  });

      const city = data.location_city || "";
      const country = data.location_country || "";
      setLocationQuery(
        city && country ? `${city}, ${country}` : city || country || ""
      );

      const parsedPhone = parsePhone(data.phone || null);

      setPhonePrefix(parsedPhone.prefix);
      setPhoneNumber(parsedPhone.number);

      setBasicData({
        address: !isCandidate ? data.address || "" : "",
        location_city: data.location_city || "",
        location_country: data.location_country || "",
        location_lat: data.location_lat ?? null,
        location_lon: data.location_lon ?? null,
        location_region: data.location_region || "",
        phone: data.phone || "",
        bio: isCandidate ? data.work_experience || "" : data.bio || "",
        date_of_birth: isCandidate
          ? data.date_of_birth || ""
          : "",
        founded_year: !isCandidate && data.founded_year
          ? String(data.founded_year)
          : "",
          social_linkedin: data.social_links?.linkedin || "",
            social_instagram: data.social_links?.instagram || "",
            social_facebook: data.social_links?.facebook || "",
            social_website: data.social_links?.website || "",
            
            experience: data.experience || "",
            skills: data.skills || "",
      });

      setCurrentImageUrl(
        isCandidate ? data.profile_picture_url || "" : data.logo_url || ""
      );
      setImagePreview(isCandidate ? data.profile_picture_url || "" : data.logo_url || "");
    };

  setSelectedIndustries(inds);
}

    load();
  }, [open, profile]);

  // ---------- IMAGE HANDLING ----------
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // ---------- SAVE ----------
  const handleSave = async () => {
    if (!profile?.id || !profile?.profile_type) return;

    try {
      setSaving(true);

      const userId = profile.id as string;
      const isCandidate = profile.profile_type === "candidate";
      const table = isCandidate ? "candidate_profile" : "company_profile";

      if (!initialData) {
        console.warn("No initialData loaded – cannot diff fields.");
      }

      const patch: any = {};
      const phoneCombined = combinePhone(phonePrefix, phoneNumber);

      // Address
        if (!isCandidate && initialData && basicData.address !== (initialData.address || "")) {
        patch.address = basicData.address || null;
        }

      // location
      if (
        initialData &&
        (basicData.location_city !== initialData.location_city ||
          basicData.location_country !== initialData.location_country ||
          basicData.location_lat !== initialData.location_lat ||
          basicData.location_lon !== initialData.location_lon ||
          basicData.location_region !== initialData.location_region)
      ) {
        patch.location_city = basicData.location_city || null;
        patch.location_country = basicData.location_country || null;
        patch.location_lat = basicData.location_lat;
        patch.location_lon = basicData.location_lon;
        patch.location_region = basicData.location_region || null;
      }

      // phone
      if (initialData && phoneCombined !== (initialData.phone || "")) {
        patch.phone = phoneCombined || null;
        // update i u users
        await supabase
          .from("users")
          .update({ phone: phoneCombined || null })
          .eq("id", userId);
      }

      // bio / work_experience
      if (isCandidate) {
        if (initialData && basicData.bio !== (initialData.work_experience || "")) {
          patch.work_experience = basicData.bio || null;
        }
      } else {
        if (initialData && basicData.bio !== (initialData.bio || "")) {
          patch.bio = basicData.bio || null;
        }
      }

      // date_of_birth / founded_year
      if (isCandidate) {
        if (
          initialData &&
          basicData.date_of_birth !== (initialData.date_of_birth || "")
        ) {
          patch.date_of_birth = basicData.date_of_birth || null;
        }
      } else {
        const asNumber = basicData.founded_year
          ? parseInt(basicData.founded_year, 10)
          : null;
        if (initialData && asNumber !== (initialData.founded_year ?? null)) {
          patch.founded_year = asNumber;
        }
      }

      // ---------- IMAGE UPLOAD ----------
      let newImageUrl: string | null = null;
      if (imageFile) {
        const bucket = isCandidate ? "profile_pictures" : "logotypes";
        const extFromName =
          imageFile.name.split(".").pop()?.toLowerCase() || "jpg";
        const ext =
          extFromName === "jpeg" ||
          extFromName === "jpg" ||
          extFromName === "png"
            ? extFromName
            : "jpg";

        const path = `${userId}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(path, imageFile, {
            upsert: true,
          });

        if (uploadError) {
          console.error("Upload error:", uploadError);
          alert("Greška pri uploadu slike.");
        } else {
          const { data } = supabase.storage
            .from(bucket)
            .getPublicUrl(path);
          newImageUrl = data.publicUrl;

          if (isCandidate) {
            patch.profile_picture_url = newImageUrl;
          } else {
            patch.logo_url = newImageUrl;
          }
        }
      }

      // Experience
        if (
        isCandidate &&
        initialData &&
        basicData.experience !== (initialData.experience || "")
        ) {
        patch.experience = basicData.experience;
        }

        // INDUSTRIES SAVE
        const labels = selectedIndustries.map(i => i.label);
        const categories = Array.from(new Set(selectedIndustries.map(i => i.category)));

        if (JSON.stringify(labels) !== JSON.stringify(initialData?.industries || [])) {
            patch.industries = labels;
        }

        if (JSON.stringify(categories) !== JSON.stringify(initialData?.industry_category || [])) {
            patch.industry_category = categories;
        }

      // Social links
      const newSocial = {
        linkedin: basicData.social_linkedin || null,
        instagram: basicData.social_instagram || null,
        facebook: basicData.social_facebook || null,
        website: basicData.social_website || null,
};

if (
  JSON.stringify(newSocial) !==
  JSON.stringify(initialData?.social_links || {})
) {
  patch.social_links = newSocial;
}

      // Ako nema nijedne promjene → samo zatvori
      if (!Object.keys(patch).length) {
        setOpen(false);
        return;
      }

      const { error } = await supabase
        .from(table)
        .update(patch)
        .eq("user_id", userId);

      if (error) {
        console.error(error);
        alert("Greška pri spašavanju podataka.");
        return;
      }

      // callback za parent ako želi da refreša state
      if (typeof window !== "undefined" && typeof (window as any).location !== "undefined") {
        // soft refresh preko roditelja, ali da ne pravimo haos – 
        // ostavljam ti graceful hook:
      }
      if (typeof patch === "object") {
        // onChange možeš koristiti u parentu ako ti treba
      }

      setOpen(false);
    } catch (err) {
      console.error("EditSection save error:", err);
      alert("Došlo je do greške.");
    } finally {
      setSaving(false);
    }
  };

  // ---------- RENDER ----------
  const isCandidate = profile?.profile_type === "candidate";

  return (
    <div className="relative group w-full dark:bg-[#000]">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>

        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-md border border-gray-300 dark:border-white/10 
                     bg-white/80 dark:bg-[#0f0f0f] hover:bg-gray-100 dark:hover:bg-[#202020] 
                     transition flex items-center shadow-sm"
        >
          <FiEdit3 className="w-4 h-4 text-gray-700 dark:text-gray-200" />
        </button>
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm overflow-y-auto flex items-start justify-center p-6">
          <Dialog.Panel
            className="
              w-full 
              max-w-xl 
              max-h-[90vh]
              overflow-y-auto 
              rounded-3xl 
              bg-white 
              dark:bg-[#0f0f0f]
              text-gray-900 dark:text-white
              p-6 md:p-8 
              shadow-2xl 
              border border-gray-200 dark:border-white/10
              backdrop-blur-xl
              scrollbar-thin 
              scrollbar-track-transparent 
              scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700
            "
            >
            <Dialog.Title className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Uredi osnovne informacije
            </Dialog.Title>

            {/* TABS */}
            <div className="flex gap-3 mb-5 border-b border-gray-200 dark:border-white/10 pb-2">
              <button
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeTab === "basic"
                        ? "px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-black dark:text-white shadow-lg border border-blue-500"
                        : "px-4 py-2 rounded-full text-sm font-medium bg-gray-200 dark:bg-[#2b2b2b] text-gray-800 dark:text-black border border-gray-300 dark:border-white/20 hover:bg-gray-300 dark:hover:bg-[#3a3a3a]"
                }`}
                onClick={() => setActiveTab("basic")}
              >
                Osnovni podaci
              </button>
              <button
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === "experience" && (
  <div className="flex flex-col gap-4">

    {/* RADNO ISKUSTVO */}
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
        Radno iskustvo
      </label>
      <textarea
        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-white/10 
                   bg-white dark:bg-[#0f0f0f] text-gray-900 dark:text-white 
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        placeholder="Ukratko opišite prethodna radna iskustva..."
        rows={5}
        value={basicData.experience}
        onChange={(e) =>
          setBasicData((prev) => ({
            ...prev,
            experience: e.target.value,
          }))
        }
      />
    </div>

    {/* INDUSTRIJA */}
<div className="flex flex-col gap-1">
  <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
    Industrija
  </label>

  <div className="relative">
    <input
      type="text"
      placeholder="Pretraži industrije..."
      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-white/10
                 bg-white dark:bg-[#0f0f0f] text-gray-900 dark:text-white text-sm"
      onChange={(e) => {
        const q = e.target.value.toLowerCase();
        setIndustriesList(prev =>
          prev.filter(ind => ind.label.toLowerCase().includes(q))
        );
      }}
    />

    {/* Dropdown */}
    <div className="mt-2 max-h-48 overflow-y-auto bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-lg shadow-lg">
      {industriesList.map((ind, idx) => (
        <button
          key={idx}
          type="button"
          onClick={() => {
            if (!selectedIndustries.find(s => s.label === ind.label)) {
              setSelectedIndustries(prev => [...prev, ind]);
            }
          }}
          className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-[#222]
                     text-gray-900 dark:text-gray-100 text-sm"
        >
          {ind.label}
        </button>
      ))}
    </div>
  </div>

  {/* Selected items list */}
  <div className="flex flex-wrap gap-2 mt-2">
    {selectedIndustries.map((ind, i) => (
      <span
        key={i}
        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-full text-xs flex items-center gap-2"
      >
        {ind.label}
        <button
          className="text-red-500"
          onClick={() =>
            setSelectedIndustries(prev =>
              prev.filter(p => p.label !== ind.label)
            )
          }
        >
          ✕
        </button>
      </span>
    ))}
  </div>
</div>

    {/* VJEŠTINE */}
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
        Vještine
      </label>
      <textarea
        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-white/10 
                   bg-white dark:bg-[#0f0f0f] text-gray-900 dark:text-white 
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        placeholder="Npr: React, UI/UX, Project Management..."
        rows={3}
        value={basicData.skills}
        onChange={(e) =>
          setBasicData((prev) => ({
            ...prev,
            skills: e.target.value,
          }))
        }
      />
    </div>

  </div>
)}`}
                onClick={() => setActiveTab("experience")}
              >
                Iskustvo
              </button>
              <button
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeTab === "social"
                    ? "px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-black dark:text-white shadow-lg border border-blue-500"
                        : "px-4 py-2 rounded-full text-sm font-medium bg-gray-200 dark:bg-[#2b2b2b] text-gray-800 dark:text-black border border-gray-300 dark:border-white/20 hover:bg-gray-300 dark:hover:bg-[#3a3a3a]"
                }`}
                onClick={() => setActiveTab("social")}
                
              >
                Društvene mreže
              </button>
            </div>

            {/* BASIC TAB */}
            {activeTab === "basic" && (
              <div className="flex flex-col gap-4">
                {/* SLika */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-[#131313] flex items-center justify-center text-xs text-gray-500">
                    {imagePreview || currentImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imagePreview || currentImageUrl}
                        alt="Profil"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      "Nema slike"
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      Profilna slika / logotip
                    </label>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={handleImageChange}
                      className="text-xs text-gray-600 dark:text-gray-300"
                    />
                    <p className="text-[11px] text-gray-400">
                      Preporuka: kvadratna slika, max 3 MB.
                    </p>
                  </div>
                </div>

                {/* Adresa kompanije */}
                {!isCandidate && (
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Adresa
                    </label>
                    <input
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-white/10 
                                bg-white dark:bg-[#0f0f0f] text-gray-900 dark:text-white 
                                focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Unesite adresu (ulica i broj)"
                    value={basicData.address}
                    onChange={(e) =>
                        setBasicData((prev) => ({
                        ...prev,
                        address: e.target.value,
                        }))
                    }
                    />
                </div>
                )}

                {/* Lokacija */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Lokacija
                  </label>
                  <input
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-[#0f0f0f] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Unesi grad..."
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                  />
                  {locationResults.length > 0 && (
                    <div className="mt-1 max-h-48 overflow-y-auto rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0f0f0f] text-sm shadow-lg">
                      {locationResults.map((loc, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleLocationSelect(loc)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-[#222] text-gray-800 dark:text-gray-100"
                        >
                          {loc.description}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Datum rođenja / Godina osnivanja */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {isCandidate ? "Datum rođenja" : "Godina osnivanja"}
                  </label>

                  {isCandidate ? (
                    <input
                      type="date"
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-[#0f0f0f] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      value={basicData.date_of_birth || ""}
                      onChange={(e) =>
                        setBasicData((prev) => ({
                          ...prev,
                          date_of_birth: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    <select
                      className="flex-1 px-3 py-4 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-[#0f0f0f] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      value={basicData.founded_year || ""}
                      onChange={(e) =>
                        setBasicData((prev) => ({
                          ...prev,
                          founded_year: e.target.value,
                        }))
                      }
                    >
                      <option value="">Odaberi godinu...</option>
                      {buildYearOptions().map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Telefon */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Broj telefona
                  </label>
                  <div className="flex gap-2">
                    <select
                      className="px-3 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-[#0f0f0f] text-gray-900 dark:text-white text-sm"
                      value={phonePrefix}
                      onChange={(e) => setPhonePrefix(e.target.value)}
                    >
                      {PHONE_PREFIXES.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                    <input
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-[#0f0f0f] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Broj bez prefiksa"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                </div>

                {/* Bio */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Biografija
                  </label>
                  <textarea
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-[#0f0f0f] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    rows={4}
                    maxLength={BIO_LIMIT}
                    value={basicData.bio}
                    onChange={(e) =>
                      setBasicData((prev) => ({
                        ...prev,
                        bio: e.target.value.slice(0, BIO_LIMIT),
                      }))
                    }
                    placeholder={
                      isCandidate
                        ? "U kratkim crtama opiši svoje iskustvo..."
                        : "Napišite kratki opis vaše kompanije..."
                    }
                  />
                  <div className="text-right text-[11px] text-gray-400">
                    {basicData.bio.length}/{BIO_LIMIT}
                  </div>
                </div>
              </div>
            )}

            {/* SOCIAL TAB */}
            {activeTab === "social" && (
  <div className="flex flex-col gap-4">

    {/* LINKEDIN */}
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
        LinkedIn
      </label>
      <input
        type="url"
        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-white/10 
                   bg-white dark:bg-[#0f0f0f] text-gray-900 dark:text-white focus:ring-2 
                   focus:ring-blue-500 text-sm"
        placeholder="https://linkedin.com/in/username"
        value={basicData.social_linkedin}
        onChange={(e) =>
          setBasicData((prev) => ({
            ...prev,
            social_linkedin: e.target.value,
          }))
        }
      />
    </div>

    {/* INSTAGRAM */}
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
        Instagram
      </label>
      <input
        type="url"
        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-white/10 
                   bg-white dark:bg-[#0f0f0f] text-gray-900 dark:text-white focus:ring-2 
                   focus:ring-blue-500 text-sm"
        placeholder="https://instagram.com/username"
        value={basicData.social_instagram}
        onChange={(e) =>
          setBasicData((prev) => ({
            ...prev,
            social_instagram: e.target.value,
          }))
        }
      />
    </div>

    {/* FACEBOOK */}
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
        Facebook
      </label>
      <input
        type="url"
        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-white/10 
                   bg-white dark:bg-[#0f0f0f] text-gray-900 dark:text-white focus:ring-2 
                   focus:ring-blue-500 text-sm"
        placeholder="https://facebook.com/username"
        value={basicData.social_facebook}
        onChange={(e) =>
          setBasicData((prev) => ({
            ...prev,
            social_facebook: e.target.value,
          }))
        }
      />
    </div>

    {/* WEBSITE — samo za kompanije */}
    {!isCandidate && (
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
          Web stranica
        </label>
        <input
          type="url"
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-white/10 
                     bg-white dark:bg-[#0f0f0f] text-gray-900 dark:text-white focus:ring-2 
                     focus:ring-blue-500 text-sm"
          placeholder="https://company.com"
          value={basicData.social_website}
          onChange={(e) =>
            setBasicData((prev) => ({
              ...prev,
              social_website: e.target.value,
            }))
          }
        />
      </div>
    )}

  </div>
)}

            {/* BUTTONS */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-white/20 bg-gray-100 dark:bg-[#1e1e1e] hover:bg-gray-200 dark:hover:bg-[#2a2a2a] text-sm font-medium text-gray-800 dark:text-black"
              >
                Odustani
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2.5 rounded-xl text-black font-semibold shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all text-sm disabled:opacity-60 disabled: text-gray disabled:cursor-not-allowed border border-blue-700 dark:border-blue-500 text-black dark:text-white"
              >
                {saving ? "Spašavam..." : "Sačuvaj"}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}