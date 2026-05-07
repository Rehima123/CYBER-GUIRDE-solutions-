import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Services from './pages/Services'
import About from './pages/About'
import Contact from './pages/Contact'
import AIAssistant from './components/AIAssistant'

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-darker">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
        <AIAssistant />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0a1628',
              color: '#e2e8f0',
              border: '1px solid #1a3a5c',
              borderRadius: '12px',
              fontFamily: 'Inter, sans-serif',
            },
            success: {
              iconTheme: { primary: '#00ff88', secondary: '#0a1628' },
            },
            error: {
              iconTheme: { primary: '#f87171', secondary: '#0a1628' },
            },
          }}
        />
      </div>
    </Router>
  )
}

export default App
