import { motion } from "framer-motion";

export default function ProductFeatures({ product }) {

  const features = [
    {
      title: "Premium Build",
      text: "Crafted with high quality materials designed for durability and comfort."
    },
    {
      title: "Immersive 3D Experience",
      text: "Inspect the product in 360° with interactive 3D visualization."
    },
    {
      title: "Augmented Reality",
      text: "Place the product in your real environment using AR."
    }
  ];

  return (

    <section className="max-w-6xl mx-auto px-6 py-20">

      <h2 className="text-3xl font-bold text-cyan-300 mb-12">
        Why You'll Love It
      </h2>

      <div className="grid md:grid-cols-3 gap-10">

        {features.map((f, i) => (

          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            className="bg-zinc-900 border border-white/10 rounded-xl p-6"
          >

            <h3 className="text-xl font-semibold mb-3 text-white">
              {f.title}
            </h3>

            <p className="text-gray-400">
              {f.text}
            </p>

          </motion.div>

        ))}

      </div>

    </section>

  );

}