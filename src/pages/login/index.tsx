import React, { useEffect, useState } from "react"
import { MainContainer, LeftContainer, RightContainer, Image, FormContainer, Form, InputText, Input, FormTitle, Button, ToggleVisibilityButton, ButtonsContainer, AnimatedStars, Star, ForgotPass, TopContainer, StarsContainer } from "./components"
import { AiTwotoneEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import Logo from "../../assets/Logo.png";
import SimplifiedLogo from "../../assets/Logo transparent.png";
import { useAuth } from "../../auth/useAuth";
import { AnimatedLoadingLogo } from "../../components/animated-loading-logo/components";

const Login = () => {

    const { login, checkSession } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [isLogging, setIsLogging] = useState(false);
    const [invalidCredentials, setInvalidCredentials] = useState(false);
    
    const navigate = useNavigate();

    useEffect(() => {
        checkSession();
    }, [checkSession])

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try{
            setIsLogging(true);
            await login(email, password);
            setIsLogging(false);
        }
        catch(error){
            setIsLogging(false);
            console.error(error);
            setInvalidCredentials(true);
        }
    }

    const handleRegisterButtonClick = () => {
        navigate("/register");
    }

    return(
        <MainContainer>
            <LeftContainer>
                <Image src={Logo}></Image>
            </LeftContainer>
            <TopContainer>
                <Image src={Logo}></Image>
            </TopContainer>
            <RightContainer>
            <StarsContainer>
                <AnimatedStars xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
                    <Star cx="100" cy="100" r="2" delay="2s"/>
                    <Star cx="200" cy="200" r="2" delay="0s"/>
                    <Star cx="300" cy="300" r="2" delay="1s"/>
                    <Star cx="500" cy="100" r="2" delay="0s"/>
                    <Star cx="600" cy="500" r="2" delay="0s"/>
                    <Star cx="700" cy="300" r="2" delay="1s"/>
                    <Star cx="100" cy="500" r="2" delay="2s"/>
                    <Star cx="300" cy="600" r="2" delay="1s"/>
                    <Star cx="650" cy="50" r="2" delay="1s"/>
                </AnimatedStars>
            </StarsContainer>
                <FormContainer>
                    {invalidCredentials && <p style={{color: 'red'}}>Invalid credentials. Please try again.</p>}
                    <FormTitle>Welcome!</FormTitle>
                    <Form onSubmit={handleLogin}>
                        <InputText>Email:</InputText>
                        <Input type="text" id="email" placeholder="Email..." value={email} onChange={(e) => setEmail(e.target.value)} required ></Input>
                        <InputText>Password:</InputText>
                        <div style={{ position: 'relative' }}>
                            <Input 
                                type={isVisible ? 'text' : 'password'} 
                                id="password" 
                                placeholder="Password..." 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                                style={{ paddingRight: '30px' }}
                            />
                            <ToggleVisibilityButton
                                onClick={() => setIsVisible(!isVisible)}
                                type="button"
                            >
                                {isVisible ? <AiTwotoneEyeInvisible /> : <AiOutlineEye />}
                            </ToggleVisibilityButton>
                        </div>
                        <ButtonsContainer>
                            <Button type="submit">{isLogging ? <AnimatedLoadingLogo src={SimplifiedLogo}/> : "Login"}</Button>
                            <Button type="button" onClick={handleRegisterButtonClick} secondary>Register</Button>
                            <ForgotPass to="/forgot-password">Forgot Password?</ForgotPass>
                        </ButtonsContainer>
                    </Form>
                </FormContainer>
            </RightContainer>
        </MainContainer>
    )
}
export default Login;