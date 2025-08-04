'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Message {
  text: string
  sender: 'user' | 'bot'
  id: number
}

interface KnowledgeItem {
  id: number
  keywords: string[]
  answer: string
  suggestedQuestions: string[]
}

interface BotResponse {
  answer: string
  suggestedQuestions: string[]
  type?: string
  state?: string
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [askedQuestions, setAskedQuestions] = useState<Set<string>>(new Set())
  const [conversationState, setConversationState] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messageIdRef = useRef(0)

  // Hub leads data
  const hubLeads: Record<string, string> = {
    'atlanta': '@Dwayne Benjamin',
    'austin': '@Noel Martinez', 
    'chicago': '@Lauren Prince',
    'new york city': '@Clara Kobashigawa & @Noa Golden',
    'nyc': '@Clara Kobashigawa & @Noa Golden',
    'san francisco': '@Matt Facchin',
    'seattle': '@Kaitlyn Cantrell',
    'bellevue': '@Kaitlyn Cantrell',
    'toronto': '@Nicole Cyhelka & @Akanksha Sharma',
    'bbc': 'Lead Needed',
    'boston': 'Lead Needed',
    'burlington': 'Lead Needed',
    'cambridge': 'Lead Needed',
    'central florida': '@David Atkins',
    'dallas': '@Natalie Millman',
    'dc': '@Christine Jean & @Claudia Viscarra',
    'denver': '@Julie Durrbeck',
    'indy': '@Angi Grant',
    'irvine': '@Mina Gendi & @Jenn Simonson',
    'socal': '@Mina Gendi & @Jenn Simonson',
    'mclean': '@Ana Febres',
    'palo alto': '@Yobi Habtamu',
    'south florida': '@Elizabeth Tejeda',
    'raleigh': '@Blaire Rodgers',
    'vancouver': '@Lisa Liu',
    'brussels': '@Liesl Houben & @Samuel Alves Rosa',
    'france': '@Isabelle Comte, @Ombeline Challet & @Marie-Charlotte de Jaurias',
    'paris': '@Isabelle Comte, @Ombeline Challet & @Marie-Charlotte de Jaurias',
    'berlin': '@Pierre Jerome Lisson',
    'london': '@Yasmin Martin',
    'milan': '@Sara Riggi, @Adele Brancadoro, @Mauro Enrico Recalcati, @Laura Valagussa @Luca Sangiorgi',
    'amsterdam': '@Guus Paulusse',
    'madrid': '@Rafael Escaño',
    'zurich': '@Silvia Gönner & @Sophie Hunziker',
    'dublin': '@Claire Rowley (Lead Needed)',
    'stockholm': 'Lead Needed',
    'israel': '@Becky Livshitz & @Ifat Schwartz',
    'tel aviv': '@Becky Livshitz & @Ifat Schwartz',
    'johannesburg': '@Janneke Henning',
    'copenhagen': '@Sonia Blanco-Hansen & @Mari-louise Melchior',
    'düsseldorf': '@Michael Schmitz & @Laura Zirkenbach',
    'frankfurt': '@Philipp Sparwasser',
    'jena': '@Björn Leonhardt',
    'manheim': '@Daniel Wagner',
    'casablanca': '@Amal Alahkam & @Soukaina Baiti',
    'barcelona': '@Valeria Mina & @Dayana Peraza',
    'manchester': '@Laura Ward, @Robert Reid @Dave Felcey',
    'dubai': '@Maha Alaoui',
    'buenos aires': '@Maria Sol Condoleo',
    'bogota': '@Elkin Jonnatan Cordoba, @Nataly Quevedo, @Laura Garcia & @Alvaro Sevilla',
    'colombia': '@Elkin Jonnatan Cordoba, @Nataly Quevedo, @Laura Garcia & @Alvaro Sevilla',
    'mexico city': '@Christian Caballero',
    'sao paulo': '@André de Souza @Cynthia Mastrodomenico',
    'chile': '@Sebastián Fontana',
    'medellín': '(Same as Colombia for now)',
    'auckland': '@Renee Hinson (she/her/hers)',
    'brisbane': '@Kylee Pinnow',
    'canberra': '@Daniel Rushbrook',
    'hyderabad': '@Raju Katta & @Anish Paul G',
    'bangalore': '@Amarnath Kattani, REWS Support @Kiran Mondal',
    'gurgaon': '@Richa Sharma & @Lalita Kandpal',
    'jaipur': '@Neelabh Krishna & @Stuti Jain',
    'pune': '@Bhavesh Dhamecha',
    'singapore': '@Mamta Deshmukh & @Kai Hui Lim',
    'sydney': '@Emma Waide',
    'tokyo': '@Midori Tokioka',
    'mumbai': 'Lead Needed',
    'seoul': 'Lead Needed',
    'melbourne': '@Jessica Wraith'
  }

