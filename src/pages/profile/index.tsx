import SideBar from '../../components/sidebar/sidebar'
import { MainContainer, Content, ProfileCard, UserImage, UserInfo, UserName, UserSubjects, Subject, CardButtons, Form, Input, InputText, ButtonsContainer, FormTitle, FormContainer, PasswordInput, VacationButtonContainer, VacationButton, CalendarContainer, ProfileCover, UserData, BadgesContainer, Badge, BadgeTitle, Badges, BadgeInfo, BadgeName, BadgeDescription, DeleteAccountButtonsContainer, CheckmarkIcon, EditIcon, AvatarContainer, NoBadgesMessage } from './components';
import { Button } from '../../components/main-button/components';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import { Message } from '../../components/message/components';
import { AnimatedLoadingLogo } from '../../components/animated-loading-logo/components';
import SimplifiedLogo from "../../assets/Logo transparent.png";
import Topbar from '../../components/topbar';
import Logo from '../../components/top-down-logo';
import { PopUp, PopUpContainer } from '../../components/popup/components';
import MultiAutocompleteInput from '../../components/multi-autocomplete-input';
import { FaUmbrellaBeach } from "react-icons/fa";
import DateRangeCalendarComponent from './calendar';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import avatars from '../../assets/avatars/avatars';
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import badges from '../../assets/badges/badges';
import EasterEggRiddle from '../../components/riddle';

 const Profile = () => {

    const navigate = useNavigate();
    const { user, updateUser, logout } = useAuth();
    const [firstName, setFirstName] = useState(user?.firstName || '');
    const [lastName, setLastName] = useState(user?.lastName || '');
    const [isEditing, setIsEditing] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [showDeleteAccountConfirmation, setShowDeleteAccountConfirmation] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [newSubjects, setNewSubjects] = useState<{ subjectid: string; subjectname: string; class_price: string }[]>([]);
    const [password, setPassword] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [showTakeVacationPopup, setShowTakeVacationPopup] = useState(false);
    const [isConfirmingVacation, setIsConfirmingVacation] = useState(false);
    const [showTerminateVacationPopup, setShowTerminateVacationPopup] = useState(false);
    const [isConfirmingTerminateVacation, setIsConfirmingTerminateVacation] = useState(false);
    const [hoveredBadgeId, setHoveredBadgeId] = useState<string | null>(null);
    const [showAvatarSelectorPopup, setShowAvatarSelectorPopup] = useState(false);
    const [userBadges, setUserBadges] = useState<{ id: string; name: string; description: string; imageUrl: string; }[]>([]);
    const [openRiddlePopUp, setOpenRiddlePopUp] = useState(false);
    const [successEasterEggMessage, setSuccessEasterEggMessage] = useState(false);
    const [errorEasterEggMessage, setErrorEasterEggMessage] = useState(false);

    const URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        setFirstName(user?.firstName || '');
        setLastName(user?.lastName || '');
        if(newSubjects.length === 0 && user?.subjects){
            setNewSubjects(user?.subjects);
        }
        
        const getUserBadges = () => {
            let newBadges: { id: string; name: string; description: string; imageUrl: string; }[] = [];

            if (user && user?.role === 'TEACHER') {
                if (user?.stats?.total_reservations >= 5 && user?.stats?.total_reservations < 50) {
                    newBadges = [...newBadges, ...badges.filter(badge => badge.id === '1')];
                }
                else if (user?.stats?.total_reservations >= 50 && user?.stats?.total_reservations < 100) {
                    newBadges = [...newBadges, ...badges.filter(badge => badge.id === '2')];
                }
                else if (user?.stats?.total_reservations >= 100) {
                    newBadges = [...newBadges, ...badges.filter(badge => badge.id === '3')];
                }
                if (user?.stats?.total_exams >= 5 && user?.stats?.total_exams < 10) {
                    newBadges = [...newBadges, ...badges.filter(badge => badge.id === '10')];
                }
                else if (user?.stats?.total_exams >= 10 && user?.stats?.total_exams < 50) {
                    newBadges = [...newBadges, ...badges.filter(badge => badge.id === '11')];
                }
                else if (user?.stats?.total_exams >= 50) {
                    newBadges = [...newBadges, ...badges.filter(badge => badge.id === '12')];
                }
            }
            if (user && user?.role === 'STUDENT') {
                if (user?.stats?.total_reservations >= 10 && user?.stats?.total_reservations < 50) {
                    newBadges = [...newBadges, ...badges.filter(badge => badge.id === '4')];
                }
                else if (user?.stats?.total_reservations >= 50 && user?.stats?.total_reservations < 100) {
                    newBadges = [...newBadges, ...badges.filter(badge => badge.id === '5')];
                }
                else if (user?.stats?.total_reservations >= 100) {
                    newBadges = [...newBadges, ...badges.filter(badge => badge.id === '6')];
                }
                if (user?.stats?.total_exams >= 5 && user?.stats?.total_exams < 10) {
                    newBadges = [...newBadges, ...badges.filter(badge => badge.id === '7')];
                }
                else if (user?.stats?.total_exams >= 10 && user?.stats?.total_exams < 50) {
                    newBadges = [...newBadges, ...badges.filter(badge => badge.id === '8')];
                }
                else if (user?.stats?.total_exams >= 50) {
                    newBadges = [...newBadges, ...badges.filter(badge => badge.id === '9')];
                }
            }
            if (user) {
                if (user?.stats?.total_time > 10 && user?.stats?.total_time < 50) {
                    newBadges = [...newBadges, ...badges.filter(badge => badge.id === '13')];
                }
                else if (user?.stats?.total_time > 50 && user?.stats?.total_time < 100) {
                    newBadges = [...newBadges, ...badges.filter(badge => badge.id === '14')];
                }
                else if (user?.stats?.total_time > 100) {
                    newBadges = [...newBadges, ...badges.filter(badge => badge.id === '15')];
                }
            }
            setUserBadges(newBadges);
        }

        getUserBadges();
        
    }, [newSubjects, user, user?.firstName, user?.lastName, user?.stats?.total_exams])

    const handlePasswordChange = () => {
        navigate('/change-password');
    };

    const handleDeleteAccountClick = () => {
        setShowDeleteAccountConfirmation(true);
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setShowDeleteAccountConfirmation(false);
        setIsPopupOpen(false);
        setPassword('');
    };

    const handleSubjectsChange = (selected: { subjectid: string; subjectname: string; class_price: string }[]) => {
        setNewSubjects(selected);
    }

    const handleDeleteAccount = async () => {
        if(!password){
            return
        }
        try {
            setIsDeleting(true);
            const res = await fetch(`${URL}authentication/delete-account/${user?.email}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                    'Authorization': `Bearer ${user?.token}`,
                },
                body: JSON.stringify({
                    password: password,
                }),
            });

            if (!res.ok) {
                setMessage("Incorrect password");
                throw new Error('Failed to delete user');
            }

            const response = await fetch(`${URL}authentication/delete-account`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                    'Authorization': `Bearer ${user?.token}`,
                },
                body: JSON.stringify({
                    email: user?.email
                }),
            });

            if(response.status === 400) {
                setMessage('Cannot delete account with future or in debt reservations');
                throw new Error('Failed to delete user');
            }

            if (!response.ok) {
                setMessage("Could not delete account");
                throw new Error('Failed to delete user');
            }
            logout();
        } catch(error) {
            setIsDeleting(false);
            setPassword('');
            setShowErrorMessage(true);
            handleClosePopup();
            setTimeout(() => {
                setShowErrorMessage(false)
            }, 3000);
            console.error(error);
        }
    };

    const handleProfileSave = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsSaving(true);
        if (!firstName || !lastName) {
            setMessage('Please fill all fields.');
            setShowErrorMessage(true);
            setTimeout(() => {
                setShowErrorMessage(false);
            }, 3000);
            return;
        }
        const body = {
            newFirstName: firstName,
            newLastName: lastName,
            email: user?.email,
            subjects: newSubjects.map(subject => subject.subjectid),
        }
        try{
            const response = await fetch(`${URL}authentication/edit-profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`,
                    'ngrok-skip-browser-warning': 'true',
                },
                body: JSON.stringify(body),
            });
            if (!response.ok) {
                setMessage("Could not update profile");
                throw new Error('Failed to update profile');
            }
            setIsSaving(false);
            updateUser({
                firstName: firstName,
                lastName: lastName,
                subjects: newSubjects.map(subject => ({
                    subjectid: subject.subjectid,
                    subjectname: subject.subjectname,
                    class_price: subject.class_price
                }))
            });
            setIsEditing(false);
            setMessage("Profile updated successfully");
            setShowSuccessMessage(true);
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 3000);
        }catch(error){
            console.error(error);
            setIsEditing(false);
            setIsSaving(false);
            setShowErrorMessage(true);
            setTimeout(() => {
                setShowErrorMessage(false);
            }, 3000);
        }
    };

    const handleTakeVacation = async () => {
        setShowTakeVacationPopup(true);
    }

    const handleCancelTakeVacation = () => {
        setShowTakeVacationPopup(false);
        setDateRange([null, null]);
    }

    const handleConfirmVacation = async () => {
        if(dateRange[0] === null || dateRange[1] === null) {
            setMessage('Please select a date range');
            throw new Error('Please select a date range');
        }
        try{
            setIsConfirmingVacation(true);
            const response = await fetch(`${URL}vacation/assign-vacation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`,
                    'ngrok-skip-browser-warning': 'true',
                },
                body: JSON.stringify({
                    teacherid: user?.id,
                    startdate: dateRange[0],
                    enddate: dateRange[1]
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                setMessage(data.message);
                throw new Error('Failed to take vacation');
            }
            setDateRange([null, null]);
            const currentDate = new Date();
            const startDate = new Date(dateRange[0]);
            const endDate = new Date(dateRange[1]);
            if(startDate <= currentDate && endDate >= currentDate) {
                updateUser({ isOnVacation: true });
            }
            setIsConfirmingVacation(false);
            setShowTakeVacationPopup(false);
            setMessage('Vacation programmed successfully!');
            updateUser({ has_planned_vacation: true });
            updateUser({ vacation_range: `From ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}` });            
            setShowSuccessMessage(true);
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 3000);    
        }catch(error){
            setIsConfirmingVacation(false);
            setShowErrorMessage(true);
            setTimeout(() => {
                setShowErrorMessage(false);
            }, 3000);
            console.error(error);
        }   
    }    
    const handleTerminateVacation = async () => {
        setShowTerminateVacationPopup(true)
    }

    const handleCancelTerminateVacation = () => {
        setShowTerminateVacationPopup(false);
    }

    const handleConfirmTerminateVacation = async () => {
        try{
            setIsConfirmingTerminateVacation(true);
            const response = await fetch(`${URL}vacation/stop-vacation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`,
                    'ngrok-skip-browser-warning': 'true',
                },
                body: JSON.stringify({
                    teacherid: user?.id,
                }),
            });
            if (!response.ok) {
                setMessage("Could not terminate vacation");
                throw new Error('Failed to terminate vacation');
            }
            updateUser({ isOnVacation: false });
            updateUser({ has_planned_vacation: false });
            updateUser({ vacation_range: '' });
            setIsConfirmingTerminateVacation(false);
            setShowTerminateVacationPopup(false);
            setMessage("Vacation terminated successfully!");
            setShowSuccessMessage(true);
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 3000);
        }catch(error){
            setIsConfirmingTerminateVacation(false);
            setShowErrorMessage(true);
            setTimeout(() => {
                setShowErrorMessage(false);
            }, 3000);
            console.error(error);
        }
    }
    const [dateRange, setDateRange] = useState<[string | null, string | null]>([null, null]);

    const handleDateChange = (newDateRange: [dayjs.Dayjs | null, dayjs.Dayjs | null]) => {
        const formattedDateRange: [string | null, string | null] = [
            newDateRange[0] ? newDateRange[0].format('YYYY-MM-DD HH:mm:ss') : null,
            newDateRange[1] ? newDateRange[1].format('YYYY-MM-DD HH:mm:ss') : null,
        ];
        setDateRange(formattedDateRange);
    };

    const getAvatarSource = () => {
        if (user?.avatar_id == 9) {
            return avatars[8].src;
        }
        if (user?.avatar_id) {
            return avatars[user?.avatar_id - 1].src;
        }  
    };

    const [selectedAvatarId, setSelectedAvatarId] = useState<number>(0);
    const [isSelectingAvatar, setIsSelectingAvatar] = useState(false);

    const handleConfirm = async () => {
        setIsSelectingAvatar(true);
        let suffix
        if(user?.role === 'TEACHER'){
            suffix = 'teachers';
        }else if(user?.role === 'STUDENT'){
            suffix = 'students';
        }
        try{
            const response = await fetch(`${URL + suffix}/update-avatar/${user?.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`,
                    'ngrok-skip-browser-warning': 'true',
                },
                body: JSON.stringify({
                    avatarId: selectedAvatarId,
                }),
            });
            if (!response.ok) {
                setMessage("Could not update avatar");
                throw new Error('Failed to update avatar');
            }
            updateUser({ avatar_id: selectedAvatarId });
            setIsSelectingAvatar(false);
            setShowAvatarSelectorPopup(false);
            setMessage("Avatar updated successfully");
            setShowSuccessMessage(true);
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 3000);
        }catch(error){   
            setIsSelectingAvatar(false);
            setShowAvatarSelectorPopup(false);
            setShowErrorMessage(true);
            setTimeout(() => {
                setShowErrorMessage(false);
            }, 3000);
            console.error(error);
        }
    };

    const handleCancel = () => {
        setSelectedAvatarId(user?.avatar_id || 0);
        setShowAvatarSelectorPopup(false);
    };

    const showSuccessEasterEggMessage = () => {
        setSuccessEasterEggMessage(true);
        setTimeout(() => {
            setSuccessEasterEggMessage(false);
        }, 3000);
    };

    const showErrorEasterEggMessage = () => {
        setErrorEasterEggMessage(true);
        setTimeout(() => {
            setErrorEasterEggMessage(false);
        }, 3000);
    };

    return (
        <>
        {successEasterEggMessage &&
            <Message>You have unlocked a new secret avatar!</Message>
        }
        {errorEasterEggMessage &&
            <Message error>An error has ocurred, try again later.</Message>
        }
        {openRiddlePopUp && (
            <PopUpContainer>
                <PopUp>
                    <EasterEggRiddle closeRiddle={() => setOpenRiddlePopUp(false)} successEasterEggMessage={showSuccessEasterEggMessage} errorEasterEggMessage={showErrorEasterEggMessage} />
                </PopUp>
            </PopUpContainer>
        )}
        {showTerminateVacationPopup && (
            <PopUpContainer>
                <PopUp>
                    <h2>Are you sure you want to terminate your vacation?</h2>
                    <p>{user?.vacation_range}</p>
                    <ButtonsContainer>
                        <Button important onClick={handleConfirmTerminateVacation}>{isConfirmingTerminateVacation ? <AnimatedLoadingLogo src={SimplifiedLogo}/> : "Terminate vacation" }</Button>
                        <Button secondary onClick={handleCancelTerminateVacation}>Cancel</Button>
                    </ButtonsContainer>
                </PopUp>
            </PopUpContainer>
        )}
        {showTakeVacationPopup && (
            <PopUpContainer>
                <PopUp>
                    <h2>Please provide your vacation duration</h2>
                    <CalendarContainer>
                        <DateRangeCalendarComponent onDateChange={handleDateChange} />
                    </CalendarContainer>
                    <ButtonsContainer>
                        <Button onClick={handleConfirmVacation}>{isConfirmingVacation ? <AnimatedLoadingLogo src={SimplifiedLogo}/> : "Take vacation"}</Button>
                        <Button secondary onClick={handleCancelTakeVacation}>Cancel</Button>
                    </ButtonsContainer>
                </PopUp>
            </PopUpContainer>
            )}
            {showDeleteAccountConfirmation && (
            <PopUpContainer>
                <PopUp>
                    <h2>Are you sure you want to delete your account?</h2>
                    <p>Confirm your password:</p>
                    <PasswordInput placeholder="Password.." type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <DeleteAccountButtonsContainer>
                        <Button important onClick={handleDeleteAccount}>{isDeleting ? <AnimatedLoadingLogo src={SimplifiedLogo}/> : "Delete account"}</Button>
                        <Button secondary onClick={handleClosePopup}>Cancel</Button>
                    </DeleteAccountButtonsContainer>
                </PopUp>
            </PopUpContainer>
            )}
            {showAvatarSelectorPopup && (
                <PopUpContainer>
                    <PopUp>
                        <h2>Select your avatar:</h2>
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', marginBottom: '50px' }}>
                            {avatars.map((avatar, index) => (
                                index < avatars.length - (user?.hasFoundEasterEgg ? 1 : 2) &&(
                                <div
                                    key={avatar.id}
                                    onClick={() => setSelectedAvatarId(avatar.id)}
                                    style={{
                                        cursor: 'pointer',
                                        margin: '5px',
                                        position: 'relative'
                            
                                    }}
                                >
                                    {selectedAvatarId === avatar.id && (
                                        <CheckmarkIcon><IoCheckmarkCircleOutline/></CheckmarkIcon>
                                    )}
                                    <img src={avatar.src} alt={`Avatar ${avatar.id}`} style={{ width: '80px', height: '80px', opacity: selectedAvatarId === avatar.id ? 0.5 : 1, }} />
                                </div>
                                )
                            ))}
                        </div>
                        <ButtonsContainer>
                            <Button onClick={handleConfirm}>
                                {isSelectingAvatar ? <AnimatedLoadingLogo src={SimplifiedLogo}/> : "Confirm"}
                            </Button>
                            <Button secondary onClick={handleCancel}>Cancel</Button>
                        </ButtonsContainer>
                    </PopUp>
                </PopUpContainer>
            )}
        <MainContainer openRiddlePopUp={openRiddlePopUp} isPopupOpen={isPopupOpen} showTakeVacationPopup={showTakeVacationPopup} showDeleteAccountConfirmation={showDeleteAccountConfirmation} showTerminateVacationPopup={showTerminateVacationPopup} showAvatarSelectorPopup={showAvatarSelectorPopup}>
            {showSuccessMessage && <Message>{message}</Message>}
            {showErrorMessage && <Message error>{message}</Message>}
            <SideBar/>
            <Topbar/>
            <Content>
                {!isEditing ? (
                <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3}}
                style={{ width: "90%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                <ProfileCard>
                    <ProfileCover/>
                    <UserInfo>
                        <AvatarContainer style={{ position: "absolute", top: "115px", left: "5%" }}>
                            <UserImage onClick={() => setShowAvatarSelectorPopup(true)} src={getAvatarSource()} alt="User Image" />
                            <EditIcon><HiOutlinePencilSquare /></EditIcon>
                        </AvatarContainer>
                        <UserName>{user?.firstName + ' ' + user?.lastName}</UserName>
                        <UserData>{user?.email}</UserData>
                        <UserData>{user?.role}</UserData>
                        {user?.role === 'TEACHER' && ( 
                            <UserSubjects>
                                {user?.subjects?.map((subject) => (
                                    <Subject key={subject.subjectid}>{subject.subjectname}</Subject>
                                ))}
                            </UserSubjects>
                        )}
                        <CardButtons>
                        <Button onClick={() => setIsEditing(true)}>Edit your profile</Button>
                            <Button secondary onClick={handlePasswordChange}>Change password</Button>
                            <Button crucial onClick={handleDeleteAccountClick}>Delete account</Button>
                        </CardButtons>
                    </UserInfo>
                    {user?.role === 'TEACHER' && (
                        <VacationButtonContainer>
                            {!user?.has_planned_vacation ? 
                            <VacationButton onClick={handleTakeVacation}><FaUmbrellaBeach /></VacationButton> 
                            : 
                            <VacationButton onClick={handleTerminateVacation}>Planned vacation</VacationButton>}
                        </VacationButtonContainer>
                    )}
                    <BadgesContainer>
                        <BadgeTitle>Achievements:</BadgeTitle>
                        <Badges>
                            {userBadges.length === 0 ? 
                            (          
                            <>
                                <NoBadgesMessage>You haven't unlocked any achievement yet.</NoBadgesMessage>
                            </>
                            ) 
                            : 
                            (
                                <>
                                    {userBadges.map(badge => (
                                    <div onMouseEnter={() => setHoveredBadgeId(badge.id)} onMouseLeave={() => setHoveredBadgeId(null)} style={{ position: 'relative' }}>
                                        <Badge key={badge.id} src={badge.imageUrl}/>
                                        <BadgeInfo visible={hoveredBadgeId === badge.id}>
                                            <BadgeName>{badge.name}</BadgeName>
                                            <BadgeDescription>{badge.description}</BadgeDescription>
                                        </BadgeInfo>
                                    </div>
                                ))} 
                                
                                </>
                        
                            )}
                        </Badges>
                    </BadgesContainer>
                </ProfileCard>
                </motion.div>
                ) : (
                <ProfileCard>
                    <FormContainer>
                        <FormTitle>Edit your profile</FormTitle>
                        <Form onSubmit={handleProfileSave}>
                            <InputText>First name:</InputText>
                            <Input type="text" id="username" placeholder="Username..." value={firstName} onChange={(e) => setFirstName(e.target.value)} required ></Input>
                            <InputText>Last name:</InputText>
                            <Input type="text" id="username" placeholder="Username..." value={lastName} onChange={(e) => setLastName(e.target.value)} required ></Input>
                            {user?.role === 'TEACHER' && (
                            <MultiAutocompleteInput alternative={true} defaultValue={user?.subjects?.map(subject => ({ subjectid: subject.subjectid.toString(), subjectname: subject.subjectname, class_price: subject.class_price }))} onSelect={handleSubjectsChange}/>
                            )}
                            <ButtonsContainer>
                                <Button type="submit">{isSaving ? <AnimatedLoadingLogo src={SimplifiedLogo}/> : "Save"}</Button>
                                <Button type="button" onClick={() => setIsEditing(false)} secondary>Cancel</Button>
                            </ButtonsContainer>
                        </Form>
                    </FormContainer> 
                </ProfileCard>
                )}
            
            </Content>
            <Logo onClick={() => !user?.hasFoundEasterEgg ? setOpenRiddlePopUp(true) : null}/>
        </MainContainer>
        </>
    )
}
export default Profile