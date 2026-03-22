import { useNavigate } from "react-router-dom";
import { Check, Coins, PlayCircle } from "lucide-react";
import GPTAds from "../components/GPTAds";

export default function SuccessPage() {
  const navigate = useNavigate();

  const features = [
    "Expand your expertise through our exclusive and wide-ranging quiz topics.",
    "A widest and coolest collection of fun and engaging quizzes entertains you.",
    "The completion of each quiz contest boosts your knowledge and self-confidence.",
    "A large number of players from across the globe rely on us to have an immersive quiz experience.",
    "Major categories you discover here include Business, Finance, Sports, Knowledge and more.",
    "Challenge players worldwide and enhance your abilities.",
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-[#6a5ae0] via-[#7d6dfa] to-[#5143cc] flex flex-col items-center p-4 space-y-4 animate-fade-in overflow-hidden relative no-scrollbar">
      {/* Background Decorative Circles */}
      <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-white/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[250px] h-[250px] bg-white/5 rounded-full blur-[60px] pointer-events-none" />

      {/* Reward Card */}
      <div className="w-full max-w-[380px] bg-white rounded-[32px] p-6 shadow-2xl relative z-10 text-center space-y-4 mt-2">
        {/* Animated Purple Dot */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#6a5ae0] rounded-full animate-pulse" />

        <div className="relative inline-block mt-2">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto shadow-inner border border-yellow-200">
            <Coins
              className="w-8 h-8 text-yellow-500 fill-yellow-500/10"
              strokeWidth={2.5}
            />
          </div>
          {/* Secondary smaller coin */}
          <div className="absolute -bottom-1 right-[-4px] w-7 h-7 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center shadow-md">
            <Coins className="w-4 h-4 text-white" />
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="text-xl font-black text-[#2d2747] leading-tight">
            You have earned 100 coins
          </h1>
          <p className="text-gray-400 font-bold text-[12px] leading-snug px-4">
            Challenge yourself with more quizzes and earn even more coins!
          </p>
        </div>

        <button
          onClick={() => navigate("/explore")}
          className="w-full bg-[#6a5ae0] hover:bg-[#5143cc] text-white py-3 rounded-[24px] text-[16px] font-black shadow-lg shadow-indigo-200/50 transform transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
        >
          Play Now
        </button>
      </div>

      {/* Discovery Section - Optimized for Readability */}
      <div className="w-full max-w-[380px] bg-white/10 backdrop-blur-md rounded-[28px] p-5 border border-white/10 space-y-3 relative z-10 transition-colors hover:bg-white/20">
        <h2 className="text-[17px] font-bold text-white tracking-tight flex items-center gap-2">
          <PlayCircle className="w-4 h-4 text-white/80" />
          Discover Fun Quizzes
        </h2>

        <ul className="space-y-2.5">
          {features.slice(0, 5).map((feature, idx) => (
            <li key={idx} className="flex gap-3 items-start group">
              <div className="mt-1 flex-shrink-0 w-[16px] h-[16px] bg-white/20 rounded-md flex items-center justify-center">
                <Check className="w-3 h-3 text-white" strokeWidth={4} />
              </div>
              <p className="text-[12.5px] font-bold text-white leading-snug tracking-tight">
                {idx === 4 ? feature + "e" : feature}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
