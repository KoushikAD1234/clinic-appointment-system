import { motion } from "framer-motion";

export default function BackgroundBlobs() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        className="w-[400px] h-[400px] bg-purple-400 rounded-full blur-3xl opacity-30 absolute top-[-100px] left-[-100px]"
        animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
        transition={{ repeat: Infinity, duration: 12 }}
      />

      <motion.div
        className="w-[300px] h-[300px] bg-blue-400 rounded-full blur-3xl opacity-30 absolute bottom-[-100px] right-[-100px]"
        animate={{ x: [0, -80, 0], y: [0, -40, 0] }}
        transition={{ repeat: Infinity, duration: 10 }}
      />
    </div>
  );
}
