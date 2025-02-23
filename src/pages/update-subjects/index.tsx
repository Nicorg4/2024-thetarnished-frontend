import Logo from '../../components/top-down-logo'
import Topbar from '../../components/topbar'
import SideBar from '../../components/sidebar/sidebar'
import { BrowserWrapper, Card, CardInfo, CardsContainer, Content, Currency, FormTitle, MainContainer, NoSubjectsFound, PageTitle, PriceInput, PriceInputContainer, StaticSkeletonCard, Title, UpdateButton } from './components'
import { useEffect, useState } from 'react';
import Notification from '../../components/notification';
import TextInput from '../../components/search-input';
import { LiaSchoolSolid } from "react-icons/lia";
import { RxUpdate } from "react-icons/rx";
import { useAuth } from '../../auth/useAuth';
import { AnimatedLoadingLogo } from '../../components/animated-loading-logo/components';
import SimplifiedLogo from "../../assets/Logo transparent.png";
import { Message } from '../../components/message/components';
import SimplifiedLogoAlt from "../../assets/Logo transparent alt.png";
import { motion } from 'framer-motion';
import { Button } from '../../components/main-button/components';
import { PopUp, PopUpContainer } from '../../components/popup/components';
import { IoAddCircleOutline } from "react-icons/io5";
import { ButtonsContainer, Form, Input, InputText } from '../profile/components';

interface Subject {
    subjectid: string;
    subjectname: string;
    class_price: number;
}

