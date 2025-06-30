import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  onClick?: () => void;
  hover?: boolean;
  scale?: boolean;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className = "",
  delay = 0,
  onClick,
  hover = true,
  scale = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.3,
        delay: delay * 0.1,
        ease: "easeOut",
      }}
      whileHover={
        hover
          ? {
              scale: scale ? 1.02 : 1,
              y: -2,
              transition: { duration: 0.2 },
            }
          : undefined
      }
      whileTap={
        onClick
          ? {
              scale: 0.98,
              transition: { duration: 0.1 },
            }
          : undefined
      }
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      className={`${className} ${onClick ? "cursor-pointer" : ""}`}
    >
      <AnimatePresence>
        {isHovered && hover && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-cyber-blue/10 rounded-lg pointer-events-none"
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>
      {children}
    </motion.div>
  );
};

// Componente para listas animadas
export const AnimatedList: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Component for page transitions
export const PageTransition: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Componente para loading skeleton animado
export const AnimatedSkeleton: React.FC<{
  className?: string;
  lines?: number;
}> = ({ className = "", lines = 3 }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className="bg-cyber-blue/20 rounded h-4 mb-2"
          style={{ width: `${100 - i * 10}%` }}
        />
      ))}
    </div>
  );
};
