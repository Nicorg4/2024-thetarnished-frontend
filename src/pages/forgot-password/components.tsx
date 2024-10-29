import styled, {css, keyframes } from "styled-components";
import colors from "../../assets/colors"

interface ButtonProps {
    secondary?: boolean;
}


export const MainContainer = styled.div`
    display: flex;
    height: 100vh;
    width: 100vw;
    align-items: center;
    justify-content: center;
    background: rgb(43,84,52);
    background: radial-gradient(circle, rgba(43,84,52,1) 0%, rgba(15,41,46,1) 92%);
    padding: 0;
    z-index: -2;
`

export const RightContainer = styled.div`
    position: relative ;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
`

const flip = keyframes`
  0% {
    transform: rotateY(0);
  }
  100% {
    transform: rotateY(360deg);
  }
`;

export const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 30px 70px 60px 70px ;
    background-color: ${colors.secondary} ;
    border-radius: 10px ;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
    animation: ${flip} .5s ease-in-out;
    backface-visibility: hidden;

    @media (max-width: 500px){
        padding: 30px 30px 60px 30px ;
    }
`

export const FormTitle = styled.h2`
    color: ${colors.primary};
`

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    width: 100%;
    z-index: 3;
`;
export const InputText = styled.label`
    font-size: 16px;
    color: ${colors.text};
    margin-bottom: 5px;
`;

export const Input = styled.input`
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid ${colors.primary};
    border-radius: 5px;
    font-size: 16px;
    outline: none;
    background-color: ${colors.secondary};
    color: ${colors.primary} ;

    &:focus {
        box-shadow: 0 0 5px ${colors.primary};
    }
`;

const buttonStyles = css<ButtonProps>`
    padding: 10px;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
    margin: 5px;
    background-color: ${props => props.secondary ? colors.secondary : colors.primary};
    border: ${props => props.secondary ? `1px solid ${colors.primary}` : "none"};
    color: ${props => props.secondary ? colors.text : '#fff'};

    &:hover {
        border-color: ${colors.primary};
        background-color: ${props => props.secondary ? "#cccccc" : "#5b6b76"};
    }
`;

export const ButtonsContainer = styled.div`
    display: flex;  
    flex-direction: column ;
`

export const Button = styled.button<ButtonProps>`
    ${buttonStyles}
`;

export const EmailSentNotification = styled.div`
    width: 80%;
    position: absolute;
    top: 10px;
    background-color: ${colors.primary};
    color: ${colors.secondary};
    text-align: center;
    font-size: 24px;
    padding: 10px;
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
`