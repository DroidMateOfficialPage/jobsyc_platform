"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";

declare global {
  interface Window {
    google: any;
  }
}

// -------------------------------
// LABELS FOR AUTOCOMPLETE FIELDS
// -------------------------------
const prettyLabels = {
  industrija: "Industrija",
  nacin_rada: "Način rada",
  lokacija: "Lokacija",
};

// -------------------------------
// REGISTER COMPANY COMPONENT
// -------------------------------
const RegisterCompany = () => {
  const router = useRouter();

  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [formData, setFormData] = useState({
    full_name: "",
    pib: "",
    phone: "",
    website: "",
    industrija: [],
    nacin_rada: [],
    location_city: "",
    location_country: "",
    location_lat: null,
    location_lon: null,
    location_region: "",
  });

  const [suggestions, setSuggestions] = useState({
    industrija: [],
    nacin_rada: [],
  });

  const [locationQuery, setLocationQuery] = useState("");
  const [locationResults, setLocationResults] = useState([]);

  // -------------------------------
  // AUTH LISTENER
  // -------------------------------
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setAuthUser(session?.user ?? null);
      setAuthLoading(false);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // INITIAL LOAD
  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      setAuthUser(data?.user ?? null);
      setAuthLoading(false);
    };
    loadUser();
  }, []);

  // -------------------------------
  // LOAD JSON DATA FOR AUTOCOMPLETE
  // -------------------------------
  useEffect(() => {
    const loadJson = async (file, key) => {
      const res = await fetch(`/data/${file}`);
      const data = await res.json();
      if (key === "industrija") {
        setSuggestions((prev) => ({
          ...prev,
          [key]: data.map((item) => ({ label: item.label, category: item.category })),
        }));
      } else {
        setSuggestions((prev) => ({
          ...prev,
          [key]: data.map((item) => item.label || item.name),
        }));
      }
    };

    loadJson("industry.json", "industrija");
    loadJson("location_industry_standard.json", "nacin_rada");
  }, []);

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
        componentRestrictions: { country: ["ba", "rs", "hr", "me", "si", "at", "de"] }
      },
      (predictions) => {
        setLocationResults(predictions || []);
      }
    );
  }, [locationQuery]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleChipChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleLocationSelect = (loc) => {
    if (!window.google) return;
    const placesService = new window.google.maps.places.PlacesService(document.createElement("div"));
    placesService.getDetails(
      { placeId: loc.place_id, fields: ["geometry", "address_components"] },
      (details) => {
        const country = details.address_components.find(ac => ac.types.includes("country"))?.long_name || "";
        const city = details.address_components.find(ac => ac.types.includes("locality"))?.long_name || loc.description;
        setFormData({
          ...formData,
          location_city: city,
          location_country: country,
          location_lat: details.geometry.location.lat(),
          location_lon: details.geometry.location.lng(),
          location_region: "Europe/Balkans"
        });
        setLocationQuery(`${city}, ${country}`);
        setLocationResults([]);
      }
    );
  };

  // -------------------------------
  // UPDATE PROFILE IN SUPABASE
  // -------------------------------
  const updateProfile = async () => {
    if (!authUser) return alert("Greška: korisnik nije prijavljen.");

    // 1) Update USERS table
    const { error: userErr } = await supabase
      .from("users")
      .update({
        full_name: formData.full_name,
        phone: formData.phone,
      })
      .eq("id", authUser.id);

    if (userErr) return alert(userErr.message);

    // Prepare selectedCategories
    const selectedCategories = Array.from(new Set(formData.industrija.map(item => item.category)));

    // 2) Update company_profile
    const { error: profileErr } = await supabase
      .from("company_profile")
      .upsert({
        user_id: authUser.id,
        company_name: formData.full_name,
        pib: formData.pib,
        website: formData.website,
        industries: formData.industrija.map(item => item.label),
        industry_category: selectedCategories,
        work_mode: formData.nacin_rada,
        location_city: formData.location_city,
        location_country: formData.location_country,
        location_lat: formData.location_lat,
        location_lon: formData.location_lon,
        location_region: formData.location_region,
        profile_completion: 70,
        badge_url: "https://mxiwzeapmfevwfbltcyl.supabase.co/storage/v1/object/public/badges/founder_badge.png",
      });

    if (profileErr) return alert(profileErr.message);

    alert("Profil kompanije uspješno sačuvan!");
    router.push("/onboarding");
  };

  // -------------------------------
  // RENDER
  // -------------------------------
  return (
    <StyledContainer>
      {authLoading && <div>Učitavanje...</div>}

      {!authLoading && !authUser && <div>Niste prijavljeni.</div>}

      {!authLoading && authUser && (
        <>
          <Heading>Popunite profil vaše kompanije</Heading>

          <FormContainer>
            <FieldWrapper>
              <TextField
                name="full_name"
                placeholder="Pun naziv kompanije"
                value={formData.full_name}
                onChange={handleInputChange}
                fullWidth
              />
            </FieldWrapper>

            <FieldWrapper>
              <TextField
                name="pib"
                placeholder="PIB"
                value={formData.pib}
                onChange={handleInputChange}
                fullWidth
              />
            </FieldWrapper>

            <FieldWrapper>
              <TextField
                name="website"
                placeholder="Link web stranice"
                value={formData.website}
                onChange={handleInputChange}
                fullWidth
              />
            </FieldWrapper>

            {/* AUTOCOMPLETE GROUPS */}
            {Object.entries(suggestions).map(([key, options]) => (
              <FieldWrapper key={key}>
                <Autocomplete
                  multiple
                  options={key === "industrija" ? suggestions[key] : options}
                  getOptionLabel={key === "industrija" ? (option) => option.label : undefined}
                  value={formData[key]}
                  onChange={(e, val) => handleChipChange(key, val)}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        key={index}
                        label={key === "industrija" ? option.label : option}
                        {...getTagProps({ index })}
                        sx={{
                          backgroundColor: "#e6f0fa",
                          color: "#1089d3",
                        }}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField {...params} placeholder={prettyLabels[key]} fullWidth />
                  )}
                />
              </FieldWrapper>
            ))}

            <FieldWrapper>
              <TextField
                placeholder="Lokacija"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                fullWidth
              />
              {locationResults.length > 0 && (
                <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #ccc", marginTop: 5 }}>
                  {locationResults.map((loc, i) => (
                    <div
                      key={i}
                      style={{ padding: 10, cursor: "pointer" }}
                      onClick={() => handleLocationSelect(loc)}
                    >
                      {loc.description}
                    </div>
                  ))}
                </div>
              )}
            </FieldWrapper>

            <PrimaryButton onClick={updateProfile}>Sačuvaj podatke</PrimaryButton>
          </FormContainer>
        </>
      )}
    </StyledContainer>
  );
};

