"use client";

import React, { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import CardForm from "@/components/register_and_login_form/formandcard";
import RegisterCandidate from "@/components/register_and_login_form/register_candidate";
import { useState } from "react";

export default function Home() {
  const [isDesktop, setIsDesktop] = useState(true);

  // 🔹 Ako želiš da stranica “sluša” promjene logina (nije obavezno)
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(() => {});

    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      listener.subscription.unsubscribe();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div style={styles.container}>
      {isDesktop && (
        <div style={styles.leftSide}>
          <CardForm />
        </div>
      )}
      <div style={isDesktop ? styles.rightSide : { ...styles.rightSide, flex: 1 }}>
        <RegisterCandidate />
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundImage: `url('/images/backgroundws.png')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    height: "100vh",
  },
  leftSide: {
    flex: 1,
    padding: "20px",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    alignItems: "center",
  },
  rightSide: {
    flex: 1,
    padding: "20px",
    backgroundColor: "#ffffff10",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    alignItems: "center",
  },
};
