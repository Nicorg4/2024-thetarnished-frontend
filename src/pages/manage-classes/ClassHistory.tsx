import { useEffect, useState } from 'react';
import SideBar from '../../components/sidebar/sidebar';
import { MainContainer, Content, Card, CardHeader, CardBody, CardInfo, StaticSkeletonCard, CardFooter, PaidInfo, CardsContainer, ButtonContainer, NotificationContainer, PageNumber } from './components';
import { useAuth } from '../../auth/useAuth';
import Topbar from '../../components/topbar';
import Notification from '../../components/notification';
import { Button } from '../../components/main-button/components';
import { IoIosArrowBack  } from "react-icons/io";
import { motion } from 'framer-motion';
import { AnimatedLoadingLogo } from '../../components/animated-loading-logo/components';
import SimplifiedLogo from "../../assets/Logo transparent alt.png";

interface Student {
    firstname: string;
    lastname: string;
}

interface Subject {
    subjectname: string;
}

interface Reservations {
    id: string;
    Student: Student;
    Subject: Subject;
    datetime: string;
    group: boolean;
    paid:  boolean;
}

const ClassHistory = ({toggleContainer}: {toggleContainer: () => void}) => {
    const { user } = useAuth();
    const [reservations, setReservations] = useState<Reservations[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState(0);
    const cardsPerPage = 3; 
    const URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const getReservationsForTeacher = async () => {
            try {
                const response = await fetch(`${URL}reservation/terminated-reservations-by/${user?.id}`, {
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
                setReservations(data);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setIsLoading(false);
            }
        };

        getReservationsForTeacher();
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

/*     const totalCards = 3; */
    const skeletonCards = 0 /* totalCards - paginatedReservations.length; */

  return (
    <MainContainer isCreateExamPopupOpen={false} isPopupOpen={false}>
        <SideBar />
        <Topbar/>
        <Content>
            <ButtonContainer>
                <Button secondary onClick={toggleContainer}><IoIosArrowBack /> Show class manager</Button>
            </ButtonContainer>
            {isLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'center'}}>
                    <AnimatedLoadingLogo src={SimplifiedLogo} width='70px' height='70px' />
                </div>
            ) : reservations.length > 0 ? (
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.4 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'center'}}>
                <CardsContainer>
                    {paginatedReservations.map((reservation) => (
                        <Card key={reservation.id}>
                            <CardHeader style={{ backgroundColor: reservation.group ? '#f2b36f' : '#3e7d44' }}>
                                <p>{reservation.Subject.subjectname}</p>
                            </CardHeader>
                            <CardBody>
                                <CardInfo>
                                    <p>{`${reservation.Student.firstname} ${reservation.Student.lastname}`}</p>
                                    <p style={{fontSize:"15px", fontWeight:"normal"}}>{new Date(reservation.datetime).toLocaleString()}</p> 
                                </CardInfo>
                            </CardBody>
                            <CardFooter>
                                <PaidInfo isPaid={reservation.paid}>{reservation.paid ? "Paid" : "In debt"}</PaidInfo>
                            </CardFooter>
                        </Card>
                    ))}
                    {skeletonCards > 0 && 
                        Array.from({ length: skeletonCards }).map((_, index) => (
                            <StaticSkeletonCard key={`skeleton-${index}`} />
                    ))}
                        {totalPages > 1 && (
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px', alignItems: 'center' }}>
                                <Button onClick={handlePreviousPage} disabled={currentPage === 0}>Previous</Button>
                                <PageNumber style={{ margin: '0 10px' }}>Page {paginatedReservations.length !== 0 ? currentPage + 1 : 0} of {totalPages}</PageNumber>
                                <Button onClick={handleNextPage} disabled={currentPage === totalPages - 1 || currentPage === 0 && totalPages === 0}>Next</Button>
                            </div>
                        )}
                </CardsContainer>
                </motion.div>
            ) : (
                <NotificationContainer>
                    <Notification alternative={true} message={"You have not dictated a class yet."} />
                </NotificationContainer>
            )}
        </Content>
    </MainContainer>
  )
}

export default ClassHistory