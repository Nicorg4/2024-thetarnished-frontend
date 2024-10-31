import React, { useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title as ChartTitle, Tooltip, Legend } from 'chart.js';
import styled, { keyframes } from 'styled-components';
import colors from '../../assets/colors';
import { useAuth } from '../../auth/useAuth';

ChartJS.register(CategoryScale, LinearScale, BarElement, ChartTitle, Tooltip, Legend);

export const MainContainer = styled.div`
    height: 100vh ;
    width: 100vw ;
    display: flex;
    align-items: center ;
    background: rgb(43,84,52);
    background: radial-gradient(circle, rgba(43,84,52,1) 0%, rgba(15,41,46,1) 92%);

    @media (max-width: 1000px){
        flex-direction: column;
        padding-bottom: 100px;
    }
`

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const Content = styled.div`
    width: 85% ;
    margin-left: 150px;
    margin-right: 50px;
    border-radius: 10px;
    display: flex ;
    flex-direction: column;
    align-items: center ;
    justify-content: center;
    background-color: ${colors.secondary};
    height: 80%;
    padding: 30px 20px 70px 20px;
    color: ${colors.primary};
    animation: ${slideIn} 0.2s ease-out forwards;

    @media (max-width: 1000px){
        margin-left: 0;
        margin-right: 0;
        margin-top: 100px;
    }
`

const DashboardContainer = styled.div`
    padding: 20px;
    background-color: #ffffff;
    border-radius: 8px;
    width: 100%;
`;

const StatsContainer = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-bottom: 20px;
    width: 80%;
    margin:auto;
    gap: 10px;

    @media (max-width: 1000px){
        flex-direction: column;
        align-items: center;
        width: 100%;
    }
`;

const StatCard = styled.div`
    background: #fff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
    border: 1px solid ${colors.primary};
    flex: 1;
    margin: 0 10px;
    max-width: 300px;

    h2 {
        font-size: 18px;
        margin: 0;
        color: #555;
    }

    p {
        font-size: 24px;
        margin: 5px 0;
        font-weight: bold;
    }

    @media (max-width: 1000px){
        width: 100%;
    }
`;

const ChartContainer = styled.div`
    height: 80%;
    max-height: 80%;
    display: flex;
    justify-content: center;
    margin-top: 30px;
`


const options = {
    responsive: true,
    plugins: {
        legend: {
            display: true,
        },
        tooltip: {
            mode: 'index' as const,
            intersect: false,
        },
    },
    scales: {
        x: {
            title: {
                display: true,
                text: 'Last 5 months',
                color: `${colors.primary}`,
                font: {
                    size: 20,
                },
            },
        },
        y: {
            title: {
                display: true,
                text: 'Reservations',
                color: `${colors.primary}`,
                font: {
                    size: 20,
                },
            },
        },
    },
};

const Dashboard: React.FC = () => {
    const URL = import.meta.env.VITE_API_URL;
    const {user} = useAuth();
    const [totalReservations, setTotalReservations] = React.useState(0);
    const [totalStudents, setTotalStudents] = React.useState(0);
    const [totalTeachers, setTeachers] = React.useState(0);
    const [monthlyReservationsData, setMonthlyReservationsData] = React.useState<number[]>([]);
    const [width, setWidth] = React.useState(window.innerWidth);

    const getLastMonths = () => {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June', 
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        const currentMonthIndex = new Date().getMonth();
        const labels = [];
        let numberOfMonths = 5;

        if (width < 1000) {
            numberOfMonths = 3;
        }
    
        for (let i = 0; i < numberOfMonths; i++) {
            const monthIndex = (currentMonthIndex - i + 12) % 12;
            labels.unshift(months[monthIndex]);
        }
        
        const adjustedData = monthlyReservationsData.slice(-numberOfMonths);
    
        return { labels, adjustedData };
    };

    const { labels, adjustedData } = getLastMonths();

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Total Reservations',
                backgroundColor: `${colors.primary}`,
                data: adjustedData,
            },
        ],
    };

    useEffect(() => {
      const fetchAppAnalytics = async () => {
        try{    
            const response = await fetch(`${URL}information/get-analytics`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${user?.token}`,
                },
            });
            if(!response.ok){
                throw new Error("Failed to fetch app analytics");
            }
            const data = await response.json();
            setTotalReservations(data.totalReservations);
            setTotalStudents(data.totalStudents);
            setTeachers(data.totalTeachers);
            setMonthlyReservationsData(data.monthlyReservations);
        }catch(error){ 
            console.error("Error fetching app analytics: ", error);
        }
    }
    if(user?.token){
        fetchAppAnalytics();
    }
    const handleResize = () => {
        setWidth(window.innerWidth);
      };
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, [URL, user?.token])
    
    return (
        <DashboardContainer>
            <StatsContainer>
                <StatCard>
                    <h2>Total Students</h2>
                    <p>{totalStudents}</p>
                </StatCard>
                <StatCard>
                    <h2>Total Teachers</h2>
                    <p>{totalTeachers}</p>
                </StatCard>
                <StatCard>
                    <h2>Total Reservations</h2>
                    <p>{totalReservations}</p>
                </StatCard>
            </StatsContainer>
            <ChartContainer>
                <Bar data={data} options={options} />
            </ChartContainer>
        </DashboardContainer>
    );
};

export default Dashboard;
