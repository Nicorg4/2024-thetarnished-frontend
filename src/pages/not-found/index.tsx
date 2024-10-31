import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/main-button/components';
import Notification from '../../components/notification/index.tsx';
import { Content, MainContainer} from './components.tsx';
import { Logo } from '../../components/topbar/components.tsx';


const NotFound = () => {

    const navigate = useNavigate();

    const getUserHome = () => {
        let home = '/';
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (user.role === 'ADMIN') {
            home = '/admin-home';
        } else if (user.role === 'STUDENT') {
            home = '/student-home';
        } else if (user.role === 'TEACHER'){
            home = '/teacher-home';
        } else {
            home = '/';
        }
        return home;
    }
    
    return (
        <MainContainer>
            <Logo/>
            <Content>
                <Notification message={'404 page not found.'}/>
                <Button secondary onClick={() => navigate(getUserHome())}>Go back</Button>
            </Content>
        </MainContainer>
    )
}

export default NotFound