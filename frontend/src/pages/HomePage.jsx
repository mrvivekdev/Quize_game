import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { getCategories } from "../utils/api";
import GPTAds from "../components/GPTAds";
import AnchorAd from "../components/AnchorAd";
import QuizContestCard from "../components/QuizContestCard";
import InterstitialAd from "../components/InterstitialAd";

const categoryIcons = {
  all: "🔥",
  bollywood: "🎬",
  cricket: "🏏",
  "birds and animals": "🐯",
  "brain teasers": "🧠",
  "general knowledge": "📘",
  technology: "💻",
  science: "🔬",
  entertainment: "🎮",
  finance: "💰",
  sport: "🏆",
  "world geography": "🌍",
};

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const movedRef = useRef(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(["All", ...data]);
      } catch (error) {
        console.error("Error loading categories", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const activeBtn = el.querySelector(".active-tab");
    if (activeBtn) {
      el.scrollTo({
        left:
          activeBtn.offsetLeft - el.offsetWidth / 2 + activeBtn.offsetWidth / 2,
        behavior: "smooth",
      });
    }
  }, [selectedCategory]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      if (e.deltaY === 0) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [isLoading, categories]);

  const handleMouseDown = (e) => {
    isDown.current = true;
    scrollRef.current.classList.add("active");
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
    scrollRef.current.style.cursor = "grabbing";
    movedRef.current = false;
  };
  const handleMouseLeave = () => {
    isDown.current = false;
    if (scrollRef.current) {
      scrollRef.current.classList.remove("active");
      scrollRef.current.style.cursor = "grab";
    }
  };
  const handleMouseUp = () => {
    isDown.current = false;
    if (scrollRef.current) {
      scrollRef.current.classList.remove("active");
      scrollRef.current.style.cursor = "grab";
    }
  };
  const handleMouseMove = (e) => {
    if (!isDown.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 2;
    if (Math.abs(walk) > 5) movedRef.current = true;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };
  const handleTouchStart = (e) => {
    isDown.current = true;
    startX.current = e.touches[0].pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
  };
  const handleTouchMove = (e) => {
    if (!isDown.current) return;
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 2;
    if (Math.abs(walk) > 5) movedRef.current = true;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };
  const handleTouchEnd = () => {
    isDown.current = false;
  };
  const handleClickCapture = (e) => {
    if (movedRef.current) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-gray-500 font-medium tracking-tight">
          Loading Quizzes...
        </p>
      </div>
    );
  }

  const filteredCategories =
    selectedCategory === "All"
      ? categories.filter((c) => c !== "All")
      : [selectedCategory];

  return (
    <div className="space-y-6 animate-slide-up pb-10 max-w-4xl mx-auto px-1 mb-20 mt-2">
      <InterstitialAd />
      {/* <AnchorAd position="top" /> */}
      {/* <AnchorAd position="bottom" /> */}
      <AnchorAd />
      <GPTAds />

      {/* Main Dashboard Card */}
      <div className="w-full bg-gradient-to-br from-[#9187e6] to-[#7d71d9] rounded-[28px] border border-white/20 p-1 pb-6 shadow-2xl relative overflow-hidden">
        {/* Category Tabs */}
        <div className="relative overflow-hidden mb-1">
          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClickCapture={handleClickCapture}
            className="flex items-center gap-2.5 overflow-x-auto no-scrollbar px-3 py-3 touch-pan-y"
          >
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex items-center gap-2 flex-shrink-0 px-4 py-2 rounded-2xl text-[11.5px] font-black transition-all duration-200 uppercase tracking-widest border-2
                    ${
                      isActive
                        ? "active-tab bg-white text-[#6a5ae0] border-white scale-105 shadow-lg"
                        : "bg-[#7165F0] text-white/90 border-[#8b81e4] hover:bg-[#6358DC]"
                    }`}
                >
                  <span className="text-[13px] leading-none">
                    {categoryIcons[cat.toLowerCase()] || "❓"}
                  </span>
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Contest Cards */}
        <div className="flex flex-col gap-3 px-2.5">
          {filteredCategories.map((category, index) => {
            const prize = (index + 1) * 10000 + (index % 3) * 5000;
            const players = 5000 + index * 134;
            const entry = index % 2 === 0 ? "Free Entry" : "₹50 Entry";
            const endTime = index % 2 === 0 ? "12:00 am" : "12:15 am";

            return (
              <div
                key={category}
                onClick={() =>
                  navigate(`/quiz/${encodeURIComponent(category)}/start`)
                }
                className="bg-white rounded-[14px] p-[10px] shadow-md cursor-pointer active:scale-[0.98] transition-transform"
              >
                <div className="flex items-stretch gap-[10px]">
                  {/* Icon Box */}
                  <div className="w-[70px] min-w-[70px] bg-gradient-to-br from-[#eceaff] to-[#e8e4ff] rounded-[12px] flex flex-col items-center justify-center gap-1 py-2">
                    <span className="text-[30px] leading-none">
                      {categoryIcons[category.toLowerCase()] || "❓"}
                    </span>
                    <span className="text-[9px] font-black text-[#5648c8] uppercase tracking-widest text-center px-1 leading-tight">
                      {category}
                    </span>
                  </div>

                  {/* Right Content */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    {/* Title + LIVE */}
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[15px] font-black text-[#111] leading-snug">
                        Play and Win {prize.toLocaleString()} 🪙
                      </span>
                      <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
                        <span className="w-[7px] h-[7px] rounded-full bg-red-500 animate-pulse inline-block" />
                        <span className="text-[11px] font-black text-red-500 uppercase tracking-tight">
                          Live
                        </span>
                      </div>
                    </div>

                    {/* Meta + Play Button */}
                    <div className="flex items-end justify-between gap-2 mt-2">
                      <div className="flex flex-col gap-[3px]">
                        <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#333]">
                          <span>🏆</span>
                          <span>Contest Ends @ {endTime}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#333]">
                          <span>👥</span>
                          <span>
                            <strong className="font-black text-[#111]">
                              {players.toLocaleString()}
                            </strong>{" "}
                            Users Playing
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#333]">
                          <span>▶</span>
                          <span>{entry}</span>
                        </div>
                      </div>

                      {/* Play Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.googletag?.cmd.push(() => {
                            window.googletag.pubads().refresh();
                          });
                          navigate(
                            `/quiz/${encodeURIComponent(category)}/start`,
                          );
                        }}
                        className="flex items-center gap-1.5 bg-[#6c5ce7] text-white text-[12px] font-black uppercase tracking-wider px-4 py-2 rounded-[10px] shadow-md flex-shrink-0 active:scale-95 transition-transform"
                      >
                        Play
                        <span
                          style={{
                            display: "inline-block",
                            width: 0,
                            height: 0,
                            borderTop: "5px solid transparent",
                            borderBottom: "5px solid transparent",
                            borderLeft: "9px solid white",
                          }}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <GPTAds />
      <QuizContestCard />

      {/* Footer */}
      <div className="mt-10 py-10 text-center space-y-6">
        <div className="flex justify-center gap-8 text-white/80 text-[12px] font-bold uppercase tracking-[0.1em]">
          <button className="hover:text-white transition-colors underline decoration-white/20 underline-offset-4">
            Terms & Conditions
          </button>
          <button className="hover:text-white transition-colors underline decoration-white/20 underline-offset-4">
            Privacy Policy
          </button>
        </div>
        <p className="text-white/40 text-[11px] font-medium">
          © 2026 QuizNova. All rights reserved.
        </p>
      </div>
    </div>
  );
}
