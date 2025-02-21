import { useEffect, useState } from 'react';
import SideBar from '../../components/sidebar/sidebar';
import { MainContainer, Content, Card, CardHeader, CardBody, CardInfo, CardFooter, StaticSkeletonCard, CardsContainer, ChatButton, PageNumber, ButtonContainer, NotificationContainer, HeaderText, PageTitle, GoogleMeetButton } from './components';
import { useAuth } from '../../auth/useAuth';
import Topbar from '../../components/topbar';
import { Button } from '../../components/main-button/components';
import { PopUp, PopUpContainer } from '../../components/popup/components';
import { Message } from '../../components/message/components';
import { AnimatedLoadingLogo } from '../../components/animated-loading-logo/components';
import SimplifiedLogo from "../../assets/Logo transparent.png";
import TransparentLogoAlt from "../../assets/Logo transparent alt.png";
import CreateExamForm from '../../components/create-exam-form';
import { CiChat1 } from "react-icons/ci";
import Chat from '../chat-manager/Chat';
import Notification from '../../components/notification';
import { IoIosArrowForward } from "react-icons/io";
import { motion } from 'framer-motion';
import { FaVideo } from 'react-icons/fa'; 


interface Reservation {
    id: string;
    student_name: string;
    subject_id: string
    subject_name: string;
    student_id: string;
    datetime: string;
    group: boolean;
    class_price: number;
    students: Student[];
    meeting_id: string;
    meeting_link: string;
}

interface Student {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zip_code: string;
    country: string;
    profile_picture: string;
}