  const regionLeads: Record<string, string> = {
    'amer': '@Lauren Prince',
    'emea': '@Steph Doel',
    'latam': '@Melina Rochi (she/her)',
    'india': '@Anshita Sharma',
    'asean': '@Anshita Sharma',
    'japan': '@Anshita Sharma',
    'anz': '@Linda Huynh',
    'korea': '@Linda Huynh',
    'apac': '@Anshita Sharma (India, ASEAN & Japan) and @Linda Huynh (ANZ & Korea) are the leads for the APAC region.'
  }

  // Knowledge base
  const knowledgeBase: KnowledgeItem[] = [
    {
      id: 1,
      keywords: ['hi', 'hello', 'hey', 'start'],
      answer: "Hello! I'm the Culture Guide Assistant. I'm ready to answer your questions about event planning, rewards points, sustainability, and hub leads.",
      suggestedQuestions: ["What is the Culture Guides Program?", "Who is the Culture Guides Program Owner?", "Who is my hub lead?", "Who is my regional lead?"]
    },
    {
      id: 2,
      keywords: ['culture guides program', 'what is a culture guide', 'what is culture guides', 'purpose', 'mission'],
      answer: "The Culture Guides Program is a global network of employees who bring Salesforce's unique culture to life. Their mission is to foster connection by amplifying marquee events and planning local activities.",
      suggestedQuestions: ["How do I join?", "What is the time commitment?", "How are guides rewarded?"]
    },
    {
      id: 3,
      keywords: ['join', 'become a guide', 'sign up', 'apply'],
      answer: "You can sign up via the 'Culture Guide Sign Up Form' workflow in the #cultureguides-global Slack channel. Remember, manager approval is mandatory!",
      suggestedQuestions: ["What is the time commitment?", "What are the rewards?", "Is manager approval required?"]
    },
    {
      id: 4,
      keywords: ['time commitment', 'how much time', 'hours per month'],
      answer: "The expected time commitment is roughly 2-4 hours per month. The role is a one-year term, starting in February.",
      suggestedQuestions: ["How do I get points?", "What are my responsibilities?", "Who is my hub lead?"]
    },
    {
      id: 5,
      keywords: ['points', 'rewarded', 'rewards', 'recognition', 'incentives', 'what do i get', 'rockstars'],
      answer: "You earn points for event participation: 100 for project managing, 50 for being a committee member, and 25 for on-site help. You can log these points via the 'Culture Guide Rockstars' workflow in the #cultureguides-global Slack channel to exchange for gifts and prizes quarterly.",
      suggestedQuestions: ["What are the marquee events?", "What's the budget per person?", "Who is the lead for Chicago?"]
    },
    {
      id: 6,
      keywords: ['plan an event', 'plan event', 'event planning', 'where to start', 'local event'],
      answer: "Start with the '[template] Event Planning Doc.pdf'. It's your main checklist. Remember to consider sustainability, partner with Equality Groups, and use the Employee Event Finder app for registration and feedback.",
      suggestedQuestions: ["What are the sustainability rules?", "What's the budget per person?", "How do I get rewards points?"]
    },
    {
      id: 7,
      keywords: ['funding', 'budget', 'money', 'payment', 'p-card'],
      answer: "The guideline is to keep events around $30 per person. You can request a budget via the Event Tracker form. Payments can be made with a P-Card (not your T&E Amex). Make sure your vendor accepts Amex or is in Coupa before requesting the budget.",
      suggestedQuestions: ["How do I plan a sustainable event?", "Who is my hub lead?", "How do I get points for my event?"]
    },
    {
      id: 8,
      keywords: ['sustainability', 'sustainable', 'green event', 'eco-friendly'],
      answer: "Sustainability is key! The 'Salesforce Event Sustainability Playbook' is your guide. Key tips: no single-use plastics, avoid beef and pork in catering, reuse banners, and ensure all swag is 'earned', not just given away. This means swag is a prize, not a handout.",
      suggestedQuestions: ["What swag is not allowed?", "What are the marquee events?", "Who is the lead for Berlin?"]
    },
    {
      id: 9,
      keywords: ['swag', 'giveaways'],
      answer: "All swag must be 'earned' as a prize, not just given away. It should be high-quality and sustainable. Items made of plastic, toys, and anything with a lithium-ion battery are not allowed.",
      suggestedQuestions: ["What are the sustainability rules?", "How do I get points?", "What is the budget for events?"]
    },
    {
      id: 10,
      keywords: ['marquee events', 'global events'],
      answer: "The four main global marquee events are Salesforce's Birthday, Salesforce Adventure Club (our 'bring your kids to work day'), Dreamforce activations, and Peace & Joy.",
      suggestedQuestions: ["How do I plan a local event?", "Who is my hub lead?", "How do I get points?"]
    },
    {
      id: 11,
      keywords: ['slack', 'channel'],
      answer: "The 'Culture Guide Slack Channels.pdf' has the full list. The main channel for all guides is #cultureguides-global. Hub-specific channels are usually named #cultureguides-[city/country code], like #cultureguides-in for India.",
      suggestedQuestions: ["Who is the lead for the EMEA region?", "What are the marquee events?", "How do I get points?"]
    },
    {
      id: 12,
      keywords: ['meetingforce', 'register event', 'contract'],
      answer: "You must use Meetingforce to register any event that involves 10 or more people AND requires a signed contract with an external vendor. This needs to be done at least 3 weeks before the contract's due date.",
      suggestedQuestions: ["What is the Employee Event Finder?", "What's the budget per person?", "How do I pay for things?"]
    },
    {
      id: 13,
      keywords: ['event finder', 'registration', 'feedback'],
      answer: "The Employee Event Finder app is your tool to manage event registrations, waitlists, and promotion. It also automatically sends a recommended survey to collect feedback from attendees after the event.",
      suggestedQuestions: ["How do I use Meetingforce?", "What tags should I use for my event?", "What are the marquee events?"]
    },
    {
      id: 14,
      keywords: ['oktoberquest', 'octoberquest'],
      answer: "OktoberQuest is an annual challenge to boost employee connection. Participants complete tasks like attending events, volunteering, and connecting with colleagues for a chance to win prizes, such as a VTO trip to South Africa or a tech carrying case.",
      suggestedQuestions: ["What is the Agentforce AR App?", "How are guides rewarded?", "What are the marquee events?"]
    },
    {
      id: 15,
      keywords: ['agentforce', 'ar app'],
      answer: "The Agentforce AR app is an augmented reality experience for events. It lets attendees take selfies with our agents and learn about the Agentforce story in an immersive way. It's a great tool for both employee and customer events.",
      suggestedQuestions: ["What is OktoberQuest?", "How do I plan an event?", "Who is my hub lead?"]
    },
    {
      id: 16,
      keywords: ['thank you', 'thanks', 'bye', 'great'],
      answer: "You're welcome! I'm here if you have any more questions. Happy to help!",
      suggestedQuestions: []
    }
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    const newMessage: Message = {
      text,
      sender,
      id: messageIdRef.current++
    }
    setMessages(prev => [...prev, newMessage])
  }

