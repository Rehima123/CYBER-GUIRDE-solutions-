import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  FaNetworkWired, FaCloud, FaUserShield, FaLock, FaEye, FaFirstAid,
  FaArrowRight, FaCheckCircle
} from 'react-icons/fa'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' },
  }),
}

const Services = () => {
  const services = [
    {
      icon: FaNetworkWired,
      title: 'Network Security',
      color: 'text-blue-400',
      glow: 'rgba(96,165,250,0.15)',
      description: 'Protect your network infrastructure from unauthorized access, misuse, and sophisticated cyber attacks with our advanced security solutions.',
      features: ['Next-gen Firewall Management', 'Intrusion Detection & Prevention', 'VPN & Zero Trust Solutions', 'Network Traffic Analysis', 'DDoS Protection'],
    },
    {
      icon: FaCloud,
      title: 'Cloud Protection',
      color: 'text-cyan-400',
      glow: 'rgba(34,211,238,0.15)',
      description: 'Secure your cloud infrastructure, applications, and data across AWS, Azure, and GCP with our comprehensive cloud security services.',
      features: ['Cloud Security Posture Management', 'Data Encryption & Key Management', 'Identity & Access Management', 'Compliance Automation', 'Cloud Workload Protection'],
    },
    {
      icon: FaUserShield,
      title: 'Endpoint Security',
      color: 'text-purple-400',
      glow: 'rgba(192,132,252,0.15)',
      description: 'Protect every device in your organization — laptops, mobile devices, servers — with AI-powered endpoint detection and response.',
      features: ['AI-Powered Threat Prevention', 'Device Management & Control', 'Behavioral Analysis', 'Data Loss Prevention', 'Remote Wipe Capability'],
    },
    {
      icon: FaLock,
      title: 'Data Encryption',
      color: 'text-green-400',
      glow: 'rgba(74,222,128,0.15)',
      description: 'Keep your sensitive data secure with military-grade encryption solutions protecting data both at rest and in transit.',
      features: ['End-to-End Encryption', 'Hardware Security Modules', 'Secure File Transfer', 'Database Encryption', 'Certificate Management'],
    },
    {
      icon: FaEye,
      title: '24/7 SOC Monitoring',
      color: 'text-yellow-400',
      glow: 'rgba(250,204,21,0.15)',
      description: 'Our Security Operations Center provides round-the-clock monitoring to detect and respond to threats before they impact your business.',
      features: ['Real-time Threat Alerts', 'SIEM Integration', 'Threat Intelligence Feeds', 'Log Analysis & Correlation', 'Executive Security Dashboard'],
    },
    {
      icon: FaFirstAid,
      title: 'Incident Response',
      color: 'text-red-400',
      glow: 'rgba(248,113,113,0.15)',
      description: 'Rapid response and recovery services to minimize damage and restore operations after a security incident.',
      features: ['Emergency Response Team', 'Digital Forensics', 'Malware Analysis', 'Recovery Planning', 'Post-Incident Review'],
    },
  ]

  const process = [
    { step: '01', title: 'Assessment', desc: 'We analyze your current security posture and identify vulnerabilities.' },
    { step: '02', title: 'Strategy', desc: 'We design a tailored security roadmap aligned with your business goals.' },
    { step: '03', title: 'Deploy', desc: 'Our experts implement solutions with minimal disruption to operations.' },
    { step: '04', title: 'Monitor', desc: 'Continuous 24/7 monitoring and regular security reviews keep you protected.' },
  ]

  return (
    <div className="bg-darker">
      {/* Hero */}
      <section className="relative pt-32 pb-20 cyber-grid-bg overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/3 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <p className="text-primary font-mono text-sm mb-4 tracking-widest">// OUR SERVICES</p>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
              Complete Security
              <span className="text-primary"> Coverage</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              From network perimeter to cloud workloads — we protect every layer of your digital infrastructure.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={idx % 2}
                className="cyber-card group"
                style={{ '--glow': service.glow }}
              >
                <div className="flex items-start gap-5">
                  <div
                    className={`${service.color} text-4xl flex-shrink-0 mt-1 group-hover:drop-shadow-[0_0_10px_currentColor] transition-all duration-300`}
                  >
                    <service.icon />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-3">{service.title}</h3>
                    <p className="text-gray-500 mb-5 leading-relaxed text-sm">{service.description}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature, i) => (
                        <li key={i} className="feature-check text-sm">{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-center text-primary font-mono text-sm mb-3 tracking-widest">// HOW IT WORKS</p>
            <h2 className="section-title">Our Process</h2>
            <p className="section-subtitle">A proven methodology to secure your organization</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

            {process.map((item, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={idx}
                className="text-center relative"
              >
                <div className="w-24 h-24 mx-auto mb-6 rounded-full border-2 border-primary/30 bg-darker flex items-center justify-center relative group hover:border-primary transition-colors duration-300">
                  <span className="text-3xl font-black text-primary font-mono">{item.step}</span>
                  <div className="absolute inset-0 rounded-full bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Not Sure Where to Start?
            </h2>
            <p className="text-gray-400 text-lg mb-10">
              Our experts will assess your current security posture for free and recommend the right solutions.
            </p>
            <Link to="/contact" className="btn-solid inline-flex items-center gap-2 group">
              Get Free Consultation
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Services
