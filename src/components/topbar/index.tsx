import { useAuth } from "../../auth/useAuth";
import { FullMenuContainer, FullMenuLink, Logo, MenuButton, MenuWrapper, PageName, SingOutLink, TopbarContainer, UserImage } from './components';
import { useState } from "react";
import LogoSimplified from "../../assets/Logo transparent alt.png";
import { AiOutlineHome , AiOutlineForm , AiOutlineUser/* , AiOutlineTool */, AiOutlineSchedule, AiOutlineLogout/* , AiOutlineDatabase */ } from "react-icons/ai";
import { PiExamLight } from "react-icons/pi";
import { LiaChalkboardTeacherSolid  } from "react-icons/lia";
import { MdOutlinePriceChange } from "react-icons/md";
import { GiChoice } from "react-icons/gi";
import { useLocation, useNavigate } from "react-router-dom";
import avatars from '../../assets/avatars/avatars';
import { IoCloseSharp } from "react-icons/io5";

const Topbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenuOpen = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const logoutUser = () => {
    logout();
  };

  const pageNames: { [key: string]: string } = {
    "/teacher-home": "Home",
    "/manage-schedule": "Manage Schedule",
    "/manage-classes": "Manage Classes",
    "/profile": "My Profile",
    "/student-home": "Home",
    "/my-classes": "My Classes",
    "/exam-viewer": "My Exams",
    "/admin-home": "Home",
    "/teacher-validation": "Teacher Validation",
    "/update-subjects": "Update Subjects"
  };

  const activePageName = pageNames[location.pathname] || "Active Page";

  const navigate = useNavigate();

  const getHome = () => {
    if (user?.role === 'TEACHER') {
      return "/teacher-home";
    } else if (user?.role === 'STUDENT') {
      return "/student-home";
    } else if (user?.role === 'ADMIN') {
      return "/admin-home";
    }
    return "/";
  };

  const getAvatarSource = () => {
    if (user?.avatar_id) {
        return avatars[user.avatar_id - 1].src;
    }else if (user?.role === "ADMIN") {
        return avatars[8].src;
    }
    
};

  return (
    <TopbarContainer>
        <MenuWrapper>
            <Logo onClick={() => navigate(getHome())} src={LogoSimplified}/>
            <PageName>{activePageName}</PageName>
            <MenuButton onClick={toggleMenuOpen}>
                {isMenuOpen ? <IoCloseSharp /> : <UserImage src={getAvatarSource()} alt="User Image" />}
                
            </MenuButton>
        </MenuWrapper>
        {isMenuOpen && (
        <FullMenuContainer isOpen={isMenuOpen}>
          {(user?.role === 'TEACHER') && (
                  <>
                  <FullMenuLink title='Home' to="/teacher-home" className={({ isActive }) => (isActive ? "active" : "")}><AiOutlineHome />Home</FullMenuLink>
  
                  {(user?.isActive === true) && (
                  <>
                  <FullMenuLink title='Manage schedule' to="/manage-schedule" className={({ isActive }) => (isActive ? "active" : "")}><AiOutlineSchedule />Manage schedule</FullMenuLink>
                  <FullMenuLink title='Manage classes' to="/manage-classes" className={({ isActive }) => (isActive ? "active" : "")}><AiOutlineForm  />Manage classes</FullMenuLink>
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
              <FullMenuLink title='My profile' to="/profile" className={({ isActive }) => (isActive ? "active" : "")}><AiOutlineUser />Profile</FullMenuLink>
              </>
          )}

          {(user?.role === 'ADMIN') && (
                <>
                <FullMenuLink title='Home' to="/admin-home" className={({ isActive }) => (isActive ? "active" : "")}><AiOutlineHome />Home</FullMenuLink>
                <FullMenuLink title='Teacher validation' to="/teacher-validation" className={({ isActive }) => (isActive ? "active" : "")}><GiChoice />Teacher validation</FullMenuLink>
                <FullMenuLink title='Update subjects' to="/update-subjects" className={({ isActive }) => (isActive ? "active" : "")}><MdOutlinePriceChange />Update subjects</FullMenuLink>
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