const ClassManager = ({toggleContainer}: {toggleContainer: () => void}) => {
    const { user, updateUser } = useAuth();
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
    const [isCreatingGoogleMeetPopupOpen, setIsCreatingGoogleMeetPopupOpen] = useState(false);
    const [isCreatingGoogleMeet, setIsCreatingGoogleMeet] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const cardsPerPage = 3; 
    const URL = import.meta.env.VITE_API_URL;

    const getReservationsForTeacher = async () => {
        try {
            const response = await fetch(`${URL}reservation/teacher/${user?.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`,
                    'ngrok-skip-browser-warning': 'true',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch teacher reservations');
            }
            const data = await response.json();
            console.log(data); 
            setReservations(data);
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };
    useEffect(() => {
        if (user?.id) {
            getReservationsForTeacher();
        }
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
                    'ngrok-skip-browser-warning': 'true',
                },
            });
            const subject_price = await price.json();
            const response = await fetch(`${URL}reservation/terminate/${reservationId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`,
                    'ngrok-skip-browser-warning': 'true',
                },
                body: JSON.stringify({
                    valor: subject_price,
                })
            });
            if (!response.ok) {
                throw new Error('Failed to update reservation');
            }
            setReservations((prevReservations) => prevReservations.filter((reservation) => reservation.id !== reservationId));
            if(user){
                const xpToLvlUp = Number(1000 * Math.pow(1.2, (user?.lvl ?? 1))) - 100;
                updateUser({ xp: (Number(user.xp) + 100 ),  lvl: (Number(user.xp)) > xpToLvlUp ? (user.lvl) + 1 : (user.lvl)})
            }
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
                    'ngrok-skip-browser-warning': 'true',
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

    const handleCreateGoogleMeet = (reservation: Reservation) => {
        setCurrentReservation(reservation)
        setIsCreatingGoogleMeetPopupOpen(true);
    };

    const totalCards = 3;
    const skeletonCards = totalCards - paginatedReservations.length;

    const createMeeting = async () => {
        if (!currentReservation) {
            return;
        }
        setIsCreatingGoogleMeet(true);
    
        try {
            const meetingData = {
                reservationId: currentReservation.id,
                startTime: currentReservation.datetime,
                endTime: new Date(new Date(currentReservation.datetime).getTime() + 60 * 60 * 1000).toISOString(),
                studentEmails: currentReservation.students.map(student => student.email),
                teacherEmail: user?.email,
                subjectName: currentReservation.subject_name
            };
    
            const response = await fetch(`${URL}meeting/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
                    "Authorization": `Bearer ${user?.token}`,
                },
                body: JSON.stringify(meetingData),
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                setMessage('Failed to create meeting');
                throw new Error(data.message || "Error while creating the meeting");
            }
    
            setIsCreatingGoogleMeet(false);
            setMessage('Meeting created successfully');
            getReservationsForTeacher();
            setIsCreatingGoogleMeetPopupOpen(false);
            setShowMessage(true);
            setTimeout(() => {
                setShowMessage(false);
            }, 3000);
    
            return data;
        } catch (error) {
            setIsCreatingGoogleMeet(false);
            setIsCreatingGoogleMeetPopupOpen(false);
            setShowErrorMessage(true);
            setTimeout(() => {
                setShowErrorMessage(false);
            }, 3000);
            console.error("Error creating meeting:", error);
        }
    };

    const handleJoinGoogleMeet = (reservation: Reservation) => {
        window.open(reservation.meeting_link, "_blank");
    }
      

  return (
    <>
    {isCreatingGoogleMeetPopupOpen && (
        <PopUpContainer>
            <PopUp>
                <h2>Do you want to create a google meet for this class?</h2>
                <p>You and your student/s will be receiving the invitation to your personal email.</p>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button onClick={createMeeting}>{isCreatingGoogleMeet ?  <AnimatedLoadingLogo src={SimplifiedLogo}/> : "Create"}</Button>
                    <Button secondary onClick={() => setIsCreatingGoogleMeetPopupOpen(false)}>Cancel</Button>
                </div>
            </PopUp>
        </PopUpContainer>

    )}
    {isChatOpen ? (
        <Chat
            teacherId={`${user?.id}` || ''}
            studentId={selectedTeacherId || ''}
            closeChat={() => setIsChatOpen(false)}
        />
    ) : (
    <MainContainer isCreateExamPopupOpen={isCreateExamPopupOpen} isPopupOpen={isPopupOpen || isCreatingGoogleMeetPopupOpen}>
        {showMessage && <Message>{message}</Message>}
        {showErrorMessage && <Message error>{message}</Message>}
        <SideBar />     
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
                <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: 0.3 }}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                    <PageTitle>Class manager</PageTitle>
                </motion.div>
                <Button secondary onClick={toggleContainer}>Show class history <IoIosArrowForward /></Button>
            </ButtonContainer>
            
            {isLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'center'}}>
                    <AnimatedLoadingLogo src={TransparentLogoAlt} width='70px' height='70px' />
                </div>
            ) : reservations.length > 0 ? (
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.4 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'center'}}>
                <CardsContainer>
                    {paginatedReservations.map((reservation) => (
                        <Card key={reservation.id}>
                            <CardHeader style={{ backgroundColor: '#3e7d44' }}>
                                <HeaderText>{reservation.subject_name} {reservation.group ? '(Group class)' : ''}</HeaderText>
                            </CardHeader>
                            <CardBody>
                                <CardInfo>
                                    {reservation.students.length > 1 ? (
                                        <p style={{fontSize:"17px", fontWeight:"bold"}}>
                                            {reservation.students.map((student) => student.name).join(', ')}
                                        </p>
                                    ) : (
                                        <p>{reservation.student_name}</p>
                                    )}
                                    <p style={{fontSize:"15px", fontWeight:"normal"}}>{new Date(reservation.datetime).toLocaleString()}</p>  
                                    <p style={{fontSize:"15px", fontWeight:"bold"}}>{'$' + reservation.class_price}</p>  
                                </CardInfo>
                            </CardBody>
                            <CardFooter>
                                {new Date(reservation.datetime) < new Date() && (
                                <Button disabled={isFinishing} onClick={() => handleFinishedClass(reservation.id, reservation.subject_id)}>
                                    {isFinishing && selectedClassId === reservation.id ? (
                                        <AnimatedLoadingLogo src={SimplifiedLogo} />
                                    ) : (
                                        "Mark as finished"
                                    )}
                                </Button>
                                )}
                                
                                {!reservation.group && 
                                    <ChatButton title='Initiate chat' onClick={()=> navigateToChat(reservation.students[0].id)}><CiChat1/></ChatButton> 
                                }
                                {new Date(reservation.datetime) > new Date() && (
                                    <Button onClick={() => handleCreateNewExam(reservation)}>Create exam</Button>
                                )}
                                {!reservation.meeting_id ? (
                                    <GoogleMeetButton onClick={() => handleCreateGoogleMeet(reservation)}>Create <FaVideo/></GoogleMeetButton>
                                ): (
                                    <GoogleMeetButton onClick={() => handleJoinGoogleMeet(reservation)}>Join <FaVideo/></GoogleMeetButton>
                                )}
                                {!reservation.group && 
                                    <Button widthRestricted={true} secondary title='Initiate chat' onClick={()=> navigateToChat(reservation.students[0].id)}>Chat</Button> 
                                }
                                
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
