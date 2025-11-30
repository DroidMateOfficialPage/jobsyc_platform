"use-client";

// Switch.tsx

import React from 'react';
import styled from 'styled-components';

const BackButton: React.FC = () => {
  return (
    <StyledWrapper>
      <div className="comment-react">
        <button>  
            <svg width="800" height="800" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_179_2)">
                    <path d="M166.667 366.667V400C166.667 528.667 271.334 633.333 400 633.333C528.667 633.333 633.334 528.667 633.334 400C633.334 271.333 528.667 166.667 400 166.667H288.967L346.867 95.0334L295.034 53.1167L176.284 200L295.034 346.883L346.867 304.967L288.967 233.333H400C491.9 233.333 566.667 308.1 566.667 400C566.667 491.9 491.9 566.667 400 566.667C308.1 566.667 233.334 491.9 233.334 400V366.667H166.667Z" fill="#1C788D"/>
                </g>
                <defs>
                    <clipPath id="clip0_179_2">
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
    background-color: #C8F3FD;
    border-radius: 50%;
    scale: 0.8;
    width: 70px;
    height: 70px;   
    border: 1px solid rgba(87, 184, 206, 0.5);
  }

  .comment-react button {
    width: 35px;
    height: 35px;
    top: 12px;
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
    background-color: rgba(87, 184, 206);
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
    fill: rgba(87, 184, 206);
  }

  .comment-react button:hover svg path {
    stroke: rgba(87, 184, 206);
    fill: rgba(87, 184, 206);
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

export default BackButton;