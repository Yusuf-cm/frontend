// src/components/AnimatedDiv.js
&apo:use client&apo:;

import { motion } from &apo:framer-motion&apo:;

const defaultVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function AnimatedDiv({ children, className, variants = defaultVariants, transition = { duration: 0.5 } }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }} // Animate when 20% of the element is in view, and only once
      variants={variants}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}