import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext, User } from './AuthContext';
import {jwtDecode} from 'jwt-decode';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const navigate = useNavigate();

  const URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch(`${URL}authentication/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }
    const data = await response.json();
    const info = jwtDecode<{
      id: Uint8Array;
      firstname: string;
      lastname: string;
      email: string;
      role: 'STUDENT' | 'TEACHER' | 'ADMIN';
      isActive: boolean;
      on_vacation: boolean;
      avatar_id: number;
      xp: number;
      hasFoundEasterEgg: boolean;
    }>(data.token);


    let userLevel

    if(info.xp > 0){
      const adjustedXp = Math.max(info.xp, 1000);
      userLevel = Math.floor(1 + Math.log(adjustedXp / 1000) / Math.log(1.2));
    }
    else{
      userLevel = 1
    }

    let sufix = ''

    if(info.role === 'TEACHER'){
      sufix = 'teacher'
    }
    else{
        sufix = 'student'
    }

      const getUserStats = await fetch(`${URL}information/get-${sufix}-stats/${info.id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
      if(!getUserStats.ok){
        throw new Error('Login failed');
      }
      
    
    
    const userStats = await getUserStats.json();
    
    const loggedInUser: User = {
      id: info.id,
      firstName: info.firstname,
      lastName: info.lastname,
      email: info.email,
      subjects: data.user_subjects,
      schedule: data.user_schedule,
      role: info.role,
      isActive: info.isActive,
      isOnVacation: info.on_vacation,
      token: data.token,
      avatar_id: info.avatar_id,
      xp: info.xp,
      lvl: userLevel,
      stats: userStats
    };

    setUser(loggedInUser);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    setIsLoggedIn(true);

    const roleRoutes: { [key: string]: string } = {
      STUDENT: '/student-home',
      TEACHER: '/teacher-home',
      ADMIN: '/admin-home',
    };

    const route = roleRoutes[info.role];
    navigate(route);
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/');
  };

  const updateUser = (newUserData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...newUserData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };


  const getUserHome = () => {
    const role = user?.role
    if (role === 'ADMIN') {
      return '/admin-home';
    } else if (role === 'TEACHER') {
      return '/teacher-home';
    } else if (role === 'STUDENT') {
      return '/student-home';
    } else{
      return '/';
    }
  }
  const checkSession = () => {
    if (isLoggedIn) {
      navigate(getUserHome())
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout, updateUser, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
};
