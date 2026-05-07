import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaShieldAlt, FaBars, FaTimes } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [location])

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ]

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-darker/95 backdrop-blur-md border-b border-border shadow-[0_4px_30px_rgba(0,212,255,0.05)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <FaShieldAlt className="text-primary text-3xl group-hover:drop-shadow-[0_0_8px_rgba(0,212,255,0.8)] transition-all duration-300" />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="text-xl font-bold tracking-wide">
              <span className="text-white">Cyber</span>
              <span className="text-primary">Guard</span>
              <span className="text-gray-500 text-sm font-mono ml-1">Solutions</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/contact"
              className="btn-primary text-sm py-2 px-5"
            >
              Get Protected
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-primary p-2 rounded-lg border border-border hover:border-primary/50 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-darker/98 backdrop-blur-md border-t border-border"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block py-2 font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'text-primary'
                      : 'text-gray-300 hover:text-primary'
                  }`}
                >
                  <span className="text-primary/50 font-mono mr-2">{'>'}</span>
                  {link.name}
                </Link>
              ))}
              <Link to="/contact" className="btn-solid block text-center mt-4">
                Get Protected
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
