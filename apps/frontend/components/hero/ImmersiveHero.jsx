import { motion } from "framer-motion";
import Link from "next/link";

export default function ImmersiveHero() {
  return (
    <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-black to-black"></div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 2 }}
        className="absolute w-[500px] h-[500px] bg-cyan-400 blur-[120px] rounded-full"
      />

      <div className="relative text-center max-w-3xl px-6">

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-bold text-white mb-6"
        >
          Discover the Future of Shopping
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-400 mb-8"
        >
          AI-powered product discovery and immersive shopping experiences.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center gap-4"
        >
          <Link
            href="/products"
            className="px-6 py-3 rounded-xl bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition"
          >
            Explore Products
          </Link>

          <Link
            href="/trending"
            className="px-6 py-3 rounded-xl border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 transition"
          >
            View Trends
          </Link>
        </motion.div>

      </div>
    </section>
  );
}