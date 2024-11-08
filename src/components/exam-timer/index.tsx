import React, { useEffect, useState } from 'react';
import colors from '../../assets/colors';

interface TimerProps {
    onTimeOut: (source: 'timer') => void;
    examid: string;
}

const Timer: React.FC<TimerProps> = ({ onTimeOut, examid }) => {
    const DURATION = 30 * 60 * 1000;
    const [timeRemaining, setTimeRemaining] = useState<number>(DURATION);
    const [isActive, setIsActive] = useState<boolean>(false);

    useEffect(() => {
        if(timeRemaining === 0){
            onTimeOut('timer');
        }
        const endTime = localStorage.getItem(`examEndTime${examid}`);
        const startTimer = () => {
            const endTime = Date.now() + DURATION;
            localStorage.setItem(`examEndTime${examid}`, endTime.toString());
            setTimeRemaining(DURATION);
            setIsActive(true);
        };

        if (endTime) {
            const remainingTime = Number(endTime) - Date.now();
            if (remainingTime > 0) {
                setTimeRemaining(remainingTime);
                setIsActive(true);
            } else {
                setTimeRemaining(0);
            }
        } else {
            startTimer();
        }

        const intervalId = setInterval(() => {
            if (isActive) {
                setTimeRemaining(prev => {
                    if (prev <= 1000) {
                        clearInterval(intervalId);
                        setIsActive(false);
                        onTimeOut('timer');
                        localStorage.removeItem(`examEndTime${examid}`);
                        return 0;
                    }
                    return prev - 1000;
                });
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [DURATION, examid, isActive, onTimeOut, timeRemaining]);

    const formatTime = (milliseconds: number) => {
        const minutes = Math.floor((milliseconds % (60 * 60 * 1000)) / (60 * 1000));
        const seconds = Math.floor((milliseconds % (60 * 1000)) / 1000);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    return (
        <div style={{backgroundColor: `${colors.primary}`, padding: '10px', borderRadius: '5px'}}>
            <div style={{color:'#fff'}} id="timer">Time left: <strong style={{color: timeRemaining < 60000 ? colors.important : 'inherit'}}>{formatTime(timeRemaining)}</strong></div>
        </div>
    );
};

export default Timer;
