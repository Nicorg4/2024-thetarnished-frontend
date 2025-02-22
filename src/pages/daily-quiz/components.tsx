import styled, { keyframes } from "styled-components";
import colors from "../../assets/colors";

export const MainContainer = styled.div`
    height: 100vh;
    width: 100vw ;
    display: flex;
    align-items: center ;
    background: rgb(43,84,52);
    background: radial-gradient(circle, rgba(43,84,52,1) 0%, rgba(15,41,46,1) 92%);

    @media (max-width: 1000px){
        min-height: 100%;
        flex-direction: column;
        padding-bottom: 35px;
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
    margin-left: 150px;
    margin-right: 50px;
    border-radius: 10px;
    display: flex ;
    flex-direction: column;
    align-items: center ;
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

export const QuizTitle = styled.h1`
    color: ${colors.primary};
    width: 100%;
    margin: 0px;
    font-weight: 300;

    @media (max-width: 550px){
        font-size: 2.3rem;
  }
`

export const QuizInfoContainer = styled.div`
    border: 1px solid ${colors.primary};
    padding: 30px;
    border-radius: 10px;
`