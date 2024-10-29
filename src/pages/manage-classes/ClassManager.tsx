import { useEffect, useState } from 'react';
import SideBar from '../../components/sidebar/sidebar';
import { MainContainer, Content, Card, CardHeader, CardBody, CardInfo, CardFooter, StaticSkeletonCard, CardsContainer, ChatButton, PageNumber, ButtonContainer, NotificationContainer, HeaderText } from './components';
import { useAuth } from '../../auth/useAuth';
import Topbar from '../../components/topbar';
import Logo from '../../components/top-down-logo';
import { Button } from '../../components/main-button/components';
import { PopUp, PopUpContainer } from '../../components/popup/components';
import { Message } from '../../components/message/components';
import { AnimatedLoadingLogo } from '../../components/animated-loading-logo/components';
import SimplifiedLogo from "../../assets/Logo transparent.png";
import CreateExamForm from '../../components/create-exam-form';
import { CiChat1 } from "react-icons/ci";
import Chat from '../chat-manager/Chat';
import Notification from '../../components/notification';
import { IoIosArrowForward } from "react-icons/io";
import { motion } from 'framer-motion';


interface Reservation {
    id: string;
    student_name: string;
    subject_id: string
    subject_name: string;
    student_id: string;
    datetime: string;
    group: boolean;
}

