import { useRef, useEffect, ReactNode } from "react";

interface HorizontalPageProps {
  children: ReactNode;
  className?: string;
}

/**
 * Layout wrapper that turns vertical content into a horizontally
 * scrolling sequence of panels on desktop. On mobile it falls back
 * to the natural vertical flow.
 */
const HorizontalPage = ({ children, className = "" }: HorizontalPageProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (window.matchMedia("(max-width: 767px)").matches) return;
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <div
      ref={scrollRef}
      className={`md:h-screen md:overflow-x-auto md:overflow-y-hidden flex flex-col md:flex-row md:items-stretch md:flex-nowrap gap-[60px] md:gap-0 px-[40px] md:px-0 py-[80px] md:py-0 scrollbar-hide ${className}`}
    >
      {children}
    </div>
  );
};

interface PanelProps {
  children: ReactNode;
  width?: string;
  className?: string;
}

export const Panel = ({
  children,
  width = "md:w-[520px]",
  className = "",
}: PanelProps) => (
  <section
    className={`flex-shrink-0 ${width} md:h-screen md:overflow-y-auto md:px-[40px] md:pt-[100px] md:pb-[60px] ${className}`}
  >
    {children}
  </section>
);

export default HorizontalPage;
