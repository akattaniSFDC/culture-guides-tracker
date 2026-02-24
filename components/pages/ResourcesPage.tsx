"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Play, SkipBack, SkipForward, Loader2, Send, Pause, Volume2, Bot, User, Headphones } from "lucide-react"
import ReactMarkdown from "react-markdown"

function getMessageText(message: { parts?: Array<{ type: string; text?: string }>; content?: string }): string {
  if (message.parts?.length) {
    return message.parts
      .filter((p): p is { type: 'text'; text: string } => p.type === 'text' && p.text != null)
      .map(p => p.text)
      .join('')
  }
  return typeof message.content === 'string' ? message.content : ''
}

export default function ResourcesPage() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
    messages: [
      {
        id: 'welcome',
        role: 'assistant',
        parts: [{ type: 'text', text: "Hello! I'm the Culture Guide Assistant. I'm ready to answer your questions about event planning, rewards points, sustainability, and hub leads." }],
      },
    ],
  })
  const [inputMessage, setInputMessage] = useState("")
  const [suggestions, setSuggestions] = useState([
    "What is the Culture Guides Program?",
    "How do I earn points?",
    "What events do Culture Guides plan?",
  ])
  const usedQuestionsRef = useRef<Set<string>>(new Set())
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [podcastData, setPodcastData] = useState<unknown>(null)
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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || status !== 'ready') return
    sendMessage({ text: inputMessage })
    setInputMessage("")
  }

  const isTyping = status === 'submitted' || status === 'streaming'

  // Auto-scroll to bottom whenever messages change or typing starts
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Topic question pools — keyed by topic name
  const questionPools: Record<string, string[]> = {
    signup: [
      'How do I sign up for Culture Guides?',
      'What happens after I sign up?',
      'When does the FY27 sign-up close?',
      'Is manager approval required to join?',
      'How long is the Culture Guide term?',
    ],
    leads: [
      'Who is the regional lead for India?',
      'Who is the regional lead for APAC?',
      'Who is the regional lead for AMER?',
      'How do I become a Hub Lead?',
      'What does a Hub Lead do?',
      'Who is the program owner?',
      'Who is my hub lead?',
    ],
    points: [
      'How do I log my points?',
      'What can I redeem points for?',
      'How many points for project managing an event?',
      'How many points for on-site help?',
      'When can I redeem points?',
    ],
    events: [
      'What is the budget per person for events?',
      'What is Meetingforce and when do I need it?',
      'What are the marquee events?',
      'What local events can Culture Guides run?',
      'How do I plan a post-event recap?',
      'What tools help with event communications?',
    ],
    sustainability: [
      'What are the sustainability rules for events?',
      'Can I give away swag at events?',
      'What food restrictions apply to catering?',
    ],
    slack: [
      'What is the Culture Guides Slack channel?',
      'What hub-specific Slack channels exist?',
      'How do I use the Culture Guide Rockstars workflow?',
    ],
    program: [
      'What is the Culture Guides Program?',
      'What is the time commitment for Culture Guides?',
      'What marquee events do Culture Guides support?',
      'Who is the Culture Guides Program Owner?',
    ],
  }

  const topicOrder = ['signup', 'leads', 'points', 'events', 'sustainability', 'slack', 'program']

  function detectTopic(text: string): string {
    if (text.includes('sign up') || text.includes('join') || text.includes('fy27') || text.includes('registration')) return 'signup'
    if (text.includes('hub lead') || text.includes('lead for') || text.includes('region lead') || text.includes('regional lead') || text.includes('program owner')) return 'leads'
    if (text.includes('point') || text.includes('reward') || text.includes('rockstar') || text.includes('redeem')) return 'points'
    if (text.includes('event') || text.includes('planning') || text.includes('budget') || text.includes('meetingforce')) return 'events'
    if (text.includes('sustainab') || text.includes('plastic') || text.includes('catering') || text.includes('swag')) return 'sustainability'
    if (text.includes('slack') || text.includes('channel') || text.includes('#cultureguides')) return 'slack'
    return 'program'
  }

  function pickUnused(pool: string[], count: number): string[] {
    const available = pool.filter(q => !usedQuestionsRef.current.has(q))
    return available.slice(0, count)
  }

  // Dynamically pick suggestions: 2 on same topic + 1 from a different topic, never repeating used questions
  useEffect(() => {
    if (isTyping) return
    const lastAssistant = [...messages].reverse().find(m => m.role === 'assistant')
    if (!lastAssistant) return
    const text = getMessageText(lastAssistant as Parameters<typeof getMessageText>[0]).toLowerCase()

    const currentTopic = detectTopic(text)
    const sameTopic = pickUnused(questionPools[currentTopic], 2)

    // Pick 1 question from a different topic (round-robin through topics)
    const otherTopics = topicOrder.filter(t => t !== currentTopic)
    let crossQuestion: string | undefined
    for (const topic of otherTopics) {
      const available = pickUnused(questionPools[topic], 1)
      if (available.length > 0) { crossQuestion = available[0]; break }
    }

    const next = crossQuestion ? [...sameTopic, crossQuestion] : sameTopic
    if (next.length > 0) setSuggestions(next)
  }, [messages, isTyping])

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        {/* Spotify-style Podcast Player */}
        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 dark:from-blue-900/40 dark:via-purple-900/30 dark:to-indigo-900/40 border border-gray-200 dark:border-blue-500/20 shadow-xl h-[600px] backdrop-blur-md">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Album Art - Spinning Circular Culture Guides Logo */}
                <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg flex-shrink-0 bg-white dark:bg-white p-1">
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
                      className="w-full bg-gray-300 dark:bg-slate-600 rounded-full h-1 hover:h-1.5 transition-all duration-200 cursor-pointer"
                      onClick={handleProgressClick}
                    >
                      <div
                        className="bg-green-600 dark:bg-green-500 h-full rounded-full relative transition-all duration-200"
                        style={{ width: `${progress}%` }}
                      >
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-gray-800 dark:bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"></div>
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
                  className="hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-300 hover:text-gray-800 dark:hover:text-white w-8 h-8"
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
                  className="hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-300 hover:text-gray-800 dark:hover:text-white w-8 h-8"
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
                  className="hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-300 hover:text-gray-800 dark:hover:text-white w-8 h-8"
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
                    className="w-20 h-1 bg-gray-300 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer"
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
              <div className="space-y-4 mt-6 pt-6 border-t border-gray-200 dark:border-slate-600">
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
                    <span key={tag} className="px-3 py-1 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 text-xs rounded-full">
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
          <Card className="overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-900/40 dark:via-purple-900/30 dark:to-indigo-900/40 border border-gray-200 dark:border-blue-500/20 shadow-xl backdrop-blur-md h-[600px]">
            {/* AI Header */}
            <div className="relative bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 p-6">
              <div className="flex items-center gap-4">
                {/* Animated Robot Avatar */}
                <motion.div
                  className="relative cursor-pointer select-none"
                  whileHover="hovered"
                  initial="idle"
                >
                  {/* Outer glow ring on hover */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-white/30"
                    variants={{
                      idle: { scale: 1, opacity: 0 },
                      hovered: { scale: 1.4, opacity: 1 },
                    }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Avatar circle — same gradient as chat bubbles */}
                  <motion.div
                    className="relative w-14 h-14 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center"
                    variants={{
                      idle: { rotate: 0, scale: 1 },
                      hovered: { rotate: [0, -10, 10, -5, 5, 0], scale: 1.05 },
                    }}
                    transition={{ duration: 0.5 }}
                    animate={isTyping ? { scale: [1, 1.08, 1] } : {}}
                  >
                    <motion.div
                      variants={{
                        idle: { rotate: 0 },
                        hovered: { rotate: [0, -15, 15, 0] },
                      }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                      animate={isTyping
                        ? { rotate: [0, -8, 8, -8, 8, 0] }
                        : {}
                      }
                    >
                      <Bot className="w-7 h-7 text-white" />
                    </motion.div>
                  </motion.div>

                  {/* Online dot */}
                  <motion.div
                    className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"
                    animate={isTyping
                      ? { scale: [1, 1.4, 1], backgroundColor: ['#4ade80', '#facc15', '#4ade80'] }
                      : { scale: [1, 1.15, 1] }
                    }
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </motion.div>

                <div>
                  <h2 className="text-2xl font-bold text-white">AI Assistant</h2>
                  <p className="text-white/80 text-sm">
                    {isTyping ? 'Thinking…' : 'Enhanced with Culture Guides Knowledge Base'}
                  </p>
                </div>
              </div>
            </div>

            <CardContent className="p-6 space-y-6">


              {/* Chat Container */}
              <div className="h-64 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-200 dark:border-slate-600 overflow-hidden">
                <div className="h-full overflow-y-auto p-4 space-y-4">
                  {messages.map((msg, index) => {
                    const isUser = (msg as { role: string }).role === 'user'
                    return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(index * 0.1, 0.3) }}
                      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`flex items-start gap-3 max-w-[85%] ${isUser ? "flex-row-reverse" : ""}`}>
                        {/* Avatar */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isUser 
                            ? "bg-gradient-to-br from-orange-400 to-pink-500" 
                            : "bg-gradient-to-br from-blue-400 to-cyan-500"
                        }`}>
                          {isUser ? (
                            <User className="w-4 h-4 text-white" />
                          ) : (
                            <Bot className="w-4 h-4 text-white" />
                          )}
                        </div>
                        
                        {/* Message Bubble */}
                        <div className={`p-4 rounded-2xl shadow-sm ${
                          isUser
                            ? "bg-gradient-to-br from-orange-500 to-pink-500 text-white"
                            : "bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-slate-200 shadow-sm"
                        }`}>
                          {isUser ? (
                            <p className="text-sm leading-relaxed">{getMessageText(msg)}</p>
                          ) : (
                            <div className="text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0.5">
                              <ReactMarkdown>{getMessageText(msg)}</ReactMarkdown>
                            </div>
                          )}
                          <div className={`text-xs mt-2 ${isUser ? "text-white/70" : "text-slate-400 dark:text-slate-400"}`}>
                            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                  })}

                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="flex items-start gap-3">
                        {/* Animated bot avatar while thinking */}
                        <motion.div
                          className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center flex-shrink-0"
                          animate={{ scale: [1, 1.12, 1] }}
                          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                        >
                          <Bot className="w-4 h-4 text-white" />
                        </motion.div>

                        {/* Thinking bubble */}
                        <div className="bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 px-4 py-3 rounded-2xl shadow-md">
                          <div className="flex items-center gap-1.5 px-1">
                            {['✦', '✦', '✦'].map((star, i) => (
                              <motion.span
                                key={i}
                                className="text-blue-400 text-sm leading-none"
                                animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
                                transition={{
                                  duration: 1.2,
                                  repeat: Infinity,
                                  delay: i * 0.3,
                                  ease: 'easeInOut',
                                }}
                              >
                                {star}
                              </motion.span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Scroll anchor */}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input Area */}
              <div className="space-y-2">
                {/* Dynamic suggestions above input */}
                {!isTyping && (
                  <motion.div
                    key={suggestions.join()}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-wrap gap-2"
                  >
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          usedQuestionsRef.current.add(suggestion)
                          setInputMessage(suggestion)
                        }}
                        className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400 rounded-full hover:bg-blue-50 dark:hover:bg-slate-600 hover:text-blue-600 dark:hover:text-blue-300 transition-colors border border-gray-200 dark:border-slate-600"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </motion.div>
                )}

                <form onSubmit={handleSendMessage} className="flex gap-3">
                  <div className="flex-1 relative">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Ask me about Culture Guides events, best practices, or planning tips..."
                      className="h-12 pl-4 pr-12 bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-400 rounded-xl shadow-sm"
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
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
