import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { Content, MainContainer, NotificationContainer, NotificationIcon, NotificationMessage } from './components';
import { InteractionBlocker } from '../../components/interaction-blocker/components';
import { AnimatedLoadingLogo } from '../../components/animated-loading-logo/components';
import SimplifiedLogo from "../../assets/Logo transparent.png";
import { IoCheckmarkCircleOutline, IoCloseCircleOutline  } from "react-icons/io5";
import Logo from '../../components/top-down-logo';
import { useAuth } from '../../auth/useAuth';


const ClassConfirm = ({ mode }: { mode: string }) => {    
    const [isLoading, setIsLoading] = React.useState(true);
    const URL = import.meta.env.VITE_API_URL;
    const { reservationId, teacherId } = useParams();
    const [message, setMessage] = React.useState('');
    const [isConfirmed, setIsConfirmed] = React.useState(false);
    const { user } = useAuth();

    useEffect(() => {
        setIsLoading(true);
        const confirmClass = async () => {
            try{
                const reponse = await fetch(`${URL}reservation/confirm-reservation/${reservationId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': 'true',
                        'Authorization': `Bearer ${user?.token}`,
                    },
                    body: JSON.stringify({
                        teacher_id: teacherId,
                    })
                });

                if (!reponse.ok) {
                    throw new Error('Failed to confirm class');
                }
                setMessage('Class confirmed!');
                setIsConfirmed(true);
                setIsLoading(false);
            }catch(error){
                setMessage('Failed to confirm class, try again later.');
                setIsLoading(false);
                console.error(error);
            }
        }
        const rejectClass = async () => {
            try{
                const reponse = await fetch(`${URL}reservation/reject/${reservationId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': 'true',
                        'Authorization': `Bearer ${user?.token}`,
                    },
                });

                if (!reponse.ok) {
                    throw new Error('Failed to reject class');
                }
                setMessage('Class rejected succesfully!');
                setIsConfirmed(true);
                setIsLoading(false);
            }catch(error){
                setMessage('Failed to reject class, try again later.');
                setIsLoading(false);
                console.error(error);
            }
        }
        if (mode === 'confirm' && reservationId && teacherId && user?.token) {
            confirmClass();
        } else {
            rejectClass();
        }
    }, [URL, mode, reservationId, teacherId, user?.token]);
    
    return (
        <MainContainer>
            <Logo/>
            <Content>
                {isLoading ? (
                    <InteractionBlocker><AnimatedLoadingLogo src={SimplifiedLogo}/></InteractionBlocker>
                ) : (
                    <>
                    <NotificationContainer>
                        <NotificationMessage>{message}</NotificationMessage>
                        <NotificationIcon>{isConfirmed ? (<IoCheckmarkCircleOutline className="svg" />) : (<IoCloseCircleOutline className="svg" />)}</NotificationIcon>
                    </NotificationContainer>
                    <p>You may now leave this page.</p>
                    </>
                )}
            </Content>
        </MainContainer>
    )
}

export default ClassConfirm