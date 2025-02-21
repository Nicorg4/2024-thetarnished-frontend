import React from 'react';
import { NavbarContainer, NavbarLink, LogOutNavbarLink, UserInfo, UserImage, UserName, UserLevel, MainLinksContainer, LogOutLinkContainer, OpenNavBar, LinkName, MainContentWrapper, UserXP, XpTutorial } from './components';
import { AiOutlineHome , AiOutlineForm , AiOutlineUser/* , AiOutlineTool */, AiOutlineSchedule, AiOutlineLogout/* , AiOutlineDatabase */ } from "react-icons/ai";
import { PiExamLight } from "react-icons/pi";
import { useAuth } from '../../auth/useAuth';
import { MdOutlineKeyboardDoubleArrowRight, MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";
import { LiaChalkboardTeacherSolid  } from "react-icons/lia";
import avatars from '../../assets/avatars/avatars';
import { MdOutlinePriceChange } from "react-icons/md";
import { GiChoice } from "react-icons/gi";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi2";
import { PiRanking } from "react-icons/pi";
import { MdOutlineQuiz } from "react-icons/md";
import { FaRegNoteSticky } from "react-icons/fa6";


const SideBar: React.FC = () => {

    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = React.useState(false);
    const [showContent, setShowContent] = React.useState(false);
    const [showXpTutorial, setShowXpTutorial] = React.useState(false);

    const handleOpen = () => {
        setIsOpen(!isOpen);
        if(!isOpen) {
            setTimeout(() => {
                setShowContent(!showContent);
            }, 200);
        }
        else {
            setShowContent(!showContent);
        }
    };

    const getAvatarSource = () => {
        if (user?.avatar_id) {
            return avatars[user.avatar_id - 1].src;
        }else if (user?.role === "ADMIN") {
            return avatars[9].src;
        }
        
    };

    const getLevelProgress = () => {
        if (user) {
            const xpNeededForNextLvl = 1000 * Math.pow(1.2, user.lvl);
            const progress = (user.xp / xpNeededForNextLvl) * 100;
            return Math.min(progress, 100);
        } else {
            return 0;
        }
    };
    
    const getXpNeededForNextLvl = () => {
        if (user) {
            return Math.floor(1000 * Math.pow(1.2, user.lvl));
        } else {
            return 0;
        }
    };

    return (
        <>
        <NavbarContainer isOpen={isOpen}>
            <MainContentWrapper>
            <UserInfo>
            <UserImage src={getAvatarSource()} alt="User Image" />
                {(user?.role !== 'ADMIN') && (
                <>
                    <UserName>{showContent && user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : ''}</UserName>
                    <UserLevel>Lvl {user?.lvl}</UserLevel>
                    {showContent && <UserXP value={getLevelProgress()} max="100" />}
                    {showContent && (
                        <UserLevel>
                            {user?.xp + '/' + getXpNeededForNextLvl()}
                            <HiOutlineQuestionMarkCircle 
                                onMouseEnter={() => setShowXpTutorial(true)} 
                                onMouseLeave={() => setShowXpTutorial(false)} 
                                style={{ color: "grey" }} 
                            />
                        </UserLevel>
                    )}   
                    <XpTutorial visible={showXpTutorial}>
                        <div className="xp-tutorial-content">
                            <h2>How to Earn Experience Points (XP)</h2>
                            <ul>
                                <li>
                                    <strong>Reserve a Class:</strong> Earn 50 XP for each class reserved.
                                </li>
                                <li>
                                    <strong>Complete a Class:</strong> Earn 100 XP for each class completed.
                                </li>
                                <li>
                                    <strong>Pass an Exam:</strong> Earn 200 XP for each exam passed.
                                </li>
                                <li>
                                    <strong>Complete the daily quiz:</strong> Earn 10 XP for each question answered correctly.
                                </li>
                            </ul>
                        </div>
                    </XpTutorial>
                </>
                )}
                
            </UserInfo>
            <OpenNavBar isOpen={isOpen} onClick={handleOpen}>
                {!isOpen ? (
                    <MdOutlineKeyboardDoubleArrowRight />
                ) : (
                    <MdOutlineKeyboardDoubleArrowLeft />
                )}
            </OpenNavBar>
            <MainLinksContainer>
            {(user?.role === 'TEACHER') && (
                <>
                <NavbarLink isOpen={showContent} title='Home' to="/teacher-home" className={({ isActive }) => (isActive ? "active" : "")}><AiOutlineHome />{showContent && <LinkName>Home</LinkName>}</NavbarLink>

                {(user?.isActive === true) && (
                <>
                <NavbarLink isOpen={showContent} title='Manage schedule' to="/manage-schedule" className={({ isActive }) => (isActive ? "active" : "")}><AiOutlineSchedule />{showContent && <LinkName>Manage Schedule</LinkName>}</NavbarLink>
                <NavbarLink isOpen={showContent} title='Manage classes' to="/manage-classes" className={({ isActive }) => (isActive ? "active" : "")}><AiOutlineForm  />{showContent && <LinkName>Manage Classes</LinkName>}</NavbarLink>
                <NavbarLink isOpen={showContent} title='Upload notes' to="/upload-notes" className={({ isActive }) => (isActive ? "active" : "")}><FaRegNoteSticky />{showContent && <LinkName>Upload notes</LinkName>}</NavbarLink>
                <NavbarLink isOpen={showContent} title='Leaderboard' to="/leaderboard" className={({ isActive }) => (isActive ? "active" : "")}><PiRanking />{showContent && <LinkName>Leaderboard</LinkName>}</NavbarLink>
                <NavbarLink isOpen={showContent} title='Daily quiz' to="/daily-quiz" className={({ isActive }) => (isActive ? "active" : "")}><MdOutlineQuiz />{showContent && <LinkName>Daily quiz</LinkName>}</NavbarLink>
                </>
                )}

                <NavbarLink isOpen={showContent} title='My profile' to="/profile" className={({ isActive }) => (isActive ? "active" : "")}><AiOutlineUser />{showContent && <LinkName>Profile</LinkName>}</NavbarLink>
                </>
            )}

            {(user?.role === 'STUDENT') && (
                <>
                <NavbarLink isOpen={showContent} title='Home' to="/student-home" className={({ isActive }) => (isActive ? "active" : "")}><AiOutlineHome />{showContent && <LinkName>Home</LinkName>}</NavbarLink>
                <NavbarLink isOpen={showContent} title='My classes' to="/my-classes" className={({ isActive }) => (isActive ? "active" : "")}><LiaChalkboardTeacherSolid   />{showContent && <LinkName>My Classes</LinkName>}</NavbarLink>
                <NavbarLink isOpen={showContent} title='My exams' to="/my-exams" className={({ isActive }) => (isActive ? "active" : "")}><PiExamLight  />{showContent && <LinkName>Exams</LinkName>}</NavbarLink>
                <NavbarLink isOpen={showContent} title='Shared notes' to="/shared-notes" className={({ isActive }) => (isActive ? "active" : "")}><FaRegNoteSticky />{showContent && <LinkName>Shared notes</LinkName>}</NavbarLink>
                <NavbarLink isOpen={showContent} title='Leaderboard' to="/leaderboard" className={({ isActive }) => (isActive ? "active" : "")}><PiRanking />{showContent && <LinkName>Leaderboard</LinkName>}</NavbarLink>
                <NavbarLink isOpen={showContent} title='Daily quiz' to="/daily-quiz" className={({ isActive }) => (isActive ? "active" : "")}><MdOutlineQuiz />{showContent && <LinkName>Daily quiz</LinkName>}</NavbarLink>
                <NavbarLink isOpen={showContent} title='My profile' to="/profile" className={({ isActive }) => (isActive ? "active" : "")}><AiOutlineUser />{showContent && <LinkName>Profile</LinkName>}</NavbarLink>
                </>
            )}
            

            {(user?.role === 'ADMIN') && (
                <>
                <NavbarLink isOpen={showContent} title='Home' to="/admin-home" className={({ isActive }) => (isActive ? "active" : "")}><AiOutlineHome />{showContent && <LinkName>Home</LinkName>}</NavbarLink>
                <NavbarLink isOpen={showContent} title='Teacher validation' to="/teacher-validation" className={({ isActive }) => (isActive ? "active" : "")}><GiChoice />{showContent && <LinkName>Teacher validation</LinkName>}</NavbarLink>
                <NavbarLink isOpen={showContent} title='Update subjects' to="/update-subjects" className={({ isActive }) => (isActive ? "active" : "")}><MdOutlinePriceChange />{showContent && <LinkName>Update subjects</LinkName>}</NavbarLink>
                </>
            )}
            {/* <NavbarLink title='Settings' to="/settings" className={({ isActive }) => (isActive ? "active" : "")}><AiOutlineTool />{showContent && <LinkName>Manage Classes</LinkName>}</NavbarLink> */}
            
            </MainLinksContainer>
            </MainContentWrapper>
            <LogOutLinkContainer>
                <LogOutNavbarLink to="/" onClick={logout}><AiOutlineLogout/>{showContent && <LinkName>Logout</LinkName>}</LogOutNavbarLink>
            </LogOutLinkContainer>
        </NavbarContainer>
        </>
    );
};
export default SideBar;
