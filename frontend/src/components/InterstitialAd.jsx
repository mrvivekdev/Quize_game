import { useEffect, useState } from "react";

/**
 * InterstitialAd Component
 * - Loads GPT web interstitials
 * - Triggers on navigation or window unhide
 */
export default function InterstitialAd() {
  const [status, setStatus] = useState("Web interstitial loading...");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Load GPT script once
    if (!document.getElementById("gpt-script-loader")) {
      const script = document.createElement("script");
      script.id = "gpt-script-loader";
      script.src = "https://securepubads.g.doubleclick.net/tag/js/gpt.js";
      script.async = true;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    }

    window.googletag = window.googletag || { cmd: [] };

    let interstitialSlot;

    window.googletag.cmd.push(() => {
      const gpt = window.googletag;

      // Define Interstitial Slot
      interstitialSlot = gpt.defineOutOfPageSlot(
        "/6355419/Travel/Europe/France/Paris",
        gpt.enums.OutOfPageFormat.INTERSTITIAL,
      );

      if (interstitialSlot) {
        interstitialSlot
          .addService(gpt.pubads())
          .setConfig({
            interstitial: {
              triggers: {
                navBar: true,
                unhideWindow: true,
              },
            },
          });

        // Listen when ad loads
        gpt.pubads().addEventListener("slotOnload", (event) => {
          if (event.slot === interstitialSlot) {
            setLoaded(true);
            setStatus("Interstitial Loaded");
          }
        });

        gpt.pubads().addEventListener("slotRenderEnded", (event) => {
          if (event.slot === interstitialSlot) {
             console.log("Interstitial status:", event.isEmpty ? "NO FILL" : "FILLED");
             setStatus(event.isEmpty ? "No Ad Fill" : "Ad Ready");
          }
        });

        // Display
        gpt.display(interstitialSlot);
        setStatus("Initialized...");
      }

      // Enable services ONLY ONCE
      if (!window.__gptInitialized) {
        gpt.pubads().enableSingleRequest();
        gpt.enableServices();
        window.__gptInitialized = true;
      }
    });

    return () => {
      // Clean up slot if necessary, but GPT usually manages interstitials
    };
  }, []);

  // Usually interstitials are invisible until triggered by GPT
  return (
    <div className="hidden">
      <span className="text-[10px] text-gray-400 opacity-20">{status} {loaded ? "✓" : ""}</span>
    </div>
  );
}
