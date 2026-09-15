import React from 'react'
import { motion } from 'framer-motion'

export const pageVariants = {
  initial: { opacity: 0, y: 15, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -10, scale: 0.99, transition: { duration: 0.2 } },
}

export const staggerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.06,
    },
  },
}

export const itemVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

export const MotionPage = ({ children, className = '' }) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export const MotionGrid = ({ children, className = '' }) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerVariants}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export const MotionItem = ({ children, className = '' }) => {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  )
}
