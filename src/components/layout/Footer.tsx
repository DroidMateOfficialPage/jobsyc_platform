"use client";

import React from 'react';
import styled from "styled-components";

const Footer = () => {
  return (
    <StyledFooter>
      <footer className="text-white p-4 text-center">
        <p>&copy; {new Date().getFullYear()} JobSyc. Sva prava zadržana.</p>
        <p className="text-xs">Napravio DroidMate</p>
      </footer>
    </StyledFooter>
  );
};

const StyledFooter = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #1e1e1e;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0.1;
  transition: opacity 0.3s ease-in-out;
  &:hover {
    opacity: 1;
  }
`;

export default Footer;