import { useEffect, useState } from 'react';
import SideBar from '../../components/sidebar/sidebar';
import { MainContainer, Content, Card, Title, Instructor, BrowserWrapper, CardInfo, ButtonsContainer, LoadingSkeletonCard, StaticSkeletonCard, Select, InputsContainer, PaymentButton, CashFlowProLogo, CloseButton, LeftContainer, SlotButton, RightContainer, SummaryContainer, StarIconContainer, SubjectName, NoTeachersFound } from './components';
import { Button } from '../../components/main-button/components';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import { Message } from '../../components/message/components';
import { AnimatedLoadingLogo } from '../../components/animated-loading-logo/components';
import { PopUp, PopUpContainer } from '../../components/payment-popup/components';
import Topbar from '../../components/topbar';
import SimplifiedLogo from "../../assets/Logo transparent.png";
import CashFlowLogo from '../../assets/Cash Flow Logo.jpeg';
import { RiCloseLargeFill } from "react-icons/ri";
import { GoPlus, GoDash  } from "react-icons/go";
import { InteractionBlocker } from '../../components/interaction-blocker/components';
import { IoMdStar } from "react-icons/io";
import TextInput from '../../components/search-input';
import Notification from '../../components/notification';
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import Logo from '../../components/top-down-logo';
import { motion } from 'framer-motion';

interface Teacher {
    teacherid: string;
    firstname: string;
    lastname: string;
    email: string;
    subjectid: string;
}

interface Schedule {
    scheduleid: string;
    start_time: string;
    end_time: string;
    teacherid: string;
    dayofweek: string;
    dayofmonth: string;
    Teacher: Teacher;
    maxstudents: number;
}

