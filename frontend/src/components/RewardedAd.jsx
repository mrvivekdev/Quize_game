import { useEffect, useState } from "react";
import { X, PlayCircle, Gift } from "lucide-react";

export default function RewardedAd() {
  const [status, setStatus] = useState("");
  const [modalType, setModalType] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    // Load GPT script if not already present
    if (!document.getElementById("gpt-rewarded-script")) {
      const script = document.createElement("script");
      script.id = "gpt-rewarded-script";
      script.src = "https://securepubads.g.doubleclick.net/tag/js/gpt.js";
      script.async = true;
      script.crossOrigin = "anonymous";
      document.body.appendChild(script);
    }

    window.googletag = window.googletag || { cmd: [] };

    let rewardedSlot;
    let rewardPayload;

    window.googletag.cmd.push(() => {
      rewardedSlot = window.googletag.defineOutOfPageSlot(
        "/22639388115/rewarded_web_example",
        window.googletag.enums.OutOfPageFormat.REWARDED
      );

      if (rewardedSlot) {
        rewardedSlot.addService(window.googletag.pubads());

        // Ready event
        window.googletag
          .pubads()
          .addEventListener("rewardedSlotReady", (event) => {
            setStatus("Rewarded ad slot is ready.");

            window.showAd = () => {
              event.makeRewardedVisible();
              setModalType("");
              setStatus("Rewarded ad is active.");
            };

            setModalType("reward");
            setModalMessage("Watch a short ad to receive a special bonus reward?");
          });

        // Completed
        window.googletag
          .pubads()
          .addEventListener("rewardedSlotVideoCompleted", () => {
            setStatus("Video ad finished.");
          });

        // Reward granted
        window.googletag
          .pubads()
          .addEventListener("rewardedSlotGranted", (event) => {
            rewardPayload = event.payload;
            setStatus("Reward granted.");
          });

        // Closed
        window.googletag
          .pubads()
          .addEventListener("rewardedSlotClosed", () => {
            if (rewardPayload) {
              setModalType("grant");
              setModalMessage(
                `Awesome! You've received ${rewardPayload.amount} ${rewardPayload.type}!`
              );
              rewardPayload = null;
            } else {
              setModalType("");
            }

            setStatus("Ad closed.");

            if (rewardedSlot) {
              window.googletag.destroySlots([rewardedSlot]);
            }
          });

        // No fill
        window.googletag
          .pubads()
          .addEventListener("slotRenderEnded", (event) => {
            if (event.slot === rewardedSlot && event.isEmpty) {
              setStatus("No ad available currently.");
            }
          });

        window.googletag.enableServices();
        window.googletag.display(rewardedSlot);
      } else {
        setStatus("Rewarded ads not supported on this device.");
      }
    });

    return () => {
      if (rewardedSlot) {
        window.googletag.cmd.push(() => {
          window.googletag.destroySlots([rewardedSlot]);
        });
      }
    };
  }, []);

  if (!modalType) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#2d2747]/80 backdrop-blur-sm animate-fade-in"
        onClick={() => setModalType("")}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-[340px] bg-white rounded-[32px] overflow-hidden shadow-2xl animate-scale-in">
        <button 
          onClick={() => setModalType("")}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 pb-6 text-center space-y-6">
          <div className="w-16 h-16 bg-[#6a5ae0]/10 rounded-2xl flex items-center justify-center mx-auto text-[#6a5ae0]">
            {modalType === "reward" ? (
              <PlayCircle className="w-10 h-10" />
            ) : (
              <Gift className="w-10 h-10" />
            )}
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black text-[#2d2747] leading-tight px-4">
              {modalType === "reward" ? "Bonus Reward Available!" : "Reward Unlocked!"}
            </h2>
            <p className="text-[13px] font-medium text-gray-500 leading-relaxed px-2">
              {modalMessage}
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {modalType === "reward" ? (
              <>
                <button 
                  onClick={() => window.showAd()}
                  className="w-full bg-[#6a5ae0] hover:bg-[#5143cc] text-white py-4 rounded-[18px] text-[15px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100/50 transition-all active:scale-95"
                >
                  Watch Now
                </button>
                <button 
                  onClick={() => setModalType("")}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-500 py-3 rounded-[18px] text-[13px] font-bold uppercase tracking-widest transition-all"
                >
                  Maybe Later
                </button>
              </>
            ) : (
              <button 
                onClick={() => setModalType("")}
                className="w-full bg-[#2BD17E] hover:bg-[#25ba71] text-white py-4 rounded-[18px] text-[15px] font-black uppercase tracking-widest shadow-lg shadow-green-100/50 transition-all active:scale-95"
              >
                Claim Reward
              </button>
            )}
          </div>
        </div>

        {/* Status indicator footer */}
        <div className="bg-gray-50 py-2 border-t border-gray-100">
           <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest text-center">
             {status}
           </p>
        </div>
      </div>
    </div>
  );
}
