import Logo from '../../components/top-down-logo'
import Topbar from '../../components/topbar'
import SideBar from '../../components/sidebar/sidebar'
import { BrowserWrapper, Card, CardInfo, CardsContainer, Content, Currency, LoadingSkeletonCard, MainContainer, NoSubjectsFound, PriceInput, PriceInputContainer, StaticSkeletonCard, Title, UpdateButton } from './components'
import { useEffect, useState } from 'react';
import Notification from '../../components/notification';
import TextInput from '../../components/search-input';
import { LiaSchoolSolid } from "react-icons/lia";
import { RxUpdate } from "react-icons/rx";
import { useAuth } from '../../auth/useAuth';
import { AnimatedLoadingLogo } from '../../components/animated-loading-logo/components';
import SimplifiedLogo from "../../assets/Logo transparent.png";

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
            setSubjects(data);
            console.log(data);
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

    const numStaticSkeletonCards = Math.max(0, 9 - filteredSubjects.length);
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
            if (response.ok) {
                console.log('Class price updated successfully');
            } else {
                console.error('Failed to update class price');
            }
            setSubjects(prevSubjects => prevSubjects.map(subject =>
                subject.subjectid === subject.subjectid ? { ...subject, class_price: subject.class_price } : subject
            ));
            setIsUpdating(false);
        } catch (error) {
            console.error('Error updating class price:', error);
        }
    };
    
  return (
    <MainContainer >
        <Logo />
        <Topbar/>
        <SideBar/>
        <Content>
            <BrowserWrapper>
                {isLoading ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
                        {Array.from({ length: 9 }).map((_, index) => (
                            <LoadingSkeletonCard key={index} />
                        ))}
                    </div>
                ) : (
                    (subjects.length === 0) ? 
                    <NoSubjectsFound>
                        <Notification alternative={true} message={"There are no subjects to display."} />
                    </NoSubjectsFound>
                    : (
                    <>
                    <div style={{ display: 'flex', marginBottom: '20px', alignItems:'left', width: '100%' }}>
                        <TextInput
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            icon={<LiaSchoolSolid />}
                            placeholder='Search for a subject...'
                        />
                    </div>
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
                    </>
                    )
                )}
                </BrowserWrapper>
            </Content>
    </MainContainer>
  )
}

export default UpdateSubjects