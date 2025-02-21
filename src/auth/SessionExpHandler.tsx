import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Message } from '../components/message/components';
import { useAuth } from './useAuth';

const SessionExpHandler = () => {
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSessionExpiration = () => {
        if (user && user.exp) {
          const expirationDate = new Date(user.exp * 1000);
          const currentDate = new Date();
          const isExpired = currentDate >= expirationDate;
          if (isExpired) {
            setShowErrorMessage(true);
            setTimeout(() => {
              setShowErrorMessage(false);
              logout();
            }, 3000);
          }
        }
    };
    checkSessionExpiration();
    const interval = setInterval(checkSessionExpiration, 60000);
    return () => clearInterval(interval);
  }, [user, logout, navigate]);

  return showErrorMessage ? <Message error>Your session has expired. You will return to the main page.</Message> : null;
};

export default SessionExpHandler;
