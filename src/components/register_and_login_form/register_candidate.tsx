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


// ----------------------------------
// LABELS
// ----------------------------------

const prettyLabels = {
  skills: "Vještine",
  education: "Obrazovanje",
  experience: "Radno iskustvo",
  certificates: "Certifikati",
  industries: "Industrija",
  job_type: "Tip zaposlenja",
  work_mode: "Način rada",
  salary: "Plata",
  availability: "Dostupnost",
  languages: "Jezici",
};

// ----------------------------------
// COMPONENT
// ----------------------------------

const RegisterCandidate = () => {
  const router = useRouter();

  // AUTH
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // FORM DATA
  const [formData, setFormData] = useState({
    education: [],
    experience: [],
    skills: [],
    certificates: [],
    industries: [],
    job_type: [],
    work_mode: [],
    salary: [],
    availability: [],
    languages: [],
    portfolio: "",
    email: "",
    phone: "",
    location_city: "",
    location_country: "",
    location_lat: null,
    location_lon: null,
    location_region: "",
  });

  const [suggestions, setSuggestions] = useState({
    education: [],
    experience: [],
    skills: [],
    certificates: [],
    industries: [],
    job_type: [],
    work_mode: [],
    salary: [],
    availability: [],
    languages: [],
  });

  // New location states
  const [locationQuery, setLocationQuery] = useState("");
  const [locationResults, setLocationResults] = useState([]);

  // AUTH LISTENER
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUser(session?.user ?? null);
      setAuthLoading(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // INITIAL AUTH FETCH
  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      setAuthUser(data?.user ?? null);
      setAuthLoading(false);
    };
    loadUser();
  }, []);

  // LOAD JSON
  useEffect(() => {
    const loadJson = async (file, key) => {
      const res = await fetch(`/data/${file}`);
      const json = await res.json();
      setSuggestions(prev => ({
        ...prev,
        [key]: json.map(i => i.label || i.name),
      }));
    };

    loadJson("skills_hr.json", "skills");
    loadJson("university.json", "education");
    loadJson("professional_certifications.json", "certificates");
    loadJson("industry.json", "industries");
    loadJson("employment_type.json", "job_type");
    loadJson("location_industry_standard.json", "work_mode");
    loadJson("salary.json", "salary");
    loadJson("availability.json", "availability");
    loadJson("language.json", "languages");
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
      (preds) => setLocationResults(preds || [])
    );
  }, [locationQuery]);

  const handleChipChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleInputChange = (e) => {
    if (e.target.name === "portfolio") {
      const cleaned = e.target.value.trim();
      const formatted = cleaned.startsWith("http") ? cleaned : `https://${cleaned}`;
      setFormData({ ...formData, portfolio: formatted });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
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

  const updateProfile = async () => {
    const { error } = await supabase
      .from("candidate_profile")
      .update({ ...formData, profile_completion: 70 })
      .eq("user_id", authUser.id);

    if (error) return alert(error.message);

    alert("Profil dopunjen");
    router.push("/home");
  };

  // ---------------------------
  // RENDER
  // ---------------------------

  return (
    <StyledContainer>
      {authLoading && <div>Učitavanje...</div>}

      {!authLoading && !authUser && <div>Niste prijavljeni.</div>}

      {!authLoading && authUser && (
        <>
          <Heading>Izgradite svoj profesionalni profil</Heading>

          <FormContainer>
            {Object.entries(suggestions).map(([key, values]) => {
              if (key === "location") return null;
              return (
                <FieldWrapper key={key}>
                  <Autocomplete
                    multiple
                    
                    options={values}
                    value={formData[key]}
                    onChange={(e, val) => handleChipChange(key, val)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder={prettyLabels[key]}
                        fullWidth
                        sx={{
                          background: "white",
                          borderRadius: "10px",
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                          },
                          "& fieldset": { borderColor: "#cdd9ea" },
                          "&:hover fieldset": { borderColor: "#1089d3" },
                          "&.Mui-focused fieldset": { borderColor: "#1089d3" },
                        }}
                      />
                    )}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          key={index}
                          label={option}
                          {...getTagProps({ index })}
                          sx={{
                            backgroundColor: "#e6f0fa",
                            color: "#1089d3",
                            borderRadius: "6px",
                          }}
                        />
                      ))
                    }
                  />
                </FieldWrapper>
              );
            })}

            <FieldWrapper>
              <TextField
                placeholder="Lokacija"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                fullWidth
                sx={{
                  background: "white",
                  borderRadius: "10px",
                  "& .MuiOutlinedInput-root": { borderRadius: "10px" }
                }}
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

            <FieldWrapper>
              <TextField
                name="portfolio"
                placeholder="Portfolio link (GitHub, LinkedIn...)"
                value={formData.portfolio}
                onChange={handleInputChange}
                fullWidth
                sx={{
                  background: "white",
                  borderRadius: "10px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                  },
                }}
              />
            </FieldWrapper>

            <PrimaryButton onClick={updateProfile}>
              Sačuvaj podatke
            </PrimaryButton>
          </FormContainer>
        </>
      )}
    </StyledContainer>
  );
};

export default RegisterCandidate;

// ----------------------------------
// STYLES
// ----------------------------------

const StyledContainer = styled.div`
  width: 600px;
  max-width: 70%;
  max-height: 75vh;
  overflow-y: auto;
  background: linear-gradient(0deg, #ffffff 0%, #f4f7fb 100%);
  border-radius: 40px;
  padding: 25px 35px;
  border: 5px solid #ffffff;
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
  margin-bottom: 10px;
`;

const Heading = styled.h1`
  text-align: center;
  font-size: 25px;
  color: #1089d3;
  margin-bottom: 10px;
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