"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Form from "@/components/register_and_login_form/Form";
import CardForm from "@/components/register_and_login_form/formandcard";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
); // koristi tvoj Supabase client

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({ type: null, completeness: 0 });
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);

      if (user) {
        const { data: userRow } = await supabase
          .from("users")
          .select("profile_type")
          .eq("id", user.id)
          .single();

        setProfile({
          type: userRow?.profile_type || null,
          completeness: 0
        });
      }
    };

    getUser();

    // 🔹 Supabase listener — prati promjene login/logout stanja
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user) {
        const { data: userRow } = await supabase
          .from("users")
          .select("profile_type")
          .eq("id", session.user.id)
          .single();

        setProfile({
          type: userRow?.profile_type || null,
          completeness: 0
        });
      }
    });

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

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return (
      <div style={styles.container}>
        {isDesktop && (
          <div style={styles.leftSide}>
            <CardForm />
          </div>
        )}
        <div style={isDesktop ? styles.rightSide : { ...styles.rightSide, flex: 1 }}>
          <Form />
        </div>
      </div>
    );
  }

  if (profile.completeness >= 70) {
    if (typeof window !== "undefined") window.location.href = "/home";
    return null;
  }

  if (profile.type === "candidate") {
    if (typeof window !== "undefined") window.location.href = "/register_candidate";
    return null;
  }

  if (profile.type === "company") {
    if (typeof window !== "undefined") window.location.href = "/register_company";
    return null;
  }

  // Optionally, fallback UI if profile.type is null and not loading
  return null;
}

const styles = {
  container: {
    backgroundImage: `url('/images/backgroundws.png')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    minHeight: "100dvh",
  },
  leftSide: {
    flex: 1,
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  rightSide: {
    flex: 1,
    padding: "20px",
    backgroundColor: "#ffffff10",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    padding: "10px 20px",
    margin: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  storeLinks: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
};
