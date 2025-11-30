"use client";

import React, { useState } from 'react';
import styled from 'styled-components';

import { FaPlus, FaTimes, FaHome, FaBookOpen, FaEnvelope, FaChessQueen, FaBusinessTime, FaHeart } from 'react-icons/fa';
import { FaGear } from "react-icons/fa6";
import { MdSettingsSuggest, MdAddBusiness } from "react-icons/md";
import { IoIosSettings } from "react-icons/io";
import { FcHome, FcSettings } from "react-icons/fc";
import { BsFillGridFill } from "react-icons/bs";

import { usePathname } from 'next/navigation';
import path from 'path';

const Tooltip = () => {
  const [expanded, setExpanded] = useState(false);
  const pathname = usePathname();

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const menuItems = [
    {icon: <FaGear />, label: "Podešavanja", path: "/settings"},
    {icon: <FaChessQueen />, label: "Premium", path: "/premium"},
    {icon: <BsFillGridFill />, label: "Grid prikaz", path: "/"},
    {icon: <FaBookOpen />, label: "Blog", path: "/blog"},
    {icon: <FaBusinessTime />, label: "Dodaj oglas", path: "/addAd"},
    {icon: <FaHeart />, label: "Sačuvani oglasi", path: "/savedAd"},
    {icon: <FaEnvelope />, label: "Poruke", path: "/messages"},
    {icon: <FaHome />, label: "Početna", path: "/main"}
  ];

  return (
    <StyledWrapper expanded={expanded}>
      <div className="icon-toggle" onClick={toggleExpand}>
        {expanded ? <FaTimes /> : <FaPlus />}
      </div>
      {expanded && (
        <ul className="social-list example-2">
          {menuItems.map((item, index) => (
            <li className="icon-content" key={index}>
              <a data-social={item.label.toLowerCase()} aria-label={item.label} href={item.path}>
                <div className="filled" />
                {item.icon}
                <span className="icon-label">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div<{ expanded: boolean }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 999;

  .icon-toggle {
    width: 50px;
    height: 50px;
    background-color: #2A4D7A;
    border-radius: 50%;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .icon-toggle:hover {
    background-color: #6f92c7;
  }

  .social-list {
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    position: absolute;
    bottom: 60px;
    gap: 10px;
  }

  .icon-content {
    position: relative;
  }

  .icon-label {
    position: absolute;
    right: calc(100% + 5px);
    top: 50%;
    transform: translateY(-50%);
    white-space: nowrap;
    opacity: 0;
    background-color: #fff;
    color: #4d4d4d;
    padding: 5px 8px;
    border-radius: 5px;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
    transition: opacity 0.3s ease, transform 0.3s ease;
    }

  .icon-content:hover .icon-label {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
  }

  .icon-content a {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    color: #4d4d4d;
    border: solid 1px rgba(162, 162, 162, 0.3);
    background-color: #fff;
    overflow: hidden;
    transition: all 0.3s ease-in-out;
  }

  .filled {
    position: absolute;
    bottom: -100%;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #2A4D7A;
    transition: all 0.4s ease-in-out;
    border-radius: 50%;
    z-index: 0;
  }

  .icon-content a:hover .filled {
    bottom: 0;
  }

  .icon-content a:hover {
    color: #fff;
    box-shadow: 0 0 15px rgba(42, 77, 122, 0.6);
  }

  .icon-content a svg {
    position: relative;
    z-index: 1;
    width: 18px;
    height: 18px;
  }


  .filled.filledMessages {
    position: absolute;
    bottom: -100%;
    left: 0;
    width: 100%;
    height: 100%;
    background-color:rgb(100, 176, 144);
    transition: all 0.4s ease-in-out;
    border-radius: 50%;
    z-index: 0;
  }

  .icon-content a:hover .filledMessages {
    color: #fff;
    box-shadow: 0 0 15px rgba(2, 179, 67, 0.6);
  }
`;

export default Tooltip;



// FaOpenBook
// FaChessQueen
// MdOutlineWork

{/* <li className="icon-content">
            <a href="https://linkedin.com/" aria-label="LinkedIn" data-social="linkedin">
              <div className="filled" />
              <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="currentColor" viewBox="0 0 16 16">
                <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z" />
              </svg>
            </a>
            <div className="tooltip">LinkedIn</div>
          </li>
          <li className="icon-content">
            <a href="https://github.com/" aria-label="GitHub" data-social="github">
              <div className="filled" />
              <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
              </svg>
            </a>
            <div className="tooltip">GitHub</div>
          </li> */}