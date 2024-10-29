import SideBar from '../../components/sidebar/sidebar';
import Topbar from '../../components/topbar';
import Dashboard, { Content, MainContainer } from './components';

const AdminHome = () => {
  return (
    <MainContainer>
        <Topbar/>
        <SideBar/>
        <Content>
            <Dashboard/>
        </Content>   
    </MainContainer>
  )
}

export default AdminHome