const ClassBrowser = () => {
    const [teachersDictatingSubject, setTeachersDictatingSubject] = useState<{ teacher: Teacher; schedule: Schedule[] }[]>([]);
    const [teacherSchedule, setTeacherSchedule] = useState<Schedule[]>([]);
    const [selectedSlots, setSelectedSlots] = useState<{ day: string, time: string }[]>([{ day: '', time: '' }]);
    const [clickedClass, setClickedClass] = useState<Teacher | null>(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [isBooking, setIsBooking] = useState(false);
    const [isBookingTimeout, setIsBookingTimeout] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isBookingWithCashFlow, setIsBookingWithCashFlow] = useState(false);
    const [subjectPrice, setSubjectPrice] = useState(100);

    const { subjectId, subjectName } = useParams();
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const getSubjectPrice = async () => {
            if (subjectId) {
                try {
                    const response = await fetch(`${URL}subject/get-price/${subjectId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${user?.token}`,
                            'ngrok-skip-browser-warning': 'true',
                        },
                    });
                    const subject_price = await response.json();
                    setSubjectPrice(subject_price);
                } catch (error) {
                    console.error('Error fetching subject price:', error);
                }
            }
        };
        const getTeachersDictatingSubject = async () => {
            if (subjectId) {
                try {
                    const response = await fetch(`${URL}teachers/all-dictating/${subjectId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${user?.token}`,
                            'ngrok-skip-browser-warning': 'true',
                        },
                    });
                    const teachers = await response.json();
    
                    const schedules = await Promise.all(
                        teachers.map(async (teacher: Teacher) => {
                            const scheduleResponse = await fetch(`${URL}classes/get-monthly-schedule-by/${teacher.teacherid}`, {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${user?.token}`,
                                    'ngrok-skip-browser-warning': 'true',
                                },
                            });
                            const teacherSchedule = await scheduleResponse.json();
                            return { teacher: { ...teacher, isPrevTeacher: false }, schedule: teacherSchedule };
                        })
                    );
    
                    return schedules.filter(({ schedule }) => schedule.length > 0);
                } catch (error) {
                    console.error('Error fetching current teachers:', error);
                    return [];
                }
            }
            return [];
        };
    
        const getPrevTeachersDictatingSubject = async () => {
            if (subjectId && user?.id) {
                try {
                    const response = await fetch(`${URL}students/get-previous/${user?.id}/${subjectId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${user?.token}`,
                            'ngrok-skip-browser-warning': 'true',
                        },
                    });
                    const teachers = await response.json();
    
                    const schedules = await Promise.all(
                        teachers.map(async (teacher: Teacher) => {
                            const scheduleResponse = await fetch(`${URL}classes/get-monthly-schedule-by/${teacher.teacherid}`, {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${user?.token}`,
                                    'ngrok-skip-browser-warning': 'true',
                                },
                            });
                            const teacherSchedule = await scheduleResponse.json();
                            return { teacher: { ...teacher, isPrevTeacher: true }, schedule: teacherSchedule };
                        })
                    );
    
                    return schedules.filter(({ schedule }) => schedule.length > 0);
                } catch (error) {
                    console.error('Error fetching previous teachers:', error);
                    return [];
                }
            }
            return [];
        };
    
        const fetchTeachers = async () => {
            const prevTeachers = await getPrevTeachersDictatingSubject();
            const currentTeachers = await getTeachersDictatingSubject();
        
            const uniqueTeachersMap = new Map();
        
            currentTeachers.forEach(({ teacher, schedule }) => {
                uniqueTeachersMap.set(teacher.teacherid, { teacher, schedule });
            });
        
            prevTeachers.forEach(({ teacher, schedule }) => {
                uniqueTeachersMap.set(teacher.teacherid, { teacher, schedule });
            });
        
            const teachersArray = Array.from(uniqueTeachersMap.values());
            setTeachersDictatingSubject(teachersArray);
            setIsLoading(false);
        };
        if (user) {
            getSubjectPrice();
            fetchTeachers();
        }
        
    }, [URL, subjectId, user]);
    

    const handleCardClick = (teacher: Teacher) => {
        const selectedTeacher = teachersDictatingSubject.find(t => t.teacher.teacherid === teacher.teacherid);
        if (selectedTeacher) {
            setClickedClass(selectedTeacher.teacher);
            setTeacherSchedule(selectedTeacher.schedule);
            setIsPopupOpen(true);
        }
    };

    const handlePopupClose = () => {
        setClickedClass(null);
        setIsPopupOpen(false);
    };

    const handleDayChange = (index: number, event: React.ChangeEvent<HTMLSelectElement>) => {
        const newSlots = [...selectedSlots];
        newSlots[index].day = event.target.value;
        setSelectedSlots(newSlots);
    };

    const handleTimeChange = (index: number, event: React.ChangeEvent<HTMLSelectElement>) => {
        const newSlots = [...selectedSlots];
        newSlots[index].time = event.target.value;
        setSelectedSlots(newSlots);
    };

    const addSlot = () => {
        if (selectedSlots.length < 5) {
            setSelectedSlots([...selectedSlots, { day: '', time: '' }]);
        }
    };

    const removeSlot = (index: number) => {
        const filteredSlots = selectedSlots.filter((_, i) => i !== index);
        setSelectedSlots(filteredSlots);
    }

    const handleGoBack = () => {
        navigate('/student-home');
    };

    const formatTime = (time: string) => {
        const [hours, minutes] = time.split(':');
        return `${hours}:${minutes}`;
    };

    const handleBook = async (paymentMethod: string) => {
        try {
            if (paymentMethod === 'CASH') {
                setIsBooking(true);
            } else {
                setIsBookingWithCashFlow(true);
            }
        
            for (const slot of selectedSlots) {
                const selectedSchedule = teacherSchedule.find((schedule) => {
                    const [dayOfWeek, dayOfMonth] = slot.day.split(' ');
                    return (
                        schedule.teacherid === clickedClass?.teacherid &&
                        schedule.dayofweek == dayOfWeek &&
                        schedule.dayofmonth == dayOfMonth &&
                        formatTime(schedule.start_time) === slot.time
                    );
                });

                if (!selectedSchedule) {
                    setMessage('No matching schedule found for one or more slots');
                    throw new Error('No matching schedule found for one or more slots');
                }

                if (!slot.day || !slot.time) {
                    setMessage('Please select a day and time for all slots');
                    throw new Error('Please select a day and time for all slots');
                }

                const requestBody = {
                    student_id: user?.id,
                    subject_id: subjectId,
                    teacher_id: clickedClass?.teacherid,
                    dayofweek: parseInt(slot.day.split(' ')[0], 10),
                    start_time: `${slot.time}:00`,
                    schedule_id: selectedSchedule?.scheduleid,
                    payment_method: paymentMethod,
                };

                const response = await fetch(`${URL}reservation/create`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user?.token}`,
                    },
                    body: JSON.stringify(requestBody),
                });
                if (response.status === 401) {
                    setMessage('User is not registered in CashFlow');
                    throw new Error('User is not registered in CashFlow');
                }
                if (!response.ok) {
                    setMessage('Failed to book class');
                    throw new Error('Failed to book class');
                }
            }

            setIsPopupOpen(false);
            setClickedClass(null);
            if(user){
                const xpToLvlUp = Number(1000 * Math.pow(1.2, (user?.lvl ?? 1))) - 50 * selectedSlots.length;
                updateUser({ xp: (Number(user.xp) + 50 * selectedSlots.length ),  lvl: (Number(user.xp)) > xpToLvlUp ? (user.lvl) + 1 : (user.lvl)})
            }
                
            setMessage('Classes booked successfully');
            if (paymentMethod === 'CASH') {
                setIsBooking(false);
            } else {
                setIsBookingWithCashFlow(false);
            }
            setIsBookingTimeout(true);
            setShowSuccessMessage(true);
            setTimeout(() => {
                setShowSuccessMessage(false);
                setIsBookingTimeout(false);
                window.location.reload();
            }, 3000);

        } catch (error) {
            console.error(error);
            setShowErrorMessage(true);
            if (paymentMethod === 'CASH') {
                setIsBooking(false);
            } else {
                setIsBookingWithCashFlow(false);
            }
            setTimeout(() => {
                setShowErrorMessage(false);
            }, 3000);
        }
    };

    const dayNames: { [key: string]: string } = {
        '1': 'Mon',
        '2': 'Tue',
        '3': 'Wed',
        '4': 'Thu',
        '5': 'Fri',
        '6': 'Sat',
        '7': 'Sun'
    };

    const formatTimeWithPadding = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    };

    const getAvailableDays = (schedules: Schedule[]) => {
        const days = Array.from(new Set(schedules.map(schedule => schedule.dayofweek)));
        return days.map(day => dayNames[day] || 'Unknown').join(', ');
    };

    const filteredTeachers = teachersDictatingSubject.filter(teacher =>
       `${teacher.teacher.firstname} ${teacher.teacher.lastname}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const numStaticSkeletonCards = Math.max(0, 9 - filteredTeachers.length);
    const cardsToDisplay = [...filteredTeachers.map(item => item.teacher), ...Array(numStaticSkeletonCards).fill(null)];

    const handleCancelBooking = async () => {
        setSelectedSlots([{ day: '', time: '' }]);
        setIsPopupOpen(false);
    }

    return (
            <>
                {isPopupOpen && clickedClass != null &&
                <PopUpContainer>
                    <PopUp>
                        <CloseButton onClick={handlePopupClose}><RiCloseLargeFill/></CloseButton>
                        <LeftContainer>
                            <h3 style={{marginBottom: '0px', marginTop:'0px'}}>Teacher: {clickedClass.firstname} {clickedClass.lastname}</h3>
                            <p>Select a day and time for each slot</p>
                            {selectedSlots.map((slot, index) => (
                                <InputsContainer key={index}>
                                    <Select required onChange={(e) => handleDayChange(index, e)} value={slot.day}>
                                        <option value="">Select a day</option>
                                        {Array.from(new Set(teacherSchedule.map(schedule => `${schedule.dayofweek} ${schedule.dayofmonth}`)))
                                            .map(day => (
                                                <option key={day} value={day}>
                                                    {`${dayNames[day.split(' ')[0]]} ${day.split(' ')[1]}`}
                                                </option>
                                            ))}
                                    </Select>
                                    <Select required onChange={(e) => handleTimeChange(index, e)} value={slot.time}>
                                        <option value="">Select a time</option>
                                        {teacherSchedule
                                            .filter(schedule => `${schedule.dayofweek} ${schedule.dayofmonth}` === slot.day)
                                            .filter(schedule => !selectedSlots.some((selectedSlot, selectedIndex) => selectedIndex !== index && selectedSlot.time === formatTimeWithPadding(schedule.start_time) && selectedSlot.day === slot.day))
                                            .map(schedule => (
                                                <option key={schedule.scheduleid} value={formatTimeWithPadding(schedule.start_time)}>
                                                {schedule.maxstudents > 1 
                                                    ? formatTimeWithPadding(schedule.start_time) + "  (Group)"
                                                    : formatTimeWithPadding(schedule.start_time)}
                                                </option>

                                            ))}
                                    </Select>
                                    {index === 0 && (
                                        <SlotButton onClick={addSlot} disabled={selectedSlots.length >= 5}><GoPlus /></SlotButton>
                                    )}
                                    {index !== 0 && (
                                        <SlotButton remove onClick={() => removeSlot(index)}><GoDash /></SlotButton>
                                    )}
                                </InputsContainer>
                            ))}
                        </LeftContainer>
                        <RightContainer>
                                <h2 style={{marginBottom:'0px'}}>Summary</h2>
                                <SummaryContainer>
                                    {selectedSlots
                                        .filter(slot => slot.day && slot.time)
                                        .map((slot, index) => (
                                            <div key={index}>
                                                <p>Day: {dayNames[slot.day.split(' ')[0]]} | Time: {slot.time} | Price: ${subjectPrice}</p>
                                            </div>
                                        ))}
                                        {selectedSlots.filter(slot => slot.day && slot.time).length !== 0 && (
                                            <div style={{ fontWeight: 'bold', textAlign: 'center' }}>
                                                <p>Total Price: ${selectedSlots.length * subjectPrice}</p>
                                            </div>
                                        )}
                                    
                                </SummaryContainer>
                                <ButtonsContainer>
                                    <Button onClick={() => handleBook("CASH")}>{isBooking ? <AnimatedLoadingLogo src={SimplifiedLogo}/> : "Book"}</Button>
                                    <PaymentButton onClick={() => handleBook("CASHFLOW")}>{isBookingWithCashFlow ? <AnimatedLoadingLogo src={SimplifiedLogo}/> : "Book with Cash Flow"}<CashFlowProLogo src={CashFlowLogo}/></PaymentButton>
                                    <Button secondary onClick={handleCancelBooking}>Cancel</Button>
                                </ButtonsContainer>
                            </RightContainer>
                    </PopUp>
                </PopUpContainer>
            }
                <Topbar/>
                <Logo/>
                <MainContainer isPopupOpen={isPopupOpen}>
                {showSuccessMessage && <Message>{message}</Message>}
                {showErrorMessage && <Message error>{message}</Message>}
                {isBookingTimeout && <InteractionBlocker><AnimatedLoadingLogo src={SimplifiedLogo}/></InteractionBlocker>}
                    <SideBar />
                    <Content>
                    <SubjectName>{subjectName}</SubjectName>
                        <BrowserWrapper>
                            {isLoading ? (
                                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
                                    {Array.from({ length: 9 }).map((_, index) => (
                                        <LoadingSkeletonCard key={index} />
                                    ))}
                                </div>
                            ) : (
                                (teachersDictatingSubject.length === 0) ? 
                                <NoTeachersFound>
                                    <Notification alternative={true} message={"No teachers available for this subject."} />
                                    <Button secondary onClick={handleGoBack}>Go back</Button>
                                </NoTeachersFound>
                                : (
                                <>
                                <div style={{ display: 'flex', marginBottom: '20px', alignItems:'left', width: '100%' }}>
                                    <TextInput
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        icon={<LiaChalkboardTeacherSolid />}
                                        placeholder='Search for a teacher...'
                                    />
                                </div>
                                <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3}}
                                style={{ width:'100%', display: "flex", alignItems: "center", justifyContent: "center" }}
                                >
                                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '100%'}}>
                                    {cardsToDisplay.map((teacher, index) => (
                                        teacher ? (
                                            <Card 
                                                key={teacher.teacherid}
                                                onClick={() => handleCardClick(teacher)} 
                                                role="button" 
                                                tabIndex={0}
                                                aria-label={`Teacher: ${teacher.firstname} ${teacher.lastname}`}
                                            > 
                                            {teacher.isPrevTeacher && 
                                                <StarIconContainer>
                                                    <IoMdStar style={{color: "#ffd700"}} />
                                                </StarIconContainer>
                                            }  
                                            
                                                <CardInfo>
                                                    <Title>{teacher.firstname} {teacher.lastname}</Title>
                                                    <Instructor>{getAvailableDays(teachersDictatingSubject.find(t => t.teacher.teacherid === teacher.teacherid)?.schedule || [])}</Instructor>
                                                </CardInfo>
                                            </Card>
                                        ) : (
                                            <StaticSkeletonCard key={`skeleton-${index}`} />
                                        )
                                    ))}
                                </div>
                                </motion.div>
                                </>
                                )
                            )}
                        </BrowserWrapper>
                    </Content>
                </MainContainer>
            </>
    );
};

export default ClassBrowser;
