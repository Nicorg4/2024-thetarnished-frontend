import { useAuth } from "../../auth/useAuth";
import { FullMenuContainer, FullMenuLink, Logo, MenuButton, MenuWrapper, SingOutLink, TopbarContainer } from './components';
import { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoCloseSharp } from "react-icons/io5";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi2";
import { IoCloseOutline } from "react-icons/io5";
import { PiRanking } from "react-icons/pi";
import { MdOutlineQuiz } from "react-icons/md";
import { FaRegNoteSticky } from "react-icons/fa6";

const Topbar = () => {

  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenuOpen = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const logoutUser = () => {
    logout();
  };

  return (
    <TopbarContainer>
        <MenuWrapper>
            <Logo src={LogoSimplified}/>
            <MenuButton onClick={toggleMenuOpen}>
                {isMenuOpen ? <IoCloseSharp /> : <RxHamburgerMenu />}
            </MenuButton>
        </MenuWrapper>
        {isMenuOpen && (
        <FullMenuContainer>
          {(user?.role === 'TEACHER') && (
                  <>
                  <FullMenuLink title='Home' to="/teacher-home" className={({ isActive }) => (isActive ? "active" : "")}><AiOutlineHome />Home</FullMenuLink>
  
                  {(user?.isActive === true) && (
                  <>
                  <FullMenuLink title='Manage schedule' to="/manage-schedule" className={({ isActive }) => (isActive ? "active" : "")}><AiOutlineSchedule />Manage schedule</FullMenuLink>
                  <FullMenuLink title='Manage classes' to="/manage-classes" className={({ isActive }) => (isActive ? "active" : "")}><AiOutlineForm  />Manage classes</FullMenuLink>
                  <FullMenuLink title='Upload notes' to="/upload-notes" className={({ isActive }) => (isActive ? "active" : "")}><FaRegNoteSticky />Upload notes</FullMenuLink>
                  <FullMenuLink title='Leaderboard' to="/leaderboard" className={({ isActive }) => (isActive ? "active" : "")}><PiRanking />Leaderboard</FullMenuLink>
                  <FullMenuLink title='Daily quiz' to="/daily-quiz" className={({ isActive }) => (isActive ? "active" : "")}><MdOutlineQuiz />Daily quiz</FullMenuLink>
                  </>
                  )}
  
                  <FullMenuLink title='My profile' to="/profile" className={({ isActive }) => (isActive ? "active" : "")}><AiOutlineUser />My profile</FullMenuLink>
                  </>
              )}

          {(user?.role === 'STUDENT') && (
              <>
              <FullMenuLink title='Home' to="/student-home" className={({ isActive }) => (isActive ? "active" : "")}><AiOutlineHome />Home</FullMenuLink>
              <FullMenuLink title='My classes' to="/my-classes" className={({ isActive }) => (isActive ? "active" : "")}><LiaChalkboardTeacherSolid   />My classes</FullMenuLink>
              <FullMenuLink title='My exams' to="/my-exams" className={({ isActive }) => (isActive ? "active" : "")}><PiExamLight  />My Exams</FullMenuLink>
              <FullMenuLink title='Shared notes' to="/shared-notes" className={({ isActive }) => (isActive ? "active" : "")}><FaRegNoteSticky />Shared notes</FullMenuLink>
              <FullMenuLink title='Leaderboard' to="/leaderboard" className={({ isActive }) => (isActive ? "active" : "")}><PiRanking />Leaderboard</FullMenuLink>
              <FullMenuLink title='Daily quiz' to="/daily-quiz" className={({ isActive }) => (isActive ? "active" : "")}><MdOutlineQuiz />Daily quiz</FullMenuLink>
              <FullMenuLink title='My profile' to="/profile" className={({ isActive }) => (isActive ? "active" : "")}><AiOutlineUser />Profile</FullMenuLink>
              </>
          )}

          {(user?.role === 'ADMIN') && (
                <>
                <FullMenuLink title='Home' to="/admin-home" className={({ isActive }) => (isActive ? "active" : "")}><AiOutlineHome />Home</FullMenuLink>
                </>
            )}
          {/* <FullMenuLink title='Settings' to="/settings" className={({ isActive }) => (isActive ? "active" : "")}>Settings</FullMenuLink> */}
          <SingOutLink to='/' onClick={logoutUser}><AiOutlineLogout />Log out</SingOutLink>
        </FullMenuContainer>
        )}
    </TopbarContainer>
  )
}

export default Topbar
