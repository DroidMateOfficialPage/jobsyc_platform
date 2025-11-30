"use-client";

// Switch.tsx

import React from 'react';
import styled from 'styled-components';

const ApplyButton: React.FC = () => {
  return (
    <StyledWrapper>
      <div className="comment-react">
        <button>  
            <svg width="448" height="512" viewBox="0 0 448 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_180_2)">
                    <path d="M438.6 105.4C451.1 117.9 451.1 138.2 438.6 150.7L182.6 406.7C170.1 419.2 149.8 419.2 137.3 406.7L9.2998 278.7C-3.2002 266.2 -3.2002 245.9 9.2998 233.4C21.7998 220.9 42.0998 220.9 54.5998 233.4L160 338.7L393.4 105.4C405.9 92.8999 426.2 92.8999 438.7 105.4H438.6Z" fill="#0C5A19"/>
                </g>
                <defs>
                    <clipPath id="clip0_180_2">
                        <rect width="448" height="512" fill="white"/>
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
    background-color: #CDEBC5;
    border-radius: 50%;
    scale: 0.8;
    width: 70px;
    height: 70px;   
    border: 1px solid rgba(180, 223, 163);;
  }

  .comment-react button {
    width: 30px;
    height: 30px;
    top: 13px;
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
    background-color:rgb(28, 129, 70);
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
    fill: rgb(28, 129, 70);
  }

  .comment-react button:hover svg path {
    stroke: rgb(28, 129, 70);
    fill: rgb(28, 129, 70);
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

export default ApplyButton;