import { NotificationContainer, NotificationIcon, NotificationMessage } from './components';
import { IoCloseCircleOutline, IoAlertCircleOutline  } from "react-icons/io5";


const Notification = ({ message, alternative }: { message: string, alternative?: boolean }) => {
    
    return (
        <NotificationContainer alternative={alternative}>
            <NotificationMessage alternative={alternative}>{message}</NotificationMessage>
            <NotificationIcon alternative={alternative}>{!alternative ? <IoCloseCircleOutline className="svg" /> : <IoAlertCircleOutline   className="svg" />}</NotificationIcon>
        </NotificationContainer>
    )
}

export default Notification