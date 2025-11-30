"use client";

import { useState } from "react";
import styled from "styled-components";
import { supabase } from "@/lib/supabaseClient";

export default function VerifyEmailPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const resendEmail = async () => {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    const email = userData.user?.email;

    if (!email) {
      alert("❌ Email nije pronađen.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      alert("❌ " + error.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  };

  return (
    <Wrapper>
      <Card>
        <h1>Provjerite vašu e-mail adresu 📩</h1>
        <p>
          Poslali smo vam verifikacijski link. Molimo otvorite inbox i potvrdite svoj nalog.
        </p>

        <p style={{ marginTop: "10px", color: "#1089d3" }}>
          Ako niste dobili email, provjerite spam/promotions.
        </p>

        <ResendButton disabled={loading} onClick={resendEmail}>
          {loading ? "Slanje..." : "Pošalji ponovo"}
        </ResendButton>

        {sent && <SuccessMsg>Email ponovo poslan ✔️</SuccessMsg>}
      </Card>
    </Wrapper>
  );
}

// ---------------- STYLING ----------------

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f8f9fd;
`;

const Card = styled.div`
  width: 450px;
  background: #fff;
  padding: 35px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 20px 40px -10px rgba(16, 137, 211, 0.2);

  h1 {
    color: #1089d3;
    font-size: 24px;
    margin-bottom: 10px;
  }

  p {
    color: #3a4e6f;
    font-size: 16px;
    line-height: 1.5;
  }
`;

const ResendButton = styled.button`
  margin-top: 25px;
  padding: 12px 20px;
  background: #1089d3;
  color: #fff;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background: #0b6ca8;
  }
`;

const SuccessMsg = styled.div`
  margin-top: 15px;
  color: #0c9a4a;
  font-weight: bold;
`;
