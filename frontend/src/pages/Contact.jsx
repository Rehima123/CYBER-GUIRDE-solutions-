import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaArrowRight, FaShieldAlt } from 'react-icons/fa'
import axios from 'axios'
import toast from 'react-hot-toast'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' },
  }),
}

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', company: '', service: '', message: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post('/api/contact', formData)
      toast.success('Message sent! We\'ll be in touch within 24 hours.')
      setFormData({ name: '', email: '', company: '', service: '', message: '' })
    } catch {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const contactInfo = [
    { icon: FaMapMarkerAlt, label: 'Our Office', value: 'Addis Ababa, Ethiopia', color: 'text-primary' },
    { icon: FaPhone, label: 'Phone', value: '+251 925 259 536', color: 'text-accent' },
    { icon: FaEnvelope, label: 'Email', value: 'info@cyberguard.com', color: 'text-purple-400' },
  ]

  const faqs = [
    { q: 'How quickly can you respond to an incident?', a: 'Our SOC team responds to critical incidents within 15 minutes, 24/7.' },
    { q: 'Do you offer a free security assessment?', a: 'Yes — we provide a complimentary security posture assessment for all new clients.' },
    { q: 'What industries do you serve?', a: 'We serve healthcare, finance, government, education, retail, and more.' },
  ]

  return (
    <div className="bg-darker">
      {/* Hero */}
      <section className="relative pt-32 pb-20 cyber-grid-bg overflow-hidden">
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-primary/4 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <p className="text-primary font-mono text-sm mb-4 tracking-widest">// CONTACT US</p>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
              Let's Secure Your
              <span className="text-primary"> Business</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Get a free security assessment from our certified experts. No commitment required.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

            {/* Left: Info */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="lg:col-span-2 space-y-8"
            >
              <div>
                <h2 className="text-3xl font-black text-white mb-4">Get in Touch</h2>
                <p className="text-gray-400 leading-relaxed">
                  Our cybersecurity experts are ready to assess your current security posture
                  and recommend the right solutions for your business.
                </p>
              </div>

              {/* Contact cards */}
              <div className="space-y-4">
                {contactInfo.map((info, idx) => (
                  <div key={idx} className="cyber-card flex items-start gap-4">
                    <div className={`${info.color} text-xl flex-shrink-0 mt-0.5`}>
                      <info.icon />
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs font-mono mb-1">{info.label}</p>
                      <p className="text-white font-medium">{info.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Response time badge */}
              <div className="cyber-card border-accent/30">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                  <span className="text-accent font-mono text-sm font-bold">RESPONSE TIME</span>
                </div>
                <p className="text-white font-bold text-2xl mb-1">{'< 15 min'}</p>
                <p className="text-gray-500 text-sm">For critical security incidents</p>
              </div>

              {/* FAQ */}
              <div>
                <p className="text-primary font-mono text-sm mb-4 tracking-widest">// FAQ</p>
                <div className="space-y-4">
                  {faqs.map((faq, idx) => (
                    <div key={idx} className="border-l-2 border-border pl-4 hover:border-primary transition-colors duration-300">
                      <p className="text-white text-sm font-semibold mb-1">{faq.q}</p>
                      <p className="text-gray-500 text-sm">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right: Form */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
              className="lg:col-span-3"
            >
              <div className="bg-card border border-border rounded-2xl p-8 shadow-[0_0_50px_rgba(0,212,255,0.05)]">
                <div className="flex items-center gap-3 mb-8">
                  <FaShieldAlt className="text-primary text-xl" />
                  <h3 className="text-xl font-bold text-white">Free Security Assessment</h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-gray-400 text-sm font-mono mb-2">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                        className="input-cyber"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm font-mono mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@company.com"
                        className="input-cyber"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm font-mono mb-2">Company</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Your Company Name"
                      className="input-cyber"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm font-mono mb-2">Service Interest</label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="input-cyber"
                    >
                      <option value="" className="bg-dark">Select a service...</option>
                      <option value="network" className="bg-dark">Network Security</option>
                      <option value="cloud" className="bg-dark">Cloud Protection</option>
                      <option value="endpoint" className="bg-dark">Endpoint Security</option>
                      <option value="encryption" className="bg-dark">Data Encryption</option>
                      <option value="monitoring" className="bg-dark">24/7 SOC Monitoring</option>
                      <option value="incident" className="bg-dark">Incident Response</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm font-mono mb-2">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Tell us about your security needs or concerns..."
                      className="input-cyber resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-solid flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed py-4 text-base font-bold"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-dark/30 border-t-dark rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  <p className="text-gray-600 text-xs text-center font-mono">
                    🔒 Your information is encrypted and never shared with third parties
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
