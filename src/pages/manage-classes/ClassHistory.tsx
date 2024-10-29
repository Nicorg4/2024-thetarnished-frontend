import { useEffect, useState } from 'react';
import SideBar from '../../components/sidebar/sidebar';
import { MainContainer, Content, Card, CardHeader, CardBody, CardInfo, StaticSkeletonCard, LoadingSkeletonCard, CardFooter, PaidInfo, CardsContainer, ButtonContainer, NotificationContainer, PageNumber } from './components';
import { useAuth } from '../../auth/useAuth';
import Topbar from '../../components/topbar';
import Notification from '../../components/notification';
import { Button } from '../../components/main-button/components';
import { IoIosArrowBack  } from "react-icons/io";

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

    const totalCards = 4;
    const skeletonCards = totalCards - reservations.length;

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

  return (
    <MainContainer isCreateExamPopupOpen={false} isPopupOpen={false}>
        <SideBar />
        <Topbar/>
        <Content>
            <ButtonContainer>
                <Button secondary onClick={toggleContainer}><IoIosArrowBack /> Show class history</Button>
            </ButtonContainer>
            {isLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {Array.from({ length: totalCards }).map((_, index) => (
                        <LoadingSkeletonCard key={index} />
                    ))}
                </div>
            ) : reservations.length > 0 ? (
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
                    {reservations.length > 3 && (
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', alignItems: 'center', position: 'absolute', bottom: '15px' }}>
                            <Button onClick={handlePreviousPage} disabled={currentPage === 0}>Previous</Button>
                            <PageNumber style={{ margin: '0 10px' }}>Page {currentPage + 1} of {totalPages}</PageNumber>
                            <Button onClick={handleNextPage} disabled={currentPage === totalPages - 1}>Next</Button>
                        </div>
                    )}
                </CardsContainer>
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