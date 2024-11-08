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
      padding-bottom: 80px;
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

export const ExamHeader = styled.div`
  margin-bottom: 20px;
  text-align: center;
  color: ${colors.primary};
  
  @media (max-width: 1000px) {
    padding-top: 100px; 
  }
`;

export const ExamInfo = styled.div`
    display: flex;
    gap: 20px;
    color: ${colors.primary};
`

export const QuestionList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 50%;
    max-height: 600px;
    overflow-x: auto;
    white-space: nowrap;
    scrollbar-width: thin;
    margin-bottom: 10px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;

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
    scrollbar-color: ${colors.secondary} transparent;
`;

export const QuestionCard = styled.div`
  padding: 20px;
  background-color: ${colors.secondary};
  border-radius: 8px;
  color: ${colors.primary};
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
`;

export const QuestionText = styled.h4`
  margin-bottom: 10px;
`;

export const ChoiceList = styled.ul`
  list-style: none;
  padding: 0;
`;

interface ChoiceProps {
  selected: boolean;
  showResults: boolean;
  correct: boolean;
}

export const Choice = styled.li<ChoiceProps>`
  margin-bottom: 5px;
  background-color: ${({ selected, showResults, correct }) => 
    showResults 
      ? (correct ? `${colors.light}` : (selected ? `${colors.important}` : `${colors.secondary}`))
      : (selected ? colors.primary : colors.secondary)
  };
  color: ${({ selected, showResults, correct }) => 
    showResults 
      ? (correct ? `${colors.secondary}` : (selected ? `${colors.secondary}` : `${colors.primary}`))
      : (selected ? colors.secondary : colors.primary)
  };
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: ${({ selected, showResults }) =>
      !showResults && !selected && `${colors.primary}90`};
  }
`;

export const ResultText = styled.p`
  margin-top: 10px;
  font-weight: bold;
  color: ${colors.primary};
  border: 1px solid ${colors.primary};
  padding: 2px;
  text-align: center;
`;

interface ScoreProps {
  hasPassed: boolean;
}

export const ScoreContainer = styled.div<ScoreProps>`
    padding: 10px;
    background-color: ${colors.secondary};
    color: ${({ hasPassed }) => (hasPassed ? `${colors.primary}` : `${colors.important}`)};
    text-align: center;
    border-radius: 10px;
    font-size: 1.2rem;
    font-weight: bold;
`
export const ButtonsContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
`

export const ExamContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 90%;
`