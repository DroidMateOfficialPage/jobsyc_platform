"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation"; // ✅ ispravno

const COUNTRY_CODES = [
  { label: "+387 (BiH)", value: "+387" },
  { label: "+385 (Hrvatska)", value: "+385" },
  { label: "+381 (Srbija)", value: "+381" },
  { label: "+382 (Crna Gora)", value: "+382" },
  { label: "+383 (Kosovo)", value: "+383" },
  { label: "+43 (Austrija)", value: "+43" },
  { label: "+49 (Njemačka)", value: "+49" },
  { label: "+1 (USA)", value: "+1" },
];

const EMPLOYER_SIZES = ["1-5 zaposlenih", "6-10 zaposlenih", "11-20 zaposlenih", "21-50 zaposlenih", "51-100 zaposlenih", "100+ zaposlenih"];

const RegisterPage = () => {
  const router = useRouter(); // ✅ pravi router

  const [isCandidateActive, setIsCandidateActive] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // ⭐ NOVO!

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    companyPIB: "",
    companySize: "",
    email: "",
    phonePrefix: "+387",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const registerUser = async () => {
  setIsLoading(true);

  if (formData.password !== formData.confirmPassword) {
    setIsLoading(false);
    alert("❌ Lozinke se ne poklapaju.");
    return;
  }

  const fullPhone = formData.phonePrefix + formData.phoneNumber;

  // 1) AUTH USER REGISTRATION
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (signUpError) {
    setIsLoading(false);
    alert("❌ " + signUpError.message);
    return;
  }

  const userId = signUpData.user?.id;

  // 2) INSERT INTO USERS
  const fullName = isCandidateActive
    ? `${formData.firstName} ${formData.lastName}`
    : formData.companyName;

  const { error: userInsertError } = await supabase.from("users").insert([
    {
      id: userId,
      full_name: fullName,
      email: formData.email,
      phone: fullPhone,
      profile_type: isCandidateActive ? "candidate" : "company",
    },
  ]);

  if (userInsertError) {
    setIsLoading(false);
    alert("❌ " + userInsertError.message);
    return;
  }

  // 3) INSERT PROFILE DATA
  if (isCandidateActive) {
    // CANDIDATE
    const { error: profileError } = await supabase
      .from("candidate_profile")
      .insert([
        {
          user_id: userId,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: fullPhone,
          profile_completion: 0,
          industries: [],
          work_mode: [],
          location: [],
          industry_category: [],
          skills: [],
          languages: [],
        },
      ]);

    if (profileError) {
      setIsLoading(false);
      alert("❌ " + profileError.message);
      return;
    }
  } else {
    // COMPANY
    const { error: profileError } = await supabase
      .from("company_profile")
      .insert([
        {
          user_id: userId,
          company_name: formData.companyName,
          jib: null,
          pib: formData.companyPIB || null,
          phone: fullPhone,
          website: null,
          employees: formData.companySize || null,
          industries: [],
          work_mode: [],
          location: [],
          profile_completion: 0,
          industry_category: [],
        },
      ]);

    if (profileError) {
      setIsLoading(false);
      alert("❌ " + profileError.message);
      return;
    }
  }

  alert("📧 Provjerite e-mail i potvrdite registraciju!");
  setIsLoading(false);

  router.push("/auth/verify-email");
};

  return (
    <Wrapper>
      <Heading>REGISTRUJ SE</Heading>

      {isLoading && (
        <LoadingBox>
          ⏳ Obrada podataka... Molimo sačekajte...
        </LoadingBox>
      )}

      <SwitchWrapper>
        <SwitchButton
          active={isCandidateActive}
          onClick={() => setIsCandidateActive(true)}
        >
          Kandidat
        </SwitchButton>
        <SwitchButton
          active={!isCandidateActive}
          onClick={() => setIsCandidateActive(false)}
        >
          Poslodavac
        </SwitchButton>
      </SwitchWrapper>

      <Form>
        {isCandidateActive ? (
          <>
            <Input placeholder="Ime" name="firstName" onChange={handleChange} />
            <Input placeholder="Prezime" name="lastName" onChange={handleChange} />
          </>
        ) : (
          <>
            <Input placeholder="Naziv kompanije" name="companyName" onChange={handleChange} />
            <Input placeholder="JIB" name="companyJIB" onChange={handleChange} />
            <Select name="companySize" onChange={handleChange}>
              <option value="" disabled selected hidden>Broj zaposlenih</option>
              {EMPLOYER_SIZES.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </Select>
          </>
        )}

        <PhoneRow>
          <Select
            value={formData.phonePrefix}
            onChange={(e) =>
              setFormData({ ...formData, phonePrefix: e.target.value })
            }
          >
            {COUNTRY_CODES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </Select>

          <Input
            name="phoneNumber"
            placeholder="Broj telefona"
            onChange={handleChange}
          />
        </PhoneRow>

        <Input name="email" type="email" placeholder="E-mail" onChange={handleChange} />

        <PasswordWrapper>
          <PasswordInput
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Lozinka"
            onChange={handleChange}
          />
          <Eye onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "🙊" : "🙈"}
          </Eye>
        </PasswordWrapper>

        <PasswordWrapper>
          <PasswordInput
            name="confirmPassword"
            type={showConfirmPass ? "text" : "password"}
            placeholder="Potvrdi lozinku"
            onChange={handleChange}
          />
          <Eye onClick={() => setShowConfirmPass(!showConfirmPass)}>
            {showConfirmPass ? "🙊" : "🙈"}
          </Eye>
        </PasswordWrapper>

        <SubmitButton onClick={registerUser} disabled={isLoading}>
          {isLoading ? "..." : "Dalje"}
        </SubmitButton>
      </Form>
    </Wrapper>
  );
};

export default RegisterPage;

// --------------------
// STYLING
// --------------------

const LoadingBox = styled.div`
  background: #e8f4ff;
  padding: 12px;
  border-radius: 10px;
  color: #1089d3;
  font-weight: 600;
  text-align: center;
  margin-bottom: 12px;
`;

const Wrapper = styled.div`
  width: 600px;
  max-width: 70%;
  background: #ffffff;
  border-radius: 40px;
  padding: 25px 35px;
  margin: 20px auto;
  box-shadow: 0 20px 40px -10px rgba(16, 137, 211, 0.2);

  @media (max-width: 1024px) {
    max-width: 90%;
    width: 90%;
    padding: 20px 25px;
    border-radius: 30px;
  }

  @media (max-width: 768px) {
    max-width: 95%;
    width: 95%;
    padding: 18px 20px;
    border-radius: 25px;
  }

  @media (max-width: 480px) {
    max-width: 100%;
    width: 100%;
    padding: 15px 18px;
    border-radius: 20px;
    margin: 10px auto;
  }
`;

const Heading = styled.h1`
  text-align: center;
  font-size: 26px;
  color: #1089d3;
  font-weight: 900;
`;

const SwitchWrapper = styled.div`
  display: flex;
  margin: 20px 0;
`;

const SwitchButton = styled.button<{ active?: boolean }>`
  flex: 1;
  padding: 12px;
  margin: 0 5px;
  background: ${({ active }) => (active ? "#1089d3" : "#e6e9ef")};
  color: ${({ active }) => (active ? "#fff" : "#1089d3")};
  border-radius: 10px;
  font-weight: bold;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;

  @media (max-width: 480px) {
    gap: 12px;
  }
`;

const Input = styled.input`
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #cdd9ea;
  color: #1089d3;
  font-size: 16px;

  @media (max-width: 480px) {
    font-size: 14px;
    padding: 10px;
  }
`;

const PhoneRow = styled.div`
  display: flex;
  gap: 10px;
  & select {
    width: 35%;
  }
  & input {
    width: 65%;
  }
`;

const Select = styled.select`
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #cdd9ea;
  color: #1089d3;
  font-size: 16px;
  width: 100%;
  height: 48px;
  box-sizing: border-box;

  @media (max-width: 480px) {
    font-size: 14px;
    padding: 10px;
    height: 42px;
  }
`;

const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const PasswordInput = styled.input`
  padding: 12px 45px 12px 12px;
  width: 100%;
  border-radius: 10px;
  border: 1px solid #cdd9ea;
  color: #1089d3;
  font-size: 16px;
  box-sizing: border-box;
`;

const Eye = styled.span`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 18px;
  opacity: 0.6;
  transition: 0.2s ease;

  &:hover {
    opacity: 1;
  }
`;

const SubmitButton = styled.button`
  padding: 12px;
  background: #1089d3;
  color: #fff;
  border-radius: 10px;
  font-size: 18px;
  font-weight: bold;

  @media (max-width: 480px) {
    padding: 10px;
    font-size: 16px;
  }
`;
