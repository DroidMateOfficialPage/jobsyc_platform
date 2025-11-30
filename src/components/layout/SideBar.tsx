"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { usePathname, useRouter } from "next/navigation";
import { FaHome, FaBlog, FaEnvelope, FaStar, FaUser, FaCog, FaArrowLeft, FaArrowRight } from "react-icons/fa";

const SideBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const menuItems = [
    { icon: <FaHome />, label: "Početna", path: "/main" },
    { icon: <FaBlog />, label: "Blog", path: "/blog" },
    { icon: <FaEnvelope />, label: "Poruke", path: "/messages" },
    { icon: <FaStar />, label: "Premium", path: "/premium" },
    { icon: <FaUser />, label: "Profil", path: "/profile" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <StyledSidebar isCollapsed={isCollapsed}>
      <div className="toggle" onClick={toggleSidebar}>
        {isCollapsed ? <FaArrowRight className="arrow" /> : <FaArrowLeft className="arrow" />}
      </div>
      <ul>
        {menuItems.map((item, index) => (
          <li
            key={index}
            className={isActive(item.path) ? "active" : ""}
            onClick={() => router.push(item.path)}
          >
            <div className="icon">{item.icon}</div>
            {!isCollapsed && <span>{item.label}</span>}
          </li>
        ))}
      </ul>
      <div className="settings">
        <FaCog className="icon" />
        {!isCollapsed && <span>Postavke</span>}
      </div>
    </StyledSidebar>
  );
};

const StyledSidebar = styled.div<{ isCollapsed: boolean }>`
  position: fixed;
  left: ${({ isCollapsed }) => (isCollapsed ? "-60px" : "0")};
  top: 0;
  width: 80px;
  height: 100vh;
  background-color: #1e1e1e;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0;
  z-index: 1000;
  transition: left 0.3s;

  &:hover {
    left: 0;
  }

  .toggle {
    margin-bottom: 20px;
    cursor: pointer;
  }

  .arrow {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: auto 0;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  li {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 15px 0;
    cursor: pointer;
    transition: transform 0.2s;
  }

  li.active {
    color: #12b1d1;
  }

  li:hover {
    transform: scale(1.1);
  }

  .icon {
    font-size: 1.8rem;
  }

  span {
    font-size: 0.8rem;
    margin-top: 5px;
  }

  .settings {
    margin-top: auto;
    padding-bottom: 10px;
    cursor: pointer;
  }
`;

export default SideBar;