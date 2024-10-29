import styled, { keyframes } from "styled-components";
import colors from "../../assets/colors";
import { NavLink } from "react-router-dom";

export const TopbarContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 70px;
    background-color: ${colors.secondary};
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 999;

    @media (min-width: 1000px) {
        display: none;
    }
`

export const MenuWrapper = styled.div`
    display: flex;
    height: 100%;
    width: 100%;
    align-items: center;
    justify-content: space-between;
`

export const MenuButton = styled.button`
    font-size: 28px;
    color: ${colors.primary};
    background-color: transparent;
    width: 80px;
    padding: 10px;
    height: 100%;
    border: none;
    border-radius: 0px;
    transition: background-color 0.3s ease, opacity 0.3s ease, scale 0.3s ease;

    &:hover {
        cursor: pointer;
        background-color: transparent;
        opacity: 0.85;
        scale: 1.03;
    }
`

const expandAnimation = keyframes`
  from {
    max-height: 0;
    opacity: 0;
  }
  to {
    max-height: 100vh;
    opacity: 1;
  }
`;

interface FullMenuContainerProps {
    isOpen: boolean;
}

export const FullMenuContainer = styled.div<FullMenuContainerProps>`
  position: absolute;
  top: 63px;
  height: 100vh;
  width: 100%;
  max-height: ${({ isOpen }) => (isOpen ? '100vh' : '0')};
  overflow: hidden;
  background-color: ${colors.secondary};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 10px;
  z-index: 100;
  transition: max-height 0.3s ease-in-out, opacity 0.1s ease-in-out;
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  
  animation: ${({ isOpen }) => (isOpen ? expandAnimation : 'none')} 0.3s ease-in;
`;

export const FullMenuLink = styled(NavLink)`
    padding: 10px;
    width: 100%;
    text-align: center;
    font-size: 20px;
    color:  ${colors.primary};
    text-align: center;
    display: flex;
    align-items: center;
    gap: 10px;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: ${colors.primary};
        color: ${colors.secondary};
    }

    &.active {
        background-color: ${colors.primary};
        color: ${colors.secondary};
    }
`

export const SingOutLink = styled(NavLink)`
    position: absolute;
    background-color: ${colors.important};
    color: ${colors.secondary};
    padding: 10px;
    padding-left: 30px;
    width: 100%;
    text-align: center;
    font-size: 20px;
    color:  ${colors.secondary};
    top: 70%;
    display: flex;
    align-items: center;
    gap: 10px;
`

export const Logo = styled.img`
  height: 45px;
  margin-left: 15px;
  transition: transform 0.6s ease-in;

  &:hover {
    cursor: pointer;
    transform: rotate(360deg);
  }
`;

export const PageName = styled.p`
    color: ${colors.primary};
    font-size: 22px;
    font-weight: 500;
`

export const UserImage = styled.img`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    margin-bottom: 10px;
`