import { useState, useRef, useEffect } from 'react'
import { FaRobot, FaTimes, FaPaperPlane, FaShieldAlt } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import toast from 'react-hot-toast'

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm your CyberGuard AI assistant. Ask me anything about cybersecurity, our services, or how to protect your business." }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await axios.post('/api/ai/chat', {
        message: input,
        history: messages,
      })
      setMessages(prev => [...prev, { role: 'assistant', content: response.data.response }])
    } catch {
      toast.error('Failed to get response')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-dark rounded-full shadow-[0_0_20px_rgba(0,212,255,0.4)] hover:shadow-[0_0_30px_rgba(0,212,255,0.6)] transition-all duration-300 flex items-center justify-center z-50 font-bold"
        aria-label="Toggle AI Assistant"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <FaTimes size={20} />
            </motion.span>
          ) : (
            <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <FaRobot size={20} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-96 h-[520px] bg-card border border-border rounded-2xl shadow-[0_0_50px_rgba(0,212,255,0.1)] flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-darker border-b border-border px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                <FaShieldAlt className="text-primary" size={14} />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">AI Security Assistant</h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                  <span className="text-gray-500 text-xs font-mono">Online</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-primary text-dark font-medium rounded-br-sm'
                        : 'bg-darker border border-border text-gray-300 rounded-bl-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-darker border border-border px-4 py-3 rounded-2xl rounded-bl-sm">
                    <div className="flex space-x-1.5">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-2 h-2 bg-primary/50 rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="p-4 border-t border-border bg-darker">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about cybersecurity..."
                  className="flex-1 px-4 py-2.5 bg-card border border-border rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-primary/50 transition-colors"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="w-10 h-10 bg-primary text-dark rounded-xl flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                >
                  <FaPaperPlane size={14} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default AIAssistant