export default RegisterCompany;

// -------------------------------
// STYLES
// -------------------------------
const StyledContainer = styled.div`
  width: 600px;
  max-width: 70%;
  max-height: 75vh;
  overflow-y: auto;
  background: linear-gradient(0deg, #ffffff 0%, #f4f7fb 100%);
  border-radius: 40px;
  padding: 25px 35px;
  border: 5px solid #fff;
  box-shadow: rgba(133, 189, 215, 0.88) 0px 30px 30px -20px;
  margin: 20px auto;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    width: 90%;
    max-width: 90%;
    padding: 22px 28px;
    border-radius: 32px;
  }

  @media (max-width: 768px) {
    width: 95%;
    max-width: 95%;
    padding: 20px 22px;
    border-radius: 26px;
    max-height: 80vh;
  }

  @media (max-width: 480px) {
    width: 100%;
    max-width: 100%;
    padding: 16px 18px;
    border-radius: 22px;
    margin: 10px auto;
    max-height: 85vh;
  }
`;

const FieldWrapper = styled.div`
  width: 100%;
`;

const Heading = styled.h1`
  text-align: center;
  color: #1089d3;
  font-size: 25px;
  margin-bottom: 12px;
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 22px;
  }

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;

  @media (max-width: 480px) {
    gap: 12px;
  }
`;

const PrimaryButton = styled.button`
  padding: 12px;
  background: #1089d3;
  color: #fff;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;

  &:hover {
    background: #0b6ca8;
  }

  @media (max-width: 768px) {
    font-size: 16px;
    padding: 10px;
  }

  @media (max-width: 480px) {
    font-size: 15px;
    padding: 9px;
  }
`;