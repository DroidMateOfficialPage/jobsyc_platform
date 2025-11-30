"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { supabase } from "@/lib/supabaseClient";

const MoreCards = () => {
  const [authUser, setAuthUser] = useState(null);
  const [userType, setUserType] = useState(null); // "candidate" | "company"
  const [categories, setCategories] = useState({
    saved: [],
    liked: [],
    superliked: [],
    passed: [],
  });
  const [loading, setLoading] = useState(true);

  // --- 1. AUTH ---
  useEffect(() => {
    const loadAuth = async () => {
      const { data } = await supabase.auth.getUser();
      setAuthUser(data?.user || null);
    };
    loadAuth();
  }, []);

  // --- 2. Determine user type ---
  useEffect(() => {
    if (!authUser) return;

    const checkType = async () => {
      const id = authUser.id;

      const { data: k } = await supabase
        .from("Kandidat")
        .select("id")
        .eq("id", id)
        .single();

      if (k) setUserType("candidate");

      const { data: p } = await supabase
        .from("Poslodavac")
        .select("id")
        .eq("id", id)
        .single();

      if (p) setUserType("company");
    };

    checkType();
  }, [authUser]);

  // --- 3. Load activity lists (ids stored in arrays) ---
  useEffect(() => {
    if (!authUser || !userType) return;

    const load = async () => {
      const table = userType === "candidate" ? "Kandidat" : "Poslodavac";

      const { data: profile } = await supabase
        .from(table)
        .select("saved_profiles, liked_profiles, passed_profiles, superliked_profiles")
        .eq("id", authUser.id)
        .single();

      if (!profile) {
        setCategories({ saved: [], liked: [], superliked: [], passed: [] });
        setLoading(false);
        return;
      }

      // Extract arrays
      const savedIds = profile.saved_profiles || [];
      const likedIds = profile.liked_profiles || [];
      const passedIds = profile.passed_profiles || [];
      const superlikedIds = profile.superliked_profiles || [];

      // Fetch opposite-type profiles
      const oppositeTable = userType === "candidate" ? "Poslodavac" : "Kandidat";

      const fetchProfiles = async (ids) => {
        if (ids.length === 0) return [];
        const { data } = await supabase
          .from(oppositeTable)
          .select("*")
          .in("id", ids);
        return data || [];
      };

      setCategories({
        saved: await fetchProfiles(savedIds),
        liked: await fetchProfiles(likedIds),
        superliked: await fetchProfiles(superlikedIds),
        passed: await fetchProfiles(passedIds),
      });

      setLoading(false);
    };

    load();
  }, [authUser, userType]);

  if (loading)
    return <div style={{ padding: 20, textAlign: "center" }}>Učitavanje...</div>;

  const renderGroup = (title, items) => (
    <div>
      <h2 style={{ margin: "20px 0 10px", fontSize: 18, fontWeight: 700 }}>
        {title}
      </h2>

      {items.length === 0 && (
        <p style={{ fontSize: 14, opacity: 0.6 }}>Nema kartica za prikaz</p>
      )}

      <div className="cards-container">
        {items.map((item) => (
          <div className="card" key={item.id}>
            <img
              src={
                item.logo_file
                  ? URL.createObjectURL(new Blob([item.logo_file]))
                  : "/images/default-user.png"
              }
              className="profile-img"
            />

            <h3>
              {userType === "candidate"
                ? item.naziv_kompanije
                : item.ime + " " + item.prezime}
            </h3>

            {userType === "candidate" ? (
              <>
                <p>Lokacija: {item.lokacija?.join(", ")}</p>
                <p>Industrija: {item.industrija?.join(", ")}</p>
              </>
            ) : (
              <>
                <p>Lokacija: {item.lokacija?.join(", ")}</p>
                <p>Obrazovanje: {item.obrazovanje?.[0]}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <StyledWrapper>
      {renderGroup("Sačuvani profili ❤️", categories.saved)}
      {renderGroup("Lajkovani profili 👍", categories.liked)}
      {renderGroup("Superlajkovani profili ⭐", categories.superliked)}
      {renderGroup("Preskočeni profili ❌", categories.passed)}
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  padding: 20px;

  .cards-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .card {
    background-color: #f8f9fd;
    border: 1px solid #dbe3ec;
    border-radius: 12px;
    padding: 15px;
    text-align: center;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.04);
  }

  .profile-img {
    width: 70px;
    height: 70px;
    border-radius: 10px;
    object-fit: cover;
    margin-bottom: 10px;
  }
`;

export default MoreCards;