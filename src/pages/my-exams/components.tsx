import styled, { keyframes } from "styled-components";
import colors from "../../assets/colors";

interface MainContainerProps {
    isPopupOpen: boolean;
}

export const MainContainer = styled.div<MainContainerProps>`
    height: 100vh ;
    width: 100vw ;
    display: flex;
    align-items: center ;
    background: rgb(43,84,52);
    background: radial-gradient(circle, rgba(43,84,52,1) 0%, rgba(15,41,46,1) 92%);

    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.5);
        z-index: 999;
        opacity: ${({ isPopupOpen }) => (isPopupOpen ? 1 : 0)};
        transition: opacity 0.3s ease;
        pointer-events: none;
        backdrop-filter: blur(5px);      
    }

    @media (max-width: 1000px){
        padding-bottom: 35px;
        align-items: center;
        justify-content: center;
    }
`

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const Content = styled.div`
    width: 90% ;
    height: 80% ;
    margin-left: 100px;
    display: flex ;
    flex-direction: column;
    align-items: center ;
    background-color: ${colors.secondary};
    padding: 30px 20px 70px 20px;
    margin-left: 150px;
    margin-right: 50px;
    border-radius: 10px;
    animation: ${slideIn} 0.2s ease-out forwards;
    position: relative;

    @media (max-width: 1000px){
        margin-left: 0;
        margin-right: 0px;
        margin-left: 0px;
        margin-top: 100px;
    }
`

export const ExamCard = styled.div`
    background-color: ${colors.secondary};
    color: ${colors.primary};
    max-width: 350px;
    padding: 1.5rem;
    border-radius: 16px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    transition: all 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    margin: 20px;

    &:hover {
        transform: translateY(-8px);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.25);
        z-index: 5;
    }
`;

export const ExamTitle = styled.h3`
    font-size: 1.8rem;
    margin-bottom: 1rem;
    color: ${colors.primary};
    font-weight: 600;
`;

export const ExamInfo = styled.p`
    font-size: 1.1rem;
    margin-bottom: 0.8rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: ${colors.primary}cc;
`;

export const NoExamsMessage = styled.div`
    text-align: center;
    color: ${colors.primary};
    font-size: 1.5rem;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    backdrop-filter: blur(5px);
`;


export const CardsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    height: 100%;

`

export const PageNumber = styled.span`
    color: ${colors.primary};
    font-weight: 400;
`

export const ButtonsContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
`

export const PageTitle = styled.h1`
    color: ${colors.primary};
    width: 100%;
    margin: 0px;
    font-weight: 300;

    @media (max-width: 550px){
        font-size: 2.3rem;
  }
`