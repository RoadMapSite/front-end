"use client";

import { useFadeIn } from "@/hooks/useFadeIn";

export default function FadeInSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const fade = useFadeIn(0.1);
  return (
    <section
      ref={fade.ref}
      className={`transition-all duration-700 ease-out ${className}`}
      style={{
        opacity: fade.isVisible ? 1 : 0,
        transform: fade.isVisible ? "translateY(0)" : "translateY(24px)",
      }}
    >
      {children}
    </section>
  );
}
