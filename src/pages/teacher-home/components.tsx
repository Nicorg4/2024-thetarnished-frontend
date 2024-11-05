import styled, { keyframes } from 'styled-components';
import colors from '../../assets/colors';


export const MainContainer = styled.div`
    position: relative;
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    background: rgb(43,130,51);
    background: radial-gradient(circle, rgba(43,84,52,1) 0%, rgba(15,41,46,1) 92%);

    @media (max-width: 1000px){
        justify-content: center;
        min-height: 100%;
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
    position: relative;

    @media (max-width: 1000px){
        margin-left: 0;
        margin-right: 0px;
        margin-left: 0px;
        margin-top: 100px;
        width: 80% ;
        height: 70%;
    }


`

export const CardsContainer =  styled.div`
`

export const Card = styled.div`
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding-bottom: 5px;
    transition: transform 0.2s ease;
    width: 500px ;
    margin-bottom: 20px;

    &:hover {
        transform: translateY(-5px);
    }

    @media (max-width: 600px){
        width: 300px ;
        max-height: 130px;
    }
`;

export const CardHeader = styled.div`
    background-color: ${colors.primary};
    color: #fff;
    border-radius: 6px 6px 0 0;
    font-size: 18px;
    font-weight: bold;
    text-align: center ;
    padding: 0px;
`;

export const CardBody = styled.div`
    padding: 10px;
    height: 90%;
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
    width: 95%;
    align-items: right ;
    justify-content: right ;
    text-align: right;
    padding-right: 5px;
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
  height: 150px;
  border: 1px solid ${colors.primary};
  border-radius: 8px;
  background-color: transparent;
  padding-bottom: 5px;
  margin: auto;
  margin-bottom: 20px;

  @media (max-width: 600px){
        width: 90% ;
        max-height: 130px;
    }
`;

export const LoadingSkeletonCard = styled.div`
  width: 500px ;
  height: 150px;
  border-radius: 8px;
  background-color: #d3d3d3;
  animation: ${skeletonLoading} 1.5s infinite ease-in-out;
  padding-bottom: 5px;
  margin: auto;
  margin-bottom: 20px;

  @media (max-width: 600px){
        max-width: 300px ;
  }
`;

export const NoScheduleAlertContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    height: 100%;
`

export const TimeFilterButton = styled.button<{ active?: boolean }>`
  padding: 10px 20px;
  background-color: ${({ active }) => (active ? `${colors.primary}` : `${colors.secondary}`)};
  color: ${({ active }) => (active ? '#fff' : '#000')};
  border: ${({ active }) => (active ? '' : `1px solid ${colors.primary}`)};
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #cccccc;
  }

  @media (max-width: 600px){
        font-size: 0.8rem;
  }
`;


export const FilterButtonsContainer = styled.div`
    @media (max-width: 600px){
        width: 90% ;
        margin: auto;
  }   
`

export const GreetingText = styled.h1`
    color: ${colors.primary};
    width: 100%;
    margin: 0px;

    @media (max-width: 650px){
        font-size: 2.3rem;
    }
`

export const Subtitle = styled.h2`
    color: ${colors.primary};
    font-weight: 400;

    @media (max-width: 650px){
        font-size: 1rem;
    }
`

export const PageNumber = styled.span`
    color: ${colors.primary};
    font-weight: 400;
`