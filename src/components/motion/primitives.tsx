"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

/** Soft section entrance — rises + clears as it enters */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={
        reduce ? false : { opacity: 0, y: 36, filter: "blur(8px)" }
      }
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.95, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

/** Image reveals with clip wipe + slight scale settle */
export function ImageReveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={`overflow-hidden ${className ?? ""}`}
      initial={
        reduce
          ? false
          : {
              clipPath: "inset(14% 14% 14% 14%)",
              opacity: 0.45,
              scale: 1.06,
            }
      }
      whileInView={{
        clipPath: "inset(0% 0% 0% 0%)",
        opacity: 1,
        scale: 1,
      }}
      viewport={{ once: true, margin: "-6%" }}
      transition={{ duration: 1.25, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

/** Scroll-linked parallax on an image layer */
export function ParallaxFrame({
  children,
  className,
  strength = 56,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [0, 0] : [strength, -strength],
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    reduce ? [1, 1, 1] : [1.08, 1.02, 1.08],
  );

  return (
    <div ref={ref} className={`overflow-hidden ${className ?? ""}`}>
      <motion.div
        style={{ y, scale }}
        className="h-full w-full will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
}

/** Thin hairline that draws on scroll into view */
export function DrawLine({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={`hairline ${className ?? ""}`}
      initial={reduce ? false : { scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 1.15, ease }}
    />
  );
}

/** Top-of-page scroll progress — thin elegant bar */
export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 28,
    mass: 0.3,
  });

  if (reduce) return null;

  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-[60] h-px origin-left bg-ink/80"
      style={{ scaleX }}
    />
  );
}

/** Load-time kinetic words (hero) */
export function KineticWords({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  if (reduce) {
    return <h1 className={className}>{text}</h1>;
  }

  return (
    <h1 className={className}>
      <motion.span
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.06 } } }}
        className="inline"
      >
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="inline-flex overflow-hidden align-bottom"
          >
            <motion.span
              className="inline-block"
              variants={{
                hidden: { y: "110%", opacity: 0 },
                show: {
                  y: "0%",
                  opacity: 1,
                  transition: { duration: 0.9, ease },
                },
              }}
            >
              {word}
              {i < words.length - 1 ? "\u00A0" : ""}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </h1>
  );
}

/** Scroll-triggered word stagger for section titles */
export function ScrollWords({
  text,
  className,
  as: Tag = "h2",
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  if (reduce) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag className={className}>
      <motion.span
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-12%" }}
        variants={{ show: { transition: { staggerChildren: 0.05 } } }}
        className="inline"
      >
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="inline-flex overflow-hidden align-bottom"
          >
            <motion.span
              className="inline-block"
              variants={{
                hidden: { y: "115%", opacity: 0 },
                show: {
                  y: "0%",
                  opacity: 1,
                  transition: { duration: 0.85, ease },
                },
              }}
            >
              {word}
              {i < words.length - 1 ? "\u00A0" : ""}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}

/** Section that drifts / scales slightly while in view */
export function ScrollScene({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.12, 0.85, 1],
    reduce ? [1, 1, 1, 1] : [0.35, 1, 1, 0.55],
  );
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [0, 0] : [40, -40],
  );

  return (
    <motion.div ref={ref} style={{ opacity, y }} className={className}>
      {children}
    </motion.div>
  );
}

/** Horizontal drift for strips driven by vertical scroll */
export function useHorizontalDrift(strength = 180) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [0, 0] : [40, -strength],
  );
  return { ref, x };
}
