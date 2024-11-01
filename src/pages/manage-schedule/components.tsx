import styled, { keyframes } from "styled-components";
import colors from "../../assets/colors";

interface MainContainerProps {
    isPopupOpen: boolean;
    isOnVacationPopUpOpen: boolean;
}

export const MainContainer = styled.div<MainContainerProps>`
    position: relative;
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    background: rgb(43,130,51);
    background: radial-gradient(circle, rgba(43,84,52,1) 0%, rgba(15,41,46,1) 92%);

    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 999;
        opacity: ${({ isPopupOpen, isOnVacationPopUpOpen }) => (isPopupOpen || isOnVacationPopUpOpen ? 1 : 0)};
        transition: opacity 0.3s ease;
        pointer-events: none;
        backdrop-filter: blur(5px);        
    }

    @media (max-width: 1000px){
        min-height: 100%;
        justify-content: center;
        padding-bottom: 30px;
    }
`;

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
    padding: 50px 20px 50px 20px;
    margin-left: 150px;
    margin-right: 50px;
    border-radius: 10px;
    animation: ${slideIn} 0.2s ease-out forwards;

    @media (max-width: 1000px){
        margin-left: 0;
        width: 90% ;
        margin-right: 0px;
        margin-left: 0px;
        margin-top: 100px;
    }

    @media (max-width: 800px){
        width: 80% ;
    }
`

export const ScheduleContainer = styled.div`
    width: 90%;
    height: 100%;
    display: flex;
    flex-direction: column ;
    align-items: center ;
    justify-content: center ;
`

export const TableData = styled.td`
    cursor: pointer ;
    width: 10vw;
    height: 40px ;
    text-align: center ;
    box-shadow: rgba(99, 99, 99, 0.4) 0px 2px 8px 0px;
    color: ${colors.secondary} ;
    font-size: 1.5rem ;

    @media (max-width: 500px){
        width: 50px ;
        height: 30px ;
        font-size: 15px;
    }
`
export const ButtonContainer = styled.div`
    display: flex ;
    width: 100% ;
    align-items: center ;
    justify-content: center ;
`

export const TutorialButtonContainer = styled.div`
    position: absolute;
    top: 15px;
    right: 15px;
`

export const TutorialButton = styled.button`
    background-color: transparent;
    color: ${colors.primary};
    font-size: 2.5rem;
    padding: 0px;

    &:hover{
      background-color: #cccccc;
    }
`