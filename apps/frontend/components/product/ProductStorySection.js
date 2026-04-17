import { motion } from "framer-motion";

export default function ProductStorySection({ product }) {

  return (
    <section className="py-24 bg-black text-white">

      <div className="max-w-6xl mx-auto px-6">

        <motion.h2
          initial={{ opacity:0, y:40 }}
          whileInView={{ opacity:1, y:0 }}
          transition={{ duration:0.6 }}
          className="text-4xl font-bold mb-10"
        >
          Experience {product.name}
        </motion.h2>

        <motion.p
          initial={{ opacity:0 }}
          whileInView={{ opacity:1 }}
          transition={{ delay:0.2 }}
          className="text-gray-400 text-lg max-w-3xl"
        >
          Designed with precision and engineered for everyday performance.
          Explore the product in immersive 3D and discover every detail
          before you buy.
        </motion.p>

      </div>

    </section>
  );

}