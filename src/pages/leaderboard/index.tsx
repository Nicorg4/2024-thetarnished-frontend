import { useState, useRef, useEffect } from 'react';
import { FaMedal } from 'react-icons/fa';
import SideBar from '../../components/sidebar/sidebar';
import Topbar from '../../components/topbar';
import { ButtonsContainer, Container, Content, MainContainer, MainTitle, ScrollableContainer, Table, TableCell, TableHeader, TableRow } from './components';
import { Button } from '../../components/main-button/components';
import { IoIosArrowDown, IoIosArrowUp  } from "react-icons/io";
import { motion } from 'framer-motion';
import { useAuth } from '../../auth/useAuth';
import Logo from '../../components/top-down-logo';

interface UserRanking {
    name: string;
    experience: number;
}

const Leaderboard = () => {
    const [showStudents, setShowStudents] = useState(true);
    const [studentRanking, setStudentRanking] = useState<UserRanking[]>([]);
    const [teacherRanking, setTeacherRanking] = useState<UserRanking[]>([]);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const URL = import.meta.env.VITE_API_URL;
    const {user} = useAuth();

    useEffect(() => {
        const fetchUserRanking = async () => {
            const response = await fetch(`${URL}information/get-users-ranking`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user?.token}`,
                        'ngrok-skip-browser-warning': 'true',
                    },
                }
            )
            if(!response.ok){
                throw new Error('Error fetching student ranking');
            }
            const data = await response.json();
            setStudentRanking(data.students);
            setTeacherRanking(data.teachers);
        }
        fetchUserRanking();
    }, [URL, user?.token]);

    const toggleTable = () => setShowStudents(!showStudents);

    const handleScrollToTop = () => {
        scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleScrollToBottom = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
                top: scrollContainerRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    };

    const renderRow = (item: UserRanking, index: number) => {
        let medal = null;
        if (index === 0) {
            medal = <FaMedal color="#FFD700" />;
        } else if (index === 1) {
            medal = <FaMedal color="#C0C0C0" />;
        } else if (index === 2) {
            medal = <FaMedal color="#CD7F32" />;
        }

        return (
            <TableRow key={index}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.experience}</TableCell>
                <TableCell style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {index + 1} {medal}
                </TableCell>
            </TableRow>
        );
    };

    return (
        <MainContainer>
            <SideBar />
            <Topbar />
            <Logo/>
            <Content>
                <Container>
                    <MainTitle>{showStudents ? 'Top 50 Students on the Platform' : 'Top 50 Teachers on the Platform'}</MainTitle>
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: 0.2 }}
                    >
                    <ScrollableContainer ref={scrollContainerRef}>
                        <Table>
                            <thead>
                                <tr>
                                    <TableHeader style={{ position: 'sticky', top: 0, zIndex: 1, borderTopLeftRadius: '10px', width: '800px' }}>Name</TableHeader>
                                    <TableHeader style={{ position: 'sticky', top: 0, zIndex: 1 }}>Score</TableHeader>
                                    <TableHeader style={{ position: 'sticky', top: 0, zIndex: 1, borderTopRightRadius: '10px', width: '100px' }}>Rank</TableHeader>
                                </tr>
                            </thead>
                            <tbody>
                                {(showStudents ? studentRanking : teacherRanking).map((item, index) => renderRow(item, index))}
                            </tbody>
                        </Table>
                    </ScrollableContainer>
                    </motion.div>
                </Container>
                <ButtonsContainer>
                    <Button onClick={toggleTable}>
                        {showStudents ? 'Show Teachers Ranking' : 'Show Students Ranking'}
                    </Button>
                    <Button secondary onClick={handleScrollToBottom}><IoIosArrowDown /></Button>
                    <Button secondary onClick={handleScrollToTop}><IoIosArrowUp /></Button>
                </ButtonsContainer>
            </Content>
        </MainContainer>
    );
};

export default Leaderboard;
