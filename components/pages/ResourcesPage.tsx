"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
  const [duration, setDuration] = useState("24:32")

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
  }, [])

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

  const quickActions = [
    "Help me plan a team building event",
    "What are the best practices for Culture Guides?",
    "How can I maximize my impact?",
    "Show me success stories",
  ]

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-8">
        {/* Spotify-style Podcast Player */}
        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-black border-0 shadow-xl max-w-4xl mx-auto">
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
                  <h3 className="text-xl font-bold text-white mb-1">Ohana Connect - The Culture Guides</h3>
                  <p className="text-green-400 text-base font-medium mb-1">Culture Guides Team</p>
                  <p className="text-slate-400 text-sm">Building connections that drive innovation at Salesforce</p>
                </div>
              </div>

              
              {/* Spotify-style Progress Bar */}
              <div className="space-y-3 mt-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-400 w-8">{currentTime}</span>
                  <div className="flex-1 group">
                    <div className="w-full bg-slate-600 rounded-full h-1 hover:h-1.5 transition-all duration-200 cursor-pointer">
                      <motion.div
                        className="bg-green-500 h-full rounded-full relative"
                        initial={{ width: "0%" }}
                        animate={{ width: "35%" }}
                        transition={{ duration: 2, delay: 1 }}
                      >
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"></div>
                      </motion.div>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-slate-400 w-8">{duration}</span>
                </div>
              </div>

              {/* Spotify-style Player Controls */}
              <div className="flex items-center justify-center gap-4 mt-4">
                <Button variant="ghost" size="icon" className="hover:bg-slate-700 text-slate-300 hover:text-white w-8 h-8">
                  <SkipBack className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-12 h-12 bg-green-500 hover:bg-green-400 text-black rounded-full shadow-lg hover:scale-105 transition-all"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-slate-700 text-slate-300 hover:text-white w-8 h-8">
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Assistant - Modern Chatbot Feel */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 border border-blue-200/50 shadow-xl max-w-4xl mx-auto">
            {/* AI Header */}
            <div className="relative bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 p-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Bot className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">AI Assistant</h2>
                  <p className="text-white/80 text-sm">Powered by NotebookLM</p>
                </div>
              </div>
            </div>

            <CardContent className="p-6 space-y-6">


              {/* Chat Container */}
              <div className="h-64 bg-slate-50/50 rounded-2xl border border-slate-200 overflow-hidden">
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
                            : "bg-white border border-slate-300 text-slate-700 shadow-sm"
                        }`}>
                          <p className="text-sm leading-relaxed">{msg.message}</p>
                          <div className={`text-xs mt-2 ${msg.type === "user" ? "text-white/70" : "text-slate-400"}`}>
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
                        <div className="bg-white border border-slate-300 p-4 rounded-2xl shadow-md">
                          <div className="flex space-x-2">
                            {[0, 1, 2].map((i) => (
                              <motion.div
                                key={i}
                                className="w-2 h-2 bg-blue-400 rounded-full"
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
                      className="h-12 pl-4 pr-12 bg-white border-slate-300 text-slate-700 placeholder-slate-400 rounded-xl shadow-sm"
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

                {/* Quick Suggestions */}
                <div className="grid grid-cols-1 gap-2">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      onClick={() => setInputMessage(action)}
                      className="h-auto p-3 text-left text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg whitespace-normal"
                    >
                      <Sparkles className="w-3 h-3 mr-2 text-blue-500 flex-shrink-0" />
                      <span className="break-words">{action}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
