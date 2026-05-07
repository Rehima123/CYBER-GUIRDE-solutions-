import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  FaShieldAlt, FaUsers, FaGlobe, FaAward, FaArrowRight,
  FaLinkedin, FaTwitter
} from 'react-icons/fa'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' },
  }),
}

const About = () => {
  const stats = [
    { value: '500+', label: 'Protected Clients', icon: FaUsers, color: 'text-primary' },
    { value: '99.9%', label: 'Uptime SLA', icon: FaShieldAlt, color: 'text-accent' },
    { value: '24/7', label: 'SOC Coverage', icon: FaGlobe, color: 'text-purple-400' },
    { value: '10+', label: 'Years Experience', icon: FaAward, color: 'text-yellow-400' },
  ]

  const team = [
    { name: 'Dawit Bekele', role: 'CEO & Founder', cert: 'CISSP, CISM', initials: 'DB' },
    { name: 'Sara Haile', role: 'Head of Security', cert: 'CEH, OSCP', initials: 'SH' },
    { name: 'Yonas Tesfaye', role: 'Cloud Security Lead', cert: 'AWS Security, CCSP', initials: 'YT' },
    { name: 'Meron Alemu', role: 'Incident Response', cert: 'GCIH, GCFE', initials: 'MA' },
  ]

  const values = [
    { title: 'Proactive Defense', desc: 'We identify and neutralize threats before they become incidents.' },
    { title: 'Transparency', desc: 'Clear communication and full visibility into your security posture.' },
    { title: 'Innovation', desc: 'Continuously evolving our methods to stay ahead of attackers.' },
    { title: 'Partnership', desc: 'We treat your security as our own — a true long-term partnership.' },
  ]

  const certs = ['ISO 27001', 'SOC 2 Type II', 'GDPR Compliant', 'PCI DSS', 'HIPAA Ready', 'NIST Framework']

  return (
    <div className="bg-darker">
      {/* Hero */}
      <section className="relative pt-32 pb-20 cyber-grid-bg overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/4 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <p className="text-primary font-mono text-sm mb-4 tracking-widest">// ABOUT US</p>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
              Built by Security
              <span className="text-primary"> Experts</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              A decade of protecting businesses across Africa and beyond — from startups to enterprises.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-card border-y border-border">
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
                <stat.icon className={`${stat.color} text-2xl mx-auto mb-3 group-hover:drop-shadow-[0_0_8px_currentColor] transition-all`} />
                <div className="text-4xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-gray-500 text-sm font-mono">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <p className="text-primary font-mono text-sm mb-3 tracking-widest">// OUR STORY</p>
              <h2 className="text-4xl font-black text-white mb-6 leading-tight">
                Why We Built
                <span className="text-primary"> CyberGuard</span>
              </h2>
              <div className="space-y-4 text-gray-400 leading-relaxed">
                <p>
                  Founded in Addis Ababa, CyberGuard Solutions was born from a simple observation:
                  businesses in Africa were increasingly targeted by sophisticated cyber attacks,
                  yet lacked access to enterprise-grade security solutions.
                </p>
                <p>
                  Our team of certified security professionals set out to change that — building
                  a platform that delivers world-class cybersecurity at a price point accessible
                  to growing businesses.
                </p>
                <p>
                  Today, we protect over 500 organizations across multiple industries, from
                  healthcare and finance to government and education.
                </p>
              </div>
            </motion.div>

            {/* Values */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {values.map((val, idx) => (
                <div key={idx} className="cyber-card">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center mb-3">
                    <span className="text-primary font-mono text-xs font-bold">0{idx + 1}</span>
                  </div>
                  <h3 className="text-white font-bold mb-2">{val.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{val.desc}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-center text-primary font-mono text-sm mb-3 tracking-widest">// THE TEAM</p>
            <h2 className="section-title">Meet Our Experts</h2>
            <p className="section-subtitle">Certified professionals with decades of combined experience</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={idx}
                className="cyber-card text-center group"
              >
                {/* Avatar */}
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30 flex items-center justify-center group-hover:border-primary transition-colors duration-300">
                  <span className="text-2xl font-black text-primary">{member.initials}</span>
                </div>
                <h3 className="text-white font-bold text-lg mb-1">{member.name}</h3>
                <p className="text-primary text-sm mb-2">{member.role}</p>
                <p className="text-gray-600 text-xs font-mono">{member.cert}</p>
                <div className="flex justify-center gap-3 mt-4">
                  <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                    <FaLinkedin size={16} />
                  </a>
                  <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                    <FaTwitter size={16} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-center text-primary font-mono text-sm mb-3 tracking-widest">// COMPLIANCE & CERTIFICATIONS</p>
            <h2 className="section-title">Industry Certified</h2>
            <p className="section-subtitle">We meet the highest standards in security compliance</p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4">
            {certs.map((cert, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={idx}
                className="px-6 py-3 rounded-full border border-border bg-card text-gray-300 font-mono text-sm hover:border-primary/50 hover:text-primary transition-all duration-300"
              >
                {cert}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-card border-t border-border">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-4xl font-black text-white mb-6">
              Join 500+ Protected Businesses
            </h2>
            <p className="text-gray-400 mb-10">
              Let our experts assess your security posture — completely free.
            </p>
            <Link to="/contact" className="btn-solid inline-flex items-center gap-2 group">
              Get Free Assessment
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default About
