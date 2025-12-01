"use client";

import { useEffect, useState } from "react";
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

  const handleImageUpload = (e: any) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setImageFile(file);
  setPreviewUrl(URL.createObjectURL(file)); // prikaz slike odmah
};

  const saveImageToStorage = async () => {
  if (!imageFile) {
    alert("Molimo odaberite sliku.");
    return;
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    alert("Niste prijavljeni.");
    return;
  }

  const bucket = profileType === "company" ? "logotypes" : "profile_pictures";

  // Ekstenzija
  const ext = imageFile.name.split(".").pop();
  const fileName = `${user.id}.${ext}`;
  const filePath = fileName;

  // ✔ Upload fajla
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, imageFile, {
      upsert: true,
      cacheControl: "3600",
      contentType: imageFile.type,
    });

  if (uploadError) {
    console.error("❌ Upload greška:", uploadError);
    alert("Greška pri uploadu slike.");
    return;
  }

  // ✔ Public URL
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  const publicUrl = urlData.publicUrl;

  // ✔ Upis u bazu
  if (profileType === "company") {
    await supabase
      .from("company_profile")
      .update({ logo_url: publicUrl })
      .eq("user_id", user.id);
  } else {
    await supabase
      .from("candidate_profile")
      .update({ profile_picture_url: publicUrl })
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
          .select("date_of_birth, phone, email")
          .eq("user_id", user.id)
          .single();

        if (cand?.date_of_birth) setBirthDate(cand.date_of_birth);
        // Optionally, set phone/email from candidate_profile if needed:
        // if (cand?.phone) setPhone(cand.phone);
        // if (cand?.email) setEmail(cand.email);
      }

      // Company data
      if (usr?.profile_type === "company") {
        setBrandName(usr.full_name || "");

        const { data: comp } = await supabase
          .from("company_profile")
          .select("legal_full_name, jib, pib, founded_year, phone")
          .eq("user_id", user.id)
          .single();

        if (comp) {
          setLegalName(comp.legal_full_name || "");
          setJib(comp.jib || "");
          setPib(comp.pib || "");
          setFoundedYear(comp.founded_year || "");
          setPhone(comp.phone || "");
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
        .update({ full_name: fullName, phone: phone, email: email })
        .eq("id", user.id);

      await supabase.from("candidate_profile")
        .update({
          first_name: firstName,
          last_name: lastName,
          date_of_birth: birthDate,
          phone: phone,
          email: email,
          work_experience: "", // placeholder if needed by schema
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
          phone: phone,
        })
        .eq("user_id", user.id);
    }

    alert("✔ Podaci su uspješno ažurirani!");
  };


  return (
    <div className="flex min-h-screen max-h-screen overflow-y-auto bg-gray-50 dark:bg-[#0d0d0d] py-6 px-4">

        <div className="flex-1 max-w-2xl mx-auto p-8 bg-white dark:bg-[#0f0f0f] rounded-2xl shadow-lg dark:shadow-none border border-gray-200 dark:border-white/10 overflow-y-auto max-h-[85vh]">
          <h1 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
            Osnovni podaci
          </h1>

          {loading ? (
            <p>Učitavanje...</p>
          ) : (
            <div className="flex flex-col gap-8">


          <div className="mb-6 flex flex-col items-center gap-4 border-b pb-6 border-gray-200 dark:border-white/10">
            {previewUrl && (
              <img
                src={previewUrl}
                className="w-28 h-28 rounded-full object-cover border border-gray-300 dark:border-white/20 shadow"
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
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md dark:shadow-none transition-all"
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
                <label className="font-semibold text-gray-800 dark:text-gray-200">Email</label>
                <input
                  readOnly
                  value={email}
                  className="p-3 rounded-lg bg-gray-100 dark:bg-[#1a1a1a] shadow-inner border border-gray-300 dark:border-white/10 text-gray-600 dark:text-gray-300"
                />
              </div>

              <button
                onClick={handleSave}
                className="p-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all w-full mt-3 text-sm"
              >
                Sačuvaj promjene
              </button>

            </div>
          )}
        </div>
    </div>
  );
}

function Section({ label, value, onChange, type = "text" }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-medium text-sm text-gray-800 dark:text-gray-200">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="p-2.5 text-sm rounded-md border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none shadow"
      />
    </div>
  );
}