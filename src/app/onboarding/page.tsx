"use client";

import { useState } from "react";
import Image from "next/image";

// -------------------------------------
// DEMO PROFILES – 3 KANDIDATA + 3 FIRME
// -------------------------------------
const demoProfiles = [
  // EMPLOYERS
  {
    id: "demo-company-1",
    type: "company",
    company_name: "TechNova Solutions",
    logo_url: "/tutorial/company.jpg",
    industry_category: ["IT & Development"],
    location_city: "Banja Luka",
    match_score: 89,
    bio: "Inovativna IT agencija specijalizovana za razvoj digitalnih rješenja.",
  },
  {
    id: "demo-company-2",
    type: "company",
    company_name: "GreenLeaf Marketing",
    logo_url: "/tutorial/company.jpg",
    industry_category: ["Marketing & Sales"],
    location_city: "Sarajevo",
    match_score: 81,
    bio: "Digitalni marketing, growth strategije i kreativa.",
  },
  {
    id: "demo-company-3",
    type: "company",
    company_name: "BuildPro Industries",
    logo_url: "/tutorial/company.jpg",
    industry_category: ["Proizvodnja"],
    location_city: "Novi Sad",
    match_score: 77,
    bio: "Industrijska proizvodnja i modernizacija procesa.",
  },

  // CANDIDATES
  {
    id: "demo-candidate-1",
    type: "candidate",
    first_name: "Marko",
    last_name: "Jovanović",
    profile_picture_url: "/tutorial/candidate.jpg",
    industry_category: ["IT & Development"],
    skills: ["React", "Next.js", "TypeScript"],
    match_score: 94,
    bio: "Frontend developer sa 3 godine iskustva.",
  },
  {
    id: "demo-candidate-2",
    type: "candidate",
    first_name: "Sara",
    last_name: "Petrović",
    profile_picture_url: "/tutorial/candidate.jpg",
    industry_category: ["Marketing & Sales"],
    skills: ["Copywriting", "Content Creation", "Social Media"],
    match_score: 88,
    bio: "Kreativac u marketingu, fokus na društvene mreže.",
  },
  {
    id: "demo-candidate-3",
    type: "candidate",
    first_name: "Nevena",
    last_name: "Kovač",
    profile_picture_url: "/tutorial/candidate.jpg",
    industry_category: ["Biznis & Finansije"],
    skills: ["Finance", "Excel", "Data Analysis"],
    match_score: 82,
    bio: "Junior finansijski analitičar.",
  },
];

// -------------------------------------
// MAIN COMPONENT
// -------------------------------------
export default function OnboardingPage() {
  const [step, setStep] = useState(0);

  const next = () => {
    if (step < 4) setStep(step + 1);
  };

  const prev = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-[#e7f3ff] to-white dark:from-[#0d1117] dark:to-[#0b0f16] p-6">
      <div className="w-full max-w-md text-center">

        {/* -------------------- HEADER -------------------- */}
        <h1 className="text-3xl font-bold text-[#1089d3] dark:text-[#4da8ff] mb-4">
          Dobrodošli na JobSyc!
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Kratki tutorijal kako funkcioniše platforma 👇
        </p>

        {/* -------------------- SLIDES -------------------- */}
        {step === 0 && <SlideIntro next={next} />}
        {step === 1 && <SlideHowSwipe next={next} prev={prev} />}
        {step === 2 && <SlideEmployers next={next} prev={prev} />}
        {step === 3 && <SlideCandidates next={next} prev={prev} />}
        {step === 4 && <SlideDone />}
      </div>
    </div>
  );
}

// -------------------------------------
// SLIDE 1 — INTRO
// -------------------------------------
function SlideIntro({ next }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Kako funkcioniše JobSyc?</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
        JobSyc ti prikazuje profile koji najviše odgovaraju tvom profilu — koristeći
        industriju, lokaciju i način rada.
      </p>

      <button onClick={next} className="primary-btn">
        Kreni dalje →
      </button>
    </div>
  );
}

