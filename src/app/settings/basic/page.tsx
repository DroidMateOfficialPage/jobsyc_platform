"use client";

import { useEffect, useState } from "react";
import SidebarLeft from "@/components/main_layout/SidebarLeft";
import SettingsSidebar from "@/app/settings/components/SideBar";
import { supabase } from "@/lib/supabaseClient";

export default function BasicSettings() {
  const [mounted, setMounted] = useState(false);

  // Candidate fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");

  // Company fields
  const [brandName, setBrandName] = useState("");       // users.full_name
  const [legalName, setLegalName] = useState("");       // company_profile.legal_full_name
  const [jib, setJib] = useState("");
  const [pib, setPib] = useState("");
  const [foundedYear, setFoundedYear] = useState("");

  // Shared fields
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profileType, setProfileType] = useState("");

  const [loading, setLoading] = useState(true);

  // Image upload states
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const saveImageToStorage = async () => {
    if (!imageFile) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const bucket = profileType === "company" ? "logotypes" : "profile_pictures";
    const fileName = `${user.id}.png`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, imageFile, { upsert: true });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      alert("Greška pri uploadu slike.");
      return;
    }

    const { data: publicURL } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    const url = publicURL.publicUrl;

    if (profileType === "company") {
      await supabase
        .from("company_profile")
        .update({ logo_url: url })
        .eq("user_id", user.id);
    } else {
      await supabase
        .from("candidate_profile")
        .update({ profile_picture_url: url })
        .eq("user_id", user.id);
    }

    alert("✔ Profilna slika uspješno ažurirana!");
  };

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;

    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // USERS base data
      const { data: usr } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (usr) {
        setEmail(usr.email || "");
        setPhone(usr.phone || "");
        setProfileType(usr.profile_type || "");
      }

      // Candidate data
      if (usr?.profile_type === "candidate") {
        const full = usr.full_name || "";
        const [f, ...l] = full.split(" ");
        setFirstName(f || "");
        setLastName(l.join(" ") || "");

        const { data: cand } = await supabase
          .from("candidate_profile")
          .select("age")
          .eq("user_id", user.id)
          .single();

        if (cand?.age) setBirthDate(cand.age);
      }

      // Company data
      if (usr?.profile_type === "company") {
        setBrandName(usr.full_name || "");

        const { data: comp } = await supabase
          .from("company_profile")
          .select("legal_full_name, jib, pib, founded_year")
          .eq("user_id", user.id)
          .single();

        if (comp) {
          setLegalName(comp.legal_full_name || "");
          setJib(comp.jib || "");
          setPib(comp.pib || "");
          setFoundedYear(comp.founded_year || "");
        }
      }

      setLoading(false);
    };

    load();
  }, [mounted]);

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // CANDIDATE SAVE
    if (profileType === "candidate") {
      const fullName = `${firstName} ${lastName}`.trim();

      await supabase.from("users")
        .update({ full_name: fullName, phone: phone })
        .eq("id", user.id);

      await supabase.from("candidate_profile")
        .update({
          first_name: firstName,
          last_name: lastName,
          age: birthDate
        })
        .eq("user_id", user.id);
    }

    // COMPANY SAVE
    if (profileType === "company") {
      await supabase.from("users")
        .update({
          full_name: brandName,
          phone: phone,
        })
        .eq("id", user.id);

      await supabase.from("company_profile")
        .update({
          legal_full_name: legalName,
          jib: jib,
          pib: pib,
          founded_year: foundedYear,
        })
        .eq("user_id", user.id);
    }

    alert("✔ Podaci su uspješno ažurirani!");
  };

  if (!mounted) return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#0d0d0d]">
      <SidebarLeft />
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#0d0d0d]">
      <SidebarLeft />

      <div className="flex w-full ml-[250px]">
        <SettingsSidebar />

        <div className="flex-1 p-10 max-w-2xl bg-white dark:bg-[#0f0f0f] rounded-xl shadow-md dark:shadow-none border border-gray-200 dark:border-white/10">
          <h1 className="text-2xl font-bold mb-8 text-gray-800 dark:text-white">
            Osnovni podaci
          </h1>

          {loading ? (
            <p>Učitavanje...</p>
          ) : (
            <div className="flex flex-col gap-8">


          <div className="mb-8 flex flex-col items-center gap-4">
            {previewUrl && (
              <img
                src={previewUrl}
                className="w-32 h-32 rounded-full object-cover border border-gray-300 dark:border-white/20"
              />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="text-sm"
            />

            <button
              onClick={saveImageToStorage}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md dark:shadow-none"
            >
              Sačuvaj sliku
            </button>
          </div>

              {/* CANDIDATE UI */}
              {profileType === "candidate" && (
                <>
                  <Section
                    label="Ime"
                    value={firstName}
                    onChange={setFirstName}
                  />

                  <Section
                    label="Prezime"
                    value={lastName}
                    onChange={setLastName}
                  />

                  <Section
                    label="Kontakt telefon"
                    value={phone}
                    onChange={setPhone}
                  />

                  <Section
                    type="date"
                    label="Datum rođenja"
                    value={birthDate}
                    onChange={setBirthDate}
                  />
                </>
              )}

              {/* COMPANY UI */}
              {profileType === "company" && (
                <>
                  <Section
                    label="Naziv kompanije"
                    value={brandName}
                    onChange={setBrandName}
                  />

                  <Section
                    label="Puno pravno ime kompanije"
                    value={legalName}
                    onChange={setLegalName}
                  />

                  <Section
                    label="JIB"
                    value={jib}
                    onChange={setJib}
                  />

                  <Section
                    label="PIB"
                    value={pib}
                    onChange={setPib}
                  />

                  <Section
                    label="Godina osnivanja"
                    type="number"
                    value={foundedYear}
                    onChange={setFoundedYear}
                  />

                  <Section
                    label="Kontakt telefon"
                    value={phone}
                    onChange={setPhone}
                  />
                </>
              )}

              {/* EMAIL */}
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-gray-700">Email</label>
                <input
                  readOnly
                  value={email}
                  className="p-3 rounded-lg bg-gray-100 dark:bg-[#1a1a1a] border border-gray-300 dark:border-white/10 text-gray-600 dark:text-gray-300"
                />
              </div>

              <button
                onClick={handleSave}
                className="p-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
              >
                Sačuvaj promjene
              </button>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ label, value, onChange, type = "text" }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="p-3 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-400 outline-none"
      />
    </div>
  );
}