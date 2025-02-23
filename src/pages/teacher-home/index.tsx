import { useEffect, useState } from 'react';
import SideBar from '../../components/sidebar/sidebar';
import { MainContainer, Content, Card, CardHeader, CardBody, CardInfo, CardFooter, CardsContainer, NoScheduleAlertContainer, TimeFilterButton, FilterButtonsContainer, GreetingText, Subtitle, PageNumber, StaticSkeletonCard } from './components';
import { useAuth } from '../../auth/useAuth';
import Topbar from '../../components/topbar';
import { Button } from '../../components/main-button/components';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/top-down-logo';
import Notification from '../../components/notification';
import { AnimatedLoadingLogo } from '../../components/animated-loading-logo/components';
import SimplifiedLogo from "../../assets/Logo transparent alt.png";
import { motion } from 'framer-motion';

interface Reservations {
    id: string;
    student_name: string;
    subject_name: string;
    datetime: string;
    student_id: string;
    class_price: number;
}

const TeacherHome = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const URL = import.meta.env.VITE_API_URL;
    
    const [reservations, setReservations] = useState<Reservations[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [timeFilter, setTimeFilter] = useState<'24h' | '3d' | '1w'>('1w');
    const [currentPage, setCurrentPage] = useState(0);
    const cardsPerPage = 2;    
    
    useEffect(() => {
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
                setReservations(data);
                setIsLoading(false);
                
            } catch (error) {
                console.error(error);
                setIsLoading(false);
            }
        };
        if (user?.id) {
            getReservationsForTeacher();
        }
    }, [URL, logout, user, user?.id, user?.token]);

    const handleGoToSchedule = () => {
        navigate("/manage-schedule")
    };

    const filterReservationsByTime = () => {
        const now = new Date().getTime();
        const timeIntervals: Record<string, number> = {
            '24h': 24 * 60 * 60 * 1000,
            '3d': 3 * 24 * 60 * 60 * 1000,
            '1w': Infinity ,
        };
        
        return reservations.filter((reservation) => {
            const reservationTime = new Date(reservation.datetime).getTime();
            return reservationTime >= now && reservationTime <= now + timeIntervals[timeFilter];
        });
    };

/*     const totalCards = 2; */
    const filteredReservations = filterReservationsByTime();
    const totalPages = Math.ceil(filteredReservations.length / cardsPerPage);
    

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

    const paginatedReservations = filteredReservations.slice(
        currentPage * cardsPerPage,
        (currentPage + 1) * cardsPerPage
    );

    const skeletonCards = 0 /* totalCards - paginatedReservations.length; */

    return (
        <MainContainer >
            <SideBar />
            <Logo/>
            <Topbar/>
            {user?.isActive === true ? (
                <Content>
                {!isLoading && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: 0.3 }}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '95%',
                        }}
                    >
                    <GreetingText>Welcome back, {user?.firstName}!</GreetingText>
                    </motion.div>
                )}
                {(user?.schedule)?.length === 0 ? (
                  <NoScheduleAlertContainer>
                    <Notification alternative={true} message='In order for students to be able to book your classes, you need to set up your availability schedule.'/>
                    <Button onClick={handleGoToSchedule}>Go to schedule</Button>
                  </NoScheduleAlertContainer>
  
                ) : (
                  <>
                  {isLoading ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'center'}}>
                          <AnimatedLoadingLogo src={SimplifiedLogo} width='70px' height='70px' />
                      </div>
                  ) : (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: 0.4 }}
                            style={{ display: 'flex', flexDirection:'column', alignItems:"center", textAlign: "center", height: '100%', justifyContent: 'center'}}
                        >
                          {reservations.length > 0 ? (
                            <>
                            <Subtitle>Here are your upcoming classes:</Subtitle>
                            
                            <FilterButtonsContainer style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px', gap:"10px" }}>
                              <TimeFilterButton onClick={() => setTimeFilter('24h')} active={timeFilter === '24h'}>Next 24 hours</TimeFilterButton>
                              <TimeFilterButton onClick={() => setTimeFilter('3d')} active={timeFilter === '3d'}>Next 3 days</TimeFilterButton>
                              <TimeFilterButton onClick={() => setTimeFilter('1w')} active={timeFilter === '1w'}>Next month</TimeFilterButton>
                            </FilterButtonsContainer>
  
                            <CardsContainer>
                                  {paginatedReservations.map((reservation) => (
                                      <Card key={reservation.id}>
                                          <CardHeader>
                                              <p>{reservation.subject_name} {'($' + reservation.class_price + ')'}</p>
                                          </CardHeader>
                                          <CardBody>
                                              <CardInfo>
                                                  <p>Student: {reservation.student_name}</p>  
                                              </CardInfo>
                                          </CardBody>
                                          <CardFooter>
                                              <p>{new Date(reservation.datetime).toLocaleString('en-US', {
                                                  year: 'numeric',
                                                  month: 'numeric',
                                                  day: 'numeric',
                                                  hour: 'numeric',
                                                  minute: 'numeric',
                                                  hour12: false
                                                  })}
                                              </p>
                                          </CardFooter>
                                      </Card>
                                  ))}
                                  {skeletonCards > 0 && skeletonCards < 2 &&
                                        Array.from({ length: skeletonCards }).map((_, index) => (
                                            <StaticSkeletonCard key={`skeleton-${index}`} />
                                    ))}
                                   {paginatedReservations.length === 0 && 
                                    <Notification alternative={true} message='No pending classes for this time scale.' />
                                   }
                              {totalPages > 1 && (
                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px', alignItems: 'center' }}>
                                    <Button onClick={handlePreviousPage} disabled={currentPage === 0}>Previous</Button>
                                    <PageNumber style={{ margin: '0 10px' }}>Page {filteredReservations.length !== 0 ? currentPage + 1 : 0} of {totalPages}</PageNumber>
                                    <Button onClick={handleNextPage} disabled={currentPage === totalPages - 1 || currentPage === 0 && totalPages === 0}>Next</Button>
                                </div>
                              )}
                              </CardsContainer>
                            </>
                          ) : (
                            <NoScheduleAlertContainer>
                               <Notification alternative={true} message='You don’t have any pending classes.' />
                            </NoScheduleAlertContainer>
                          )}
                    </motion.div>
                  )}
                  </>
                  )}
              </Content>
            ) : (
                <Content>
                    <div style={{height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Notification alternative={true} message='Your account is under evaluation, please be patient and await for approval.' />
                    </div>
                </Content>
            )}
            
        </MainContainer>
    );
};

export default TeacherHome;
