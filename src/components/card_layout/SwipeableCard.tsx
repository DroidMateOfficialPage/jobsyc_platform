"use client";

import { useRef, useState } from "react";
import styled from "styled-components";

export default function SwipeableCard({ profile, card, onSwipe, index, disableSwipe = false }) {
// DISABLE SWIPE MODE (back side of card)
if (disableSwipe) {
  return (
  <div
    className="w-full h-full overflow-y-scroll touch-pan-y"
    style={{ borderRadius: 18 }}
  >
    {card}
  </div>
);
}

  const cardRef = useRef(null);

  // Držimo trenutnu poziciju i rotaciju
  const [pos, setPos] = useState({ x: 0, y: 0, rot: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [badge, setBadge] = useState(null); // ✔️ ❌ ⭐
  const [isGone, setIsGone] = useState(false);

  const startRef = useRef({ x: 0, y: 0 });

  // -----------------------------
  // START DRAG
  // -----------------------------
  const handleStart = (e) => {
    setIsDragging(true);

    const touch = e.touches?.[0];
    startRef.current.x = touch ? touch.clientX : e.clientX;
    startRef.current.y = touch ? touch.clientY : e.clientY;
  };

  // -----------------------------
  // DRAGGING
  // -----------------------------
  const handleMove = (e) => {
    if (!isDragging) return;

    const touch = e.touches?.[0];
    const clientX = touch ? touch.clientX : e.clientX;
    const clientY = touch ? touch.clientY : e.clientY;

    const dx = clientX - startRef.current.x;
    const dy = clientY - startRef.current.y;

    // ROTACIJA KARTICE
    const rot = dx * 0.08;

    setPos({ x: dx, y: dy, rot });

    // BADGES
    if (dx > 60) setBadge("like");
    else if (dx < -60) setBadge("nope");
    else if (dy < -60) setBadge("super");
    else setBadge(null);
  };

  // -----------------------------
  // END DRAG
  // -----------------------------
  // END DRAG
const handleEnd = () => {
  setIsDragging(false);

  // console for debug
  console.log("SWIPE END POS:", pos, "ID:", profile.id);

  if (pos.x > 120) {
    vibrate();
    console.log("SWIPE: right", profile.id);
    onSwipe("right", profile.id);
    animateOff("right");
    return;
  }

  if (pos.x < -120) {
    vibrate();
    console.log("SWIPE: left", profile.id);
    onSwipe("left", profile.id);
    animateOff("left");
    return;
  }

  if (pos.y < -120) {
    vibrate();
    console.log("SWIPE: up", profile.id);
    onSwipe("up", profile.id);
    animateOff("up");
    return;
  }

  setPos({ x: 0, y: 0, rot: 0 });
  setBadge(null);
};

  // -----------------------------
  // ANIMACIJA ODLASKA
  // -----------------------------
  const animateOff = (dir) => {
    if (dir === "right") {
      setPos({ x: 1000, y: 0, rot: 40 });
      setIsGone(true);
      onSwipe(dir, profile.id);
      return;
    }
    if (dir === "left") {
      setPos({ x: -1000, y: 0, rot: -40 });
      setIsGone(true);
      onSwipe(dir);
      return;
    }
    if (dir === "up") {
      setPos({ x: 0, y: -1000, rot: 0 });
      setIsGone(true);
      onSwipe(dir);
      return;
    }
  };

  // -----------------------------
  // MOBILE HAPTIC FEEDBACK
  // -----------------------------
  const vibrate = () => {
    if (navigator.vibrate) navigator.vibrate(30);
  };

  if (isGone) return null;

  return (
    <CardWrapper
      style={{
        zIndex: 100 - index,
        transform: `translate(${pos.x}px, ${pos.y}px) rotate(${pos.rot}deg)`,
        transition: isDragging ? "none" : "0.3s ease",
      }}
      onClick={(e) => e.stopPropagation()}
      {...(!disableSwipe && {
        onMouseDown: handleStart,
        onMouseMove: handleMove,
        onMouseUp: handleEnd,
        onMouseLeave: isDragging ? handleEnd : undefined,
        onTouchStart: handleStart,
        onTouchMove: handleMove,
        onTouchEnd: handleEnd,
      })}
    >
      {/* SWIPE OVERLAY */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            badge === "nope"
              ? "rgba(255,0,0,0.12)"
              : badge === "like"
              ? "rgba(0,255,0,0.12)"
              : badge === "super"
              ? "rgba(0,100,255,0.12)"
              : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          transition: "background 0.2s ease",
          fontSize: "64px",
          fontWeight: "bold",
          color:
            badge === "nope"
              ? "rgba(255,0,0,0.35)"
              : badge === "like"
              ? "rgba(0,180,0,0.35)"
              : badge === "super"
              ? "rgba(0,100,255,0.35)"
              : "transparent",
        }}
      >
        {badge === "nope" && "✖"}
        {badge === "like" && "✔"}
        {badge === "super" && "★"}
      </div>

      {/* BADGES */}
      {badge === "like" && <BadgeLike>LIKE ✔️</BadgeLike>}
      {badge === "nope" && <BadgeNope>NOPE ❌</BadgeNope>}
      {badge === "super" && <BadgeSuper>SUPERLIKE ⭐</BadgeSuper>}

      {/* OVDJE UBACUJES TVOJ PROFILECARD */}
      {card}
      
    </CardWrapper>
  );
}

// **********************************************
// STYLES
// **********************************************
const CardWrapper = styled.div`
  position: absolute;
  width: 380px;
  height: 520px;
  top: 0;
  left: 0;
  border-radius: 20px;
  background: white;
  box-shadow: 0px 8px 25px rgba(0,0,0,0.15);
  overflow: hidden;
  cursor: grab;

  /* Mobile phones under 420px */
  @media (max-width: 420px) {
    width: 87vw;
    height: 70vh;
    max-width: 360px;
    max-height: 500px;
    border-radius: 24px;
  }

  @media (max-width: 360px) {
    width: 82vw;
    height: 65vh;
    border-radius: 20px;
  }
`;

const BadgeLike = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  background: #4bfa8a;
  color: white;
  font-size: 22px;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: bold;
`;

const BadgeNope = styled(BadgeLike)`
  left: auto;
  right: 20px;
  background: #ff5c5c;
`;

const BadgeSuper = styled.div`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #4b7bff;
  color: white;
  font-size: 22px;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: bold;
`;