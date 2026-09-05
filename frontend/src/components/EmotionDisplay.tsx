import { motion } from "framer-motion";

interface EmotionDisplayProps {
  emotion: string;
  confidence: number;
}

const EmotionDisplay = ({ emotion, confidence }: EmotionDisplayProps) => {
  const emotionConfig: Record<string, { gradient: string; emoji: string; description: string }> = {
    happy: {
      gradient: "from-yellow-400 to-orange-500",
      emoji: "😊",
      description: "You're radiating positive energy!",
    },
    sad: {
      gradient: "from-blue-400 to-blue-700",
      emoji: "😢",
      description: "Let music lift your spirits",
    },
    angry: {
      gradient: "from-red-400 to-red-700",
      emoji: "😠",
      description: "Channel that energy into rhythm",
    },
    surprise: {
      gradient: "from-purple-400 to-pink-500",
      emoji: "😲",
      description: "Something unexpected caught your eye!",
    },
    fear: {
      gradient: "from-purple-600 to-purple-900",
      emoji: "😨",
      description: "Music can be soothing right now",
    },
    neutral: {
      gradient: "from-gray-400 to-gray-600",
      emoji: "😐",
      description: "A calm state of mind",
    },
    disgust: {
      gradient: "from-green-500 to-green-700",
      emoji: "🤢",
      description: "Let's find something uplifting",
    },
  };

  const config = emotionConfig[emotion.toLowerCase()] || emotionConfig.neutral;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      {/* Emotion Circle */}
      <div className="relative inline-block mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.8, delay: 0.2 }}
          className={`w-32 h-32 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-2xl`}
        >
          <span className="text-6xl">{config.emoji}</span>
        </motion.div>
        {/* Glow ring */}
        <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${config.gradient} blur-2xl opacity-40 -z-10`} />
      </div>

      {/* Emotion Label */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-3xl font-display font-bold mb-2 capitalize"
      >
        {emotion}
      </motion.h2>

      {/* Confidence */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border">
          <span className="text-sm text-muted-foreground">Confidence:</span>
          <span className="text-sm font-semibold text-primary">{Math.round(confidence * 100)}%</span>
        </div>
      </motion.div>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-muted-foreground"
      >
        {config.description}
      </motion.p>
    </motion.div>
  );
};

export default EmotionDisplay;
