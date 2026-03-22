import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Zap, Trophy, Users, Star } from 'lucide-react';

const QuizContestCard = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    const features = [
        { icon: <Zap className="w-5 h-5 text-yellow-300" />, title: "Instant Play", desc: "No registration required to start your first quiz." },
        { icon: <Trophy className="w-5 h-5 text-yellow-300" />, title: "Big Prizes", desc: "Win up to 220,000 coins in our daily featured contests." },
        { icon: <Users className="w-5 h-5 text-yellow-300" />, title: "Global Rank", desc: "Compare your score with players from around the world." },
        { icon: <Star className="w-5 h-5 text-yellow-300" />, title: "New Topics", desc: "Fresh questions added every hour across 10+ categories." }
    ];

    return (
        <div className="w-full max-w-4xl mx-auto px-2 mb-10 mt-10">
            <div className={`bg-[#8c7df0] rounded-[40px] p-8 sm:p-10 text-center shadow-xl relative overflow-hidden group transition-all duration-500 hover:shadow-2xl ${isExpanded ? 'bg-[#7a6add]' : 'hover:bg-[#8373ef]'}`}>
                {/* Minimal backdrop glow */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

                <div className="relative z-10 space-y-6">
                    <div className="space-y-4">
                        <h2 className="text-white text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                            Play Online Quiz Contest
                        </h2>

                        <div className="space-y-3">
                            <h3 className="text-white text-lg sm:text-xl font-black opacity-95">
                                Play and Learn with Exciting Online Quizzes
                            </h3>

                            <p className="text-white/80 text-sm sm:text-[15px] font-bold leading-relaxed max-w-md mx-auto">
                                QuizNova is the finest platform to discover knowledge, fun and interactive learning across multiple domains.
                            </p>
                        </div>
                    </div>

                    {/* Expandable Section */}
                    <div className={`transition-all duration-500 overflow-hidden ${isExpanded ? 'max-h-[500px] opacity-100 pt-6 mt-4' : 'max-h-0 opacity-0'}`}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                            {features.map((f, i) => (
                                <div key={i} className="bg-white/10 rounded-2xl p-4 border border-white/5 flex items-start gap-3">
                                    <div className="mt-1 p-2 bg-white/10 rounded-lg">
                                        {f.icon}
                                    </div>
                                    <div>
                                        <p className="text-white font-black text-sm uppercase tracking-wider">{f.title}</p>
                                        <p className="text-white/60 text-[12px] font-bold leading-snug">{f.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="flex items-center gap-2 mx-auto text-white text-[13px] font-black uppercase tracking-[0.2em] hover:tracking-[0.3em] transition-all duration-300"
                        >
                            {isExpanded ? "Show Less" : "View More"}
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        <div className="w-8 h-1 bg-white/30 mx-auto mt-3 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizContestCard;
