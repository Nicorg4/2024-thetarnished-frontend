import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './auth/AuthProvider';
import Login from '../src/pages/login';
import TeacherHome from './pages/teacher-home';
import StudentHome from './pages/student-home';
import ManageSchedule from './pages/manage-schedule';
import ManageClasses from './pages/manage-classes';
import Profile from './pages/profile';
import Settings from './pages/settings';
import MyClasses from './pages/my-classes';
import ClassBrowser from './pages/class-browser';
import ForgotPassword from './pages/forgot-password';
import Register from './pages/register';
import ChangePassword from './pages/change-password';
import ResetPassword from './pages/reset-password';
import AdminHome from './pages/admin-home';
import LandingPage from './pages/landing-page';
import ExamViewer from './pages/my-exams';
import ExamDetail from './pages/exam-detail';
import ClassConfirm from './pages/confirm-class';
import SessionExpHandler from './auth/SessionExpHandler';
import AccessDenied from './pages/access-denied';
import ProtectedRoute from './auth/ProtectedRoute';
import NotFound from './pages/not-found';
import UpdateSubjects from './pages/update-subjects';
import TeacherValidation from './pages/teacher-validation'
import Leaderboard from './pages/leaderboard';
import Quiz from './pages/daily-quiz';
import UploadNotes from './pages/upload-notes';
import SharedNotes from './pages/shared-notes';

const App: React.FC = () => {
    return (
    <Router>
      <AuthProvider>
        <SessionExpHandler />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/reset-password/:userId/:token" element={<ResetPassword />} />
          <Route path="/admin-home" element={<AdminHome />} />
          <Route path="/my-exams" element={<ExamViewer />} />
          <Route path="/exam/:examId" element={<ExamDetail />} />
          <Route path="/teacher-home" element={<ProtectedRoute element={<TeacherHome />} roles={['TEACHER']} />} />
          <Route path="/student-home" element={<ProtectedRoute element={<StudentHome />} roles={['STUDENT']} />} />
          <Route path="/manage-schedule" element={<ProtectedRoute element={<ManageSchedule />} roles={['TEACHER']} />} />
          <Route path="/manage-classes" element={<ProtectedRoute element={<ManageClasses />} roles={['TEACHER']} />} />
          <Route path="/my-classes" element={<ProtectedRoute element={<MyClasses />} roles={['STUDENT']} />} />
          <Route path="/my-exams" element={<ProtectedRoute element={<ExamViewer />} roles={['STUDENT']} />} />
          <Route path="/class-browser/:subjectId/:subjectName" element={<ProtectedRoute element={<ClassBrowser />} roles={['STUDENT']} />} />
          <Route path="/profile" element={<ProtectedRoute element={<Profile />} roles={['STUDENT', 'TEACHER']} />} />
          <Route path="/settings" element={<ProtectedRoute element={<Settings />} roles={['STUDENT', 'TEACHER']} />} />
          <Route path="/admin-home" element={<ProtectedRoute element={<AdminHome />} roles={['ADMIN']} />} />
          <Route path="teacher-validation" element={<ProtectedRoute element={<TeacherValidation />} roles={['ADMIN']} />} />
          <Route path="/exam/:examId" element={<ProtectedRoute element={<ExamDetail />} roles={['STUDENT']} />} />
          <Route path="/confirm-class/:reservationId/:teacherId" element={<ProtectedRoute element={<ClassConfirm mode={"confirm"}/> } roles={['TEACHER']} />} />
          <Route path="/reject-class/:reservationId/:teacherId" element={<ProtectedRoute element={<ClassConfirm mode={"reject"}/> } roles={['TEACHER']} />} />
          <Route path='/update-subjects' element={<ProtectedRoute element={<UpdateSubjects />} roles={['ADMIN']} />} />
          <Route path="leaderboard" element={<ProtectedRoute element={<Leaderboard />} roles={['STUDENT', 'TEACHER']} />} />
          <Route path="/access-denied" element={<AccessDenied />} />
          <Route path="/daily-quiz" element={<ProtectedRoute element={<Quiz />} roles={['STUDENT', 'TEACHER']} />} />
          <Route path="/upload-notes" element={<ProtectedRoute element={<UploadNotes />} roles={['TEACHER']} />} />
          <Route path="/shared-notes" element={<ProtectedRoute element={<SharedNotes />} roles={['STUDENT']} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};
export default App;
