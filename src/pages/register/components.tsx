import styled, {css, keyframes } from "styled-components";
import colors from "../../assets/colors"
import { Link } from 'react-router-dom';

interface ButtonProps {
    secondary?: boolean;
}


export const MainContainer = styled.div`
    display: flex;
    height: 100vh;
    width: 100vw;
    align-items: center;
    justify-content: center;
    background: rgb(89,185,99);
    background: linear-gradient(143deg, rgba(89,185,99,1) 0%, rgba(38,78,42,1) 35%, rgba(15,41,46,1) 84%);
    padding: 0;
    z-index: -2;

    @media (max-width: 1200px){
      flex-direction: column;
      justify-content: flex-start;
      min-height: 100%;
    }
`

export const TopContainer = styled.div`
  background-color: ${colors.secondary};
  padding-top: 40px;
  padding-bottom: 50px;
  width: 100%;
  justify-content:center ;
  display: flex;
  max-height: 150px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (min-width: 1200px){
      display: none;
  }
`

export const LeftContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50%;
    height: 100%;
    border-top-right-radius: 50%;
    position: relative;
    background-color: ${colors.secondary};
    box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
  
    @media (max-width: 1200px){
      display: none;
    }
`
export const RightContainer = styled.div`
    position: relative ;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50%;
    height: 900px;
`

export const Image = styled.img`
    max-width: 100%;
    max-height: 100%;

    @media (max-width: 1200px){
      height: 100px;
    }

    @media (max-width: 500px){
      height: 80px;
    }
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
    padding: 30px 70px 60px 70px;
    background-color: ${colors.secondary} ;
    border-radius: 10px ;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
    animation: ${flip} .5s ease-in-out;
    backface-visibility: hidden;

    @media (max-width: 500px){
      padding: 30px 35px 60px 35px;
    }

    @media (max-width: 400px){
      max-width: 200px;
    }
`

export const AnimatedContainer = styled.div<{ isTeacher: boolean }>`
  max-height: ${props => (props.isTeacher ? '300px' : '0')};
  overflow: hidden;
  transition: max-height 0.5s ease;
`;

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
    margin-bottom: 2px;
`;

export const Input = styled.input`
    padding: 10px;
    width: 300px;
    margin-bottom: 10px;
    border: 1px solid ${colors.primary};
    border-radius: 5px;
    font-size: 16px;
    outline: none;
    background-color: ${colors.secondary};
    color: ${colors.primary} ;

    &:focus {
        box-shadow: 0 0 5px ${colors.primary};
    }

    @media (max-width: 500px){
      padding: 5px;
    }

    @media (max-width: 400px){
      width: 90%;
      max-width: 200px;
    }
`;

export const Checkbox = styled.input`
    appearance: none;
    width: 30px;
    height: 30px;
    border: 2px solid ${colors.primary};
    border-radius: 4px;
    background-color: #fff;
    cursor: pointer;
    position: relative;
    margin-left: 10px;
    transition: background-color 0.3s ease, border-color 0.3s ease;

    &:checked {
        background-color: ${colors.primary};
    }

    &:checked::after {
        content: '✔';
        color: #fff;
        font-size: 14px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    &:hover {
        background-color: #d1d1d1;
    }
`

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

export const ToggleVisibilityButton = styled.button`
    position: absolute; 
    right: 0px; 
    top: 20px; 
    transform: translateY(-50%);
    background-color: ${colors.primary};
    height: 40px;
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;

    @media (max-width: 500px){
      height: 30px;
      width: 5px;
      top: 15px;
      right: 8px; 
    }
`

export const AnimatedStars = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const twinkling = keyframes`
  0% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
`;

const floating = keyframes`
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-50px);
  }
  100% {
    transform: translateY(0);
  }
`;

interface StarProps extends React.SVGProps<SVGCircleElement> {
    delay?: string;
  }

export const Star = styled.circle<StarProps>`
  fill: white;
  opacity: 0.7;
  animation: ${twinkling} 5s infinite ease-in-out alternate, ${floating} 10s infinite ease-in-out;
  animation-delay: ${props => props.delay};
`;

export const Content = styled.div`
  position: relative;
  z-index: 2;
  color: white;
  text-align: center;
  padding-top: 20%;
`;

export const ForgotPass = styled(Link)`
  color: ${colors.primary};
  text-align: center ;
  cursor: pointer ;
  font-weight: bold ;

  &:hover{
    color: ${colors.primary};
    opacity: 0.8;
  }
`