"use client";

import styled from "styled-components";

export default function ProfileCardBack({ type, data }) {
  const isCompany = type === "company";

  // 🔷 BUILD SECTIONS FOR COMPANY
  const companySections = [
    { title: "Industrija", chips: data?.industries || [] },
    { title: "Način rada", chips: data?.work_mode || [] },
    { title: "Lokacije", chips: data?.location || [] },
    { title: "Broj zaposlenih", text: data?.employees || "Nema podataka" },
    { title: "Website", text: data?.website || "N/A" },
    { title: "Telefon", text: data?.phone || "N/A" },
    { title: "Email", text: data?.email || "N/A" },
    { title: "Kratak opis", text: data?.description || "—" },
  ];

  // 🔷 BUILD SECTIONS FOR CANDIDATE
  const candidateSections = [
    { title: "Obrazovanje", chips: data?.education || [] },
    { title: "Radno iskustvo", chips: data?.experience || [] },
    { title: "Vještine", chips: data?.skills || [] },
    { title: "Certifikati", chips: data?.certificates || [] },
    { title: "Industrija", chips: data?.industries || [] },
    { title: "Tip zaposlenja", chips: data?.job_type || [] },
    { title: "Način rada", chips: data?.work_mode || [] },
    { title: "Lokacija", chips: data?.location || [] },
    { title: "Plata (očekivanja)", chips: data?.salary || [] },
    { title: "Dostupnost", chips: data?.availability || [] },
    { title: "Jezici", chips: data?.languages || [] },
    { title: "Portfolio", text: data?.portfolio || "N/A" },
    { title: "Kratak opis", text: data?.description || "—" },
  ];

  const sections = isCompany ? companySections : candidateSections;

  return (
    <BackWrapper>
      <Title>Detalji profila</Title>

      {sections.map((sec, index) => (
        <Section key={index}>
          <SectionTitle>{sec.title}</SectionTitle>

          {sec.chips && sec.chips.length > 0 ? (
            <ChipWrapper>
              {sec.chips.map((chip, i) => (
                <Chip key={i}>{chip}</Chip>
              ))}
            </ChipWrapper>
          ) : (
            <SectionText>{sec.text}</SectionText>
          )}
        </Section>
      ))}
    </BackWrapper>
  );
}

const BackWrapper = styled.div`
  width: 380px;
  height: 520px;
  padding: 22px;
  background: linear-gradient(180deg, #ffffff 0%, #f6f9fc 100%);
  border-radius: 24px;
  box-shadow: 0 12px 30px rgba(0,0,0,0.1);
  overflow-y: auto;
  position: relative;
  backdrop-filter: blur(6px);
  

  /* Mobile phones under 420px */
  @media (max-width: 420px) {
    width: 87vw;
    height: 90vh;
    max-width: 360px;
    max-height: 500px;
    border-radius: 24px;
  }

  @media (max-width: 360px) {
    width: 82vw;
    height: 90vh;
    border-radius: 20px;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #b3d7f5;
    border-radius: 10px;
  }

  @media (prefers-color-scheme: dark) {
    background: linear-gradient(180deg, #111111 0%, #1a1a1a 100%);
    box-shadow: 0 12px 30px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06);
  }
`;

const Title = styled.h3`
  font-size: 22px;
  margin-bottom: 18px;
  color: #1089d3;
  font-weight: 800;
  text-align: center;
  letter-spacing: -0.5px;

  @media (prefers-color-scheme: dark) {
    color: #60a5fa;
  }
`;

const Section = styled.div`
  margin-bottom: 20px;
  background: #ffffff;
  border-radius: 16px;
  padding: 14px 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  transition: 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(0,0,0,0.08);
  }

  @media (prefers-color-scheme: dark) {
    background: #1f1f1f;
    box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  }
`;

const SectionTitle = styled.h4`
  margin: 0 0 8px 0;
  font-weight: 700;
  color: #0b6ca8;
  font-size: 15px;
  text-transform: uppercase;
  letter-spacing: 0.8px;

  @media (prefers-color-scheme: dark) {
    color: #93c5fd;
  }
`;

const SectionText = styled.div`
  font-size: 14px;
  color: #4a4a4a;
  line-height: 1.4;
  padding-left: 2px;

  @media (prefers-color-scheme: dark) {
    color: #d1d5db;
  }
`;

const ChipWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Chip = styled.div`
  padding: 6px 12px;
  background: #f1f7ff;
  border-radius: 14px;
  font-size: 13px;
  font-weight: 500;
  color: #0b6ca8;
  border: 1px solid #d3e7fb;
  transition: 0.2s ease-in-out;

  &:hover {
    background: #e4f1ff;
    border-color: #b9d9f7;
  }

  @media (prefers-color-scheme: dark) {
    background: #1e293b;
    color: #93c5fd;
    border-color: #334155;
  }
`;