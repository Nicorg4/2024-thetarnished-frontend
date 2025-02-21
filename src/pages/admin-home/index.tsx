import SideBar from '../../components/sidebar/sidebar';
import Logo from '../../components/top-down-logo';
import Topbar from '../../components/topbar';
import Dashboard, { Content, MainContainer } from './components';

const AdminHome = () => {
  return (
    <MainContainer>
        <Topbar/>
        <SideBar/>
        <Logo/>
        <Content>
            <Dashboard/>
        </Content>   
    </MainContainer>
  )
}

export default AdminHome