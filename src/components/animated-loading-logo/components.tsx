import styled, {keyframes } from "styled-components";

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

interface AnimatedLoadingLogoProps {
  width?: string;
  height?: string;
}

export const AnimatedLoadingLogo = styled.img<AnimatedLoadingLogoProps>`
  width: ${props => props.width || "20px"};
  height: ${props => props.height || "20px"};
  animation: ${rotate} 1s ease infinite;
`;