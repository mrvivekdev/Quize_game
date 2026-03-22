import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  Trophy,
  Share2,
  RotateCcw,
  Home,
  Star,
  PartyPopper,
  ChevronLeft,
} from "lucide-react";
import GPTAds from "../components/GPTAds";
import InterstitialAd from "../components/InterstitialAd";

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  // Read from state or query params (supporting full-page reload)
  const score = location.state?.score ?? parseInt(searchParams.get("score") || "0");
  const total = location.state?.total ?? parseInt(searchParams.get("total") || "0");
  const quizTitle = location.state?.quizTitle ?? (searchParams.get("quizTitle") || "Quiz");
  const coinsEarned = location.state?.coinsEarned ?? parseInt(searchParams.get("coinsEarned") || "0");
  const totalCoins = location.state?.totalCoins ?? parseInt(searchParams.get("totalCoins") || "0");

  const hasData = location.state || searchParams.has("score");

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
        <h2 className="text-2xl font-black text-gray-900">No results found!</h2>
        <Link to="/explore" className="btn-primary w-auto px-8">
          Go Home
        </Link>
      </div>
    );
  }

  const percentage = Math.round((score / total) * 100);

  let message = "Good job!";
  if (percentage === 100) message = "Perfect Score!";
  else if (percentage >= 80) message = "Excellent!";
  else if (percentage >= 60) message = "Well Done!";
  else if (percentage < 40) message = "Keep Trying!";

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "My Quiz Result",
          text: `I scored ${score}/${total} on the ${quizTitle} quiz!`,
          url: window.location.origin,
        })
        .catch(console.error);
    } else {
      alert(`I scored ${score}/${total} on the ${quizTitle} quiz!`);
    }
  };

  return (
    <div className="min-h-screen bg-[#6358DC] relative overflow-hidden flex flex-col items-center px-4 py-8 font-['Outfit',sans-serif]">
      <InterstitialAd />
      {/* Abstract Background Shapes */}
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-white/5 rounded-full blur-3xl"></div>

      {/* Header Section */}
      <div className="w-full max-w-md text-center mb-6 relative z-10">
        <p className="text-white/70 text-sm font-bold uppercase tracking-[0.2em] mb-2">
          {quizTitle}
        </p>
        <h1 className="text-3xl font-black text-white flex items-center justify-center gap-2 uppercase tracking-tight">
          Play and Win 220000{" "}
          <span className="text-yellow-400 drop-shadow-sm">🪙</span>
        </h1>
      </div>

      {/* Main Result Card */}
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-5 relative z-10 flex flex-col gap-5">
        {/* Decorative Dot at top */}
        <div className="w-2 h-2 bg-[#6358DC] rounded-full mx-auto -mt-2.5"></div>

        {/* Inner Purple Card */}
        <div className="bg-[#7265F0] rounded-[2rem] p-8 text-center text-white flex flex-col items-center gap-4 relative overflow-hidden">
          {/* Confetti decoration */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-1 h-1 rounded-full bg-white animate-pulse`}
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              ></div>
            ))}
          </div>

          <div className="p-3 bg-white/10 rounded-full">
            <PartyPopper className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-2xl font-black">Well Played</h2>

          <div className="bg-[#2BD17E] px-8 py-3 rounded-2xl shadow-lg transform -rotate-1 flex flex-col items-center">
            <span className="text-4xl font-black">
              {coinsEarned >= 0 ? "+" : ""}
              {coinsEarned}
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-80">
              Coins Earned
            </span>
          </div>

          <div className="mt-2 space-y-1">
            <p className="text-sm font-bold opacity-80 uppercase tracking-tighter">
              Total Balance: {totalCoins || 0} 🪙
            </p>
            <p className="text-[11px] font-medium opacity-70 italic">
              {coinsEarned >= 0 
                ? "Your knowledge is paying off!" 
                : "Better luck next time!"}
            </p>
          </div>
        </div>

        {/* Stats Row (Peach Section) */}
        <div className="bg-[#FFE5E5] rounded-[2rem] py-5 px-6 grid grid-cols-4 gap-2">
          <div className="text-center">
            <p className="text-2xl font-black text-[#1e1a3d]">2</p>
            <p className="text-[10px] uppercase font-black text-red-400 tracking-wider">
              Rank
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-[#1e1a3d]">{total}</p>
            <p className="text-[10px] uppercase font-black text-red-400 tracking-wider">
              Total
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-[#1e1a3d]">{score}</p>
            <p className="text-[10px] uppercase font-black text-red-400 tracking-wider">
              Correct
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-[#1e1a3d]">
              {total - score}
            </p>
            <p className="text-[10px] uppercase font-black text-red-400 tracking-wider">
              Wrong
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 pb-2">
          <button
            onClick={() => navigate("/explore")}
            className="bg-[#5D51E8] text-white py-4 rounded-[2rem] font-black text-lg shadow-lg hover:scale-[1.02] transition-transform"
          >
            Play Quiz
          </button>
          <button
            onClick={() => navigate(-1)}
            className="bg-[#FEB800] text-white py-4 rounded-[2rem] font-black text-lg shadow-lg hover:scale-[1.02] transition-transform"
          >
            Play Again
          </button>
        </div>
      </div>

      {/* Scroll Down Hint */}
      <div className="mt-8 flex flex-col items-center gap-2 opacity-40">
        <div className="w-10 h-6 bg-white/20 rounded-t-xl flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
      </div>

      <GPTAds />
    </div>
  );
}
