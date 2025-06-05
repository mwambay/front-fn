import { motion } from 'framer-motion';
import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

function Card({ title, children, className = '' }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`bg-white rounded-xl shadow-soft hover:shadow-lg transition-shadow duration-300 ${className}`}
    >
      <div className="p-6">
        {title && (
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg font-semibold text-secondary-800 mb-4"
          >
            {title}
          </motion.h2>
        )}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {children}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Card;