// -------------------------------------
// SLIDE 2 — HOW SWIPE WORKS
// -------------------------------------
function SlideHowSwipe({ next, prev }) {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4">Kako listati profile?</h2>

      <div className="w-64 h-80 relative mb-6">
        <div className="demo-card-animate absolute w-full h-full bg-white dark:bg-[#1b2028] dark:border-white/10 rounded-2xl shadow-xl p-5">
          <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-3">
            <Image src="/tutorial/demo_user_1.png" alt="demo" width={90} height={90} />
          </div>
          <h3 className="font-bold text-lg">Marko Jovanović</h3>
          <p className="text-gray-500 text-sm">IT & Development</p>
          <p className="text-blue-600 font-semibold mt-3">Match: 94%</p>
        </div>
      </div>

      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Prevuci lijevo da preskočiš, desno da lajkuješ, gore za superlike 🚀
      </p>

      <div className="flex justify-between w-full">
        <button onClick={prev} className="secondary-btn">← Nazad</button>
        <button onClick={next} className="primary-btn">Dalje →</button>
      </div>

      <style jsx>{`
        @keyframes swipeDemo {
          0% { transform: translateX(0) rotate(0); opacity: 1; }
          40% { transform: translateX(100px) rotate(15deg); }
          100% { transform: translateX(250px) rotate(25deg); opacity: 0; }
        }
        .demo-card-animate {
          animation: swipeDemo 2s infinite;
        }
      `}</style>
    </div>
  );
}

// -------------------------------------
// SLIDE 3 — DEMO EMPLOYERS
// -------------------------------------
function SlideEmployers({ next, prev }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Primjer poslodavaca</h2>

      <div className="flex overflow-x-auto gap-6 pb-4">
        {demoProfiles.filter(p => p.type === "company").map(profile => (
          <DemoCard key={profile.id} profile={profile} />
        ))}
      </div>

      <div className="flex justify-between mt-6">
        <button onClick={prev} className="secondary-btn">← Nazad</button>
        <button onClick={next} className="primary-btn">Dalje →</button>
      </div>
    </div>
  );
}

// -------------------------------------
// SLIDE 4 — DEMO CANDIDATES
// -------------------------------------
function SlideCandidates({ next, prev }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Primjer kandidata</h2>

      <div className="flex overflow-x-auto gap-6 pb-4">
        {demoProfiles.filter(p => p.type === "candidate").map(profile => (
          <DemoCard key={profile.id} profile={profile} />
        ))}
      </div>

      <div className="flex justify-between mt-6">
        <button onClick={prev} className="secondary-btn">← Nazad</button>
        <button onClick={next} className="primary-btn">Dalje →</button>
      </div>
    </div>
  );
}

// -------------------------------------
// SLIDE 5 — DONE
// -------------------------------------
function SlideDone() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Spremni ste!</h2>

      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Sada možete početi koristiti JobSyc i otkriti najbolje prilike!
      </p>

      <a href="/home" className="primary-btn w-full block text-center">
        Započni →
      </a>
    </div>
  );
}

// -------------------------------------
// DEMO PROFILE CARD
// -------------------------------------
function DemoCard({ profile }) {
  return (
    <div className="w-56 bg-white dark:bg-[#1a1f27] shadow-lg rounded-xl p-4 border dark:border-white/10">
      <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-3">
        <Image
          src={profile.profile_picture_url || profile.logo_url}
          alt="profile"
          width={100}
          height={100}
        />
      </div>

      <h3 className="font-semibold text-center dark:text-white">
        {profile.type === "company"
          ? profile.company_name
          : `${profile.first_name} ${profile.last_name}`}
      </h3>

      <p className="text-gray-500 dark:text-gray-400 text-center text-sm mt-1">
        {profile.industry_category[0]}
      </p>

      <p className="text-blue-600 dark:text-blue-400 text-center font-semibold mt-2">
        Match {profile.match_score}%
      </p>

      <p className="text-gray-400 dark:text-gray-500 text-xs mt-3 text-center">{profile.bio}</p>
    </div>
  );
}

// -------------------------------------
// BUTTON STYLES
// -------------------------------------
const baseBtn = `
  px-4 py-2 rounded-lg font-semibold shadow-md transition
`;

const primaryBtn = `
  ${baseBtn}
  bg-[#1089d3] text-white hover:bg-[#0a6ba1] dark:bg-[#0e6fb5] dark:hover:bg-[#0a5b95]
`;

const secondaryBtn = `
  ${baseBtn}
  bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-[#2a2f36] dark:text-gray-200 dark:hover:bg-[#3a414b]
`;