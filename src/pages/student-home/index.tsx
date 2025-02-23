import { Content, MainContainer, CardsWrapper, Card, CardSubject, ButtonsContainer, TutorialButtonContainer, TutorialButton, PageNumber, MainWrapper, NotificationContainer } from "./components";
import SideBar from "../../components/sidebar/sidebar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "../../components/main-button/components";
import Topbar from "../../components/topbar";
import { useAuth } from "../../auth/useAuth";
import { motion } from 'framer-motion';
import Notification from "../../components/notification";
import TextInput from "../../components/search-input";
import { LiaSchoolSolid } from "react-icons/lia";
import { PopUp, PopUpContainer } from "../../components/popup/components";
import { PiWarningCircle } from "react-icons/pi";
import Logo from "../../components/top-down-logo";
import { AnimatedLoadingLogo } from "../../components/animated-loading-logo/components";
import SimplifiedLogoAlt from "../../assets/Logo transparent alt.png";


interface Subject {
  subjectid: number;
  subjectname: string;
}

const Home = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const {user} = useAuth();
  const [showTutorialPopUp, setShowTutorialPopUp] = useState(false)
  const widthUmbral1 = 1500;
  const widthUmbral2 = 900;
  const widthUmbral3 = 600;
  const [pageWidth, setPageWidth] = useState(window.innerWidth);
  const URL = import.meta.env.VITE_API_URL;

  const getItemsPerPage = (width: number) => {
    if (width > widthUmbral1) return 15;
    if (width > widthUmbral2) return 9;
    if (width > widthUmbral3) return 4;
    return 3;
  };

  const ITEMS_PER_PAGE = getItemsPerPage(pageWidth);

  const handleSubjectSearch = (subjectId: number, subjectName: string) => {
    navigate(`/class-browser/${subjectId}/${subjectName}`);
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 0));
  };

  useEffect(() => {
    setShowTutorialPopUp(user?.xp == 0);
    const handleWidthChange = () => {
      setPageWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleWidthChange);

    handleWidthChange();

    const fetchSubjects = async () => {
      try {
        const response = await fetch(`${URL}subject/all-subjects-dictated`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.token}`,
            'ngrok-skip-browser-warning': 'true',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setSubjects(data.results || []);	
        setIsLoading(false);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchSubjects();
    
    return () => {
      window.removeEventListener('resize', handleWidthChange);
    };
  }, [URL, user?.token, user?.xp]);

  const filteredSubjects = subjects.filter(subject =>
    subject.subjectname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSubjects.length / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentSubjects = filteredSubjects.slice(startIndex, endIndex);
  const skeletonCount = 0/* ITEMS_PER_PAGE - currentSubjects.length;
 */
  const handleClosePopup = () => {
    setShowTutorialPopUp(false)
  }

  return (
    <>
    {showTutorialPopUp && 
    <PopUpContainer>
      <PopUp>
        <h2>Select Your Subject</h2>
        <p>Here you can choose the subject for which you want to take classes.</p>
        <p>
          Once you select the subject, you will proceed to another screen where you can choose your preferred teacher, their available schedules, and make payment for the classes you wish to take.
        </p>
        <p>
          Remember, it's important to choose your subject wisely to ensure the classes fit your needs.
        </p>
        <h3>How to Select Your Subject:</h3>
        <ul>
          <li><strong>Click on the desired subject:</strong> This will take you to the next screen.</li>
          <li><strong>Select a teacher:</strong> You will see a list of available teachers for the selected subject.</li>
          <li><strong>Choose your schedules:</strong> Make sure to select the times that best fit your availability.</li>
          <li><strong>Make the payment:</strong> You can pay for a single class or multiple classes, depending on your preference.</li>
        </ul>
        <p>
          If you have any questions or need assistance, feel free to contact our support team.
        </p>
        <ButtonsContainer>
          <Button secondary onClick={handleClosePopup}>
            Close
          </Button>
        </ButtonsContainer>
      </PopUp>
    </PopUpContainer>
    }
    <MainContainer isPopupOpen={showTutorialPopUp}>
      <SideBar />
      <Topbar/>
      <Logo />
      <Content>
        {isLoading ? (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'center'}}>
                <AnimatedLoadingLogo src={SimplifiedLogoAlt} width='70px' height='70px' />
            </div>
          </>
        ) : (     
          <MainWrapper>
            {subjects.length !== 0 && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
              <TextInput
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  icon = {<LiaSchoolSolid />}
                  placeholder = "Search for a subject..."
               />
            </div>
            )}
            

            {currentSubjects.length > 0 ? (
            <>
            <CardsWrapper>
              {currentSubjects.map((subject, index) => (
                <motion.div
                  key={subject.subjectid}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card key={subject.subjectid} onClick={() => handleSubjectSearch(subject.subjectid, subject.subjectname)}>
                    <CardSubject>{subject.subjectname}</CardSubject>
                  </Card>
                </motion.div>
              ))}

              {Array.from({ length: skeletonCount }).map((_, index) => (
                <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: currentSubjects.length * 0.1 }}
              >
                <Card key={`skeleton-${index}`} isSkeleton={true}/>
                </motion.div>
              ))}
              
            </CardsWrapper>

            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px', alignItems: 'center' }}>
                  <Button onClick={handlePrevPage} disabled={currentPage === 0}>Previous</Button>
                  <PageNumber style={{ margin: '0 10px' }}>Page {currentSubjects.length !== 0 ? currentPage + 1 : 0} of {totalPages}</PageNumber>
                  <Button onClick={handleNextPage} disabled={currentPage === totalPages - 1 || currentPage === 0 && totalPages === 0}>Next</Button>
              </div>
            )}
          </>
          ) : (
            <NotificationContainer>
              <Notification alternative message='No subjects available.'/>
            </NotificationContainer>
          )
          }
          </MainWrapper>
        )}
        <TutorialButtonContainer>
            <TutorialButton onClick={() => setShowTutorialPopUp(true)}><PiWarningCircle /></TutorialButton>
        </TutorialButtonContainer>
      </Content>
    </MainContainer>
    </>
  );
};
export default Home;
