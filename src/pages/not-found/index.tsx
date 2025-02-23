import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/main-button/components';
import Notification from '../../components/notification/index.tsx';
import { Content, MainContainer, PencilImage } from './components.tsx';
import { Logo } from '../../components/topbar/components.tsx';
import image1 from '../../assets/pencil.png';

const NotFound = () => {
  const navigate = useNavigate();

  const getUserHome = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role === 'ADMIN') return '/admin-home';
    if (user.role === 'STUDENT') return '/student-home';
    if (user.role === 'TEACHER') return '/teacher-home';
    return '/';
  };

  return (
    <MainContainer>
      <Logo />
      <Content style={{ textAlign: 'center'}}>
      <PencilImage src={image1} alt="Pencil" style={{ position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)', height: 'auto' }} />
        <Notification message="404 - Page Not Found" />
        <p style={{ fontSize: '1.2rem'}}>
          It looks like you've ventured off the beaten path. Don't worry, we'll get you back home in no time!
        </p>
        <Button secondary onClick={() => navigate(getUserHome())} style={{ marginTop: '30px', padding: '10px 20px', fontSize: '1rem' }}>
          Go Back Home
        </Button>
      </Content>
    </MainContainer>
  );
};

export default NotFound;
