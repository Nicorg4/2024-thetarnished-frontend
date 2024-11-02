import { useNavigate } from 'react-router-dom';
import { ButtonsContainer, CardsContainer, Content, ExamCard, ExamInfo, ExamTitle, MainContainer, PageNumber, PageTitle } from './components';
import SideBar from '../../components/sidebar/sidebar';
import Topbar from '../../components/topbar';
import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/useAuth';
import { FaChalkboardTeacher, FaBook, FaQuestionCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Notification from '../../components/notification';
import { Button } from '../../components/main-button/components';
import { AnimatedLoadingLogo } from '../../components/animated-loading-logo/components';
import SimplifiedLogo from "../../assets/Logo transparent.png";
import SimplifiedLogoAlt from "../../assets/Logo transparent alt.png";
import { PopUp, PopUpContainer } from '../../components/popup/components';
import { Message } from '../../components/message/components';
import Logo from '../../components/top-down-logo';

interface Choice {
  choice_id: string;
  choice_text: string;
  is_correct: boolean;
}

interface Question {
  question_id: string;
  question_text: string;
  choices: Choice[];
}

interface Exam {
  exam_id: string;
  exam_name: string;
  teacher: {
    firstname: string;
    lastname: string;
  };
  subject: string;
  questions: Question[];
}

const ExamViewer = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(0);
  const [showConfirmationPopUp, setShowConfirmationPopup] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [isAccepting, setIsAccepting] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [pageWidth, setPageWidth] = useState(window.innerWidth);
  const widthUmbral = 841;
  const cardsPerPage = pageWidth > widthUmbral ? 4 : 2;
  const URL = import.meta.env.VITE_API_URL;

  const handleExamClick = async (examId: string | null) => {
    setIsAccepting(true);

    if (!examId) {   
      return;
    }

    try{
      const response = await fetch(`${URL}exam/initiate-exam/${examId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          'Authorization': `Bearer ${user?.token}`,
        },
      });
      if (!response.ok){
        throw new Error('Failed to initiate exam');
      }
    setIsAccepting(false);
    navigate(`/exam/${examId}`);
    }catch (error) {
      setIsAccepting(false);
      setShowErrorMessage(true);
      console.error('Error initiating exam:', error);
    }
  };
  
  useEffect(() => {
    const handleWidthChange = () => {
      setPageWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleWidthChange);

    handleWidthChange();
    const getAllExamsByStudentId = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${URL}exam/get-student-exams-by/${user?.id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'ngrok-skip-browser-warning': 'true',
              'Authorization': `Bearer ${user?.token}`,
            },
          }
        );
        const data = await response.json();
        setExams(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching exams:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) {
      getAllExamsByStudentId();
    }
  }, [URL, user?.id, user?.token]);

  const totalPages = Math.ceil(exams.length / cardsPerPage)

  const handleNextPage = () => {
    if(currentPage < totalPages){
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePreviousPage = () => {
    if(currentPage > 0){
      setCurrentPage(currentPage - 1)
    }
  }

  const paginatedExams = exams.slice(currentPage * cardsPerPage, (currentPage + 1) * cardsPerPage)

  const handleExamCardClick = (examId: string) => {
    setSelectedExamId(examId);
    setShowConfirmationPopup(true);
  };
  
  return (
    <>
    {showConfirmationPopUp && (
      <PopUpContainer>
          <PopUp>
              <h2>Are you sure you want to initiate the exam?</h2>
              <p>You won't be able to close the window or go back. You will <strong>fail</strong> the exam if you do.</p>
              <p>Also, you will only have <strong>30 minutes</strong> to finish the exam and submit our answers.</p>
              <ButtonsContainer>
                  <Button onClick={() => handleExamClick(selectedExamId)}>{isAccepting ? <AnimatedLoadingLogo src={SimplifiedLogo}/> : "Initiate exam" }</Button>
                  <Button secondary onClick={() => setShowConfirmationPopup(false)}>Cancel</Button>
              </ButtonsContainer>
          </PopUp>
      </PopUpContainer>
  )}
    <MainContainer isPopupOpen={showConfirmationPopUp}>
        {showErrorMessage && <Message error>Error initiating exam. Please try again later.</Message>}
      <SideBar/>
      <Topbar/>
      <Logo/>
      {loading ? (
        <Content>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'center'}}>
              <AnimatedLoadingLogo src={SimplifiedLogoAlt} width='70px' height='70px' />
          </div>
        </Content>
      ) : 
      <Content>
        {exams.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'center'}}>
              <Notification alternative={true} message='No exams available at the moment.'/>
          </div>
        ) : (
          <>
          <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
              }}
          >
          <PageTitle>My exams</PageTitle>
          </motion.div>
          <CardsContainer>
            {paginatedExams.map((exam, index) => (
              <motion.div
                key={exam.exam_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: (index + 1) * 0.2 }}
              >
                <ExamCard onClick={() => handleExamCardClick(exam.exam_id)}>
                  <ExamTitle>{exam.exam_name}</ExamTitle>
                  <ExamInfo>
                    <FaChalkboardTeacher />
                    Teacher: {exam.teacher.firstname} {exam.teacher.lastname}
                  </ExamInfo>
                  <ExamInfo>
                    <FaBook />
                    Subject: {exam.subject}
                  </ExamInfo>
                  <ExamInfo>
                    <FaQuestionCircle />
                    Questions: {exam.questions.length}
                  </ExamInfo>
                </ExamCard>
              </motion.div>
            ))}
          </CardsContainer>
          </>
        )}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', alignItems: 'center'}}>
            <Button onClick={handlePreviousPage} disabled={currentPage === 0}>Previous</Button>
            <PageNumber style={{ margin: '0 10px' }}>Page {currentPage + 1} of {totalPages}</PageNumber>
            <Button onClick={handleNextPage} disabled={currentPage === totalPages - 1}>Next</Button>
        </div>
      </Content>
      }
    </MainContainer>
    </>
  );
};

export default ExamViewer;