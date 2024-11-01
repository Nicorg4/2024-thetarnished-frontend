import { useState } from 'react';
import { MainContainer } from './components';

const QuestionCard = ({ questionData, handleAnswer }: { questionData: { question: string, correct_answer: string, incorrect_answers: string[] }, handleAnswer: (isCorrect: boolean) => void }) => {
    const { question, correct_answer, incorrect_answers } = questionData;
    const allAnswers = [...incorrect_answers, correct_answer].sort(() => Math.random() - 0.5);

    return (
        <div style={{ border: '1px solid #ddd', padding: '20px', marginBottom: '20px', borderRadius: '8px' }}>
            <h3 dangerouslySetInnerHTML={{ __html: question }}></h3>
            <div>
                {allAnswers.map((answer, index) => (
                    <button
                        key={index}
                        onClick={() => handleAnswer(answer === correct_answer)}
                        style={{
                            display: 'block',
                            margin: '10px 0',
                            padding: '10px',
                            borderRadius: '5px',
                            backgroundColor: '#f2f2f2',
                            border: '1px solid #ccc',
                            cursor: 'pointer'
                        }}
                        dangerouslySetInnerHTML={{ __html: answer }}
                    ></button>
                ))}
            </div>
        </div>
    );
};

const Quiz = () => {
    const [questions, setQuestions] = useState([]);
    const [score, setScore] = useState(0);
    const [completed, setCompleted] = useState(false);

    const fetchQuestions = async () => {
        fetch('https://opentdb.com/api.php?amount=3&difficulty=medium&type=multiple')
            .then((response) => response.json())
            .then((data) => {
                setQuestions(data.results || []);
            })
            .catch((error) => console.error('Error fetching data:', error));

    }

    const handleAnswer = (isCorrect: boolean) => {
        if (isCorrect) setScore((prevScore) => prevScore + 1);
        if (score + 1 === questions.length) setCompleted(true);
    };

    return (
        <MainContainer>
                <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
                    <h2>Quiz Time!</h2>
                    <button onClick={fetchQuestions}>Start Quiz</button>
                    {completed ? (
                        <div>
                            <h3>Quiz Completed!</h3>
                            <p>Your Score: {score} / {questions.length}</p>
                        </div>
                    ) : (
                        questions && questions.length > 0 ? (
                            questions.map((questionData, index) => (
                                <QuestionCard key={index} questionData={questionData} handleAnswer={handleAnswer} />
                            ))
                        ) : (
                            <p>Loading questions...</p>
                        )
                    )}
                </div>
        </MainContainer>
    );
};

export default Quiz;
