"use client"

import { motion } from "framer-motion"

export default function LoadingSpinner() {

  return (
    <div className="min-h-screen bg-white flex items-center justify-center relative">

      {/* Main Content */}
      <div className="text-center space-y-12 z-10 relative">
        {/* Enhanced Logo Section */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, type: "spring", bounce: 0.3 }}
          className="relative"
        >
          <div className="w-32 h-32 mx-auto relative">
            {/* Outer Geometric Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-4 border-orange-500/40 rounded-full"
              style={{
                borderImage: 'conic-gradient(from 0deg, #fb7c47, #87ceeb, #fbbf24, #10b981, #8b5cf6, #fb7c47) 1',
              }}
            />
            
            {/* Middle Spinning Elements */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              className="absolute inset-3"
            >
              {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                  style={{
                    top: '50%',
                    left: '50%',
                    transformOrigin: '0 0',
                    transform: `rotate(${angle}deg) translate(35px, -6px)`,
                  }}
                  animate={{
                    scale: [0.8, 1.2, 0.8],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </motion.div>

            {/* Inner Pulsing Ring */}
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-6 border-2 border-cyan-400 rounded-full"
            />
            
            {/* Center Logo with Glow */}
            <motion.div 
              className="absolute inset-8 rounded-full flex items-center justify-center bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(251, 124, 71, 0.5)',
                  '0 0 40px rgba(135, 206, 235, 0.5)',
                  '0 0 20px rgba(251, 124, 71, 0.5)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <img
                src="/culture-guides-logo.png"
                alt="Culture Guides Logo"
                className="w-12 h-12 object-contain filter drop-shadow-lg"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Loading Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="space-y-6"
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Culture Guides
          </motion.h2>
          
          {/* Advanced Loading Dots */}
          <div className="flex items-center justify-center space-x-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-500 to-pink-500"
                animate={{
                  y: [-5, 5, -5],
                  opacity: [0.4, 1, 0.4],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>
          
          <motion.p 
            className="text-lg text-gray-600 max-w-md mx-auto"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Preparing your amazing experience...
          </motion.p>
          
          {/* Progress Bar */}
          <motion.div className="w-64 h-1 bg-gray-200 rounded-full mx-auto overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-500 to-pink-500"
              animate={{
                x: [-260, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}