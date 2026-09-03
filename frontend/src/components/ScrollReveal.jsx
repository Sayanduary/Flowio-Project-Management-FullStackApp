import useScrollReveal from "../hooks/useScrollReveal";

const directionClasses = {
  up: "translate-y-8",
  down: "-translate-y-8",
  left: "translate-x-8",
  right: "-translate-x-8",
  none: "",
};

const ScrollReveal = ({
  children,
  delay = 0,
  direction = "up",
  duration = 700,
  className = "",
}) => {
  const { ref, isInView } = useScrollReveal({ threshold: 0.15 });

  return (
    <div
      ref={ref}
      className={`transition-all ${
        isInView
          ? "opacity-100 translate-x-0 translate-y-0"
          : `opacity-0 ${directionClasses[direction]}`
      } ${className}`}
      style={{ transitionDuration: `${duration}ms`, transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