const ClassManager = ({toggleContainer}: {toggleContainer: () => void}) => {
    const { user } = useAuth();
    const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
    const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
    const navigateToChat = (teacherid:string) =>{
        setSelectedTeacherId(teacherid);
        setIsChatOpen(true);
    }
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [currentReservation, setCurrentReservation] = useState<Reservation | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
    const [isFinishing, setIsFinishing] = useState(false);
    const [isCanceling, setIsCanceling] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [isCreateExamPopupOpen, setIsCreateExamPopupOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const cardsPerPage = 3; 
    const URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const getReservationsForTeacher = async () => {
            try {
                const response = await fetch(`${URL}reservation/teacher/${user?.id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user?.token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch teacher reservations');
                }
                const data = await response.json();
                setReservations([...data,...data,...data,...data]);
                setTimeout(() => {
                    setIsLoading(false);
                }, 1000);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setIsLoading(false);
            }
        };

        getReservationsForTeacher();
    }, [URL, user?.id, user?.token]);

    const handleFinishedClass = async (reservationId: string, subject_id: string) => {
        setSelectedClassId(reservationId);
        try {
            setIsFinishing(true);
            const price = await fetch(`${URL}subject/get-price/${subject_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`,
                },
            });
            const subject_price = await price.json();
            const response = await fetch(`${URL}reservation/terminate/${reservationId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`,
                },
                body: JSON.stringify({
                    valor: subject_price,
                })
            });
            if (!response.ok) {
                throw new Error('Failed to update reservation');
            }
            setReservations((prevReservations) => prevReservations.filter((reservation) => reservation.id !== reservationId));
            setIsFinishing(false);
            setMessage('Class finished successfully');
            setShowMessage(true);
            setTimeout(() => {
                setShowMessage(false);
            }, 3000);
        }catch (error) {
            console.error(error);
            setMessage('Failed to finish class');
            setIsFinishing(false);
            setShowErrorMessage(true);
            setTimeout(() => {
                setShowErrorMessage(false);
            }, 3000);
        }
    };

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

    const cancelClass = async () => {
        try {
            setIsCanceling(true);
            const response = await fetch(`${URL}reservation/cancel/${selectedClassId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to update reservation');
            }
            setReservations((prevReservations) => prevReservations.filter((reservation) => reservation.id !== selectedClassId));
            setIsCanceling(false);
            setMessage('Class canceled successfully');
            setIsPopupOpen(false);
            setShowMessage(true);
            setTimeout(() => {
                setShowMessage(false);
            }, 3000);
        }catch (error) {
            console.error(error);
            setMessage('Failed to cancel class');
            setIsCanceling(false);
            setIsPopupOpen(false);
            setShowErrorMessage(true);
            setTimeout(() => {
                setShowErrorMessage(false);
            }, 3000);
        }
    };

    const handleClassCancelation = (reservationId: string) => {
        setSelectedClassId(reservationId);
        setIsPopupOpen(true);
    };

    const handleCreateNewExam = (reservation: Reservation) => {
        setCurrentReservation(reservation)
        setIsCreateExamPopupOpen(true);
    };

    const totalCards = 3;
    const skeletonCards = totalCards - paginatedReservations.length;

  return (
    <>
    {isChatOpen ? (
        <Chat
            teacherId={`${user?.id}` || ''}
            studentId={selectedTeacherId || ''}
            closeChat={() => setIsChatOpen(false)}
        />
    ) : (
    <MainContainer isCreateExamPopupOpen={isCreateExamPopupOpen} isPopupOpen={isPopupOpen}>
        {showMessage && <Message>{message}</Message>}
        {showErrorMessage && <Message error>{message}</Message>}
        <SideBar />
        <Logo/>
        <Topbar/>
        {isPopupOpen && (
        <PopUpContainer>
            <PopUp>
                <h2>Are you sure you want to cancel this class?</h2>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button important onClick={cancelClass}>{isCanceling ?  <AnimatedLoadingLogo src={SimplifiedLogo}/> : "Cancel class"}</Button>
                    <Button secondary onClick={() => setIsPopupOpen(false)}>Keep class</Button>
                </div>
            </PopUp>
        </PopUpContainer>
        )}
        {isCreateExamPopupOpen && currentReservation && (
        <CreateExamForm reservation={currentReservation} closePopup={() => setIsCreateExamPopupOpen(false)} />
        )}
        <Content>
            <ButtonContainer>
                <Button secondary onClick={toggleContainer}>Show class history <IoIosArrowForward /></Button>
            </ButtonContainer>
            {isLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'center'}}>
                    <AnimatedLoadingLogo src={SimplifiedLogo} width='70px' height='70px' />
                </div>
            ) : reservations.length > 0 ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <CardsContainer>
                    {paginatedReservations.map((reservation) => (
                        <Card key={reservation.id}>
                            <CardHeader style={{ backgroundColor: reservation.group ? '#f2b36f' : '#3e7d44' }}>
                                <HeaderText>{reservation.subject_name}</HeaderText>
                            </CardHeader>
                            <CardBody>
                                <CardInfo>
                                    <p>{reservation.student_name}</p>
                                    <p style={{fontSize:"15px", fontWeight:"normal"}}>{new Date(reservation.datetime).toLocaleString()}</p>  
                                </CardInfo>
                            </CardBody>
                            <CardFooter>
                                {new Date(reservation.datetime) < new Date() && (
                                <Button onClick={() => handleFinishedClass(reservation.id, reservation.subject_id)}>
                                    {isFinishing && selectedClassId === reservation.id ? (
                                        <AnimatedLoadingLogo src={SimplifiedLogo} />
                                    ) : (
                                        "Mark as finished"
                                    )}
                                </Button>
                                
                                )}
                                <ChatButton title='Initiate chat' onClick={()=> navigateToChat(reservation.student_id)}><CiChat1/></ChatButton> 
                                
                                {new Date(reservation.datetime) > new Date() && (
                                    <Button onClick={() => handleCreateNewExam(reservation)}>Create exam</Button>
                                )}
                                <Button secondary title='Initiate chat' onClick={()=> navigateToChat(reservation.student_id)}>Chat</Button> 
                                <Button secondary onClick={() => handleClassCancelation(reservation.id)}>Cancel</Button>
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
                </CardsContainer>
                </motion.div>
            ) : (
                <NotificationContainer>
                    <Notification alternative={true} message={"You don't have any class to manage."} />
                </NotificationContainer>
            )}
        </Content>
    </MainContainer>
    )}
    </>
  )
};

export default ClassManager;
