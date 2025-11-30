"use client";

import React, { useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

const Form = () => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMsg("❌ Pogrešan e-mail ili lozinka.");
      return;
    }

    alert("✅ Uspješna prijava!");
    window.location.href = "/home";
  };

  // 🔹 Google OAuth login
  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) setErrorMsg("❌ Greška prilikom Google prijave.");
    setLoading(false);
  };

  // 🔹 LinkedIn OAuth login
  const handleLinkedInLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "linkedin_oidc",
    });
    if (error) setErrorMsg("❌ Greška prilikom LinkedIn prijave.");
    setLoading(false);
  };

  // // 🔹 Facebook OAuth login
  // const handleFacebookLogin = async () => {
  //   setLoading(true);
  //   const { error } = await supabase.auth.signInWithOAuth({
  //     provider: "facebook",
  //   });
  //   if (error) setErrorMsg("❌ Greška prilikom Facebook prijave.");
  //   setLoading(false);
  // };

  return (
    <StyledWrapper>
      <div className="container">
        <div className="heading">Prijavi se</div>

        <form onSubmit={handleSubmit} className="form">
          <input
            required
            className="input"
            type="email"
            name="email"
            placeholder="E-mail"
          />
          <input
            required
            className="input"
            type="password"
            name="password"
            placeholder="Lozinka"
          />
          <span className="forgot-password">
            <a href="#">Zaboravljena šifra?</a>
          </span>

          {errorMsg && (
            <div style={{ color: "red", fontSize: "12px" }}>{errorMsg}</div>
          )}

          <input
            className="login-button"
            type="submit"
            value={loading ? "Učitavanje..." : "Prijavi se"}
          />
        </form>

        <div className="social-account-container">
          <span className="title">Ili se prijavi sa</span>
          <div className="social-accounts">
            <button
              className="social-button google"
              type="button"
              onClick={handleGoogleLogin}
            >
              <svg
                className="svg"
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 488 512"
              >
                <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
              </svg>
            </button>

            <button
              className="social-button linkedin"
              type="button"
              onClick={handleLinkedInLogin}
            >
              <svg
                className="svg"
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 448 512"
              >
                <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1a53.79 53.79 0 1 1 53.79-53.79 53.79 53.79 0 0 1-53.79 53.79zM447.9 448h-92.68V302.4c0-34.7-12.4-58.4-43.4-58.4-23.7 0-37.8 16-44 31.4-2.3 5.4-2.8 12.9-2.8 20.5V448h-92.78s1.2-237.1 0-261.8h92.78v37.1a92.51 92.51 0 0 1 83.6-46c61 0 106.6 39.8 106.6 125.2z" />
              </svg>
            </button>
{/* 
            <button
              className="social-button facebook"
              type="button"
              onClick={handleFacebookLogin}
            >
              <svg
                className="svg"
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 320 512"
              >
                <path d="M279.14 288l14.22-92.66h-88.91V127.92c0-25.35 12.42-50.06 52.24-50.06H293V6.26S259.61 0 225.36 0c-73.22 0-121.17 44.38-121.17 124.72v70.62H22.89V288h81.3v224h100.2V288z" />
              </svg>
            </button> */}
          </div>
        </div>

        <span className="register">
          <Link href="/register">Nemaš profil? Registruj se</Link>
        </span>
      </div>
    </StyledWrapper>
  );
};

export default Form;

const StyledWrapper = styled.div`
  .container {
    max-width: 350px;
    background: #f8f9fd;
    background: linear-gradient(0deg, rgb(255, 255, 255) 0%, rgb(244, 247, 251) 100%);
    border-radius: 40px;
    padding: 25px 35px;
    border: 5px solid rgb(255, 255, 255);
    box-shadow: rgba(133, 189, 215, 0.88) 0px 30px 30px -20px;
  }

  .heading {
    text-align: center;
    font-weight: 900;
    font-size: 30px;
    color: rgb(16, 137, 211);
  }

  .form {
    margin-top: 20px;
  }

  .form .input {
    width: 100%;
    background: white;
    border: none;
    padding: 15px 20px;
    border-radius: 20px;
    margin-top: 15px;
    box-shadow: #cff0ff 0px 10px 10px -5px;
    border-inline: 2px solid transparent;
  }

  .form .input::placeholder {
    color: rgb(170, 170, 170);
  }

  .form .input:focus {
    outline: none;
    border-inline: 2px solid #12b1d1;
  }

  .form .forgot-password {
    display: block;
    margin-top: 10px;
    margin-left: 10px;
  }

  .form .forgot-password a {
    font-size: 11px;
    color: #0099ff;
    text-decoration: none;
  }

  .form .login-button {
    display: block;
    width: 100%;
    font-weight: bold;
    background: linear-gradient(45deg, rgb(16, 137, 211) 0%, rgb(18, 177, 209) 100%);
    color: white;
    padding-block: 15px;
    margin: 20px auto;
    border-radius: 20px;
    box-shadow: rgba(133, 189, 215, 0.88) 0px 20px 10px -15px;
    border: none;
    transition: all 0.2s ease-in-out;
  }

  .form .login-button:hover {
    transform: scale(1.03);
    box-shadow: rgba(133, 189, 215, 0.88) 0px 23px 10px -20px;
  }

  .social-account-container {
    margin-top: 25px;
  }

  .social-account-container .title {
    display: block;
    text-align: center;
    font-size: 10px;
    color: rgb(170, 170, 170);
  }

  .social-account-container .social-accounts {
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 5px;
  }

  .social-account-container .social-button {
    background: linear-gradient(45deg, rgb(0, 0, 0) 0%, rgb(112, 112, 112) 100%);
    border: 5px solid white;
    padding: 5px;
    border-radius: 50%;
    width: 40px;
    aspect-ratio: 1;
    display: grid;
    place-content: center;
    box-shadow: rgba(133, 189, 215, 0.88) 0px 12px 10px -8px;
    transition: all 0.2s ease-in-out;
  }

  .social-button.linkedin {
    background: linear-gradient(45deg, #0077b5 0%, #0a66c2 100%);
  }

  .social-button.facebook {
    background: linear-gradient(45deg, #3b5998 0%, #4a69ad 100%);
  }

  .social-account-container .social-button .svg {
    fill: white;
  }

  .social-account-container .social-button:hover {
    transform: scale(1.2);
  }

  .register {
    display: block;
    text-align: center;
    margin-top: 15px;
  }

  .register a {
    text-decoration: none;
    color: #0099ff;
    font-size: 12px;
    font-weight: bold;
  }
`;
