import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import colors from "../../assets/colors";

interface NavContainerProps {
    isOpen?: boolean;
}

export const NavbarContainer = styled.nav<NavContainerProps>`
    position: fixed;
    background-color: ${colors.secondary} ;
    height: 80%;
    width: ${({ isOpen }) => (isOpen ? '200px' : '60px')};
    display: flex ;
    gap: 20px;
    flex-direction:column;
    align-items: center;
    justify-content: space-between;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
    padding: 50px 20px 50px 20px;
    transition: width 0.3s ease-in-out;
    @media (max-width: 1000px) {  
        display: none;
    }
    z-index: 999;
`;

export const NavbarLink = styled(NavLink)<NavContainerProps>`
    display: flex;
    align-items: center;
    justify-content: ${({ isOpen }) => (isOpen ? 'flex-start' : 'center')};
    padding: 10px 10px;
    color: ${colors.primary};
    border-radius: 5px;
    cursor: pointer;
    font-size: 30px;
    border: none ;
    transition: background-color 0.3s, justify-content 0.3s ease;;
    gap: ${({ isOpen }) => (isOpen ? '10px' : '0')};

    &:hover {
        background-color: #b1dbb5;
        color: ${colors.primary};
    }
  
    &.active {
      background-color: #b1dbb5;
      border-radius: 5px;
    }
`;

export const LogOutNavbarLink = styled(NavLink)`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 10px;
    background-color: ${colors.important};
    color: ${colors.secondary};
    border-radius: 5px;
    cursor: pointer;
    gap: 10px;
    font-size: 30px;
    border: none ;
    transition: background-color 0.3s;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;

    &:hover {
        background-color: #ff9486;
        color: ${colors.secondary};
    }
`;

export const UserInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`

export const UserImage = styled.img`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    margin-bottom: 10px;
    cursor: pointer;
`

export const UserName = styled.p`
    font-size: 20px;
    font-weight: bold;
    color: ${colors.primary};
    margin: 0;
    overflow: hidden;
    white-space: nowrap;
`

export const UserLevel = styled.p`
    font-size: 15px;
    color: ${colors.primary};
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
`

export const MainContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`

export const MainLinksContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: left;
    justify-content: flex-start;
    gap: 10px;
`

export const LogOutLinkContainer = styled.div``

export const OpenNavBar = styled.div<NavContainerProps>`
    background-color: transparent;
    color: ${colors.primary};
    border: none;
    font-size: 20px;
    margin-top: 10px;
    margin-bottom: 10px;
    transition: transform 0.3s ease-in-out;

    &:hover{
        cursor: pointer;
        transform: ${({ isOpen }) => (isOpen ? 'translateX(-3px)' : 'translateX(3px)')};
    }
`

export const LinkName = styled.label`
    font-size: 15px;
    pointer-events: none;
`

export const UserXP = styled.progress``

interface XpTutorialProps {
    visible?: boolean;
}

export const XpTutorial = styled.div<XpTutorialProps>`
    position: absolute;
    left: 200px;
    width: 300px;
    z-index: 1;
    pointer-events: none;
    background-color: white;
    color: ${colors.primary};
    border: 1px solid #ccc;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    display: ${({ visible }) => (visible ? 'flex' : 'none')};
    flex-direction: column;
    border-radius: 10px;
`