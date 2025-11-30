"use client";

import ProfileCardFront from "./ProfileCardFront";
import ProfileCardBack from "./ProfileCardBack";
import { useState } from "react";

export default function ProfileCard({ type, data }) {
  const [showBack, setShowBack] = useState(false);

  const safeData = data || {};

  return (
    <div onClick={() => setShowBack(!showBack)}>
      {showBack ? (
        <ProfileCardBack type={type} data={safeData} />
      ) : (
        <ProfileCardFront type={type} data={safeData} />
      )}
      
    </div>
  );
}

// ------------------- STYLES -------------------

// const CardContainer = styled.div`
//   width: 380px;
//   height: 520px;
//   perspective: 1200px;
//   cursor: pointer;
// `;

// const Inner = styled.div<{ flip: boolean }>`
//   width: 100%;
//   height: 100%;
//   position: relative;
//   transition: transform 0.7s ease;
//   transform-style: preserve-3d;
//   transform: ${({ flip }) => (flip ? "rotateY(180deg)" : "rotateY(0deg)")};
// `;

// const Front = styled.div`
//   position: absolute;
//   width: 100%;
//   height: 100%;
//   backface-visibility: hidden;
// `;

// const Back = styled(Front)`
//   transform: rotateY(180deg);
// `;