import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '../.env') })

import User from '../models/User.js'
import Service from '../models/Service.js'

const services = [
  {
    name: 'Network Security',
    slug: 'network-security',
    shortDesc: 'Protect your infrastructure from unauthorized access and threats.',
    description: 'Comprehensive network security solutions including firewall management, intrusion detection, and VPN setup to protect your entire network perimeter.',
    features: ['Next-gen Firewall Management', 'Intrusion Detection & Prevention', 'VPN & Zero Trust Solutions', 'Network Traffic Analysis', 'DDoS Protection'],
    icon: 'FaNetworkWired',
    price: { monthly: 299, yearly: 2990, currency: 'USD' },
    category: 'network',
    order: 1,
  },
  {
    name: 'Cloud Protection',
    slug: 'cloud-protection',
    shortDesc: 'Secure your cloud infrastructure across AWS, Azure, and GCP.',
    description: 'End-to-end cloud security covering posture management, workload protection, identity management, and compliance automation.',
    features: ['Cloud Security Posture Management', 'Data Encryption & Key Management', 'Identity & Access Management', 'Compliance Automation', 'Cloud Workload Protection'],
    icon: 'FaCloud',
    price: { monthly: 399, yearly: 3990, currency: 'USD' },
    category: 'cloud',
    order: 2,
  },
  {
    name: 'Endpoint Security',
    slug: 'endpoint-security',
    shortDesc: 'AI-powered protection for every device in your organization.',
    description: 'Protect laptops, mobile devices, and servers with AI-powered endpoint detection and response, behavioral analysis, and data loss prevention.',
    features: ['AI-Powered Threat Prevention', 'Device Management & Control', 'Behavioral Analysis', 'Data Loss Prevention', 'Remote Wipe Capability'],
    icon: 'FaUserShield',
    price: { monthly: 199, yearly: 1990, currency: 'USD' },
    category: 'endpoint',
    order: 3,
  },
  {
    name: 'Data Encryption',
    slug: 'data-encryption',
    shortDesc: 'Military-grade encryption for data at rest and in transit.',
    description: 'Keep sensitive data secure with end-to-end encryption, hardware security modules, and comprehensive key management.',
    features: ['End-to-End Encryption', 'Hardware Security Modules', 'Secure File Transfer', 'Database Encryption', 'Certificate Management'],
    icon: 'FaLock',
    price: { monthly: 249, yearly: 2490, currency: 'USD' },
    category: 'encryption',
    order: 4,
  },
  {
    name: '24/7 SOC Monitoring',
    slug: 'soc-monitoring',
    shortDesc: 'Round-the-clock threat detection and real-time security alerts.',
    description: 'Our Security Operations Center monitors your infrastructure 24/7 using SIEM integration, threat intelligence feeds, and real-time log analysis.',
    features: ['Real-time Threat Alerts', 'SIEM Integration', 'Threat Intelligence Feeds', 'Log Analysis & Correlation', 'Executive Security Dashboard'],
    icon: 'FaEye',
    price: { monthly: 499, yearly: 4990, currency: 'USD' },
    category: 'monitoring',
    order: 5,
  },
  {
    name: 'Incident Response',
    slug: 'incident-response',
    shortDesc: 'Rapid containment and recovery when security incidents occur.',
    description: 'Our certified incident response team provides rapid containment, digital forensics, malware analysis, and full recovery planning.',
    features: ['Emergency Response Team', 'Digital Forensics', 'Malware Analysis', 'Recovery Planning', 'Post-Incident Review'],
    icon: 'FaFirstAid',
    price: { monthly: 599, yearly: 5990, currency: 'USD' },
    category: 'incident',
    order: 6,
  },
]

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Clear existing
    await Service.deleteMany()
    await User.deleteMany({ role: 'admin' })

    // Seed services
    await Service.insertMany(services)
    console.log(`✅ Seeded ${services.length} services`)

    // Create admin user
    await User.create({
      name: process.env.ADMIN_NAME || 'Admin',
      email: process.env.ADMIN_EMAIL || 'admin@cyberguard.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@123456',
      role: 'admin',
      emailVerified: true,
    })
    console.log(`✅ Admin user created: ${process.env.ADMIN_EMAIL || 'admin@cyberguard.com'}`)

    console.log('\n🎉 Database seeded successfully!')
    process.exit(0)
  } catch (err) {
    console.error('❌ Seeding failed:', err)
    process.exit(1)
  }
}

seed()
