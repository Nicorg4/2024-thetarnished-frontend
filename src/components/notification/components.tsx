import styled, { keyframes } from "styled-components"
import colors from "../../assets/colors"

interface NotificationContainerProps {
    alternative?: boolean;
}


export const NotificationContainer = styled.div<NotificationContainerProps>`
    padding: 50px;
    border: 3px solid ${props => props.alternative ? colors.primary : colors.secondary};
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 30px;
    max-width: 300px;
    text-align: center;
`

export const NotificationMessage = styled.h2<NotificationContainerProps>`
    font-size: 2rem;
    font-weight: 300;
    color: ${props => props.alternative ? colors.primary : colors.secondary};
`

const checkmarkAnimation = keyframes`
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

export const NotificationIcon = styled.div<NotificationContainerProps>`
    font-size: 5.7rem;
    color: ${props => props.alternative ? colors.primary : colors.secondary};
    .svg{
        animation: ${checkmarkAnimation} 0.5s ease forwards;
        transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out;
    }
   
`