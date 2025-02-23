import Logo from '../../components/top-down-logo'
import Topbar from '../../components/topbar'
import SideBar from '../../components/sidebar/sidebar'
import { BrowserWrapper, Card, CardInfo, CardsContainer, Content, Currency, MainContainer, NoSubjectsFound, PageTitle, PriceInput, PriceInputContainer, StaticSkeletonCard, Title, UpdateButton } from './components'
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
                throw new Error('Failed to update class price');
            }
            setSubjects(prevSubjects => prevSubjects.map(subject =>
                subject.subjectid === subject.subjectid ? { ...subject, class_price: subject.class_price } : subject
            ));
            setIsUpdating(false);
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
    
  return (
    <MainContainer >
        {showSuccessMessage && <Message>Subject cost updated successfully!</Message>}
        {showErrorMessage && <Message error>Failed to update subject cost.</Message>}
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
                        </NoSubjectsFound>
          
                    )}
                </BrowserWrapper>
                </>
                )}
            </Content>
    </MainContainer>
  )
}

export default UpdateSubjects