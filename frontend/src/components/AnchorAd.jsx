import { useEffect } from "react";

export default function AnchorAd({ position = "bottom" }) {
  useEffect(() => {
    // ❌ Prevent duplicate execution (STRICT MODE + multiple mounts)
    if (window.__anchorAdInitialized) return;
    window.__anchorAdInitialized = true;

    // ✅ Load GPT script once
    if (!document.getElementById("gpt-script-loader")) {
      const script = document.createElement("script");
      script.id = "gpt-script-loader";
      script.src = "https://securepubads.g.doubleclick.net/tag/js/gpt.js";
      script.async = true;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    }

    window.googletag = window.googletag || { cmd: [] };

    window.googletag.cmd.push(() => {
      const gpt = window.googletag;

      // ❌ ONLY ONE ANCHOR ALLOWED → force bottom
      const format = gpt.enums.OutOfPageFormat.BOTTOM_ANCHOR;

      const slot = gpt.defineOutOfPageSlot("/6355419/Travel", format);

      if (slot) {
        slot.addService(gpt.pubads());

        gpt.pubads().addEventListener("slotRenderEnded", (event) => {
          console.log("Ad status:", event.isEmpty ? "NO FILL ❌" : "FILLED ✅");
        });

        // ✅ Enable services ONLY ONCE
        if (!window.__gptInitialized) {
          gpt.pubads().enableSingleRequest();
          gpt.enableServices();
          window.__gptInitialized = true;
        }

        gpt.display(slot);
      }
    });

    // ❌ REMOVE top animation logic (not needed now)
  }, []);

  return null;
}
