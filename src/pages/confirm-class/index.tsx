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

        const handleClassAction = async (endpoint: string, actionType: string, teacherId?: string) => {
            try {
                const headers = {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                    'Authorization': `Bearer ${user?.token}`,
                };

                const requestOptions: RequestInit = {
                    method: 'POST',
                    headers,
                    body: teacherId ? JSON.stringify({ teacher_id: teacherId }) : undefined
                };

                const response = await fetch(`${URL}${endpoint}`, requestOptions);
                const data = await response.json();

                if (!response.ok) {
                    setMessage(data.message);
                    throw new Error(`Failed to ${actionType} class`);
                }

                setMessage(`Class ${actionType} successfully!`);
                setIsConfirmed(true);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        if (reservationId && user?.token) {
            if (mode === 'confirm' && teacherId) {
                handleClassAction(`reservation/confirm-reservation/${reservationId}`, 'confirmed', teacherId);
            } else {
                handleClassAction(`reservation/reject/${reservationId}`, 'rejected');
            }
        }
    }, [URL, reservationId, teacherId, mode, user?.token]);    
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