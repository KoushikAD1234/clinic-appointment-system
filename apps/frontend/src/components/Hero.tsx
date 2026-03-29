import { motion } from "framer-motion";
import BackgroundBlobs from "./BackgroundBlobs";

export default function Hero() {
  return (
    <div className="h-screen flex items-center justify-center text-center px-6 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 opacity-70" />

      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* <BackgroundBlobs /> */}
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Modern Clinic <span className="text-blue-600">Management</span>
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto">
          Simplify appointments, manage patients, and grow your clinic
          effortlessly.
        </p>

        <div className="flex justify-center gap-4">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 shadow-lg">
            Get Started
          </button>

          <button className="border px-6 py-3 rounded-xl dark:border-gray-600">
            Learn More
          </button>
        </div>
      </motion.div>
    </div>
  );
}
