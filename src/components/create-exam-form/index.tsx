import { useState } from 'react';
import { RiCloseLargeFill } from "react-icons/ri";
import { 
  Container, 
  StyledForm, 
  Label,
  RadioButton, 
  AddOptionButton, 
  RemoveOptionButton, 
  ActionButtons,
  CloseButton, 
  PopUp, 
  QuestionInput,
  OptionInput
} from "./components";
import { Button } from '../main-button/components';
import { GoPlus, GoDash  } from "react-icons/go";
import { AnimatedLoadingLogo } from '../animated-loading-logo/components';
import { Message } from '../message/components';
import SimplifiedLogo from "../../assets/Logo transparent.png";
import { useAuth } from '../../auth/useAuth';

interface Reservation {
  id: string;
  student_name: string;
  subject_name: string;
  datetime: string;
  group: boolean;
}

interface CreateExamFormProps {
  reservation: Reservation;
  closePopup: () => void;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctOption: number;
}

interface Exam {
  reservationid: string;
  teacherid: string;
  exam_name: string;
  subject_name: string;
  questions: Question[];
}

const CreateExamForm = ({ reservation, closePopup }: CreateExamFormProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [options, setOptions] = useState<string[]>(['']);
  const [correctOption, setCorrectOption] = useState<number | null>(null);
  const [isCreatingExam, setIsCreatingExam] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [showError, setShowError] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const { user, updateUser } = useAuth();
  const URL = import.meta.env.VITE_API_URL;

  const handleAddOption = () => {
    if (options.length < 5) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);
    if (correctOption === index) {
      setCorrectOption(null);
    } else if (correctOption !== null && correctOption > index) {
      setCorrectOption(correctOption - 1);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = options.map((option, i) => (i === index ? value : option));
    setOptions(updatedOptions);
  };

  const isQuestionValid = () => {
    const filledOptions = options.filter(option => option.trim() !== '');
    return (
      currentQuestion.trim() !== '' &&
      filledOptions.length >= 2 &&
      correctOption !== null
    );
  };

  const saveCurrentQuestion = () => {
    if (isQuestionValid()) {
      const updatedQuestion: Question = {
        id: `${currentQuestionIndex + 1}`,
        question: currentQuestion,
        options: options.filter(option => option.trim() !== ''),
        correctOption: correctOption as number
      };

      const updatedQuestions = [...questions];
      updatedQuestions[currentQuestionIndex] = updatedQuestion;
      setQuestions(updatedQuestions);
    }
  };

  const handleNextQuestion = () => {
    saveCurrentQuestion();
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      const nextQuestion = questions[currentQuestionIndex + 1];
      setCurrentQuestion(nextQuestion.question);
      setOptions(nextQuestion.options);
      setCorrectOption(nextQuestion.correctOption);
    }
  };

  const handleBackQuestion = () => {
    saveCurrentQuestion();
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
      const previousQuestion = questions[currentQuestionIndex - 1];
      setCurrentQuestion(previousQuestion.question);
      setOptions(previousQuestion.options);
      setCorrectOption(previousQuestion.correctOption);
    }
  };

  const handleAddQuestion = () => {
    if (isQuestionValid()) {
      const newQuestion: Question = {
        id: `${currentQuestionIndex + 1}`,
        question: currentQuestion,
        options: options.filter(option => option.trim() !== ''),
        correctOption: correctOption as number
      };

      const updatedQuestions = [...questions];
      updatedQuestions[currentQuestionIndex] = newQuestion;
      setQuestions([...updatedQuestions]);

      setCurrentQuestion('');
      setOptions(['']);
      setCorrectOption(null);
      setCurrentQuestionIndex(updatedQuestions.length);
    }
  };

  const handleCreateExam = async () => {
    const finalQuestions = [...questions];
    if (isQuestionValid()) {
      const lastQuestion = {
        id: `${currentQuestionIndex + 1}`,
        question: currentQuestion,
        options: options.filter(option => option.trim() !== ''),
        correctOption: correctOption as number
      };
      finalQuestions[currentQuestionIndex] = lastQuestion;
    }

    if (finalQuestions.length > 0 && user?.id) {
      const newExam: Exam = {
        reservationid: reservation.id,
        teacherid: user.id.toString(),
        exam_name: reservation.subject_name + " exam",
        subject_name: reservation.subject_name,
        questions: finalQuestions,
      };
      setIsCreatingExam(true);
      try {
        const response = await fetch(`${URL}exam/create-exam`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
          body: JSON.stringify(newExam)
        });
        if (!response.ok) {
          throw new Error('Failed to create exam');
        } 
        closePopup();
        setMessage("Exam created successfully");
        if(user){
          const xpToLvlUp = Number(1000 * Math.pow(1.2, (user?.lvl ?? 1))) - 50;
          updateUser({ xp: (Number(user.xp) + 50),  lvl: (Number(user.xp)) > xpToLvlUp ? (user.lvl) + 1 : (user.lvl)})
        }
        setShowSuccess(true);
        setIsCreatingExam(false);
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      } catch {
        setIsCreatingExam(false);
        setMessage("Error creating exam");
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
          closePopup();
        }, 3000);
      }
    }
  };
  return (
    <Container>
      {showSuccess && <Message>{message}</Message>}
      {showError && <Message error>{message}</Message>}
      <PopUp>
        <h2>Create {reservation.subject_name} exam for {reservation.student_name}</h2>
        <StyledForm>
          <Label>Question:</Label>
          <QuestionInput
            type="text"
            value={currentQuestion}
            onChange={(e) => setCurrentQuestion(e.target.value)}
            placeholder="Insert question"
          />
          <Label>Options:</Label>
          {options.map((option, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
              <OptionInput
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Insert option ${index + 1}`}
              />
              {index === 0 ? (
                <AddOptionButton type="button" onClick={handleAddOption}><GoPlus/></AddOptionButton>
              ) : (
                <RemoveOptionButton type="button" onClick={() => handleRemoveOption(index)}><GoDash/></RemoveOptionButton>
              )}
              <RadioButton
                type="radio"
                name="correctOption"
                checked={correctOption === index}
                onChange={() => setCorrectOption(index)}
              /> Correct option
            </div>
          ))}
        </StyledForm>
        <ActionButtons>
          <Button secondary type="button" onClick={handleBackQuestion} disabled={currentQuestionIndex === 0}>Back</Button>   
          <Button secondary type="button" onClick={handleNextQuestion} disabled={currentQuestionIndex >= questions.length - 1}>Next</Button>
          <Button 
            type="button" 
            onClick={handleAddQuestion} 
            disabled={!isQuestionValid()}
          >
            Add Question
          </Button>
          <Button type="button" onClick={handleCreateExam}>{isCreatingExam ? <AnimatedLoadingLogo src={SimplifiedLogo}/> : "Create exam"}</Button>
        </ActionButtons>
        <CloseButton onClick={closePopup}>
          <RiCloseLargeFill />
        </CloseButton>
      </PopUp>
    </Container>
  );
};

export default CreateExamForm;