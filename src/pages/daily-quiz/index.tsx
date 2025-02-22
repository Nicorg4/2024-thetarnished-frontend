import { useState } from 'react';
import { Content, QuizTitle, MainContainer, QuizInfoContainer } from './components';
import Topbar from '../../components/topbar';
import SideBar from '../../components/sidebar/sidebar';
import Logo from '../../components/top-down-logo';
import { motion } from 'framer-motion';
import { Button } from '../../components/main-button/components';
import colors from '../../assets/colors';
import { useAuth } from '../../auth/useAuth';
import Notification from '../../components/notification';
import { AnimatedLoadingLogo } from '../../components/animated-loading-logo/components';
import SimplifiedLogo from "../../assets/Logo transparent.png";
import styled from 'styled-components';

type Question = {
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
    shuffledAnswers?: string[];
};

const Card = styled.div`
    border: 1px solid #ddd;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 8px;
    width: 500px;
    height: 280px;

    @media (max-width: 800px) {
        width: 80%;
    }
`;

const QuestionCard = ({
    questionData,
    selectedAnswer,
    handleAnswerSelect,
}: {
    questionData: Question,
    selectedAnswer: string | null,
    handleAnswerSelect: (answer: string) => void
}) => {
    const { question, shuffledAnswers } = questionData;

    return (
        <Card>
            <h3 dangerouslySetInnerHTML={{ __html: question }}></h3>
            <div>
                {shuffledAnswers && shuffledAnswers.map((answer, index) => (
                    <Button
                        key={index}
                        onClick={() => handleAnswerSelect(answer)}
                        style={{
                            display: 'block',
                            margin: '10px 0',
                            padding: '10px',
                            borderRadius: '5px',
                            backgroundColor: selectedAnswer === answer ? '' : '#f2f2f2',
                            cursor: 'pointer',
                            color: selectedAnswer === answer ? `${colors.secondary}` : `${colors.primary}`,
                        }}
                        dangerouslySetInnerHTML={{ __html: answer }}
                    ></Button>
                ))}
            </div>
        </Card>
    );
};

const Quiz = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFetchingQuestions, setIsFetchingQuestions] = useState(false);

    const {user, updateUser} = useAuth();
 
    const fetchQuestions = async () => {
        setIsFetchingQuestions(true);
        fetch('https://opentdb.com/api.php?amount=3&difficulty=easy&type=multiple')
            .then((response) => response.json())
            .then((data) => {
                const questionsWithShuffledAnswers = data.results.map((question: Question) => ({
                    ...question,
                    shuffledAnswers: [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5)
                }));
                setQuestions(questionsWithShuffledAnswers);
                setIsFetchingQuestions(false);
            })
            .catch((error) => console.error('Error fetching data:', error));
    };

    const handleAnswerSelect = (answer: string) => {
        setSelectedAnswer(answer);
    };

    const URL = import.meta.env.VITE_API_URL;

    const confirmAnswer = async () => {
        if (selectedAnswer) {
            const isCorrect = selectedAnswer === questions[currentQuestionIndex].correct_answer;
            if (isCorrect) setScore((prevScore) => prevScore + 1);
            if (currentQuestionIndex + 1 === questions.length) {
                try{
                    setIsSubmitting(true);
                    const response = await fetch(`${URL}quiz/complete-quiz/${user?.id}`,
                        {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${user?.token}`,
                                'ngrok-skip-browser-warning': 'true',
                            },
                            body: JSON.stringify({
                                score: score,
                            })
                        }
                    )
                    if(!response.ok){
                        throw new Error('Error updating user')
                    }
                    setCompleted(true);
                    if(user){
                        const xpToLvlUp = Number(1000 * Math.pow(1.2, (user?.lvl ?? 1))) - 10 * Number(score);
                        updateUser({ xp: (Number(user.xp) + 10 * score),  lvl: (Number(user.xp)) > xpToLvlUp ? Number(user.lvl) + 1 : (user.lvl)})
                        updateUser({ dailyQuizCompleted : true })
                    }
                }catch(error){
                    console.error(error)
                } finally {
                    setIsSubmitting(false);
                }
            } else {
                setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
                setSelectedAnswer(null);
            }
        }
    };
    const goToPreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
            setSelectedAnswer(null);
        }
    };

    return (
        <MainContainer>
            <SideBar/>
            <Topbar/>
            <Logo/>
            <Content>
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: 0.3 }}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '95%',
                }}
            >
            <QuizTitle>Daily quiz</QuizTitle>
            </motion.div>
            {user?.dailyQuizCompleted && !completed ? (
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: 0.3 }}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%'
                    }}
                >
                <Notification alternative={true} message='You have already completed the daily quiz today! Come back tomorrow.'></Notification>
                </motion.div>
            ) : (
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: 0.3 }}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '80%'
                }}
            >
            <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
                {!questions.length ? (
                    <QuizInfoContainer>
                    <div>
                        <h2>Welcome to the Daily Quiz!</h2>
                        <p>You can play the Daily Quiz <strong>once a day</strong> and earn <strong>experience points</strong> for each correct answer.</p>
                        <p>Once you hit the <strong>"Start Quiz"</strong> button, you can answer the questions in order and change your previous responses as needed.</p>
                        <p>Get ready to test your knowledge and earn points!</p>
                    </div>
                    <Button onClick={fetchQuestions}>{isFetchingQuestions ? <AnimatedLoadingLogo src={SimplifiedLogo}/> : 'Start Quiz'}</Button>
                    </QuizInfoContainer>
                    
                ) : completed ? (
                    <div>
                        <h3>Quiz Completed!</h3>
                        <p>Your Score: {score} / {questions.length}</p>
                    </div>
                ) : (
                    <div>
                        <QuestionCard
                            questionData={questions[currentQuestionIndex]}
                            selectedAnswer={selectedAnswer}
                            handleAnswerSelect={handleAnswerSelect}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Button
                                onClick={goToPreviousQuestion}
                                disabled={currentQuestionIndex === 0}
                                secondary
                            >
                                Previous
                            </Button>
                            <Button
                                onClick={confirmAnswer}
                                disabled={!selectedAnswer}
                            >
                                {isSubmitting ? <AnimatedLoadingLogo src={SimplifiedLogo}/> : currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next'}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
            </motion.div>
            )}
            
            </Content>
        </MainContainer>
    );
};
export default Quiz;
