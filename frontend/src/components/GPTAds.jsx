import { useEffect, useId, useRef } from "react";

/**
 * GPTAds Component - Refined for Smart Sizing and Multi-instance Support
 * 
 * Props:
 * - type: 'banner' | 'square' | 'fluid' | 'responsive' (default: 'responsive')
 * - adUnitPath: string (optional) - e.g. "/6355419/Travel"
 */
export default function GPTAds({ type = 'responsive', adUnitPath }) {
  const containerId = useId().replace(/[^a-zA-Z0-9]/g, ""); // Unique sanitized ID
  const adId = `gpt-ad-${type}-${containerId}`;
  const isInitialized = useRef(false);

  useEffect(() => {
    // 1. Ensure GPT script is loaded in the head
    if (!document.getElementById("gpt-script-loader")) {
      const script = document.createElement("script");
      script.id = "gpt-script-loader";
      script.src = "https://securepubads.g.doubleclick.net/tag/js/gpt.js";
      script.async = true;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    }

    // Initialize/Display logic
    window.googletag = window.googletag || { cmd: [] };
    
    window.googletag.cmd.push(() => {
      const gpt = window.googletag;
      
      // Cleanup existing slot for this ID to prevent collisions during HMR or re-renders
      const existingSlot = gpt.pubads().getSlots().find(s => s.getSlotElementId() === adId);
      if (existingSlot) {
        gpt.destroySlots([existingSlot]);
      }

      // Default network path if none provided
      const path = adUnitPath || (type === 'responsive' ? "/6355419/Travel/Europe" : "/6355419/Travel");

      let slot;
      if (type === 'banner') {
        slot = gpt.defineSlot(path, [[728, 90], [320, 50], [300, 50]], adId);
      } else if (type === 'square') {
        slot = gpt.defineSlot(path, [300, 250], adId);
      } else if (type === 'fluid') {
        slot = gpt.defineSlot(path, ["fluid"], adId);
      } else {
        // SMART RESPONSIVE (Matches website max widths)
        slot = gpt.defineSlot(path, [[300, 250], [728, 90], [750, 200]], adId);
        
        const mapping = gpt.sizeMapping()
          .addSize([1024, 768], [[750, 200], [728, 90]]) // Large Desktop
          .addSize([768, 500], [[336, 280], [300, 250]]) // Tablet / Small Dashboard
          .addSize([0, 0], [[300, 250], [320, 50], "fluid"]) // Mobile
          .build();
        slot.defineSizeMapping(mapping);
      }

      if (slot) {
        slot.addService(gpt.pubads());
        gpt.pubads().enableSingleRequest();
        gpt.enableServices();
        gpt.display(adId);
      }
    });

    return () => {
       // Cleanup on unmount
       window.googletag.cmd.push(() => {
         const gpt = window.googletag;
         const slotToDestroy = gpt.pubads().getSlots().find(s => s.getSlotElementId() === adId);
         if (slotToDestroy) gpt.destroySlots([slotToDestroy]);
       });
    };
  }, [adId, type, adUnitPath]);

  return (
    <div className="w-full flex flex-col items-center justify-center my-6 group">
      {/* Premium Admin Label */}
      <div className="flex items-center gap-2 mb-2 opacity-30 group-hover:opacity-60 transition-opacity">
        <div className="h-[1px] w-4 bg-white/40"></div>
        <span className="text-[9px] font-black text-white/50 uppercase tracking-[0.2em] whitespace-nowrap">
          Sponsored Ad
        </span>
        <div className="h-[1px] w-4 bg-white/40"></div>
      </div>

      {/* Ad Container */}
      <div className="w-full max-w-full bg-white/5 backdrop-blur-sm rounded-[24px] border border-white/10 p-2 sm:p-4 flex items-center justify-center min-h-[50px] shadow-sm relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />
        
        {/* The Ad Slot */}
        <div 
          id={adId} 
          className="mx-auto overflow-hidden transition-all duration-500 flex justify-center items-center"
          style={{ minWidth: "120px" }}
        />
      </div>
    </div>
  );
}
