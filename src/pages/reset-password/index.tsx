import { useEffect, useState } from "react"
import { MainContainer, RightContainer, FormContainer, Form, InputText, Input, FormTitle, Button, ButtonsContainer } from "./components"
import { useNavigate, useParams } from 'react-router-dom';
import { Message } from "../../components/message/components";
import SimplifiedLogo from "../../assets/Logo transparent.png";
import { AnimatedLoadingLogo } from "../../components/animated-loading-logo/components";
import { ToggleVisibilityButton } from "../login/components";
import { AiTwotoneEyeInvisible, AiOutlineEye } from "react-icons/ai";
import Logo from "../../components/top-down-logo";

const ResetPassword = () => {

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const URL = import.meta.env.VITE_API_URL;

    const navigate = useNavigate();

    const { userId, token } = useParams();

    useEffect(() => {
        const confirmCredentials = async () => {
            try {
                const response = await fetch(`${URL}reset/reset-password/${userId}/${token}`, {
                    method: 'GET',
                    headers: {
                        'ngrok-skip-browser-warning': 'true',
                        'Content-Type': 'application/json'
                    }
            });
            if(!response.ok){
                alert('Failed to confirm credentials');
                navigate('/')
            }
            }catch(error){
                console.error(error);
            }
        }
        confirmCredentials();
    }, [URL, navigate, token, userId]);

    const handleChangePassword = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        if (newPassword !== currentPassword){
            alert('New password and current password do not match');
            return;
        }
        try{
            const response = await fetch(`${URL}reset/reset-password/${userId}/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                },
                body: JSON.stringify({
                    newPassword: newPassword,
                })
            });
            setIsLoading(false);
            if(!response.ok){
                throw new Error('Failed to change password');
            }

            setShowSuccessMessage(true);
            setTimeout(() => {
                setShowSuccessMessage(false);
                navigate('/');
            }, 3000);   
        }catch(error){
            console.error(error);
            setShowErrorMessage(true);
            setTimeout(() => {
                setShowErrorMessage(false);
            }, 3000);
        }

        
    }

    return(
        <MainContainer>
           {showSuccessMessage && <Message>Your new password has been saved</Message>}
           {showErrorMessage && <Message error>Could not update your password. Invalid credentials</Message>}
            <RightContainer>
                <FormContainer>
                    <FormTitle>Reset your password</FormTitle>
                    <Form onSubmit={(event) => handleChangePassword(event)}>
                        <InputText>Your new password:</InputText>
                        <div style={{ position: 'relative' }}>
                            <Input 
                                type={isVisible ? 'text' : 'password'} 
                                id="password" 
                                placeholder="Password..." 
                                value={currentPassword} 
                                onChange={(e) => setCurrentPassword(e.target.value)} 
                                required
                            />
                            <ToggleVisibilityButton
                                onClick={() => setIsVisible(!isVisible)}
                                type="button"
                            >
                                {isVisible ? <AiTwotoneEyeInvisible /> : <AiOutlineEye />}
                            </ToggleVisibilityButton>
                        </div>
                        <InputText>Confirm new password:</InputText>
                        <Input type={isVisible ? 'text' : 'password'} id="password" placeholder="Password..." value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required ></Input>
                        <ButtonsContainer>
                            <Button type="submit">{isLoading ?  <AnimatedLoadingLogo src={SimplifiedLogo}/> : "Confirm"}</Button>
                        </ButtonsContainer>
                    </Form>
                </FormContainer>
            </RightContainer>
            <Logo/>
        </MainContainer>
    )

}
export default ResetPassword;