import { useState, useEffect } from "react";

export default function useWindowSize() {
  const [isMobile, setIsMobile] = useState(false);

  function detectWindowSize() {
    if (typeof window !== "undefined") {
      window.screen.width <= 760 ? setIsMobile(true) : setIsMobile(false);
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("resize", detectWindowSize);
    }
    detectWindowSize();
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", detectWindowSize);
      }
    };
  });

  return { isMobile };
}
