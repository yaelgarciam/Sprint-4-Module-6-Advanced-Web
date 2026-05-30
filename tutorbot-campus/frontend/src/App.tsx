import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import ChatHeader from './components/ChatHeader';
import AuthGuard from './components/AuthGuard';
import TopicSelectPage from './pages/TopicSelectPage';
import ChatPage from './pages/ChatPage';
import ProgressPage from './pages/ProgressPage';
import LoginPage from './pages/LoginPage';
import ResultsPage from './pages/ResultsPage';
import { useSession } from './hooks/useSession';

function AppRoutes() {
  const location = useLocation();
  const {
    session,
    setTopic,
    setLevel,
    startSession,
    recordEvaluation,
    recordQuiz,
    resetSession,
  } = useSession();

  const showHeader = location.pathname !== '/login';

  return (
    <>
      {showHeader && (
        <ChatHeader
          topic={session.topicLabel || session.topic}
          level={session.level}
        />
      )}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <AuthGuard>
              <TopicSelectPage
                selectedTopic={session.topic}
                selectedLevel={session.level}
                onSelectTopic={setTopic}
                onSelectLevel={setLevel}
                onStartSession={startSession}
              />
            </AuthGuard>
          }
        />
        <Route
          path="/chat"
          element={
            <AuthGuard>
              <ChatPage
                session={session}
                onEvaluationComplete={recordEvaluation}
                onQuizGraded={recordQuiz}
              />
            </AuthGuard>
          }
        />
        <Route
          path="/progress"
          element={
            <AuthGuard>
              <ProgressPage session={session} onReset={resetSession} />
            </AuthGuard>
          }
        />
        <Route
          path="/results"
          element={
            <AuthGuard>
              <ResultsPage session={session} onReset={resetSession} />
            </AuthGuard>
          }
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