  const getBotResponse = (input: string): BotResponse | null => {
    const lowerCaseInput = input.toLowerCase()
    const triggerWords = ['lead for', 'who is the lead', 'hub lead', 'contact for', 'program owner', 'global lead', 'regional lead']

    if (triggerWords.some(word => lowerCaseInput.includes(word))) {
      if (lowerCaseInput.includes('my hub')) {
        return { 
          type: 'follow-up', 
          state: 'awaiting_hub_name', 
          answer: "Happy to help! What city or hub are you in?", 
          suggestedQuestions: [] 
        }
      }
      
      if (lowerCaseInput.includes('my region') || lowerCaseInput.includes('regional lead')) {
        return { 
          type: 'follow-up', 
          state: 'awaiting_region_name', 
          answer: "Of course! Which region are you in (AMER, EMEA, LATAM, APAC)?", 
          suggestedQuestions: [] 
        }
      }
      
      if (lowerCaseInput.includes('global') || lowerCaseInput.includes('owner') || lowerCaseInput.includes('charge of the program')) {
        return { 
          answer: "The Culture Guide Program Owner is @Steph Doel (who is also the EMEA Lead).", 
          suggestedQuestions: ["Who is the lead for my region?", "How are hub leads different?", "What are the marquee events?"] 
        }
      }

      for (const region in regionLeads) {
        if (lowerCaseInput.includes(region)) {
          return { 
            answer: `The Region Lead for ${region.toUpperCase()} is ${regionLeads[region]}.`, 
            suggestedQuestions: ["Who is the lead for a specific city?", "What are the rewards for guides?", "How do I plan an event?"] 
          }
        }
      }

      for (const hub in hubLeads) {
        if (lowerCaseInput.includes(hub)) {
          const leadName = hubLeads[hub]
          const verb = leadName.includes('&') || leadName.includes(',') ? 'are' : 'is'
          let answer: string
          
          if (leadName === 'Lead Needed' || leadName.includes('(Lead Needed)')) {
            answer = `A lead is currently needed for ${hub.charAt(0).toUpperCase() + hub.slice(1)}. If you're interested, you should reach out to your Region Lead.`
          } else {
            answer = `The hub lead(s) for ${hub.charAt(0).toUpperCase() + hub.slice(1)} ${verb} ${leadName}.`
          }
          
          return { 
            answer, 
            suggestedQuestions: ["How do I get rewards points?", "What are the sustainability rules?"] 
          }
        }
      }
    }
    
    const foundItem = knowledgeBase.find(item => 
      item.keywords.some(k => lowerCaseInput.includes(k))
    )
    
    return foundItem ? {
      answer: foundItem.answer,
      suggestedQuestions: foundItem.suggestedQuestions
    } : null
  }

