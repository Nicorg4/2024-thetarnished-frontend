import { useAuth } from "../../auth/useAuth";
import { CloseButton, FullMenuContainer, FullMenuLink, Logo, MenuButton, MenuWrapper, PageName, SingOutLink, TopbarContainer, UserImage, UserImageAlt, UserInfo, UserLevel, UserName, UserXP, XpTutorial } from './components';
import React, { useState } from "react";
import LogoSimplified from "../../assets/Logo transparent alt.png";
import { AiOutlineHome , AiOutlineForm , AiOutlineUser/* , AiOutlineTool */, AiOutlineSchedule, AiOutlineLogout/* , AiOutlineDatabase */ } from "react-icons/ai";
import { PiExamLight } from "react-icons/pi";
import { LiaChalkboardTeacherSolid  } from "react-icons/lia";
import { MdOutlinePriceChange } from "react-icons/md";
import { GiChoice } from "react-icons/gi";
import { useLocation, useNavigate } from "react-router-dom";
import avatars from '../../assets/avatars/avatars';
import { IoCloseSharp } from "react-icons/io5";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi2";
import { IoCloseOutline } from "react-icons/io5";
import { PiRanking } from "react-icons/pi";

const Topbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const [showXpTutorial, setShowXpTutorial] = React.useState(false);

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
    "/my-exams": "My Exams",
    "/admin-home": "Home",
    "/teacher-validation": "Teacher Validation",
    "/update-subjects": "Update Subjects",
    "/exam/:examId": "Exam Details",
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
        return avatars[9].src;
    }
    
  };

  const getLevelProgress = () => {
    if (user) {
        const xpNeededForCurrentLvl = 1000 * Math.pow(1.2, user?.lvl - 1);
        const currentProgress = user?.xp / xpNeededForCurrentLvl * 100
        return currentProgress;
    }
    else {
        return 0;
    }
  };

  const getXpNeededForCurrentLvl = () => {
    if (user) {
        const xpNeededForCurrentLvl = 1000 * Math.pow(1.2, user?.lvl - 1);
        return xpNeededForCurrentLvl;
    }
    else {
        return 0;
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
          <UserInfo>
            <UserImageAlt src={getAvatarSource()} alt="User Image" />
                {(user?.role !== 'ADMIN') && (
                <>
                    <UserName>{user && `${user.firstName} ${user.lastName}`}</UserName>
                    <UserLevel>Lvl {user?.lvl}</UserLevel>
                    <UserXP value={getLevelProgress()} max="100"/>
                    <UserLevel>{user?.xp + '/' + getXpNeededForCurrentLvl()}<HiOutlineQuestionMarkCircle onClick={() => setShowXpTutorial(true)} style={{color: "grey"}}/></UserLevel>
                    <XpTutorial visible={showXpTutorial}>
                        <CloseButton onClick={() => setShowXpTutorial(false)}><IoCloseOutline /></CloseButton>
                        <div>
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
                            </ul>
                        </div>
                    </XpTutorial>
                </>
                )}
                
          </UserInfo>
          {(user?.role === 'TEACHER') && (
                  <>
                  <FullMenuLink title='Home' to="/teacher-home" className={({ isActive }) => (isActive ? "active" : "")}><AiOutlineHome />Home</FullMenuLink>
  
                  {(user?.isActive === true) && (
                  <>
                  <FullMenuLink title='Manage schedule' to="/manage-schedule" className={({ isActive }) => (isActive ? "active" : "")}><AiOutlineSchedule />Manage schedule</FullMenuLink>
                  <FullMenuLink title='Manage classes' to="/manage-classes" className={({ isActive }) => (isActive ? "active" : "")}><AiOutlineForm  />Manage classes</FullMenuLink>
                  <FullMenuLink title='Leaderboard' to="/leaderboard" className={({ isActive }) => (isActive ? "active" : "")}><PiRanking />Leaderboard</FullMenuLink>
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
              <FullMenuLink title='Leaderboard' to="/leaderboard" className={({ isActive }) => (isActive ? "active" : "")}><PiRanking />Leaderboard</FullMenuLink>
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
