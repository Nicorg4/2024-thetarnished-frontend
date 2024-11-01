import { createContext } from 'react';

export interface ScheduleEntry {
  maxstudents: string;
  studentsCount: number;
  scheduleid: string;
  start_time: string;
  end_time: string;
  teacherid: string;
  dayofweek: string;
}

interface Stats {
  total_reservations: number;
  total_exams: number;
  total_time: number;
}

export interface User {
  id: BigInteger;
  firstName: string;
  lastName: string;
  email: string;
  subjects: {
    subjectid: string;
    subjectname: string;
  }[];
  schedule?: ScheduleEntry[];
  isActive: boolean;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  isOnVacation: boolean;
  token: string;
  avatar_id: number;
  xp: number;
  lvl: number;
  stats: Stats;
  hasFoundEasterEgg?: boolean;
  exp: number;
}

export interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (newUserData: Partial<User>) => void;
  checkSession: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);