import { useAuth } from "../../auth/useAuth";
import { useEffect, useState } from "react";
import { BrowserWrapper, ButtonsContainer, Card, CardInfo, CardsContainer, Content, Instructor, LoadingSkeletonCard, MainContainer, NoTeachersFound, StaticSkeletonCard, Title } from "./components";
import Logo from "../../components/top-down-logo";
import { PopUp, PopUpContainer } from "../../components/popup/components";
import { Button } from "../../components/main-button/components";
import SideBar from "../../components/sidebar/sidebar";
import Topbar from "../../components/topbar";
import { useNavigate } from "react-router-dom";
import Notification from "../../components/notification";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import TextInput from "../../components/search-input";
import { StarIconContainer } from "../class-browser/components";
import { IoMdStar } from "react-icons/io";
import { AnimatedLoadingLogo } from "../../components/animated-loading-logo/components";
import SimplifiedLogo from '../../assets/Logo transparent.png'
import { Message } from "../../components/message/components";

interface Teacher {
    teacherid: number;
    firstname: string;
    lastname: string;
    email: string;
    signup_date: string;
}

const TeacherValidation = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [currentTeacherId, setCurrentTeacherId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [isRejectPopupOpen, setIsRejectPopupOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isAccepting, setIsAccepting] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [message, setMessage] = useState("");
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    const { isLoggedIn, user } = useAuth();

    const URL = import.meta.env.VITE_API_URL;

    const navigate = useNavigate();

    useEffect(() => {
       const getInactiveTeachers = async () => {
            try{
                const response = await fetch(`${URL}admins/inactive-teachers`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${user?.token}`,
                        'ngrok-skip-browser-warning': 'true',
                    },
                    
                });
                const data = await response.json();
                setTeachers(data);
                setIsLoading(false);
            }catch (error) {
                setTeachers([]);
                setIsLoading(false);
                console.error("Error fetching teachers: ", error);
            }
        }
       if(user){getInactiveTeachers()}
       
    }, [URL, isLoggedIn, navigate, user]);

    const handleTeacherAccept = async () => {
        setIsAccepting(true);
        try{
            const response = await fetch(`${URL}admins/activate-teacher/${currentTeacherId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${user?.token}`,
                    'ngrok-skip-browser-warning': 'true',
                    
                },
            });
            if(!response.ok){
                setMessage("Failed to accept teacher. Please try again.");
                throw new Error("Failed to accept teacher. Please try again.");
            }
            setIsAccepting(false)
            setTeachers(teachers.filter(teacher => teacher.teacherid !== currentTeacherId));
            setIsPopupOpen(false);
            setMessage("Teacher accepted successfully.");
            setShowSuccessMessage(true);
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 3000);
        } catch (error) {
            setIsAccepting(false);
            setShowErrorMessage(true);
            setTimeout(() => {
                setShowErrorMessage(false);
            }, 3000);
            console.error("Error accepting teacher: ", error);
        }
    }

    const handleTeacherReject = (teacherId: number) => {
        setCurrentTeacherId(teacherId);
        setIsRejectPopupOpen(true);
    }

    const handleTeacherEnroll = (teacherId: number) => {
        setCurrentTeacherId(teacherId);
        setIsPopupOpen(true);
    } 

    const handleTeacherRejection = async () => {
        setIsRejecting(true);
        try{
            const response = await fetch(`${URL}teachers/delete/${currentTeacherId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${user?.token}`,
                    'ngrok-skip-browser-warning': 'true',
                },
            });
            if(!response.ok){
                setMessage("Failed to delete teacher");
                throw new Error("Failed to delete teacher");
            }
            setIsRejecting(false);
            setTeachers(teachers.filter(teacher => teacher.teacherid !== currentTeacherId));
            setIsRejectPopupOpen(false);
            setMessage("Teacher rejected successfully.");
            setShowSuccessMessage(true);
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 3000);
        } catch (error) {
            setIsRejecting(false);
            setShowErrorMessage(true);
            setTimeout(() => {
                setShowErrorMessage(false);
            }, 3000);
            console.error("Error rejecting teacher: ", error);
        }
        
    }

    const filteredTeachers = Array.isArray(teachers) ? 
        teachers.filter(teacher => 
            `${teacher.firstname} ${teacher.lastname}`.toLowerCase().includes(searchTerm.toLowerCase())
        ) 
    : [];

    const numStaticSkeletonCards = Math.max(0, 9 - filteredTeachers.length);
    const cardsToDisplay = [...filteredTeachers.map(item => item), ...Array(numStaticSkeletonCards).fill(null)];

    return (
        <>
        {showSuccessMessage && <Message>{message}</Message>}
        {showErrorMessage && <Message error>{message}</Message>}
            {isPopupOpen && (
                <PopUpContainer>
                    <PopUp>
                        <h2>You are about to enroll this teacher to the app. Are you sure?</h2>
                        <p>This teacher will be able to create, and give classes to students.</p>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <Button onClick={handleTeacherAccept}>{isAccepting ? <AnimatedLoadingLogo src={SimplifiedLogo}/> : 'Accept'}</Button>
                            <Button secondary onClick={() => setIsPopupOpen(false)}>Close</Button>
                        </div>
                    </PopUp>
                </PopUpContainer>
            )}
            {isRejectPopupOpen && (
                <PopUpContainer>
                    <PopUp>
                        <h2>You are about to reject this teacher application. Are you sure?</h2>
                        <p>This teacher account will be deleted.</p>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <Button important onClick={handleTeacherRejection}>{isRejecting ? <AnimatedLoadingLogo src={SimplifiedLogo}/> : 'Reject'}</Button>
                            <Button secondary onClick={() => setIsRejectPopupOpen(false)}>Close</Button>
                        </div>
                    </PopUp>
                </PopUpContainer>
            )}
            <MainContainer isPopupOpen={isPopupOpen}>
                <Logo />
                <Topbar/>
                <SideBar/>
                <Content>
                    <BrowserWrapper>
                        {isLoading ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
                                {Array.from({ length: 9 }).map((_, index) => (
                                    <LoadingSkeletonCard key={index} />
                                ))}
                            </div>
                        ) : (
                            (teachers.length === 0) ? 
                            <NoTeachersFound>
                                <Notification alternative={true} message={"There are no teachers to display."} />
                            </NoTeachersFound>
                            : (
                            <>
                            <div style={{ display: 'flex', marginBottom: '20px', alignItems:'left', width: '100%' }}>
                                <TextInput
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    icon={<LiaChalkboardTeacherSolid />}
                                    placeholder='Search for a teacher...'
                                />
                            </div>
                            <CardsContainer style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '100%'}}>
                                {cardsToDisplay.map((teacher, index) => (
                                    teacher ? (
                                        <Card 
                                            key={teacher.teacherid}
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
                                                <Instructor><strong>Joined:</strong> {teacher.signup_date}</Instructor>
                                                <ButtonsContainer>
                                                    <Button onClick={() => handleTeacherEnroll(teacher.teacherid)}>Accept</Button>
                                                    <Button onClick={() => handleTeacherReject(teacher.teacherid)} crucial>Reject</Button>
                                                </ButtonsContainer>
                                            </CardInfo>
                                        </Card>
                                    ) : (
                                        <StaticSkeletonCard key={`skeleton-${index}`} />
                                    )
                                ))}
                            </CardsContainer>
                            </>
                            )
                        )}
                        </BrowserWrapper>
                    </Content>
            </MainContainer>
        </>
    );
}

export default TeacherValidation;
