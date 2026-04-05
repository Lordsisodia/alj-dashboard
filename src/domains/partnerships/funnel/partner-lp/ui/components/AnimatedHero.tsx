import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MoveRight, TrendingUp, Handshake, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LandingCountdown from "./LandingCountdown";
import { useIsMobile } from "@/hooks/use-mobile";
import { LandingStats } from "./LandingStats";

const FOUNDED_AT = new Date("2025-10-11T00:00:00Z");

function AnimatedHero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState<Date>(new Date());
  const isMobile = useIsMobile();

  // Inject keyframes for animated text gradient (shifts position & hue subtly)
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById("hero-title-gradient-anim")) return;
    const style = document.createElement("style");
    style.id = "hero-title-gradient-anim";
    style.innerHTML = `
      @keyframes heroTitleGradientShift {
        0% { background-position: 0% 50%; filter: hue-rotate(0deg); }
        45% { background-position: 80% 50%; filter: hue-rotate(10deg); }
        100% { background-position: 20% 50%; filter: hue-rotate(-8deg); }
      }
    `;
    document.head.appendChild(style);
  }, []);
  
  const titles = useMemo(
    () => [
      "Scale Together",
      "Close Bigger, Faster",
      "Win With Us",
    ],
    []
  );

  const benefits = [
    { icon: TrendingUp, text: "Earn 20% recurring commissions" },
    { icon: Handshake, text: "No-risk kickoff: we build, you close" },
    { icon: Star, text: "Dedicated solution squad & full support" }
  ];

  useEffect(() => {
    setMounted(true);

    const timeoutId = setTimeout(() => {
      setTitleNumber((prev) => (prev + 1) % titles.length);
    }, 3400);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!mounted) return null;

  const handleGetStarted = () => {
    console.log('Become Partner clicked - navigating to /onboarding-chat');
    if (typeof window !== 'undefined') {
      window.location.href = '/onboarding-chat';
    }
  };

  const handleLearnMore = () => {
    const nextSection = document.querySelector('#why-choose-section') || 
                       document.querySelector('section:nth-of-type(2)') ||
                       document.querySelector('[data-section="next"]');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full">
      <div className="container mx-auto px-4 relative">
        <div className="flex flex-col items-center text-center w-full max-w-4xl mx-auto space-y-6 md:space-y-7">
          <div className="flex flex-col items-center gap-2 md:gap-3">
            <Badge
              variant="outline"
              className={`border-siso-orange/40 text-siso-orange bg-siso-orange/10 backdrop-blur-md ${isMobile ? 'mx-auto' : ''}`}
            >
              Founded on{" "}
              {FOUNDED_AT.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </Badge>

            <LandingCountdown
              startDate={FOUNDED_AT}
              endDate={now}
              gradientColors={["#ff8a3d", "#ff9f4d", "#ffc27d"]}
              gradientSpeedSec={6}
              labelClassName="text-sm text-white/70"
            />
          </div>

          <div className="space-y-3 sm:space-y-4">
            <h1
              className={`whitespace-nowrap text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-center font-regular leading-[1.02]`}
            >
              <span className="text-siso-text-bold block mb-0.5">Built for Partners to</span>
              <div className="relative h-16 sm:h-18 md:h-20 overflow-hidden flex items-center justify-center mb-1">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={titles[titleNumber]}
                    className="font-bold uppercase tracking-[0.01em] bg-gradient-to-r from-[#FF5722] via-[#FFA726] to-[#FF5722] bg-clip-text text-transparent block px-2 pb-1"
                    initial={false}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -18, opacity: 0 }}
                    transition={{ duration: 0.52, ease: "easeOut" }}
                    style={{
                      fontSize: isMobile ? 34 : 58,
                      lineHeight: isMobile ? '1.12' : '1.05',
                      whiteSpace: 'nowrap',
                      backgroundSize: '240% 240%',
                      animation: 'heroTitleGradientShift 11s ease-in-out infinite',
                      textShadow:
                        '0 0 12px rgba(255,170,110,0.28), 0 0 26px rgba(255,140,80,0.22), 0 0 46px rgba(255,120,60,0.18)',
                    }}
                  >
                    {titles[titleNumber]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </h1>

            <p className="text-base sm:text-xl md:text-xl leading-relaxed tracking-tight text-siso-text max-w-2xl mx-auto">
              Launch MVPs in days, not months.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center items-center w-full max-w-md mx-auto">
            <Button
              size={isMobile ? "lg" : "lg"}
              className="gap-2 sm:gap-3 bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90 min-w-[44%] sm:min-w-[180px] sm:py-5 text-base sm:text-lg flex-1"
              onClick={handleGetStarted}
            >
              Become Partner <MoveRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="w-full mt-8 sm:mt-10">
            <LandingStats />
          </div>
        </div>
      </div>
    </div>
  );
}

export { AnimatedHero as Hero };
