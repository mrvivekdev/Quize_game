import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Loader2, AlertCircle, ChevronLeft } from "lucide-react";
import { getQuestions, submitScore } from "../utils/api";
import GPTAds from "../components/GPTAds";
import InterstitialAd from "../components/InterstitialAd";

export default function QuizPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const decodedCategory = decodeURIComponent(category || "General");

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]); // Array of 'correct' or 'wrong'

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        const limit = queryParams.get("limit") || 10;
        const data = await getQuestions(decodedCategory, "", limit);
        setQuestions(data);
      } catch (err) {
        setError("Failed to load questions. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [decodedCategory, location.search]);

  useEffect(() => {
    if (loading || error || questions.length === 0 || isAnswered) return;

    if (timeLeft === 0) {
      handleOptionSelect(null);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, loading, error, questions.length, isAnswered]);

  const handleOptionSelect = async (index) => {
    if (isAnswered) return;

    setIsAnswered(true);
    setSelectedOption(index);

    const currentQuestion = questions[currentIndex];
    const isCorrect =
      index !== null &&
      currentQuestion.options[index] === currentQuestion.correctAnswer;

    // Use current score for calculation since setScore is async
    const updatedScore = isCorrect ? score + 1 : score;
    if (isCorrect) {
      setScore(updatedScore);
      setResults((prev) => [...prev, "correct"]);
    } else {
      setResults((prev) => [...prev, "wrong"]);
    }

    if (currentIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setIsAnswered(false);
        setSelectedOption(null);
        setTimeLeft(15);
      }, 1500);
    } else {
      // Quiz Finished - Submit Score to Backend
      try {
        const submission = await submitScore(
          updatedScore,
          questions.length,
          decodedCategory,
        );

        const queryParams = new URLSearchParams({
          score: updatedScore,
          total: questions.length,
          quizTitle: decodedCategory,
          coinsEarned: submission.coinsEarned,
          totalCoins: submission.totalCoins,
        }).toString();

        window.googletag?.cmd.push(() => {
          const pubads = window.googletag.pubads();
          pubads.refresh();
        });

        setTimeout(() => {
          window.location.href = `/result?${queryParams}`;
        }, 1000);
      } catch (err) {
        console.error("Failed to submit score:", err);
        // Fallback to local result if API fails
        setTimeout(() => {
          navigate("/result", {
            state: {
              score: updatedScore,
              total: questions.length,
              quizTitle: decodedCategory,
              coinsEarned: 0,
            },
          });
        }, 1500);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#6358DC] flex flex-col items-center justify-center text-white p-6 font-['Outfit',sans-serif]">
        <Loader2 className="w-16 h-16 animate-spin mb-6 opacity-20" />
        <p className="text-lg font-black uppercase tracking-widest opacity-40">
          Loading Quiz...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#6358DC] flex flex-col items-center justify-center text-white p-6 text-center font-['Outfit',sans-serif]">
        <div className="p-4 bg-white/10 rounded-full mb-6">
          <AlertCircle className="w-12 h-12 text-red-300" />
        </div>
        <p className="text-xl font-bold mb-8 max-w-xs">{error}</p>
        <button
          onClick={() => navigate("/explore")}
          className="bg-white text-[#6358DC] px-10 py-4 rounded-3xl font-black text-lg shadow-xl hover:scale-105 active:scale-95 transition-transform"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (questions.length === 0) return null;

  const currentQuestion = questions[currentIndex];

  return (
    <>
      <InterstitialAd />
      {/* <AnchorAd position="top" />
      <AnchorAd position="bottom" /> */}
      <div className="min-h-screen bg-[#6358DC] relative overflow-hidden flex flex-col items-center px-4 py-8 font-['Outfit',sans-serif]">
        {/* Abstract Background Shapes */}
        <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-white/5 rounded-full blur-3xl"></div>

        {/* Header Section */}
        <div className="w-full max-w-md text-center mb-6 relative z-10">
          <p className="text-white/70 text-sm font-bold uppercase tracking-[0.2em] mb-2">
            {decodedCategory}
          </p>
          <h1 className="text-3xl font-black text-white flex items-center justify-center gap-2">
            Play and Win 220000{" "}
            <span className="text-yellow-400 drop-shadow-sm">🪙</span>
          </h1>
        </div>

        {/* Top Ad Section */}
        <div className="w-full max-w-md mb-6 relative z-10 px-2 opacity-90">
          <GPTAds />
        </div>

        {/* Progress Bars / Stats */}
        <div className="w-full max-w-md flex justify-between items-center mb-6 relative z-10 px-4">
          <div className="flex items-center gap-2">
            <span className="text-[#2BD17E] font-black text-2xl">{score}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#FF4B4B] font-black text-2xl">
              {currentIndex - score}
            </span>
          </div>
        </div>

        {/* Main Question Card */}
        <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-6 relative z-10 flex flex-col gap-6">
          {/* Question Numbers - Dynamic based on number of questions */}
          <div className="flex justify-center flex-wrap gap-2 px-1">
            {questions.map((_, i) => {
              const result = results[i];
              let bgColor = "bg-gray-100 text-gray-400";
              if (currentIndex === i) {
                bgColor = "bg-[#0F172A] text-white scale-110 shadow-lg";
              } else if (result === "correct") {
                bgColor = "bg-[#2BD17E] text-white";
              } else if (result === "wrong") {
                bgColor = "bg-[#FF4B4B] text-white";
              }

              return (
                <div
                  key={i}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${bgColor}`}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>

          {/* Question Text Box */}
          <div className="bg-[#F0F2FF] rounded-3xl p-8 min-h-[160px] flex items-center justify-center text-center">
            <h2 className="text-xl font-black text-[#0F172A] leading-tight">
              {currentQuestion.questionText}
            </h2>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-2 gap-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedOption === index;
              const isCorrect = option === currentQuestion.correctAnswer;

              let buttonStyle =
                "bg-[#7165F0] text-white hover:bg-[#5D51E8] active:scale-[0.98]";
              if (isAnswered) {
                if (isCorrect) {
                  buttonStyle = "bg-[#2BD17E] text-white";
                } else if (isSelected) {
                  buttonStyle = "bg-[#FF4B4B] text-white";
                } else {
                  buttonStyle = "bg-[#7165F0]/50 text-white/70";
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  disabled={isAnswered}
                  className={`h-16 px-4 rounded-2xl font-bold flex items-center justify-center text-center leading-tight transition-all duration-200 shadow-md ${buttonStyle}`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {/* Card Footer */}
          <div className="flex justify-between items-center pt-2">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-100">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#7165F0]"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span className="font-black text-[#0F172A]">{timeLeft} Sec</span>
            </div>

            {/* <button className="px-5 py-2 rounded-xl border-2 border-gray-100 font-black text-gray-400 uppercase text-sm tracking-wider hover:bg-gray-50 transition-colors">
            Use Lifeline
          </button> */}
          </div>
        </div>

        {/* Bottom Ad Section */}
        <div className="w-full max-w-md mt-8 relative z-10 px-2 opacity-80">
          <GPTAds />
        </div>

        {/* Page Footer */}
        <div className="mt-auto pt-8">
          <p className="text-white text-xl font-bold">
            Your score : <span className="font-black">{score}</span>
          </p>
        </div>
      </div>
    </>
  );
}
