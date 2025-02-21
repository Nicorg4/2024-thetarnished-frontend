import React from 'react';
import { NavbarContainer, NavbarLink, LogOutNavbarLink } from './components';
import { AiOutlineHome , AiOutlineForm , AiOutlineUser/* , AiOutlineTool */, AiOutlineSchedule, AiOutlineLogout/* , AiOutlineDatabase */, AiOutlineGroup } from "react-icons/ai";
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

    return (
        <NavbarContainer>
            {(user?.role === 'TEACHER') && (
                <>
                <NavbarLink title='Home' to="/teacher-home" className={({ isActive }) => (isActive ? "active" : "")}><AiOutlineHome /></NavbarLink>

                {(user?.isActive === true) && (
                <>
                <NavbarLink isOpen={showContent} title='Manage schedule' to="/manage-schedule" className={({ isActive }) => (isActive ? "active" : "")}><AiOutlineSchedule />{showContent && <LinkName>Manage Schedule</LinkName>}</NavbarLink>
                <NavbarLink isOpen={showContent} title='Manage classes' to="/manage-classes" className={({ isActive }) => (isActive ? "active" : "")}><AiOutlineForm  />{showContent && <LinkName>Manage Classes</LinkName>}</NavbarLink>
                <NavbarLink isOpen={showContent} title='Upload notes' to="/upload-notes" className={({ isActive }) => (isActive ? "active" : "")}><FaRegNoteSticky />{showContent && <LinkName>Upload notes</LinkName>}</NavbarLink>
                <NavbarLink isOpen={showContent} title='Leaderboard' to="/leaderboard" className={({ isActive }) => (isActive ? "active" : "")}><PiRanking />{showContent && <LinkName>Leaderboard</LinkName>}</NavbarLink>
                <NavbarLink isOpen={showContent} title='Daily quiz' to="/daily-quiz" className={({ isActive }) => (isActive ? "active" : "")}><MdOutlineQuiz />{showContent && <LinkName>Daily quiz</LinkName>}</NavbarLink>
                </>
                )}

                <NavbarLink title='My profile' to="/profile" className={({ isActive }) => (isActive ? "active" : "")}><AiOutlineUser /></NavbarLink>
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
                <NavbarLink title='Home' to="/admin-home" className={({ isActive }) => (isActive ? "active" : "")}><AiOutlineHome /></NavbarLink>
                </>
            )}
            
            {/* <NavbarLink title='Settings' to="/settings" className={({ isActive }) => (isActive ? "active" : "")}><AiOutlineTool /></NavbarLink> */}
            <LogOutNavbarLink to="/" onClick={logout}><AiOutlineLogout/></LogOutNavbarLink>
        </NavbarContainer>
    );
};

export default SideBar;
