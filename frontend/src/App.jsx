import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import StartPage from './pages/StartPage';
import QuizPage from './pages/QuizPage';
import ResultPage from './pages/ResultPage';
import ProfilePage from './pages/ProfilePage';
import SuccessPage from './pages/SuccessPage';
import SearchPage from './pages/SearchPage';
import { authenticateGuest, getMe } from './utils/api';

function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const setupApp = async () => {
      console.log("App initializing...");
      try {
        // Try to get existing session from cookie
        console.log("Checking for existing session...");
        const userData = await getMe();
        console.log("Session found:", userData.name);
        
        // Update local storage in case it was cleared but cookie remains
        if (userData.name) localStorage.setItem('userName', userData.name);
        if (userData.guestId) localStorage.setItem('guestId', userData.guestId);
        if (userData.avatar) localStorage.setItem('userAvatar', userData.avatar);
        
        setIsReady(true);
      } catch (error) {
        console.log("No existing session or error, authenticating as guest...", error.response?.status || error.message);
        try {
          const guestData = await authenticateGuest();
          console.log("Guest authenticated:", guestData.name);
          setIsReady(true);
        } catch (innerError) {
          console.error("Critical error: Could not authenticate guest.", innerError);
          // Still set ready so the app can render, maybe the user can refresh or login manually
          setIsReady(true);
        }
      }
    };
    setupApp();
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="explore" element={<HomePage />} />
          <Route path="quiz/:category/start" element={<StartPage />} />
          <Route path="quiz/:category" element={<QuizPage />} />
          <Route path="result" element={<ResultPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="success" element={<SuccessPage />} />
          <Route path="search" element={<SearchPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
