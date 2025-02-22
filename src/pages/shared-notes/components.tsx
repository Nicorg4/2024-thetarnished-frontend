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
        min-height: 100%;
        justify-content: center;
        padding-bottom: 35px;
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
        margin-right: 0px;
        margin-left: 0px;
        margin-top: 100px;
    }
`


export const CardWrapper = styled.div`
  width: 90%;
  margin-top: 20px;
  justify-content: space-between;
`;


export const FileCard = styled.div`
  height: 50px;
  border-radius: 8px;
  background-color: ${colors.secondary};
  border: 1px solid #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  text-align: center ;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 900px){
      margin: auto ;
      width: 180px;
      height: 125px;
  }
`;

export const FileName = styled.h3`
    font-size: 20px;
    color:${colors.primary};
    font-weight: 400;
`
export const FileType = styled.p`
    font-size: 14px;
    color:${colors.primary};

`

export const BrowserWrapper = styled.div`
    width: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px;
`;

export const Card = styled.div`
    position: relative;
    width: 100%;
    background-color: ${colors.secondary} ;
    border-radius: 8px;
    min-height: 50px;
    margin: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    display: flex;
    align-items: center;

    &:hover {
        transform: translateY(-1px);
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

export const NoSubjectsFound = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    align-items: center;
`
export const CardsContainer = styled.div`
    width: 90%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    max-height: 650px;
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
`

export const DownloadButtonContainer = styled.div`
   display: flex;
   flex-direction: row;
   align-items: center;
   justify-content: center;
`
export const DownloadButton = styled.button`
  background-color: ${colors.primary};
  color: ${colors.secondary};
  border-radius: 0px;
  border-bottom-right-radius: 5px;
  border-top-right-radius: 5px;
  height: 35px;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  padding-left: 10px;
  padding-right: 10px;
  border: none;

  &:hover {
    opacity: 0.8;
    background-color: ${colors.primary};
    border: none;
  }
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

export const NotificationContainer = styled.div`
    height: 100%;
    display: flex;
    justify-content: center ;
    align-items: center;
`