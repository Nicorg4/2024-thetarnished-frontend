import styled from "styled-components";
import colors from "../../assets/colors";

interface MainContainerProps {
    isPopupOpen: boolean;
    showTakeVacationPopup: boolean;
    showDeleteAccountConfirmation: boolean;
    showTerminateVacationPopup: boolean;
    showAvatarSelectorPopup: boolean;
}


export const MainContainer =  styled.div<MainContainerProps>`
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
        opacity: ${({ isPopupOpen, showTakeVacationPopup, showDeleteAccountConfirmation, showTerminateVacationPopup, showAvatarSelectorPopup }) =>
            isPopupOpen || showTakeVacationPopup || showDeleteAccountConfirmation || showTerminateVacationPopup || showAvatarSelectorPopup ? 1 : 0
        };
        transition: opacity 0.3s ease;
        pointer-events: none;
        backdrop-filter: blur(5px);        
    }
`

export const Content = styled.div`
    width: 90% ;
    height: 100% ;
    margin-left: 100px;
    display: flex ;
    align-items: center ;
    justify-content: center;

    @media (max-width: 1000px){
        margin-left: 0;
        width: 100% ;
    }
`

export const ProfileCard = styled.div`
    position: relative;
    width: 800px;
    height: 90%;
    background-color: ${colors.secondary};
    display: flex;
    flex-direction: column;
    align-items: right;
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;

    @media (max-width: 1000px){
        width: 100%;
        height: 900px;
    }
`

export const UserInfo = styled.div`
    display: flex;
    flex-direction: column;
    width: 90%;
    margin: auto;
    margin-top: 100px;
    gap: 15px;
    box-sizing: border-box;
    padding-bottom: 30px;
    border-bottom: 1px solid ${colors.primary};
    margin-bottom: 15px;
`

export const UserName = styled.h1`
    color: ${colors.primary};
    margin-bottom: 0px;
    flex-wrap: nowrap;
    font-size: 24px;
    margin-top: 0;

    @media (max-width: 600px){
        font-size: 30px;
    }
`

export const UserData = styled.h2`
    color: ${colors.primary};
    font-size: 20px;
    font-weight: lighter;
    margin: 0;
`

export const UserRole = styled.div`
    display: flex;
    align-items: center;
    justify-content: start;
    gap: 10px;
    overflow-x: auto;
    white-space: nowrap;
    padding: 10px;
    color: ${colors.primary};
`;

export const Role = styled.div`
    display: flex;
    padding: 10px;
    background-color: ${colors.primary};
    border-radius: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap; 
    text-overflow: auto;
`;

export const UserSubjects = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
`;

export const Subject = styled.span`
  background-color: ${colors.secondary};
  color: ${colors.primary};
  border: 1px solid ${colors.primary};
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
`;

export const CardButtons = styled.div`
    display: flex;

    @media (max-width: 1000px){
        flex-direction: column;
        width: 200px;
    }
`

export const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: ${colors.secondary} ;
    border-radius: 30px ;
    width: 100%;
    @media (max-width: 550px){
        width: 90% ;
    }
`

export const FormTitle = styled.h2`
    color: ${colors.primary};
`

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    z-index: 1;
    width: 90%;
    align-items: center;
    justify-content: center;
`;
export const InputText = styled.label`
    font-size: 16px;
    color: ${colors.text};
    margin-bottom: 5px;
    width: 60%;  
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
    width: 60%;

    &:focus {
        box-shadow: 0 0 5px ${colors.primary};
    }
`;

export const DeleteAccountButtonsContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: 30px;
`

export const ButtonsContainer = styled.div`
    position: absolute;
    display: flex;
    bottom: 20px;
    right: 20px;
    align-items: center;
    justify-content: center;
`

export const PasswordInput = styled.input`
    width: 90%;
    padding: 10px;
    background: ${colors.secondary};
    border: 1px solid ${colors.primary};
    border-radius: 5px;
    font-size: 16px;
    color: ${colors.primary};
`

export const VacationButtonContainer = styled.div`
    position: absolute ;
    top: 20px;
    right: 20px;
`
interface VacationButtonProps {
    important?: boolean;
}

export const VacationButton = styled.button<VacationButtonProps>`
    background-color: ${(props) => (props.important ? `${colors.important}` : `${colors.secondary}`)};
    color: ${colors.primary};
    border: none;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    border-radius: 10px;
    padding: 15px;
    font-size: 1.2rem;
    display: flex;
    justify-content: center;
    align-items: center ;

    &:hover{
        opacity: 0.8;
        background-color: #fff;
    }
`

export const CalendarContainer = styled.div`
    width: 100%;
    align-items: center;
    justify-content: center;
`

export const ProfileCover = styled.div`
    min-height: 200px;
    background-color: ${colors.primary};
    width: 100%;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
`

export const BadgesContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 90%;
    margin: auto;
    margin-top: 0px;
    box-sizing: border-box;
`;

export const BadgeTitle = styled.h2`
    color: ${colors.primary};
    margin: 0;
    margin-bottom: 10px;
    font-size: 20px;
`

export const Badges = styled.div`
    display: flex;
    gap: 20px;
`

export const Badge = styled.img`
    width: 70px;
    height: 70px;
    border-radius: 10px;
    transition: transform 0.2s;

    &:hover {
        transform: scale(1.1);
    }
`;

interface BadgeProps {
    visible?: boolean;
}

export const BadgeInfo = styled.div<BadgeProps>`
    position: absolute;
    top: -80px;
    left: 50%;
    width: 200px;
    z-index: 1;
    pointer-events: none;
    background-color: white;
    color: ${colors.primary};
    border: 1px solid #ccc;
    padding: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    display: ${({ visible }) => (visible ? 'flex' : 'none')};
    flex-direction: column;
    border-radius: 10px;
`;

export const BadgeName = styled.h3`
    margin-bottom: 5px;
    margin-top: 5px;
`

export const BadgeDescription = styled.p`
    margin: 0;
`

export const CheckmarkIcon = styled.div`
    position: absolute;
    top: 10%;
    right: 20%;
    color: ${colors.primary};
    font-size: 3rem;
    font-weight: bold;
`

export const EditIcon = styled.div`
    position: absolute;
    top: 15%;
    right: 20%;
    color: ${colors.secondary};
    font-size: 5rem;
    font-weight: bold;
    display: none;
    pointer-events: none;
    opacity: 0.5;
`

export const UserImage = styled.img`
  width: 152px;
  height: 152px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;

  &:hover {
    cursor: pointer;
    opacity: 0.95;
    transition: opacity 0.1s ease;
  }
`;

export const AvatarContainer = styled.div`
    border-radius: 100%;
    &:hover ${EditIcon} {
        display: block;
    }

`