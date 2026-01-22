import { useEffect, useState } from "react";

export default function useScrollVisibility() {
  const [scrollPosition, setScrollPosition] = useState(window.pageYOffset);
  const [scrollVisible, setScrollVisible] = useState(true);
  useEffect(() => {
    const handleScroll = () => {
      let currentScrollY = window.pageYOffset;
      setScrollVisible(scrollPosition > currentScrollY);
      setScrollPosition(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });
  return scrollVisible;
}
