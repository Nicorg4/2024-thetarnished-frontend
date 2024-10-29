import styled, { keyframes } from "styled-components";
import colors from "../../assets/colors";


export const MainContainer = styled.div`
    height: 100vh ;
    display: flex;
    align-items: center ;
    background: rgb(43,84,52);
    background: radial-gradient(circle, rgba(43,84,52,1) 0%, rgba(15,41,46,1) 92%);

    @media (max-width: 1000px){
        flex-direction: column;
        padding-bottom: 100px;
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
    width: 80% ;
    margin-left: 150px;
    margin-right: 50px;
    border-radius: 10px;
    display: flex ;
    flex-direction: column;
    align-items: center ;
    justify-content: center;
    background-color: ${colors.secondary};
    height: 80%;
    padding: 30px 20px 70px 20px;
    color: ${colors.primary};
    animation: ${slideIn} 0.2s ease-out forwards;

    @media (max-width: 1000px){
        margin-left: 0;
        margin-right: 0;
        margin-top: 100px;
    }
`

export const ContentTitle = styled.h2`
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    color: ${colors.secondary};
    margin-bottom: 20px;
`;

export const CardsWrapper = styled.div`
    display: grid;
    grid-template-columns: 230px 230px 230px 230px 230px;
    gap: 30px;
    padding: 20px;
    border-radius: 8px;
    align-items: center;
    justify-content: center;

    @media (max-width: 800px){
      max-height: 800px;

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
    }

    @media (max-width: 1500px){
      grid-template-columns: 230px 230px 230px;
    }

    @media (max-width: 900px){
      grid-template-columns: 230px 230px;
    }
    @media (max-width: 600px){
      grid-template-columns: 100%;
      margin-bottom: 0px;
    }
`;

interface CardProps {
  isSkeleton?: boolean;
}

export const Card = styled.div<CardProps>`
  width: 200px;
  height: 150px;
  border-radius: 8px;
  background-color: ${({ isSkeleton }) => (isSkeleton ? "" : "#fff")};
  border: 1px solid ${({ isSkeleton }) => (isSkeleton ? `${colors.primary}` : "#ccc")};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: ${({ isSkeleton }) => (isSkeleton ? "none" : "0 4px 8px rgba(0, 0, 0, 0.1)")};
  cursor: ${({ isSkeleton }) => (isSkeleton ? "default" : "pointer")};
  text-align: center ;

  &:hover {
    transform: ${({ isSkeleton }) => (isSkeleton ? "none" : "translateY(-5px);")};
    box-shadow: ${({ isSkeleton }) => (isSkeleton ? "none" : "0 8px 16px rgba(0, 0, 0, 0.2);")};
  }

  @media (max-width: 900px){
      margin: auto ;
      width: 180px;
      height: 125px;
  }
`;

export const CardSubject = styled.div`
  font-size: 25px;
  color: ${colors.primary};
  font-weight: 350;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Arrow = styled.div<{ direction: string }>`
  position: absolute;
  top: 50%;
  ${({ direction }) => (direction === 'left' ? 'left: 10px;' : 'right: 10px;')}
  cursor: pointer;
  font-size: 2rem;
  user-select: none;
  transform: translateY(-50%);
  z-index: 1;

  &:hover {
    color: #333;
  }
`;

const pulse = keyframes`
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
`;

export const SkeletonCard = styled.div`
  width: 200px;
  height: 150px;
  border-radius: 8px;
  background-color: #e0e0e0;
  animation: ${pulse} 1.5s infinite;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  text-align: center;
`;