const UpdateSubjects = () => {

    const URL = import.meta.env.VITE_API_URL;
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [showAddSubjectPopUp, setShowAddSubjectPopUp] = useState(false);
    const [newSubjectName, setNewSubjectName] = useState("");
    const [newSubjectPrice, setNewSubjectPrice] = useState<number>(0);
    const [isCreating, setIsCreating] = useState(false);
    const [message, setMessage] = useState("");

    const { user } = useAuth();

    useEffect(() => {
        const getAllSubjects = async () => {
            try {
            const response = await fetch(`${URL}subject/all-subjects`, {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
                },
            });
            const data = await response.json();
            setSubjects(data || []);
            setIsLoading(false);
            } catch (error) {
            console.error('Error fetching subjects:', error);
            }
        };

    getAllSubjects();
    }, [URL]);


    const filteredSubjects = subjects.filter(subject =>
        subject.subjectname.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const numStaticSkeletonCards = 0 /* Math.max(0, 9 - filteredSubjects.length); */
    const cardsToDisplay = [...filteredSubjects.map(item => item), ...Array(numStaticSkeletonCards).fill(null)];

    const handlePriceChange = (index: number, newPrice: number) => {
        const updatedSubjects = [...subjects];
        updatedSubjects[index].class_price = newPrice;
        setSubjects(updatedSubjects);
    };

    const updateClassPrice = async (subject: Subject) => {
        setIsUpdating(true);
        setSelectedSubject(subject)
        try {
            const response = await fetch(`${URL}subject/update-subject/${subject.subjectid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`,
                    'ngrok-skip-browser-warning': 'true',
                },
                body: JSON.stringify({ class_price: subject.class_price }),
            });
            if (!response.ok) {
                setMessage("Failed to update class price");
                throw new Error('Failed to update class price');
            }
            setSubjects(prevSubjects => prevSubjects.map(subject =>
                subject.subjectid === subject.subjectid ? { ...subject, class_price: subject.class_price } : subject
            ));
            setIsUpdating(false);
            setMessage("Class price updated successfully!");
            setShowSuccessMessage(true);
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 3000);
        } catch (error) {
            setShowErrorMessage(true);
            setIsUpdating(false);
            setTimeout(() => {
                setShowErrorMessage(false);
            }, 3000);
            console.error('Error updating class price:', error);
        }
    };

    const handleCreateSubject = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);
        try {
            const response = await fetch(`${URL}subject/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`,
                    'ngrok-skip-browser-warning': 'true',
                },
                body: JSON.stringify({
                    subjectname: newSubjectName,
                    class_price: newSubjectPrice
                }),
            });
            if (!response.ok) {
                setMessage('Failed to create subject');
                throw new Error('Failed to create subject');
            }
            const newSubject = await response.json();
            setSubjects(prev => [...prev, newSubject]);
            setMessage('Subject created successfully');
            setShowSuccessMessage(true);
            setShowAddSubjectPopUp(false);
            setNewSubjectName("");
            setNewSubjectPrice(0);
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 3000);
        } catch (error) {
            setShowErrorMessage(true);
            setTimeout(() => {
                setShowErrorMessage(false);
            }, 3000);
            console.error('Error creating subject:', error);
        }
        setIsCreating(false);
    };

    const handleShowAddSubjectPopUp = () => {
        setShowAddSubjectPopUp(true);
    };

    const handlePopupClose = () => {
        setShowAddSubjectPopUp(false);
        setNewSubjectName("");
        setNewSubjectPrice(0);
    };
    
  return (
    <>
    {showAddSubjectPopUp && (
        <PopUpContainer>
            <PopUp>
                <FormTitle>Create new subject</FormTitle>
                <Form style={{minWidth:'300px'}} onSubmit={handleCreateSubject}>
                    <InputText >Name:</InputText>
                    <Input  type="text" id="name" placeholder="Name..." value={newSubjectName} onChange={(e) => setNewSubjectName(e.target.value)} required ></Input>
                    <InputText >Price:</InputText>
                    <Input  type="number" id="price" placeholder="price..." value={newSubjectPrice} onChange={(e) => setNewSubjectPrice(Number(e.target.value))} required ></Input>
                    <ButtonsContainer>
                        <Button type="submit">{isCreating ? <AnimatedLoadingLogo src={SimplifiedLogo}/> : "Save"}</Button>
                        <Button type="button" onClick={() => handlePopupClose()} secondary>Cancel</Button>
                    </ButtonsContainer>
                </Form>
            </PopUp>
        </PopUpContainer>
    )}
    <MainContainer >
        {showSuccessMessage && <Message>{message}</Message>}
        {showErrorMessage && <Message error>{message}</Message>}
        <Logo />
        <Topbar/>
        <SideBar/>
        <Content>
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: 0.3 }}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '95%'
                }}
            >
            <PageTitle>Update subjects</PageTitle>
            </motion.div>
                {isLoading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'center'}}>
                        <AnimatedLoadingLogo src={SimplifiedLogoAlt} width='70px' height='70px' />
                    </div>
                ) : (
                    <>
                <BrowserWrapper>
                {subjects.length !== 0 && (
                    <div style={{ display: 'flex', marginBottom: '20px', alignItems:'center', width: '100%', justifyContent: 'center'}}>
                        <TextInput
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            icon={<LiaSchoolSolid />}
                            placeholder='Search for a subject...'
                        />
                        <Button style={{height:'56px'}} onClick={handleShowAddSubjectPopUp}><IoAddCircleOutline size={25}/></Button>
                    </div>
                    )}
                    
                    {cardsToDisplay.length > 0 ? (
                    <CardsContainer style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '100%'}}>
                        {cardsToDisplay.map((subject, index) => (
                            subject ? (
                                <Card 
                                    key={subject.subjectname}
                                    role="button" 
                                    tabIndex={0}
                                    aria-label={`Subject: ${subject.subjectname}`}
                                >  
                                
                                    <CardInfo>
                                        <Title>{subject.subjectname}</Title>
                                        <PriceInputContainer>
                                            <Currency>$</Currency>
                                            <PriceInput value={subject.class_price} type='number' onChange={(e) => handlePriceChange(index, parseFloat(e.target.value))} />
                                            <UpdateButton onClick={() => updateClassPrice(subject)}>{isUpdating && subject === selectedSubject ? <AnimatedLoadingLogo src={SimplifiedLogo}/> : <RxUpdate />}</UpdateButton>
                                        </PriceInputContainer>
                                    </CardInfo>
                                </Card>
                            ) : (
                                <StaticSkeletonCard key={`skeleton-${index}`} />
                            )
                        ))}
                    </CardsContainer>
                    ) : (
                        <NoSubjectsFound>
                            <Notification alternative={true} message={"There are no subjects to display."} />
                            <Button style={{gap:'5px', height:'56px'}}onClick={handleShowAddSubjectPopUp}>Add new subject<IoAddCircleOutline size={25}/></Button>
                        </NoSubjectsFound>
          
                    )}
                </BrowserWrapper>
                </>
                )}
            </Content>
    </MainContainer>
    </>
  )

}
export default UpdateSubjects