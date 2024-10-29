import styled, { keyframes } from 'styled-components';
import colors from '../../assets/colors';


interface MainContainerProps {
    isPopupOpen: boolean;
    isCreateExamPopupOpen: boolean;
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
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 999;
        opacity: ${({ isPopupOpen, isCreateExamPopupOpen }) =>
            isPopupOpen || isCreateExamPopupOpen ? 1 : 0
        };
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
    position: relative;

    @media (max-width: 1000px){
        margin-left: 0;
        margin-right: 0px;
        margin-left: 0px;
        margin-top: 100px;
        height: 700px;
        margin-top: 150px;
        width: 80% ;
    }
`

export const CardsContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 20px;
`

export const Card = styled.div`
    background-color: #fff;
    display: flex;
    flex-direction: column;
    position: relative;
    border-radius: 8px;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    margin-bottom: 10px;
    padding-bottom: 5px;
    transition: transform 0.2s ease;
    width: 500px ;

    &:hover {
        transform: translateY(-5px);
    }

    @media (max-width: 600px){
        margin: auto ;
        margin-bottom: 20px;
        width: 330px ;
    }
`;

export const CardHeader = styled.div`
    background-color: ${colors.secondary};
    color: #fff;
    border-radius: 6px 6px 0 0;
    font-size: 18px;
    font-weight: bold;
    text-align: center ;
    padding: 0px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const HeaderText = styled.p`
    margin: 0;
`

export const CardBody = styled.div`
    padding: 10px;
`;

export const CardInfo = styled.div`
    display: flex;
    flex-direction: column ;
    justify-content: space-between;
    align-items: center;

    p {
        margin: 0;
        color: ${colors.primary};
        font-weight: bold;
        font-size: 20px;
    }
`;

export const CardFooter = styled.div`
    color: ${colors.primary};
    display: flex;
    align-items: center ;
    justify-content: flex-end;
    text-align: center;
    width: 97%;
`

const skeletonLoading = keyframes`
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

export const StaticSkeletonCard = styled.div`
  width: 500px ;
  height: 155px;
  border: 1px solid ${colors.primary};
  border-radius: 8px;
  background-color: transparent;
  margin-bottom: 10px;
  padding-bottom: 5px;

  @media (max-width: 600px){
        margin: auto ;
        margin-bottom: 20px;
        width: 330px ;
    }
`;

export const LoadingSkeletonCard = styled.div`
  width: 500px ;
  height: 150px;
  border-radius: 8px;
  background-color: #d3d3d3;
  animation: ${skeletonLoading} 1.5s infinite ease-in-out;
  margin-bottom: 20px;
  padding-bottom: 5px;

  @media (max-width: 550px){
        margin: auto ;
        margin-bottom: 20px;
        width: 300px ;
  }
`;

export const ExamButton = styled.button`
    position: absolute;
    top: 50%;
    transform: translate(-50%, -40%);
    right: 5px;
    background-color: ${colors.primary};
    color: #fff;
    border: none;
    border-radius: 50%;
    font-size: 1.5rem;
    padding: 12px;
    text-align: center;
    justify-content: center;
    align-items: center;

    &:hover {
        opacity: 0.7;
        cursor: pointer;
        transition: opacity 0.5s ease;
    }

    @media (max-width: 550px){
        padding: 5px;
    }
`

interface PaidInfoProps {
    isPaid: boolean;
}

export const PaidInfo = styled.div<PaidInfoProps>`
    padding: 5px;
    color: ${(props) => (props.isPaid ? `${colors.primary}` : `${colors.important}`)};
    font-weight: bold;
`

export const ChatButton = styled.button`
    position: absolute;
    right: -60px;
    top: 40%;
    background-color: ${colors.primary};
    font-size: 1.5rem;
    padding: 5px 10px 5px 10px;
    border: none;

    &:hover {
        opacity: 0.7;
        cursor: pointer;
        
    }

    @media (max-width: 700px){
        display: none;
    }
`

export const PageNumber = styled.span`
    color: ${colors.primary};
    font-weight: 400;
`

export const ButtonContainer = styled.div`
    width: 100%;
`
export const NotificationContainer = styled.div`
    height: 100%;
    display: flex;
    justify-content: center ;
    align-items: center;
`