"use client";

import styled from "styled-components";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

export default function ProfileCardFront({ type, data }: { type: "company" | "candidate"; data: any }) {
  const isCompany = type === "company";

  // vibracija
  const vibrate = (ms = 30) => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(ms);
    }
  };

  // hold-to-superlike state
  const [holdTimer, setHoldTimer] = useState<NodeJS.Timeout | null>(null);
  const [holdActive, setHoldActive] = useState(false);

  const startHold = () => {
    const timer = setTimeout(() => {
      setHoldActive(true);
      vibrate(60);
      // handleSwipe("up"); // superlike - removed as per instructions
    }, 600); // 0.6s
    setHoldTimer(timer);
  };

  const stopHold = () => {
    if (holdTimer) clearTimeout(holdTimer);
    setHoldActive(false);
  };

  // ————————————————————————
  //  FETCH CURRENT USER ID
  // ————————————————————————
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data.user?.id || null);
    });
  }, []);

  const [localSavedCount, setLocalSavedCount] = useState(data.saved_count || 0);

  const handleSaveProfile = async (e: any) => {
    e.stopPropagation();
    vibrate(40);

    if (!currentUserId || !data?.id) return;

    const tableUser = isCompany ? "Kandidat" : "Poslodavac";   // ko čuva
    const tableTarget = isCompany ? "Poslodavac" : "Kandidat"; // koga čuvamo

    try {
      // 1) FETCH USER ROW
      const { data: userRow } = await supabase
        .from(tableUser)
        .select("saved_profiles")
        .eq("id", currentUserId)
        .single();

      const userSavedList = Array.isArray(userRow?.saved_profiles)
        ? userRow.saved_profiles
        : [];

      // 1a) ADD TARGET ID TO USER'S saved_profiles[]
      if (!userSavedList.includes(data.id)) {
        await supabase
          .from(tableUser)
          .update({ saved_profiles: [...userSavedList, data.id] })
          .eq("id", currentUserId);
      }

      // 2) FETCH TARGET ROW
      const { data: targetRow } = await supabase
        .from(tableTarget)
        .select("saved_by, saved_count")
        .eq("id", data.id)
        .single();

      const targetSavedBy = Array.isArray(targetRow?.saved_by)
        ? targetRow.saved_by
        : [];

      const targetSavedCount = targetRow?.saved_count || 0;

      let updatedSavedBy = targetSavedBy;
      let newCount = targetSavedCount;

      // 2a) ADD USER TO TARGET saved_by[]
      if (!targetSavedBy.includes(currentUserId)) {
        updatedSavedBy = [...targetSavedBy, currentUserId];
        newCount = targetSavedCount + 1;
      }

      await supabase
        .from(tableTarget)
        .update({
          saved_by: updatedSavedBy,
          saved_count: newCount,
        })
        .eq("id", data.id);

      // 3) UPDATE UI
      data.saved_count = newCount;
      setLocalSavedCount(newCount);
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  // ---------------------------
  // MAPPING PODATAKA IZ BAZE
  // ---------------------------

  const title = isCompany
    ? data.company_name || "Nepoznata kompanija"
    : `${data.first_name || ""} ${data.last_name || ""} ${data.age ? "· " + data.age : ""}`.trim();

  const logoUrl = isCompany
    ? (data.logo_url
        ? data.logo_url
        : data.logo_file
          ? `data:image/png;base64,${Buffer.from(data.logo_file).toString("base64")}`
          : "/images/default-company.png")
    : (data.profile_picture_url
        ? data.profile_picture_url
        : "/images/default-user.png");

  // gornji plavi čipovi (industrija, lokacija, godina / obrazovanje)
  const topChips = [];

  if (isCompany) {
    if (data.industries?.[0]) topChips.push(data.industries[0]);
    if (data.location?.[0]) topChips.push(data.location[0]);
    if (data.profile_completion) topChips.push(data.profile_completion + "%");
  } else {
    if (data.location?.[0]) topChips.push(data.location[0]);
    if (data.education?.[0]) topChips.push(data.education[0]);
    if (data.industries?.[0]) topChips.push(data.industries[0]);
  }

  async function updateTargetProfile(action: "like" | "save" | "pass" | "super", targetId: string) {
  if (!currentUserId) return;

  const tableOfTarget = isCompany ? "Kandidat" : "Poslodavac";
  const column =
    action === "like" ? "liked_by" :
    action === "save" ? "saved_by" :
    action === "pass" ? "passed_by" :
    "super_liked_by";

  const { data: target } = await supabase
    .from(tableOfTarget)
    .select(column)
    .eq("id", targetId)
    .single();

  const list = Array.isArray(target?.[column]) ? target[column] : [];

  if (!list.includes(currentUserId)) {
    const updated = [...list, currentUserId];

    await supabase
      .from(tableOfTarget)
      .update({ [column]: updated })
      .eq("id", targetId);
  }
}

const handleLike = (e) => {
  e.stopPropagation();
  updateTargetProfile("like", data.id);
};

const handleSuperLike = (e) => {
  e.stopPropagation();
  updateTargetProfile("super", data.id);
};

const handleSave = (e) => {
  e.stopPropagation();
  updateTargetProfile("save", data.id);
};

const handlePass = (e) => {
  e.stopPropagation();
  updateTargetProfile("pass", data.id);
};

  // sekcija "Oglas" / "Profil"
  const sectionLabel = isCompany ? "Oglas" : "Profil kandidata";

  const role = isCompany
    ? data.job_title || "Pozicija nije definisana"
    : data.job_type?.[0] || "Tip zaposlenja nije definisan";

  const salaryOrType = isCompany
    ? data.salary?.[0] || "Nije navedeno"
    : data.availability?.[0] || "Dostupnost nije definisana";

  const workType = isCompany
    ? data.work_mode?.[0] || "Način rada nije definisan"
    : data.salary?.[0] || "Nije navedeno";

  const employeesText = isCompany
    ? data.employees || ""
    : ""; // Removed display of languages for candidates as per instructions

  const bottomTags: string[] = isCompany
    ? (data.skills || data.tech_stack || [])
    : (data.skills || []).slice(0, 3);

  const likes = data.likes || 0;

  return (
    <Card>
      <ScrollArea>
      {/* SAVE & LIKE BADGES */}
      <BadgeRow>
        <SaveBadge onClick={handleSaveProfile}>
          ❤️ {data.saved_count || 0}
        </SaveBadge>
        <LikeBadgeStyled>
          ⭐ {data.likes || 0}
        </LikeBadgeStyled>
      </BadgeRow>

      {/* LOGO / AVATAR */}
      <LogoWrapper>
        <LogoImage>
          <Image
            src={logoUrl}
            alt={title}
            fill
            style={{ objectFit: "contain" }}
          />
        </LogoImage>
      </LogoWrapper>

      {/* IME / NAZIV */}
      <TitleRow>
        <Title>{title}</Title>
        {data.badge_url && (
          <div style={{ display: "flex", gap: "6px", top: "4px" }}>
            <Image
              src={data.badge_url}
              alt="badge"
              width={24}
              height={24}
              style={{ objectFit: "contain" }}
            />
          </div>
        )}
        {isCompany && <Verify>✓</Verify>}
      </TitleRow>

      {/* GORNJI ČIPOVI */}
      {topChips.length > 0 && (
        <ChipRow>
          {topChips.map((chip, idx) => (
            <Chip key={idx} variant="blue">
              {chip}
            </Chip>
          ))}
        </ChipRow>
      )}

      {/* NASLOV SEKCIJE */}
      <SectionLabel>{sectionLabel}</SectionLabel>

      {/* ZELENI ČIPOVI – ROLE / PLATA / NAČIN RADA */}
      <ChipRow>
        <Chip variant="green">{role}</Chip>
        <Chip variant="green">{salaryOrType}</Chip>
        <Chip variant="green">{workType}</Chip>
      </ChipRow>

      {/* BROJ ZAPOSLENIH / JEZICI */}
      {isCompany && employeesText && <SubInfo>{employeesText}</SubInfo>}

      {/* DONJI TAGOVI – VJEŠTINE / TECH STACK */}
      {!isCompany && data.skills && data.skills.length > 0 && (
        <ChipRow>
          {data.skills.slice(0, 3).map((skill: string, idx: number) => (
            <Chip key={idx} variant="grey">
              {skill}
            </Chip>
          ))}
        </ChipRow>
      )}
      {isCompany && bottomTags && bottomTags.length > 0 && (
        <ChipRow>
          {bottomTags.slice(0, 5).map((tag: string, idx: number) => (
            <Chip key={idx} variant="grey">
              {tag}
            </Chip>
          ))}
        </ChipRow>
      )}
      </ScrollArea>
      <BottomActions>
        <ActionButtons>
          {/* ❌ NOPE */}
          <CircleButton
            color="#ff5c5c"
            onClick={() => { vibrate(); /*handleSwipe("left");*/ }}
          >
            ❌
          </CircleButton>

          {/* ⭐ SUPERLIKE (hold-to-activate) */}
          <CircleButton
            color="#4b7bff"
            onMouseDown={startHold}
            onMouseUp={stopHold}
            onMouseLeave={stopHold}
            onTouchStart={startHold}
            onTouchEnd={stopHold}
            hold={holdActive}
          >
            ⭐
          </CircleButton>

          {/* ✔ LIKE */}
          <CircleButton
            color="#4bfa8a"
            onClick={() => { vibrate(); /*handleSwipe("right");*/ }}
          >
            ✔️
          </CircleButton>
        </ActionButtons>

      <InfoText>Klikni za više informacija →</InfoText>
      </BottomActions>

    </Card>
  );
}

// ------------------------------------
// STYLES – izgled kao na screenshotu
// ------------------------------------

const Card = styled.div`
  position: relative;
  width: 380px;
  height: 520px;
  max-width: 100%;
  border-radius: 32px;
  background: #ffffff;
  @media (prefers-color-scheme: dark) {
    background: #111111;
    box-shadow:
      0 18px 40px rgba(0, 0, 0, 0.6),
      0 0 0 1px rgba(255, 255, 255, 0.06);
  }
  box-shadow:
    0 18px 40px rgba(0, 0, 0, 0.08),
    0 0 0 1px rgba(15, 23, 42, 0.02);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 28px 26px 140px;
`;

const BadgeRow = styled.div`
  position: absolute;
  top: 18px;
  right: 22px;
  display: flex;
  gap: 8px;
`;

const SaveBadge = styled.div`
  padding: 6px 10px;
  border-radius: 12px;
  background: #ffe2eb;
  color: #e0527f;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 6px 16px rgba(255, 163, 194, 0.45);
  cursor: pointer;
`;

const LikeBadgeStyled = styled.div`
  padding: 6px 10px;
  border-radius: 12px;
  background: #e3f0ff;
  color: #2563eb;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 6px 16px rgba(163, 194, 255, 0.45);
`;

const LogoWrapper = styled.div`
  margin-top: 4px;
  margin-bottom: 14px;
  display: flex;
  justify-content: center;
  width: 100%;
`;

const LogoImage = styled.div`
  position: relative;
  width: 132px;
  height: 132px;
  border-radius: 26px;
  overflow: hidden;
  background: #f5f5f7;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.12);
`;

const TitleRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 8px;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  @media (prefers-color-scheme: dark) {
    color: #f3f4f6;
  }
`;

const Verify = styled.span`
  font-size: 16px;
  color: #3b82f6;
`;

const SectionLabel = styled.div`
  margin-top: 14px;
  margin-bottom: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  align-self: flex-start;
  @media (prefers-color-scheme: dark) {
    color: #9ca3af;
  }
`;

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  width: 100%;
  margin-bottom: 8px;
`;

const Chip = styled.span<{ variant?: "blue" | "green" | "grey" }>`
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;

  ${({ variant }) => {
    switch (variant) {
      case "blue":
        return `
          background: #e3f0ff;
          color: #2563eb;
          @media (prefers-color-scheme: dark) {
            background: #1e3a8a;
            color: #93c5fd;
          }
        `;
      case "green":
        return `
          background: #e2fbe8;
          color: #15803d;
          @media (prefers-color-scheme: dark) {
            background: #064e3b;
            color: #6ee7b7;
          }
        `;
      case "grey":
      default:
        return `
          background: #f3f4f6;
          color: #4b5563;
          @media (prefers-color-scheme: dark) {
            background: #1f2937;
            color: #d1d5db;
          }
        `;
    }
  }}
`;

const SubInfo = styled.div`
  font-size: 12px;
  color: #6b7280;
  margin: 6px 0 4px;
  text-align: center;
  @media (prefers-color-scheme: dark) {
    color: #9ca3af;
  }
`;

const BottomActions = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 0;
  background: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 20px;
`;
const InfoText = styled.p`
  font-size: 10px;
  color: #5a5a5a;
  @media (prefers-color-scheme: dark) {
    color: #9ca3af;
  }
`;

const CircleButton = styled.button<{ color: string; hold?: boolean }>`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: none;
  background: ${({ color }) => color}22;
  color: ${({ color }) => color};
  font-size: 26px;
  cursor: pointer;
  transition: 
    0.2s ease transform,
    0.2s ease box-shadow,
    background 0.2s ease;

  display: flex;
  align-items: center;
  justify-content: center;

  backdrop-filter: blur(12px);
  box-shadow:
    0 6px 18px rgba(0,0,0,0.15),
    0 0 0 1px rgba(255,255,255,0.3);

  &:hover {
    transform: scale(1.12);
    box-shadow:
      0 8px 22px rgba(0,0,0,0.18),
      0 0 0 1px rgba(255,255,255,0.4);
  }

  ${({ hold }) =>
    hold &&
    `
    transform: scale(1.35);
    background: rgba(75, 123, 255, 0.2);
  `}
`;
