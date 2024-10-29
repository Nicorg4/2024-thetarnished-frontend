import React from 'react';
import { NavbarContainer, NavbarLink, LogOutNavbarLink, UserInfo, UserImage, UserName, UserLevel, MainLinksContainer, LogOutLinkContainer, OpenNavBar, LinkName, MainContentWrapper, UserXP } from './components';
import { AiOutlineHome , AiOutlineForm , AiOutlineUser/* , AiOutlineTool */, AiOutlineSchedule, AiOutlineLogout/* , AiOutlineDatabase */ } from "react-icons/ai";
import { PiExamLight } from "react-icons/pi";
import { useAuth } from '../../auth/useAuth';
import { MdOutlineKeyboardDoubleArrowRight, MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";
import { LiaChalkboardTeacherSolid  } from "react-icons/lia";
import avatars from '../../assets/avatars/avatars';
import { MdOutlinePriceChange } from "react-icons/md";
import { GiChoice } from "react-icons/gi";


const SideBar: React.FC = () => {

    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = React.useState(false);
    const [showContent, setShowContent] = React.useState(false);

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
            return avatars[8].src;
        }
        
    };

    return (
        <NavbarContainer isOpen={isOpen}>
            <MainContentWrapper>
            <UserInfo>
            <UserImage src={getAvatarSource()} alt="User Image" />
                {(user?.role !== 'ADMIN') && (
                <>
                    <UserName>{showContent && user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : ''}</UserName>
                    <UserLevel>Lvl 1</UserLevel>
                    {showContent && <UserXP value="70" max="100"/>}
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
                </>
                )}

                <NavbarLink isOpen={showContent} title='My profile' to="/profile" className={({ isActive }) => (isActive ? "active" : "")}><AiOutlineUser />{showContent && <LinkName>Profile</LinkName>}</NavbarLink>
                </>
            )}

            {(user?.role === 'STUDENT') && (
                <>
                <NavbarLink isOpen={showContent} title='Home' to="/student-home" className={({ isActive }) => (isActive ? "active" : "")}><AiOutlineHome />{showContent && <LinkName>Home</LinkName>}</NavbarLink>
                <NavbarLink isOpen={showContent} title='My classes' to="/my-classes" className={({ isActive }) => (isActive ? "active" : "")}><LiaChalkboardTeacherSolid   />{showContent && <LinkName>My Classes</LinkName>}</NavbarLink>
                <NavbarLink isOpen={showContent} title='My exams' to="/exam-viewer" className={({ isActive }) => (isActive ? "active" : "")}><PiExamLight  />{showContent && <LinkName>Exams</LinkName>}</NavbarLink>
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
    );
};
export default SideBar;
