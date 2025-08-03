"use client"

import { motion } from "framer-motion"

export default function BackgroundEffects() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Enhanced abstract geometric background pattern */}
      <div className="absolute inset-0 opacity-40">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="abstract-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              {/* Circles */}
              <circle cx="30" cy="30" r="3" fill="#64748b" opacity="0.4"/>
              <circle cx="120" cy="60" r="2" fill="#94a3b8" opacity="0.5"/>
              <circle cx="60" cy="120" r="1.5" fill="#cbd5e1" opacity="0.3"/>
              <circle cx="150" cy="150" r="4" fill="#64748b" opacity="0.4"/>
              
              {/* Abstract shapes */}
              <polygon points="80,20 100,50 60,50" fill="#e2e8f0" opacity="0.3"/>
              <polygon points="160,80 180,110 140,110" fill="#cbd5e1" opacity="0.4"/>
              
              {/* Curved lines */}
              <path d="M20,20 Q60,15 100,30 T180,40" stroke="#94a3b8" strokeWidth="1" fill="none" opacity="0.3"/>
              <path d="M15,100 Q50,85 85,100 T155,110" stroke="#64748b" strokeWidth="0.8" fill="none" opacity="0.25"/>
              
              {/* Diamond shapes */}
              <polygon points="40,80 50,70 60,80 50,90" fill="#cbd5e1" opacity="0.3"/>
              <polygon points="140,40 155,25 170,40 155,55" fill="#94a3b8" opacity="0.4"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#abstract-pattern)"/>
        </svg>
      </div>

      {/* Space nebula effects - darker and more visible */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-400/30 to-blue-400/25 rounded-full blur-3xl"
        animate={{
          x: [-100, 100, -100],
          y: [-100, 50, -100],
        }}
        transition={{
          duration: 40,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />

      <motion.div
        className="absolute top-1/2 right-0 w-96 h-96 bg-gradient-to-br from-indigo-400/25 to-purple-400/20 rounded-full blur-3xl"
        animate={{
          x: [100, -100, 100],
          y: [0, -100, 0],
        }}
        transition={{
          duration: 50,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />

      <motion.div
        className="absolute bottom-0 left-1/2 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/25 rounded-full blur-3xl"
        animate={{
          x: [-50, 50, -50],
          y: [50, -50, 50],
        }}
        transition={{
          duration: 60,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />

      {/* Enhanced Space elements - rockets, planets, asteroids */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-10 h-15 opacity-30"
        animate={{
          x: [-50, 400, 850],
          y: [0, -100, 0],
          rotate: [0, 45, 90],
        }}
        transition={{
          duration: 25,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <svg viewBox="0 0 40 60" className="w-full h-full fill-blue-300">
          <path d="M20 3 L25 15 L20 22 L15 15 Z" fill="#60A5FA"/>
          <rect x="17" y="22" width="6" height="25" fill="#3B82F6"/>
          <circle cx="20" cy="52" r="5" fill="#1E40AF"/>
          <path d="M15 47 L10 55 L15 52 Z" fill="#EF4444"/>
          <path d="M25 47 L30 55 L25 52 Z" fill="#EF4444"/>
        </svg>
      </motion.div>

      {/* Enhanced planets with rings */}
      <motion.div
        className="absolute top-1/6 right-1/3 w-8 h-8 opacity-35"
        animate={{
          rotate: [0, 360],
          x: [-15, 15, -15],
          y: [-8, 8, -8],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        <svg viewBox="0 0 32 32" className="w-full h-full">
          <circle cx="16" cy="16" r="12" fill="#4F46E5" opacity="0.8"/>
          <ellipse cx="16" cy="16" rx="15" ry="3" fill="none" stroke="#8B5CF6" strokeWidth="1" opacity="0.6"/>
          <circle cx="11" cy="11" r="2" fill="#6366F1" opacity="0.9"/>
          <circle cx="21" cy="18" r="1.5" fill="#8B5CF6" opacity="0.8"/>
        </svg>
      </motion.div>

      <motion.div
        className="absolute bottom-1/3 left-1/5 w-6 h-6 opacity-40"
        animate={{
          rotate: [360, 0],
          x: [-20, 20, -20],
          y: [-10, 10, -10],
        }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <circle cx="12" cy="12" r="9" fill="#7C3AED" opacity="0.7"/>
          <circle cx="9" cy="9" r="1.5" fill="#A855F7" opacity="0.9"/>
          <circle cx="15" cy="15" r="1" fill="#C084FC" opacity="0.8"/>
        </svg>
      </motion.div>

      {/* Moving asteroids */}
      <motion.div
        className="absolute top-1/2 left-1/6 w-4 h-4 opacity-25"
        animate={{
          x: [-30, 500, 1030],
          y: [0, -80, 0],
          rotate: [0, 720, 1440],
        }}
        transition={{
          duration: 30,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        <svg viewBox="0 0 16 16" className="w-full h-full fill-gray-400">
          <polygon points="8,1 12,5 11,11 5,12 3,8 4,4" fill="#6B7280"/>
          <polygon points="6,3 9,4 8,7 5,6" fill="#9CA3AF"/>
        </svg>
      </motion.div>

      <motion.div
        className="absolute bottom-1/4 right-1/6 w-3 h-3 opacity-30"
        animate={{
          x: [150, -250, 150],
          y: [0, -50, 0],
          rotate: [0, -720, -1440],
        }}
        transition={{
          duration: 22,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        <svg viewBox="0 0 12 12" className="w-full h-full fill-slate-300">
          <polygon points="6,0.5 9,3 8.5,7 3.5,8 1.5,5 2.5,1.5" fill="#94A3B8"/>
        </svg>
      </motion.div>

      {/* Space station */}
      <motion.div
        className="absolute top-1/3 left-1/2 w-12 h-8 opacity-20"
        animate={{
          x: [-60, 60, -60],
          y: [-30, 30, -30],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 50,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        <svg viewBox="0 0 48 32" className="w-full h-full fill-cyan-400">
          <rect x="16" y="12" width="16" height="8" fill="#22D3EE"/>
          <rect x="8" y="14" width="8" height="4" fill="#0891B2"/>
          <rect x="32" y="14" width="8" height="4" fill="#0891B2"/>
          <circle cx="24" cy="16" r="3" fill="#67E8F9"/>
          <rect x="12" y="10" width="24" height="2" fill="#164E63"/>
          <rect x="12" y="20" width="24" height="2" fill="#164E63"/>
        </svg>
      </motion.div>

      {/* Space stations and satellites */}
      <motion.div
        className="absolute top-1/5 right-1/4 w-6 h-4 opacity-12"
        animate={{
          x: [-20, 20, -20],
          y: [-10, 10, -10],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 45,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        <svg viewBox="0 0 24 16" className="w-full h-full fill-blue-400">
          <rect x="8" y="6" width="8" height="4"/>
          <rect x="4" y="7" width="4" height="2"/>
          <rect x="16" y="7" width="4" height="2"/>
          <circle cx="12" cy="8" r="1.5" fill="#60A5FA"/>
        </svg>
      </motion.div>

      {/* Enhanced twinkling stars */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute w-1 h-1 opacity-60"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 2 + Math.random() * 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: Math.random() * 3,
          }}
        >
          <div className="w-full h-full bg-white rounded-full shadow-white shadow-sm"></div>
        </motion.div>
      ))}

      {/* Shooting stars */}
      <motion.div
        className="absolute top-1/4 left-0 w-20 h-0.5 opacity-0"
        animate={{
          x: [0, 400],
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: 8,
          ease: "easeOut",
        }}
      >
        <div className="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent"></div>
      </motion.div>

      <motion.div
        className="absolute top-2/3 right-0 w-16 h-0.5 opacity-0"
        animate={{
          x: [0, -350],
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration: 2.5,
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: 12,
          ease: "easeOut",
          delay: 5,
        }}
      >
        <div className="w-full h-full bg-gradient-to-l from-transparent via-blue-200 to-transparent"></div>
      </motion.div>

      {/* Abstract floating shapes */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className={`absolute ${
            i % 3 === 0 
              ? 'w-3 h-3 bg-slate-500/20 rounded-full' 
              : i % 3 === 1 
                ? 'w-2 h-4 bg-slate-400/25 rounded-sm rotate-45' 
                : 'w-4 h-2 bg-slate-600/20 rounded-full'
          }`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            rotate: [0, 180, 360],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 6 + Math.random() * 8,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 4,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Enhanced mesh gradient overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-slate-200/15" />
      
      {/* Enhanced texture overlay with darker tones */}
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-100/15 via-slate-50/15 to-slate-100/15" />
      
      {/* Additional ambient lighting effect with more intensity */}
      <div className="absolute inset-0 bg-gradient-to-tl from-orange-200/20 via-transparent to-purple-200/20" />
      
      {/* Subtle noise texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-300/10 via-transparent to-slate-400/10" />
    </div>
  )
}
