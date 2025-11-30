"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import Image from "next/image";
import styled from "styled-components";
import Form from "@/components/register_and_login_form/Form";
import CardForm from "@/components/register_and_login_form/formandcard";
import RegisterPage from "@/components/register_and_login_form/register_page";

export default function Home() {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // const [user, setUser] = useState<any>(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  // 🔹 Provjera stanja prijavljenog korisnika
  // useEffect(() => {
  //   const getUser = async () => {
  //     try {
  //       const {
  //         data: { user },
  //         error,
  //       } = await supabase.auth.getUser();
  //       if (error) throw error;
  //       setUser(user);
  //     } catch (err: any) {
  //       setError(err.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   getUser();

  //   // 🔹 Listener za login/logout promjene
  //   const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
  //     setUser(session?.user ?? null);
  //   });

  //   return () => {
  //     listener.subscription.unsubscribe();
  //   };
  // }, []);

  // 🔹 Loading state
  // if (loading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error}</div>;

  return (
    <div style={styles.container}>
      {isDesktop && (
        <div style={styles.leftSide}>
          <CardForm />
        </div>
      )}
      <div style={isDesktop ? styles.rightSide : { ...styles.rightSide, flex: 1 }}>
        <RegisterPage />
      </div>
    </div>
  );

  // 🔹 Ako jeste prijavljen
  // return (
  //   <div style={styles.container}>
  //     <div style={styles.leftSide}>
  //       <h1 style={{ color: "#1089d3", fontSize: "24px" }}>
  //         Dobrodošao/la, {user.email}
  //       </h1>
  //       <button style={styles.button} onClick={() => supabase.auth.signOut()}>
  //         Odjavi se
  //       </button>
  //     </div>
  //     <div style={styles.rightSide}>
  //       <p style={{ color: "#1089d3" }}>🎉 Uspješno si povezan/a sa Supabase-om!</p>
  //     </div>
  //   </div>
  // );
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
  button: {
    padding: "10px 20px",
    margin: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};
