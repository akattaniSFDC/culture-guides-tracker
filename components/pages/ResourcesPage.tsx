"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Play, SkipBack, SkipForward, Loader2, Send, Pause, Volume2, Mic, Bot, User, Headphones, Radio } from "lucide-react"

export default function ResourcesPage() {
  const [chatMessages, setChatMessages] = useState([
    {
      type: "bot",
      message:
        "Hi! I'm your Culture Guides AI assistant powered by NotebookLM. I can help you with event planning, culture initiatives, and answer questions about the program. How can I assist you today?",
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [podcastData, setPodcastData] = useState<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState("0:00")
  const [duration, setDuration] = useState("0:00")
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    // Fetch podcast data
    fetch("/api/podcast")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPodcastData(data.data)
        }
      })
      .catch(console.error)

    // Setup audio element
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => {
      const current = audio.currentTime
      const total = audio.duration
      setCurrentTime(formatTime(current))
      setDuration(formatTime(total))
      setProgress((current / total) * 100)
    }

    const handleLoadedMetadata = () => {
      setDuration(formatTime(audio.duration))
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setProgress(0)
      audio.currentTime = 0
    }

    audio.volume = volume
    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [volume])

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const skipForward = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Math.min(audio.currentTime + 10, audio.duration)
  }

  const skipBackward = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Math.max(audio.currentTime - 10, 0)
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = x / rect.width
    audio.currentTime = percentage * audio.duration
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
    const audio = audioRef.current
    if (audio) {
      audio.volume = newVolume
    }
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isMuted) {
      audio.volume = volume
      setIsMuted(false)
    } else {
      audio.volume = 0
      setIsMuted(true)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    const userMessage = inputMessage
    setInputMessage("")
    setChatMessages((prev) => [...prev, { type: "user", message: userMessage }])
    setIsTyping(true)

    try {
      const response = await fetch("/api/notebooklm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      })

      const result = await response.json()

      if (result.success) {
        setChatMessages((prev) => [...prev, { type: "bot", message: result.response }])
      } else {
        throw new Error("Failed to get response")
      }
    } catch (error) {
      setChatMessages((prev) => [
        ...prev,
        {
          type: "bot",
          message: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }



  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        {/* Spotify-style Podcast Player */}
        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="overflow-hidden bg-gradient-to-br from-blue-100/80 via-purple-100/60 to-indigo-100/80 dark:from-blue-900/40 dark:via-purple-900/30 dark:to-indigo-900/40 border border-blue-500/20 shadow-xl h-[600px] backdrop-blur-md">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Album Art - Spinning Circular Culture Guides Logo */}
                <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg flex-shrink-0 bg-white p-1">
                  <motion.img
                    src="/culture-guides-logo.png"
                    alt="Culture Guides Logo"
                    className="w-full h-full object-contain rounded-full"
                    animate={isPlaying ? { rotate: 360 } : {}}
                    transition={isPlaying ? { duration: 3, repeat: Infinity, ease: "linear" } : {}}
                  />
                </div>
                
                {/* Track Info */}
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">Ohana Connect - The Culture Guides</h3>
                  <p className="text-green-600 dark:text-green-400 text-base font-medium mb-1">Culture Guides Team</p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Building connections that drive innovation at Salesforce</p>
                </div>
              </div>

              
              {/* Spotify-style Progress Bar */}
              <div className="space-y-3 mt-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-600 dark:text-slate-400 w-8">{currentTime}</span>
                  <div className="flex-1 group">
                    <div 
                      className="w-full bg-slate-400 dark:bg-slate-600 rounded-full h-1 hover:h-1.5 transition-all duration-200 cursor-pointer"
                      onClick={handleProgressClick}
                    >
                      <div
                        className="bg-green-600 dark:bg-green-500 h-full rounded-full relative transition-all duration-200"
                        style={{ width: `${progress}%` }}
                      >
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-slate-800 dark:bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"></div>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-slate-600 dark:text-slate-400 w-8">{duration}</span>
                </div>
              </div>

              {/* Spotify-style Player Controls */}
              <div className="flex items-center justify-center gap-4 mt-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={skipBackward}
                  className="hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white w-8 h-8"
                >
                  <SkipBack className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  onClick={togglePlayPause}
                  className="w-12 h-12 bg-green-600 hover:bg-green-500 dark:bg-green-500 dark:hover:bg-green-400 text-white rounded-full shadow-lg hover:scale-105 transition-all"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={skipForward}
                  className="hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white w-8 h-8"
                >
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>

              {/* Volume Control */}
              <div className="flex items-center justify-center gap-3 mt-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleMute}
                  className="hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white w-8 h-8"
                >
                  <Volume2 className={`w-4 h-4 ${isMuted ? 'opacity-50' : ''}`} />
                </Button>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 bg-slate-400 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #059669 0%, #059669 ${(isMuted ? 0 : volume) * 100}%, #94a3b8 ${(isMuted ? 0 : volume) * 100}%, #94a3b8 100%)`
                    }}
                  />
                  <span className="text-xs text-slate-500 dark:text-slate-400 w-8 text-center">
                    {Math.round((isMuted ? 0 : volume) * 100)}%
                  </span>
                </div>
              </div>

              {/* Hidden Audio Element */}
              <audio
                ref={audioRef}
                src="/audio/culture-intro.wav"
                preload="metadata"
              />

              {/* Podcast Details & Description */}
              <div className="space-y-4 mt-6 pt-6 border-t border-slate-400 dark:border-slate-600">
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                    <Headphones className="w-5 h-5 text-green-600 dark:text-green-400" />
                    About This Episode
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                    Join the Culture Guides team as they explore what it means to build meaningful connections that drive innovation at Salesforce. 
                    This episode dives deep into our Ohana culture and how every Trailblazer can contribute to making our workplace more inclusive, 
                    collaborative, and impactful.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-800 dark:text-white">{duration}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Duration</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{isPlaying ? "Playing" : "Ready"}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-4">
                  {["Culture", "Innovation", "Ohana", "Leadership"].map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Assistant - Modern Chatbot Feel */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="overflow-hidden bg-gradient-to-br from-blue-50/80 via-white/60 to-purple-50/80 dark:from-blue-900/40 dark:via-purple-900/30 dark:to-indigo-900/40 border border-blue-500/20 shadow-xl backdrop-blur-md h-[600px]">
            {/* AI Header */}
            <div className="relative bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 p-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Bot className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">AI Assistant</h2>
                  <p className="text-white/80 text-sm">Enhanced with Culture Guides Knowledge Base</p>
                </div>
              </div>
            </div>

            <CardContent className="p-6 space-y-6">


              {/* Chat Container */}
              <div className="h-64 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-600 overflow-hidden">
                <div className="h-full overflow-y-auto p-4 space-y-4">
                  {chatMessages.map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`flex items-start gap-3 max-w-[85%] ${msg.type === "user" ? "flex-row-reverse" : ""}`}>
                        {/* Avatar */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          msg.type === "user" 
                            ? "bg-gradient-to-br from-orange-400 to-pink-500" 
                            : "bg-gradient-to-br from-blue-400 to-cyan-500"
                        }`}>
                          {msg.type === "user" ? (
                            <User className="w-4 h-4 text-white" />
                          ) : (
                            <Bot className="w-4 h-4 text-white" />
                          )}
                        </div>
                        
                        {/* Message Bubble */}
                        <div className={`p-4 rounded-2xl shadow-sm ${
                          msg.type === "user"
                            ? "bg-gradient-to-br from-orange-500 to-pink-500 text-white"
                            : "bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 shadow-sm"
                        }`}>
                          <p className="text-sm leading-relaxed">{msg.message}</p>
                          <div className={`text-xs mt-2 ${msg.type === "user" ? "text-white/70" : "text-slate-400 dark:text-slate-400"}`}>
                            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 p-4 rounded-2xl shadow-md">
                          <div className="flex space-x-2">
                            {[0, 1, 2].map((i) => (
                              <motion.div
                                key={i}
                                className="w-2 h-2 bg-blue-400 dark:bg-blue-300 rounded-full"
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{
                                  duration: 1.5,
                                  repeat: Number.POSITIVE_INFINITY,
                                  delay: i * 0.2,
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Input Area */}
              <div className="space-y-4">
                <form onSubmit={handleSendMessage} className="flex gap-3">
                  <div className="flex-1 relative">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Ask me about Culture Guides events, best practices, or planning tips..."
                      className="h-12 pl-4 pr-12 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-400 rounded-xl shadow-sm"
                      disabled={isTyping}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={!inputMessage.trim() || isTyping}
                    className="h-12 px-6 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-xl shadow-lg"
                  >
                    {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </form>

                {/* Question Suggestions */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400">Quick questions to get started:</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "How do I plan a culture event?",
                      "What are the best engagement activities?", 
                      "How to increase participation?",
                      "What makes a successful culture initiative?"
                    ].map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => setInputMessage(suggestion)}
                        className="px-3 py-2 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors border border-slate-200 dark:border-slate-600"
                        disabled={isTyping}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
