import React from "react";
import clsx from "clsx";

interface AnimatedTitleProps {
  children: React.ReactNode;
  className?: string;
}

const AnimatedTitle: React.FC<AnimatedTitleProps> = ({
  children,
  className,
}) => {
  const titleClasses = clsx(
    "text-5xl",
    "font-medium",
    "animate-pulse-text",
    className
  );

  return <h1 className={titleClasses}>{children}</h1>;
};

export default AnimatedTitle;
