import express from 'express'
import axios from 'axios'

const router = express.Router()

// AI Chat endpoint - supports both OpenAI and Gemini
router.post('/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body

    if (!message) {
      return res.status(400).json({
        status: 'error',
        message: 'Message is required'
      })
    }

    let response

    // Try OpenAI first
    if (process.env.OPENAI_API_KEY) {
      try {
        const openaiResponse = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: 'You are a helpful cybersecurity assistant for Cyber Guard Solutions. Provide expert advice on cybersecurity topics, threats, best practices, and our services (Network Security, Cloud Protection, Endpoint Security, Data Encryption, 24/7 Monitoring, and Incident Response). Be professional, concise, and helpful.'
              },
              ...history.map(msg => ({
                role: msg.role,
                content: msg.content
              })),
              {
                role: 'user',
                content: message
              }
            ],
            max_tokens: 500,
            temperature: 0.7
          },
          {
            headers: {
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        )

        response = openaiResponse.data.choices[0].message.content
      } catch (openaiError) {
        console.error('OpenAI error:', openaiError.message)
        throw openaiError
      }
    }
    // Fallback to Gemini
    else if (process.env.GEMINI_API_KEY) {
      try {
        const geminiResponse = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            contents: [{
              parts: [{
                text: `You are a cybersecurity assistant. Previous context: ${history.map(h => h.content).join(' ')}. User question: ${message}`
              }]
            }]
          }
        )

        response = geminiResponse.data.candidates[0].content.parts[0].text
      } catch (geminiError) {
        console.error('Gemini error:', geminiError.message)
        throw geminiError
      }
    }
    // Fallback response if no API key
    else {
      response = `Thank you for your question about "${message}". As a cybersecurity assistant, I can help you with:

• Network Security - Protecting your infrastructure
• Cloud Protection - Securing cloud environments
• Endpoint Security - Device protection
• Data Encryption - Keeping data secure
• 24/7 Monitoring - Continuous threat detection
• Incident Response - Rapid security response

Please configure OPENAI_API_KEY or GEMINI_API_KEY in your .env file for full AI capabilities. For immediate assistance, please contact us at info@cyberguard.com or call +251 925 259 536.`
    }

    res.json({
      status: 'success',
      response
    })
  } catch (error) {
    console.error('AI Chat error:', error.message)
    res.status(500).json({
      status: 'error',
      message: 'Failed to process AI request',
      fallback: 'Our AI assistant is temporarily unavailable. Please contact us directly at info@cyberguard.com for assistance.'
    })
  }
})

export default router
