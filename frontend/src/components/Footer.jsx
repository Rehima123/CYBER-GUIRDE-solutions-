import { Link } from 'react-router-dom'
import { FaTwitter, FaLinkedin, FaFacebook, FaInstagram, FaShieldAlt, FaEnvelope, FaPhone } from 'react-icons/fa'

const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4 group">
              <FaShieldAlt className="text-primary text-2xl group-hover:drop-shadow-[0_0_8px_rgba(0,212,255,0.8)] transition-all" />
              <span className="text-lg font-bold">
                <span className="text-white">Cyber</span>
                <span className="text-primary">Guard</span>
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Enterprise-grade cybersecurity solutions protecting businesses across Africa and beyond.
            </p>
            <div className="flex space-x-3">
              {[FaTwitter, FaLinkedin, FaFacebook, FaInstagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary/50 transition-all duration-300"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-5 font-mono text-sm tracking-widest">NAVIGATION</h3>
            <ul className="space-y-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'Services', path: '/services' },
                { name: 'About', path: '/about' },
                { name: 'Contact', path: '/contact' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-500 hover:text-primary transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="text-primary/30 group-hover:text-primary transition-colors">▸</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-bold mb-5 font-mono text-sm tracking-widest">SERVICES</h3>
            <ul className="space-y-3">
              {['Network Security', 'Cloud Protection', 'Endpoint Security', '24/7 Monitoring', 'Incident Response'].map((s) => (
                <li key={s}>
                  <Link
                    to="/services"
                    className="text-gray-500 hover:text-primary transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="text-primary/30 group-hover:text-primary transition-colors">▸</span>
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-5 font-mono text-sm tracking-widest">CONTACT</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-500 text-sm">
                <FaPhone className="text-primary mt-0.5 flex-shrink-0" size={13} />
                <span>+251 925 259 536</span>
              </li>
              <li className="flex items-start gap-3 text-gray-500 text-sm">
                <FaEnvelope className="text-primary mt-0.5 flex-shrink-0" size={13} />
                <span>info@cyberguard.com</span>
              </li>
              <li className="flex items-start gap-3 text-gray-500 text-sm">
                <span className="text-primary mt-0.5 flex-shrink-0 text-xs">📍</span>
                <span>Addis Ababa, Ethiopia</span>
              </li>
            </ul>

            {/* Status indicator */}
            <div className="mt-6 flex items-center gap-2 text-xs font-mono text-gray-600">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span>All systems operational</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm font-mono">
            © {year} Cyber Guard Solutions. All rights reserved.
          </p>
          <div className="flex gap-6 text-gray-600 text-xs font-mono">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
