import styled, { keyframes } from "styled-components";
import colors from "../../assets/colors";

export const MainContainer = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    background: rgb(43,84,52);
    background: radial-gradient(circle, rgba(43,84,52,1) 0%, rgba(15,41,46,1) 92%);

    @media (max-width: 1000px) {
        padding-bottom: 80px;
        align-items: center;
        justify-content: center;
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
    width: 90%;
    height: 80%;
    margin-left: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: ${colors.secondary};
    padding: 30px 20px 70px 20px;
    margin-left: 150px;
    margin-right: 50px;
    border-radius: 10px;
    animation: ${slideIn} 0.2s ease-out forwards;
    position: relative;

    @media (max-width: 1000px) {
        margin-left: 0;
        margin-right: 0;
        margin-top: 100px;
        height: 700px;
        margin-top: 150px;
        width: 80%;
    }
`;

export const Container = styled.div`
    padding: 20px;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
`;

export const Table = styled.table`
    width: 95%;
    margin: auto;
    border-radius: 10px;
`;

export const TableHeader = styled.th`
    background-color: ${colors.primary};
    padding: 10px;
    text-align: left;
`;

export const TableRow = styled.tr`
    border-bottom: 1px solid #ddd;

    &:hover {
        background-color: #f9f9f9;
    }
`;

export const TableCell = styled.td`
    padding: 10px;
    color: ${colors.primary};
    height: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export const ScrollableContainer = styled.div`
    max-height: 580px;
    overflow-y: auto;
    width: 100%;
    border-radius: 5px;

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
`;

export const MainTitle = styled.h1`
    color: ${colors.primary};
    text-align: center;
    font-weight: 400;
    font-size: 30px;
    margin-top: 10px;

    @media (max-width: 700px){
        font-size: 1.5rem;
  }
`

export const ButtonsContainer = styled.div`
    position: absolute;
    display: flex;
    bottom: 30px;
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