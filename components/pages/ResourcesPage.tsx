"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Play, SkipBack, SkipForward, Loader2, Send } from "lucide-react"

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
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Podcast Player */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <Card className="liquid-glass border-0 shadow-2xl p-8">
            <CardHeader>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                Featured Podcast
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-32 h-32 bg-gradient-to-br from-orange-400 via-pink-400 to-purple-500 rounded-3xl flex items-center justify-center text-6xl flex-shrink-0 shadow-2xl">
                  🎵
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-2xl font-bold">{podcastData?.title || "Ohana Connect - The Culture Guides"}</h3>
                  <p className="text-muted-foreground mt-2">Hosted by the Culture Guides Team</p>
                  <p className="text-sm text-muted-foreground mt-3">
                    {podcastData?.description ||
                      "An inspiring conversation on how we shape the future of work at Salesforce through our Ohana culture."}
                  </p>
                </div>
              </div>

              {/* Audio Player */}
              <div className="space-y-4">
                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-orange-500 to-pink-500 h-3 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "30%" }}
                    transition={{ duration: 2, delay: 1 }}
                  />
                </div>
                <div className="flex justify-between text-sm font-mono text-muted-foreground">
                  <span>10:32</span>
                  <span>35:18</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-6">
                <Button variant="ghost" size="icon" className="hover:bg-white/10 rounded-full">
                  <SkipBack className="w-6 h-6" />
                </Button>
                <Button
                  size="icon"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-20 h-20 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 rounded-full shadow-2xl"
                >
                  <Play className="w-8 h-8" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-white/10 rounded-full">
                  <SkipForward className="w-6 h-6" />
                </Button>
              </div>

              {podcastData?.audioUrl && (
                <audio controls className="w-full mt-4 rounded-2xl" style={{ filter: "invert(1) hue-rotate(180deg)" }}>
                  <source src={podcastData.audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* NotebookLM AI Assistant */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <Card className="liquid-glass border-0 shadow-2xl p-8">
            <CardHeader>
              <CardTitle className="text-3xl font-bold flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                NotebookLM AI Assistant
              </CardTitle>
              <CardDescription className="text-lg">
                Your intelligent Culture Guides companion powered by Google's NotebookLM
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Chat Messages */}
              <div className="h-80 bg-white/5 rounded-2xl p-4 overflow-y-auto space-y-4 backdrop-blur-sm">
                {chatMessages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] p-4 rounded-2xl ${
                        msg.type === "user"
                          ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white"
                          : "bg-white/10 backdrop-blur-sm border border-white/10"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.message}</p>
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white/10 backdrop-blur-sm border border-white/10 p-4 rounded-2xl">
                      <div className="flex space-x-2">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 bg-muted-foreground rounded-full"
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
                )}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask me about Culture Guides events, best practices, or planning tips..."
                  className="flex-1 h-12 liquid-glass border-0 text-base"
                  disabled={isTyping}
                />
                <Button
                  type="submit"
                  disabled={!inputMessage.trim() || isTyping}
                  className="h-12 px-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl"
                >
                  {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </Button>
              </form>

              {/* Quick Actions */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Quick Actions</h3>
                <div className="grid grid-cols-1 gap-3">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      onClick={() => setInputMessage(action)}
                      className="justify-start text-left h-auto p-4 liquid-glass border-white/10 hover:bg-white/10"
                      disabled={isTyping}
                    >
                      {action}
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
