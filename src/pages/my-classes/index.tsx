import { useEffect, useState } from 'react';
import SideBar from '../../components/sidebar/sidebar';
import { MainContainer, Content, Card, CardHeader, CardBody, CardInfo, CardFooter, StaticSkeletonCard, ChatButton, PageNumber, NotificationContainer, PageTitle } from './components';
import { useAuth } from '../../auth/useAuth';
import Topbar from '../../components/topbar';
import { IoChatbubbleEllipses } from "react-icons/io5";
import Chat from '../chat-manager/Chat';
import Notification from '../../components/notification';
import { Button } from '../../components/main-button/components';
import { AnimatedLoadingLogo } from '../../components/animated-loading-logo/components';
import SimplifiedLogo from "../../assets/Logo transparent alt.png";
import { motion } from 'framer-motion';
import Logo from '../../components/top-down-logo';
import { GoogleMeetButton } from '../manage-classes/components';
import { FaVideo } from 'react-icons/fa'; 


interface Teacher {
    firstname: string;
    lastname: string;
    teacherid: string;
}

interface Subject {
    subjectname: string;
}

interface Reservation {
    id: string;
    datetime: string;
    Teacher: Teacher;
    Subject: Subject;
    meeting_id: string;
    meet_link: string;
}

const MyClasses = () => {
    const { user } = useAuth();
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
    const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const cardsPerPage = 3; 
    const URL = import.meta.env.VITE_API_URL;
    const navigateToChat = (teacherid:string) =>{
        setSelectedTeacherId(teacherid);
        setIsChatOpen(true);
    }

    useEffect(() => {
        const getReservationsForStudent = async () => {
            try {
                const response = await fetch(`${URL}reservation/student/${user?.id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user?.token}`,
                        'ngrok-skip-browser-warning': 'true',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch student reservations');
                }
                const data = await response.json();
                console.log(data);
                setReservations(data);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setIsLoading(false);
            }
        };

        getReservationsForStudent();
    }, [URL, user?.id, user?.token]);


    const totalPages = Math.ceil(reservations.length / cardsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const paginatedReservations = reservations.slice(
        currentPage * cardsPerPage,
        (currentPage + 1) * cardsPerPage
    );

    const totalCards = 3;
    const skeletonCards = totalCards - paginatedReservations.length;

    const handleJoinGoogleMeet = (reservation: Reservation) => {
        window.open(reservation.meet_link, "_blank");
    }


    return (
        <>
        {isChatOpen ? (
            <Chat
                teacherId={selectedTeacherId || ''}
                studentId={`${user?.id}` || ''}
                closeChat={() => setIsChatOpen(false)}
            />
        ) : (
        <MainContainer>
            <SideBar />
            <Topbar/>
            <Logo/>
                <Content>
                <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: 0.3 }}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '95%',
                        }}
                    >
                    <PageTitle>My classes</PageTitle>
                </motion.div>
                {isLoading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'center'}}>
                        <AnimatedLoadingLogo src={SimplifiedLogo} width='70px' height='70px' />
                    </div>
                ) : reservations.length > 0 ? (
                    <>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.4 }}>
                        {paginatedReservations.map((reservation) => (
                            <Card key={reservation.id}>
                                <CardHeader>
                                    <p>{reservation.Subject.subjectname}</p>
                                </CardHeader>
                                <CardBody>
                                    <CardInfo>
                                        <p>Teacher: {reservation.Teacher.firstname} {reservation.Teacher.lastname}</p>  
                                    </CardInfo>
                                </CardBody>
                                <CardFooter>
                                    <p>{new Date(reservation.datetime).toLocaleString()}</p>
                                    {reservation.meeting_id && (
                                        <GoogleMeetButton onClick={() => handleJoinGoogleMeet(reservation)}>Join <FaVideo/></GoogleMeetButton>
                                    )}    
                                    <Button widthRestricted secondary title='Initiate chat' onClick={()=> navigateToChat(reservation.Teacher.teacherid)}>Chat</Button> 
                                <ChatButton title='Initiate chat' onClick={()=> navigateToChat(reservation.Teacher.teacherid)}><IoChatbubbleEllipses/></ChatButton> 
                                </CardFooter>
                            </Card>
                        ))}
                        {skeletonCards > 0 && 
                            Array.from({ length: skeletonCards }).map((_, index) => (
                                <StaticSkeletonCard key={`skeleton-${index}`} />
                        ))}
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', alignItems: 'center'}}>
                            <Button onClick={handlePreviousPage} disabled={currentPage === 0}>Previous</Button>
                            <PageNumber style={{ margin: '0 10px' }}>Page {currentPage + 1} of {totalPages}</PageNumber>
                            <Button onClick={handleNextPage} disabled={currentPage === totalPages - 1}>Next</Button>
                        </div>
                    </motion.div>
                    </div>
                    </>
                ) : (
                    <NotificationContainer>
                        <Notification alternative={true} message="You haven’t booked any class yet."/>
                    </NotificationContainer>
                )}
            </Content>
            
        </MainContainer>
        )}
    </>
    );
};

export default MyClasses;