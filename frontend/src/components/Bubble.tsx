import { motion } from "framer-motion";
import { emotionConfig } from "@/constants/emotionConfig";

type Props = {
  emotion: string;
  x: number;
  y: number;
  onClick: () => void;
};

const getRandomPosition = () => ({
  x: `${Math.random() * 90}%`,
  y: `${Math.random() * 90}%`,
});

const Bubble = ({ emotion, x, y, onClick }: Props) => {
  return (
    <motion.div
      onClick={onClick}
      className="absolute rounded-full cursor-pointer"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: 60,
        height: 60,
        backgroundColor: emotionConfig[emotion].color,
      }}
      animate={{
        // Animate to random positions continuously
        x: [0, 100, -100, 50, -50, 0], // relative movement
        y: [0, -80, 80, -40, 40, 0],   // relative movement
      }}
      transition={{
        duration: 8,      // total duration of one loop
        repeat: Infinity, // infinite loop
        ease: "easeInOut",
      }}
      whileHover={{ scale: 1.15 }}
    />
  );
};

export default Bubble;
