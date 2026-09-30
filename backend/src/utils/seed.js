/**
 * Run once to create the superadmin account and seed Amponsah Tech services.
 * Usage: node src/utils/seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const Service = require('../models/Service');
const connectDB = require('./db');

const SERVICES = [
  // ── CCTV Installation ─────────────────────────────────────────────────────
  {
    name: 'CCTV Basic Package',
    description: '2-camera CCTV system with DVR, installation, and 1-month support. Ideal for small homes or shops.',
    duration: 120,
    price: 800,
    currency: 'GHS',
    category: 'CCTV Installation',
  },
  {
    name: 'CCTV Standard Package',
    description: '4-camera HD CCTV system with DVR/NVR, night vision, remote viewing setup, and 3-month support.',
    duration: 180,
    price: 1500,
    currency: 'GHS',
    category: 'CCTV Installation',
  },
  {
    name: 'CCTV Premium Package',
    description: '8-camera full HD system with NVR, motion alerts, cloud backup, remote viewing, and 6-month support.',
    duration: 300,
    price: 2800,
    currency: 'GHS',
    category: 'CCTV Installation',
  },
  {
    name: 'CCTV Maintenance & Repair',
    description: 'Diagnosis, cleaning, cable checks, and repair of existing CCTV systems.',
    duration: 90,
    price: 150,
    currency: 'GHS',
    category: 'CCTV Installation',
  },

  // ── Internet & Networking ─────────────────────────────────────────────────
  {
    name: 'Home Internet Setup',
    description: 'Router configuration, Wi-Fi optimisation, and device connection for homes.',
    duration: 60,
    price: 200,
    currency: 'GHS',
    category: 'Internet & Networking',
  },
  {
    name: 'Business Network Setup',
    description: 'Full office LAN/Wi-Fi setup including switches, access points, and firewall configuration.',
    duration: 240,
    price: 1200,
    currency: 'GHS',
    category: 'Internet & Networking',
  },
  {
    name: 'Network Troubleshooting',
    description: 'Diagnosis and fix of slow internet, dropped connections, or network failures.',
    duration: 60,
    price: 100,
    currency: 'GHS',
    category: 'Internet & Networking',
  },
  {
    name: 'Structured Cabling',
    description: 'Cat5e/Cat6 cable installation and termination for offices and commercial premises.',
    duration: 180,
    price: 600,
    currency: 'GHS',
    category: 'Internet & Networking',
  },

  // ── Electrical Services ───────────────────────────────────────────────────
  {
    name: 'Electrical Installation',
    description: 'Wiring, socket installation, distribution board setup for new builds or renovations.',
    duration: 180,
    price: 500,
    currency: 'GHS',
    category: 'Electrical Services',
  },
  {
    name: 'Electrical Fault Diagnosis',
    description: 'Identification and repair of electrical faults, trips, and short circuits.',
    duration: 60,
    price: 120,
    currency: 'GHS',
    category: 'Electrical Services',
  },
  {
    name: 'Solar & Inverter Setup',
    description: 'Solar panel mounting, inverter installation, and battery bank configuration.',
    duration: 300,
    price: 2000,
    currency: 'GHS',
    category: 'Electrical Services',
  },
  {
    name: 'Security Lighting Installation',
    description: 'Motion-sensor and perimeter security lights installed and configured.',
    duration: 90,
    price: 350,
    currency: 'GHS',
    category: 'Electrical Services',
  },
];

async function seed() {
  await connectDB();

  // Create superadmin
  const existing = await Admin.findOne({ email: 'josephamponsah91@gmail.com' });
  if (!existing) {
    await Admin.create({
      name: 'Joseph Amponsah',
      email: 'josephamponsah91@gmail.com',
      password: 'Admin1234!',
      role: 'superadmin',
    });
    console.log('Superadmin created — email: josephamponsah91@gmail.com  password: Admin1234!');
  } else {
    console.log('Superadmin already exists, skipping.');
  }

  // Seed services
  for (const svc of SERVICES) {
    const exists = await Service.findOne({ name: svc.name });
    if (!exists) {
      await Service.create(svc);
      console.log(`Service created: ${svc.name}`);
    }
  }

  console.log('\nSeed complete — Amponsah Tech is ready.');
  await mongoose.disconnect();
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seed failed:', err.message);
    // Exit 0 so the build doesn't fail if seed has a non-critical error
    process.exit(0);
  });
