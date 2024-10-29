import styled, { keyframes } from "styled-components";
import colors from "../../assets/colors";

interface MainContainerProps {
    isPopupOpen: boolean;
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
        opacity: ${({ isPopupOpen }) => (isPopupOpen ? 1 : 0)};
        transition: opacity 0.3s ease;
        pointer-events: none;
        backdrop-filter: blur(5px);        
    }

    @media (max-width: 1000px){
        height: 100%;
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
    padding: 30px 20px 70px 20px;
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

export const BrowserWrapper = styled.div`
    width: 90%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    max-height: 800px;
    overflow-y: auto;
    flex-wrap: wrap;
    padding: 10px;

    ::-webkit-scrollbar {
        width: 8px;
    }

    ::-webkit-scrollbar-track {
        background: transparent;
    }

    ::-webkit-scrollbar-thumb {
        background: white;
        border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: #e0e0e0;
    }

    scrollbar-width: thin;
    scrollbar-color: ${colors.primary} transparent;

    @media (max-width: 1000px){
        width: 80%;
    }
`;


export const Card = styled.div`
    position: relative;
    width: 100%;
    background-color: ${colors.secondary} ;
    border-radius: 8px;
    height: 50px;
    margin: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    transition: background-color 0.3s;
    cursor: pointer ;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
        transform: translateY(-5px);
    }
`;

export const CardInfo = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: space-between;
    padding: 0 20px 0 20px;
    align-items: center;
`

export const Title = styled.h2`
    font-size: 1.5rem;
    font-weight: 400;
    margin: 0;
    color: ${colors.primary};

    @media (max-width: 600px){
        font-size: 1.1rem;
    }
`;

export const Instructor = styled.p`
    color: ${colors.primary};
    font-weight: 350;
`;

export const Description = styled.p`
    margin: 10px 0;
`;

export const Details = styled.p`
    font-size: 0.9rem;
    color: #555;
`;

export const ButtonsContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: auto;

    @media (max-width: 850px){
        position: relative;
        margin-top: auto;
    }
`

export const LoadingSkeletonCard = styled.div`
    width: 100%;
    height: 50px;
    background-color: #e0e0e0;
    border-radius: 8px;
    border: 1px solid ${colors.secondary} ;
    margin: 10px;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
    animation: pulse 1.5s infinite ease-in-out;
    
    @keyframes pulse {
        0% {
            background-color: transparent;
            opacity: 0.1;
        }
        50% {
            background-color: #adadad;
            opacity: 0.2;
        }
        100% {
            background-color: #939393;
            opacity: 0.3;
        }
    }
`;

export const StaticSkeletonCard = styled.div`
    width: 100%;
    height: 50px;
    border: 1px solid ${colors.primary} ;
    border-radius: 8px;
    margin: 5px;
`;

export const Select = styled.select`
    background-color: transparent ;
    border: 1px solid ${colors.primary} ;
    border-radius: 5px;
    padding: 10px;
    width: 150px;
    color: ${colors.primary};
`

export const InputsContainer = styled.div`
    display: flex ;
    width: 50%;
    gap: 10px;
    margin-bottom: 10px;
`

export const PaymentButton = styled.button`
    padding: 10px;
    border-radius: 5px;
    font-size: 14px;
    min-width: 150px;
    cursor: pointer;
    transition: background-color 0.3s;
    margin: 5px;
    background-color: #000;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
    border: none;

    &::before, &::after {
        content: '';
        position: absolute;
        top: 25px;
        left: -2px; 
        width: 40px;
        height: 5px;
        background-color: gold;
        transform: rotate(-45deg);
        transform-origin: top left;
    }

    &::after {
        top: 10px;
    }

    &:hover {
        background-color: grey;
    }
`;


export const CashFlowProLogo = styled.img`
    position: absolute;
    display: none;
    width: 30px;
    height: 30px;
    top: 5px;
    right: 5px;
`

export const CloseButton = styled.button`
    background-color: transparent;
    color: ${colors.primary};
    font-size: 1.5rem;
    border: none;
    position: absolute;
    top: 10px;
    right: 10px;

    &:hover {
        opacity: 0.7;
        background-color: transparent;
    }
`

export const LeftContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    border-right: 1px solid ${colors.primary};
    height: 100%;

    @media (max-width: 850px){
        width: 100%;
        border-right: none;
        border-bottom: 1px solid ${colors.primary};
    }
`

export const RightContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center ;
    width: 50%;
    height: 100%;

    @media (max-width: 850px){
        width: 100%;
    }
    
`

interface SlotButtonProps {
    remove?: boolean;
}

export const SlotButton = styled.button<SlotButtonProps>`
    background-color: ${props => props.remove ? colors.important : colors.primary};
    border: none;

    &:hover {
        background-color: ${props => props.remove ? colors.important : colors.primary};
        opacity: 0.8;
    }
`

export const SummaryContainer = styled.div``

export const SummaryItem = styled.div``


export const StarIconContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    margin-left: 10px;
`

export const SubjectName = styled.h2`
    margin-top: 0;
    color: ${colors.primary};
    font-weight: 300;
    font-size: 2.5rem;
    margin-bottom: 0px;
`

export const NoTeachersFound = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 5%;
`

export const NoTeachersFoundMessage = styled.p`
    color: ${colors.primary};
    font-size: 1.5rem;
    margin-top: 50%;
    font-weight: 300;
`