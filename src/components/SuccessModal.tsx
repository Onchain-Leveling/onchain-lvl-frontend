'use client'

import { useEffect, useState } from 'react'
import { X, ExternalLink } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  exp: number
}

export default function SuccessModal({ isOpen, onClose, exp }: SuccessModalProps) {
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShowModal(true)
    }
  }, [isOpen])

  if (!showModal) return null

  const handleClose = () => {
    setShowModal(false)
    onClose()
  }

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          
          <motion.div 
            className="relative bg-white rounded-2xl p-6 mx-4 max-w-xs w-full text-center shadow-xl"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              duration: 0.4
            }}
          >
        <button 
          onClick={handleClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
        
        <div className="space-y-4">
          <motion.div 
            className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              delay: 0.2,
              type: "spring", 
              stiffness: 400, 
              damping: 25 
            }}
          >
            <motion.div 
              className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                delay: 0.4,
                type: "spring", 
                stiffness: 500, 
                damping: 30 
              }}
            >
              <motion.svg 
                className="w-5 h-5 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.6, duration: 0.6, ease: "easeInOut" }}
              >
                <motion.path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={3} 
                  d="M5 13l4 4L19 7"
                />
              </motion.svg>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="space-y-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          >
            <h2 className="text-lg font-bold text-gray-900">Success!</h2>
            <div className="inline-flex items-center px-2 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium">
              Onchain Progress Confirmed
            </div>
          </motion.div>
          
          <motion.p 
            className="text-sm text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.4 }}
          >
            Reward claimed successfully
          </motion.p>
          
          <div className="space-y-2 flex flex-col items-center">
            <motion.div 
              className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-xl font-bold text-lg"
              initial={{ scale: 0, rotateZ: -45 }}
              animate={{ scale: 1, rotateZ: 0 }}
              transition={{ 
                delay: 1.2,
                type: "spring", 
                stiffness: 300, 
                damping: 20 
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              +{exp} EXP
            </motion.div>
            
            <motion.button 
              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 transition-colors mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ExternalLink className="w-3 h-3" />
              View transaction hash
            </motion.button>
          </div>
          
          <motion.button 
            onClick={handleClose}
            className="w-full py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 via-red-600 to-pink-600 hover:from-red-600 hover:via-red-700 hover:to-pink-700 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.4 }}
            whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(239, 68, 68, 0.3)" }}
            whileTap={{ scale: 0.98 }}
          >
            Close
          </motion.button>
        </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}