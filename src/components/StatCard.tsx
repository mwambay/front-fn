import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

function StatCard({ title, value, icon, trend, className = '' }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className={`bg-white rounded-xl shadow-soft p-6 hover:shadow-lg transition-shadow duration-300 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm font-medium text-secondary-500"
          >
            {title}
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-semibold text-secondary-900 mt-1"
          >
            {value}
          </motion.p>
          
          {trend && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center mt-2"
            >
              <span 
                className={`text-sm font-medium ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-xs text-secondary-500 ml-1">vs last year</span>
            </motion.div>
          )}
        </div>
        
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="p-3 rounded-full bg-primary-50 text-primary-500"
        >
          {icon}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default StatCard;