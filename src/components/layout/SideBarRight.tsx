"use client";

import React from "react";
import styled from "styled-components";
import { FaHome, FaBlog, FaEnvelope, FaStar, FaUser } from "react-icons/fa";

const SideBar = () => {
  return (
    <StyledSidebar>
      <ul>
        <li>
          <FaHome className="icon" />
          <span>Početna</span>
        </li>
        <li>
          <FaBlog className="icon" />
          <span>Blog</span>
        </li>
        <li>
          <FaEnvelope className="icon" />
          <span>Poruke</span>
        </li>
        <li>
          <FaStar className="icon" />
          <span>Premium</span>
        </li>
        <li>
          <FaUser className="icon" />
          <span>Profil</span>
        </li>
      </ul>
    </StyledSidebar>
  );
};

const StyledSidebar = styled.div`
  position: fixed;    /* Sidebar je fiksiran */
  right: 0;
  top: 0;
  width: 80px;
  height: 100vh;
  background-color: #1e1e1e;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  padding: 20px 0;
  z-index: 1000;       /* Sidebar je iznad ostalih elemenata */

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 15px 0;
    cursor: pointer;
    transition: transform 0.2s;
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
`;

/* Glavni sadržaj da se ne preklapa sa sidebarom */
const StyledContent = styled.div`
  margin-right: 80px; /* Širina sidebar-a */
  padding: 20px;
`;

export default SideBar;