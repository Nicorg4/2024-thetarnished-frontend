import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Choice, ChoiceList, ExamHeader, QuestionCard, QuestionList, QuestionText, MainContainer, Content, ExamInfo, ScoreContainer, ButtonsContainer, ExamContainer } from './components';
import SideBar from '../../components/sidebar/sidebar';
import Topbar from '../../components/topbar';
import { Button } from '../../components/main-button/components';
import { Message } from '../../components/message/components';
import { PopUp, PopUpContainer } from '../../components/popup/components';
import { AnimatedLoadingLogo } from '../../components/animated-loading-logo/components';
import SimplifiedLogo from "../../assets/Logo transparent.png"; 
import SimplifiedLogoAlt from "../../assets/Logo transparent alt.png"; 
import { useAuth } from '../../auth/useAuth';
import Logo from '../../components/top-down-logo';
import Notification from '../../components/notification';
import Timer from '../../components/exam-timer';

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
  state: string;
}

interface Results {
  [questionId: string]: boolean;
}

interface SelectedAnswers {
  [questionId: string]: string;
}

const ExamDetail: React.FC = () => {
  const [exam, setExam] = useState<Exam | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [message, setMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [finalGrade, setFinalGrade] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const URL = import.meta.env.VITE_API_URL;
  const { examId } = useParams();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExam = async () => {
      setIsFetching(true)
      try {
        const response = await fetch(`${URL}exam/get-exams-by/${examId}/${user?.id}`,
          {
            method: 'GET',
            headers: {
              'ngrok-skip-browser-warning': 'true',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user?.token}`,
            },
          }
        );
        if (response.status === 403) {
          setMessage("You are not authorized to access this exam.");
          throw new Error('You are not authorized to access this exam.');
        }
        if (!response.ok) {
          setMessage("Error while trying to get the exam");
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setExam(data);
        setIsFetching(false)
      } catch (error) {
        setShowErrorMessage(true);
        setIsFetching(false);
        setTimeout(() => {
          setShowErrorMessage(false);
          navigate('/my-exams');
        }, 3000);
        console.error('Error fetching exam:', error);
      }
    };
    if(user && !exam){
      fetchExam();
    }
    
    if (exam?.state && exam?.state.trim() !== "INITIATED") {
      navigate('/my-exams');
    }
  }, [URL, exam, exam?.state, examId, navigate, user]);

  const handleAnswerSelect = (questionId: string, choiceId: string) => {
    if (!showResults) {
      setSelectedAnswers((prev) => ({
        ...prev,
        [questionId]: choiceId
      }));
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (exam?.questions?.length || 1) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    setShowConfirmationPopup(true);
  };

  const handleSendSubmitedExam = async (source: 'button' | 'timer') => {
    setIsAccepting(true);
    try {
      const allAnswered = exam?.questions?.every((question) => selectedAnswers[question.question_id]);

      if (!allAnswered && source === 'button') {
        setMessage("Please answer all questions before submitting.");
        setShowErrorMessage(true);
        setIsAccepting(false);
        setTimeout(() => {
          setShowErrorMessage(false);
        }, 3000);
        return;
      }

      const result: Results = {};
      let correctAnswersCount = 0;
      exam?.questions?.forEach((question) => {
        const userAnswer = selectedAnswers[question.question_id];
        const correctAnswer = question.choices.find(choice => choice.is_correct)?.choice_id;
        result[question.question_id] = userAnswer === correctAnswer;

        if (userAnswer === correctAnswer) {
          correctAnswersCount += 1;
        }
      });

      const totalQuestions = exam?.questions?.length || 0;
      const percentage = (correctAnswersCount / totalQuestions) * 100;
      const grade = Math.round(percentage);
      setFinalGrade(grade);

      const response = await fetch(`${URL}exam/submit-exam/${examId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`,
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          score: grade,
        }),
      });

      if (!response.ok) {
        setMessage("Failed to submit exam");
        throw new Error('Failed to submit exam');
      }
      setIsAccepting(false);
      setShowConfirmationPopup(false);
      setShowSuccessMessage(true);
      localStorage.removeItem(`examEndTime${exam?.exam_id}`);
      if(grade >= 60 && user){
        const xpToLvlUp = Number(1000 * Math.pow(1.2, (user?.lvl ?? 1))) - 200;
        updateUser({ xp: (Number(user.xp) + 200 ),  lvl: (Number(user.xp)) > xpToLvlUp ? (user.lvl) + 1 : (user.lvl)})
      }
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
      setShowResults(true);
    } catch (error) {
      console.error('Error submitting exam:', error);
      setIsAccepting(false);
      setShowConfirmationPopup(false);
      setShowErrorMessage(true);
      setTimeout(() => {
        setShowErrorMessage(false);
      }, 3000);
    }
  };

  return (
    <>
      {showConfirmationPopup &&
        <PopUpContainer>
          <PopUp>
            <h2>Are you sure you want to submit the exam?</h2>
            <p>You won't be able to change your answers once you confirm.</p>
            <ButtonsContainer>
              <Button onClick={() => handleSendSubmitedExam('button')}>{isAccepting ? <AnimatedLoadingLogo src={SimplifiedLogo} /> : "Submit exam"}</Button>
              <Button secondary onClick={() => setShowConfirmationPopup(false)}>Cancel</Button>
            </ButtonsContainer>
          </PopUp>
        </PopUpContainer>
      }
      <MainContainer isPopupOpen={showConfirmationPopup}>
        <Logo />
        {showErrorMessage && <Message error>{message}</Message>}
        {showSuccessMessage && <Message>Exam submitted successfully!</Message>}
        <SideBar />
        <Topbar />
        <Content>
          <ExamContainer>
            {isFetching ? (  
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'center'}}>
                  <AnimatedLoadingLogo src={SimplifiedLogoAlt} width='70px' height='70px' />
              </div>
            ) : (
              <>
              {!exam ? (<Notification alternative={true} message='Failed to get exam.'/>) : (
              <>
              <ExamHeader>
                <h2>{exam?.exam_name}</h2>
                <ExamInfo>
                  <p>Teacher: {exam?.teacher.firstname} {exam?.teacher.lastname}</p>
                  <p>Subject: {exam?.subject}</p>
                </ExamInfo>
                {!showResults && <Timer examid={exam?.exam_id} onTimeOut={handleSendSubmitedExam} />}   
              </ExamHeader>
              <QuestionList>
                {exam?.questions && exam.questions.length > 0 && (
                  <QuestionCard>
                    <QuestionText>{exam.questions[currentQuestionIndex].question_text}</QuestionText>
                    <ChoiceList>
                      {exam.questions[currentQuestionIndex].choices.map((choice) => (
                        <Choice
                          key={choice.choice_id}
                          onClick={() => handleAnswerSelect(exam.questions[currentQuestionIndex].question_id, choice.choice_id)}
                          selected={selectedAnswers[exam.questions[currentQuestionIndex].question_id] === choice.choice_id}
                          showResults={showResults}
                          correct={choice.is_correct}
                        >
                          {choice.choice_text}
                        </Choice>
                      ))}
                    </ChoiceList>
                  </QuestionCard>
                )}
              </QuestionList>
              <ButtonsContainer>
                <Button disabled={currentQuestionIndex === 0} onClick={handlePreviousQuestion}>Previous</Button>
                {currentQuestionIndex < (exam?.questions?.length || 1) - 1 ? (
                  <Button onClick={handleNextQuestion}>Next</Button>
                ) : (
                  !showResults && <Button onClick={handleSubmit}>Submit Exam</Button>
                )}
              </ButtonsContainer>
              {showResults && (
                <ScoreContainer hasPassed={finalGrade >= 60}>Your final score is {finalGrade}%</ScoreContainer>
              )}
              {showResults && (
                <Button secondary onClick={() => navigate("/my-exams")}>Back to exams</Button>
              )}
              </>
              )}
              </>
            )}
          </ExamContainer>
        </Content>
      </MainContainer>
    </>
  );
};
export default ExamDetail;
