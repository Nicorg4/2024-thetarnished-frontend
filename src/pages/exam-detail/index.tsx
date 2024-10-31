import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Choice, ChoiceList, ExamHeader, QuestionCard, QuestionList, QuestionText, MainContainer, Content, ExamInfo, ScoreContainer, ButtonsContainer } from './components';
import SideBar from '../../components/sidebar/sidebar';
import Topbar from '../../components/topbar';
import { Button } from '../../components/main-button/components';
import { Message } from '../../components/message/components';
import { PopUp, PopUpContainer } from '../../components/popup/components';
import { AnimatedLoadingLogo } from '../../components/animated-loading-logo/components';
import SimplifiedLogo from "../../assets/Logo transparent.png";
import { useAuth } from '../../auth/useAuth';
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
  const [showResults, setShowResults] = useState(false);
  const [message, setMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [finalGrade, setFinalGrade] = useState(0);
  const URL = import.meta.env.VITE_API_URL;
  const { examId } = useParams();
  const {user} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = await fetch(`${URL}exam/get-exams-by/${examId}`);
        const data = await response.json();
        console.log(data);
        setExam(data[0]);
      } catch (error) {
        console.error('Error fetching exam:', error);
      }
    }
    fetchExam();
    if (exam?.state && exam?.state.trim() !== "INITIATED") {
        navigate('/my-exams');
    }

  }, [URL, exam?.state, examId, navigate])
  

  const handleAnswerSelect = (questionId: string, choiceId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: choiceId
    }));
  };

  const handleSubmit = () => {
    setShowConfirmationPopup(true);
  }

  const handleSendSubmitedExam = async () => {
    setIsAccepting(true);
    try{
      const allAnswered = exam?.questions.every((question) => selectedAnswers[question.question_id]);
  
      if (!allAnswered) {
        setMessage("Please answer all questions before submitting.");
        setShowErrorMessage(true);
        setTimeout(() => {
          setShowErrorMessage(false);
        }, 3000);
        return;
      }
    
      const result: Results = {};
      let correctAnswersCount = 0;
      exam?.questions.forEach((question) => {
        const userAnswer = selectedAnswers[question.question_id];
        const correctAnswer = question.choices.find(choice => choice.is_correct)?.choice_id;
        result[question.question_id] = userAnswer === correctAnswer;

        if (userAnswer === correctAnswer) {
          correctAnswersCount += 1;
        }
      });
      
      const totalQuestions = exam?.questions.length || 0;
      const percentage = (correctAnswersCount / totalQuestions) * 100;
      const grade = Math.round(percentage);
      setFinalGrade(grade);

      const response = await fetch(`${URL}exam/submit-exam/${examId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.token}`,
          },
          body: JSON.stringify({
            score: grade,
          }),
        }
      )
      if (!response.ok) {
        setMessage("Failed to submit exam");
        throw new Error('Failed to submit exam');
      }
      setIsAccepting(false);
      setShowConfirmationPopup(false);
      setShowSuccessMessage(true);
      setShowResults(true);
    }catch(error){
      console.error('Error submitting exam:', error);
      setIsAccepting(false);
      setShowConfirmationPopup(false);
      setShowErrorMessage(true)
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
                <Button onClick={() => handleSendSubmitedExam()}>{isAccepting ? <AnimatedLoadingLogo src={SimplifiedLogo}/> : "Submit exam" }</Button>
                <Button secondary onClick={() => setShowConfirmationPopup(false)}>Cancel</Button>
            </ButtonsContainer>
        </PopUp>
    </PopUpContainer>
    }
    <MainContainer isPopupOpen={showConfirmationPopup}>
    <Logo/>
        {showErrorMessage && <Message error>{message}</Message>}
        {showSuccessMessage && <Message>Exam submitted successfully!</Message>}
        <SideBar/>
        <Topbar/>
        <Content>
            <ExamHeader>
                <h2>{exam?.exam_name}</h2>
                <ExamInfo>
                    <p>Teacher: {exam?.teacher.firstname} {exam?.teacher.lastname}</p>
                    <p>Subject: {exam?.subject}</p>
                </ExamInfo>
            </ExamHeader>
            <QuestionList>
                {exam?.questions.map((question) => (
                <QuestionCard key={question.question_id}>
                    <QuestionText>{question.question_text}</QuestionText>
                    <ChoiceList>
                    {question.choices.map((choice) => (
                        <Choice
                        key={choice.choice_id}
                        onClick={() => handleAnswerSelect(question.question_id, choice.choice_id)}
                        selected={selectedAnswers[question.question_id] === choice.choice_id}
                        showResults={showResults}
                        correct={choice.is_correct}
                        >
                        {choice.choice_text}
                        </Choice>
                    ))}
                    </ChoiceList>

                </QuestionCard>
                ))}
            </QuestionList>
            {!showResults ? (
                <Button onClick={handleSubmit}>Submit Exam</Button> ) : 
                (
                  <>
                    <ScoreContainer hasPassed={finalGrade >= 60}>Your final score is {finalGrade}%</ScoreContainer>
                    <Button secondary onClick={() => navigate("/my-exams")}>Back to exams</Button>
                  </>

                )
            }
      </Content>
    </MainContainer>
    </>
  );
};

export default ExamDetail;