  const handleSendMessage = () => {
    const messageText = inputValue.trim()
    if (messageText === '') return

    addMessage(messageText, 'user')
    setAskedQuestions(prev => new Set(Array.from(prev).concat(messageText.toLowerCase())))
    setInputValue('')
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      let botResponse: BotResponse | null

      if (conversationState === 'awaiting_hub_name') {
        botResponse = getBotResponse(`who is the lead for ${messageText}`)
        setConversationState(null)
      } else if (conversationState === 'awaiting_region_name') {
        botResponse = getBotResponse(`who is the lead for ${messageText} region`)
        setConversationState(null)
      } else {
        botResponse = getBotResponse(messageText)
      }

      if (botResponse) {
        if (botResponse.type === 'follow-up') {
          setConversationState(botResponse.state || null)
        }
        addMessage(botResponse.answer, 'bot')
      } else {
        addMessage("I'm sorry, I can only answer questions about the Culture Guide program. Try asking about event planning, rewards points, or who the lead is for a specific hub.", 'bot')
      }
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question)
    handleSendMessage()
  }

  // Initialize with greeting
  useEffect(() => {
    setTimeout(() => {
      const initialResponse = knowledgeBase.find(item => item.keywords.includes('start'))
      if (initialResponse) {
        addMessage(initialResponse.answer, 'bot')
      }
    }, 500)
  }, [])

  // Get suggested questions from last bot message
  const getActiveSuggestedQuestions = (): string[] => {
    const lastBotMessage = messages.filter(m => m.sender === 'bot').pop()
    if (!lastBotMessage) return []
    
    // Find the knowledge item that matches the last bot response
    const matchingItem = knowledgeBase.find(item => item.answer === lastBotMessage.text)
    if (!matchingItem) return []
    
    return matchingItem.suggestedQuestions.filter(q => 
      !askedQuestions.has(q.toLowerCase())
    ).slice(0, 4)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl">
        
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 rounded-t-2xl flex items-center shadow-md">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4">
            <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V10a2 2 0 012-2h8z"></path>
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold">Culture Guide Assistant</h1>
            <p className="text-sm opacity-80">Your guide to the Culture Guide program</p>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 p-6 overflow-y-auto" style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#94a3b8 #f1f5f9'
        }}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex mb-4 max-w-md ${
                message.sender === 'user' 
                  ? 'justify-end ml-auto' 
                  : 'justify-start mr-auto'
              }`}
            >
              <div
                className={`px-4 py-3 rounded-2xl ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        <div className="px-6 pb-2 flex flex-wrap gap-2 justify-center">
          {getActiveSuggestedQuestions().map((question, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleSuggestedQuestion(question)}
              className="text-sm bg-gray-100 text-blue-700 border-gray-300 hover:bg-gray-200 hover:text-blue-800 transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              {question}
            </Button>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
          <div className="flex items-center space-x-3">
            <Input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about events, points, hub leads..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <Button
              onClick={handleSendMessage}
              className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition transform hover:scale-105"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}