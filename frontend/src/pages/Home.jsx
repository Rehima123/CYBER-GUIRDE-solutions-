import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FaShieldAlt, FaCloud, FaLock, FaEye, FaNetworkWired, FaUserShield,
  FaArrowRight, FaCheckCircle, FaTerminal, FaBolt
} from 'react-icons/fa'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' },
  }),
}

const Home = () => {
  const services = [
    { icon: FaNetworkWired, title: 'Network Security', desc: 'Protect your infrastructure with enterprise-grade firewall and intrusion detection systems.', color: 'text-blue-400' },
    { icon: FaCloud, title: 'Cloud Protection', desc: 'Secure your cloud workloads, data, and applications across all major platforms.', color: 'text-cyan-400' },
    { icon: FaUserShield, title: 'Endpoint Security', desc: 'Comprehensive protection for every device in your organization.', color: 'text-purple-400' },
    { icon: FaLock, title: 'Data Encryption', desc: 'Military-grade encryption for data at rest and in transit.', color: 'text-green-400' },
    { icon: FaEye, title: '24/7 Monitoring', desc: 'Round-the-clock threat detection and real-time security alerts.', color: 'text-yellow-400' },
    { icon: FaShieldAlt, title: 'Incident Response', desc: 'Rapid containment and recovery when security incidents occur.', color: 'text-red-400' },
  ]

  const stats = [
    { value: '500+', label: 'Protected Clients', icon: FaUserShield },
    { value: '99.9%', label: 'Uptime Guarantee', icon: FaBolt },
    { value: '24/7', label: 'Active Monitoring', icon: FaEye },
    { value: '10+', label: 'Years Experience', icon: FaShieldAlt },
  ]

  const trustedBy = ['Fortune 500', 'Healthcare', 'Finance', 'Government', 'Education', 'Retail']

  return (
    <div className="bg-darker">
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden cyber-grid-bg">
        {/* Background glow blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-8"
          >
            <span className="cyber-badge">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <FaTerminal size={10} />
              SYSTEM ACTIVE — THREAT LEVEL: LOW
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="text-5xl md:text-7xl font-black mb-6 leading-tight"
          >
            <span className="text-white">Defend Your</span>
            <br />
            <span className="text-primary" style={{ textShadow: '0 0 40px rgba(0,212,255,0.4)' }}>
              Digital Frontier
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Enterprise-grade cybersecurity solutions that protect your business from
            evolving threats — before they strike.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/contact" className="btn-solid flex items-center justify-center gap-2 group">
              Get Free Assessment
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/services" className="btn-primary flex items-center justify-center gap-2">
              Explore Services
            </Link>
          </motion.div>

          {/* Trusted by */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
            className="mt-16"
          >
            <p className="text-gray-600 text-sm font-mono mb-4">TRUSTED BY INDUSTRIES</p>
            <div className="flex flex-wrap justify-center gap-4">
              {trustedBy.map((item) => (
                <span key={item} className="px-4 py-2 rounded-full border border-border text-gray-500 text-sm hover:border-primary/40 hover:text-gray-300 transition-all duration-300">
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600">
          <span className="text-xs font-mono">SCROLL</span>
          <div className="w-px h-12 bg-gradient-to-b from-primary/50 to-transparent" />
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-20 border-y border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={idx}
                className="stat-card group"
              >
                <stat.icon className="text-primary text-2xl mx-auto mb-3 group-hover:drop-shadow-[0_0_8px_rgba(0,212,255,0.8)] transition-all" />
                <div className="text-4xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-gray-500 text-sm font-mono">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="py-24 cyber-grid-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <p className="text-center text-primary font-mono text-sm mb-3 tracking-widest">// CAPABILITIES</p>
            <h2 className="section-title">Our Security Services</h2>
            <p className="section-subtitle">
              Comprehensive protection solutions engineered for modern threats
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={idx}
                className="cyber-card group cursor-pointer"
              >
                <div className={`${service.color} text-4xl mb-4 group-hover:drop-shadow-[0_0_8px_currentColor] transition-all duration-300`}>
                  <service.icon />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{service.desc}</p>
                <div className="mt-4 flex items-center gap-2 text-primary text-sm font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>Learn more</span>
                  <FaArrowRight size={12} />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/services" className="btn-primary inline-flex items-center gap-2">
              View All Services <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why Us ── */}
      <section className="py-24 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <p className="text-primary font-mono text-sm mb-3 tracking-widest">// WHY CYBERGUARD</p>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                Security That Never
                <span className="text-primary"> Sleeps</span>
              </h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Our team of certified security experts monitors your infrastructure around the clock,
                using AI-powered threat intelligence to stay ahead of attackers.
              </p>
              <ul className="space-y-4">
                {[
                  'AI-powered threat detection and response',
                  'Certified security professionals (CISSP, CEH)',
                  'Compliance with ISO 27001, SOC 2, GDPR',
                  'Dedicated incident response team',
                  'Real-time security dashboard and reporting',
                ].map((item, i) => (
                  <li key={i} className="feature-check">{item}</li>
                ))}
              </ul>
              <div className="mt-10">
                <Link to="/about" className="btn-primary inline-flex items-center gap-2">
                  About Our Team <FaArrowRight />
                </Link>
              </div>
            </motion.div>

            {/* Terminal-style card */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
              className="relative"
            >
              <div className="bg-darker border border-border rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,212,255,0.08)]">
                {/* Terminal header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-card border-b border-border">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                  <span className="ml-2 text-gray-500 text-xs font-mono">threat-monitor.sh</span>
                </div>
                {/* Terminal body */}
                <div className="p-6 font-mono text-sm space-y-3">
                  <div className="text-gray-500">$ ./cyberguard --monitor --realtime</div>
                  <div className="text-accent">✓ System initialized</div>
                  <div className="text-gray-400">Scanning network perimeter...</div>
                  <div className="text-accent">✓ 0 active threats detected</div>
                  <div className="text-gray-400">Checking endpoint integrity...</div>
                  <div className="text-accent">✓ All endpoints secure</div>
                  <div className="text-gray-400">Analyzing traffic patterns...</div>
                  <div className="text-yellow-400">⚠ Anomaly detected: 192.168.1.45</div>
                  <div className="text-accent">✓ Threat neutralized automatically</div>
                  <div className="text-gray-400">Generating security report...</div>
                  <div className="text-primary cursor-blink">Status: PROTECTED</div>
                </div>
              </div>
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-primary/5 rounded-xl blur-xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <p className="text-primary font-mono text-sm mb-4 tracking-widest">// GET STARTED</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Ready to Secure Your Business?
            </h2>
            <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
              Get a free security assessment and discover vulnerabilities before attackers do.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="btn-solid flex items-center justify-center gap-2 group">
                Start Free Assessment
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/services" className="btn-primary flex items-center justify-center gap-2">
                View Pricing
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
