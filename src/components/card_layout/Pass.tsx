"use-client";

// Switch.tsx

import React from 'react';
import styled from 'styled-components';

const PassButton: React.FC = () => {
  return (
    <StyledWrapper>
      <div className="comment-react">
        <button>  
            <svg width="800" height="800" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_179_8)">
                    <path d="M598 258.4L456.4 400L598 541.6L541.6 598L400 456.8L258.8 598L202 541.2L343.2 400L202 258.8L258.8 202L400 343.2L541.6 202L598 258.4Z" fill="#85173A"/>
                </g>
                <defs>
                    <clipPath id="clip0_179_8">
                        <rect width="800" height="800" fill="white"/>
                    </clipPath>
                </defs>
            </svg>
        </button>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .comment-react {
    margin: 0;
    left: 10px;
    top: 10px;
    display: flex;
    justify-content: center;
    padding: 5px;
    background-color:rgba(245, 53, 111, 0.5);
    border-radius: 50%;
    scale: 0.8;
    width: 70px;
    height: 70px;
    border: 1px solid #f5356e;
  }

  .comment-react button {
    width: 40px;
    height: 40px;
    top: 8px;
    left: 1px;
    right: 1px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    border: 0;
    outline: none;
  }

  .comment-react button:after {
    content: "";
    width: 40px;
    height: 40px;
    position: absolute;
    left: -3px;
    top: -3px;
    background-color: #f5356e;
    border-radius: 50%;
    z-index: 0;
    transform: scale(0);
  }

  .comment-react button svg {
    position: relative;
    z-index: 9;
  }

  .comment-react button:hover:after {
    animation: ripple 0.6s ease-in-out forwards;
  }

  .comment-react button:hover svg {
    fill: #f5356e;
  }

  .comment-react button:hover svg path {
    stroke: #f5356e;
    fill: #f5356e;
  }

  .comment-react hr {
    width: 80%;
    height: 1px;
    background-color: #dfe1e6;
    margin: auto;
    border: 0;
  }

  .comment-react span {
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: auto;
    font-size: 20px;
    font-weight: 600;
    color: #707277;
    padding-right: 10px;
    text-align: center;
  }

  @keyframes ripple {
    0% {
      transform: scale(0);
      opacity: 0.6;
    }

    100% {
      transform: scale(2);
      opacity: 0;
    }
  }
`;

export default PassButton;