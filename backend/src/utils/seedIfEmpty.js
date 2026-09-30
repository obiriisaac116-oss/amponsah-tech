/**
 * Auto-seeds the database on startup if no services exist yet.
 * Safe to call multiple times — skips records that already exist.
 * Does NOT disconnect from the DB (server keeps running).
 */

const Admin   = require('../models/Admin');
const Service = require('../models/Service');

const SERVICES = [
  // ── CCTV Installation ──────────────────────────────────────────────
  { name: 'CCTV Basic Package',       description: '2-camera CCTV system with DVR, installation, and 1-month support. Ideal for small homes or shops.',                        duration: 120, price: 800,  currency: 'GHS', category: 'CCTV Installation' },
  { name: 'CCTV Standard Package',    description: '4-camera HD CCTV system with DVR/NVR, night vision, remote viewing setup, and 3-month support.',                           duration: 180, price: 1500, currency: 'GHS', category: 'CCTV Installation' },
  { name: 'CCTV Premium Package',     description: '8-camera full HD system with NVR, motion alerts, cloud backup, remote viewing, and 6-month support.',                      duration: 300, price: 2800, currency: 'GHS', category: 'CCTV Installation' },
  { name: 'CCTV Maintenance & Repair',description: 'Diagnosis, cleaning, cable checks, and repair of existing CCTV systems.',                                                   duration: 90,  price: 150,  currency: 'GHS', category: 'CCTV Installation' },
  // ── Internet & Networking ──────────────────────────────────────────
  { name: 'Home Internet Setup',      description: 'Router configuration, Wi-Fi optimisation, and device connection for homes.',                                                duration: 60,  price: 200,  currency: 'GHS', category: 'Internet & Networking' },
  { name: 'Business Network Setup',   description: 'Full office LAN/Wi-Fi setup including switches, access points, and firewall configuration.',                                duration: 240, price: 1200, currency: 'GHS', category: 'Internet & Networking' },
  { name: 'Network Troubleshooting',  description: 'Diagnosis and fix of slow internet, dropped connections, or network failures.',                                             duration: 60,  price: 100,  currency: 'GHS', category: 'Internet & Networking' },
  { name: 'Structured Cabling',       description: 'Cat5e/Cat6 cable installation and termination for offices and commercial premises.',                                        duration: 180, price: 600,  currency: 'GHS', category: 'Internet & Networking' },
  // ── Electrical Services ────────────────────────────────────────────
  { name: 'Electrical Installation',      description: 'Wiring, socket installation, distribution board setup for new builds or renovations.',                                 duration: 180, price: 500,  currency: 'GHS', category: 'Electrical Services' },
  { name: 'Electrical Fault Diagnosis',   description: 'Identification and repair of electrical faults, trips, and short circuits.',                                           duration: 60,  price: 120,  currency: 'GHS', category: 'Electrical Services' },
  { name: 'Solar & Inverter Setup',        description: 'Solar panel mounting, inverter installation, and battery bank configuration.',                                        duration: 300, price: 2000, currency: 'GHS', category: 'Electrical Services' },
  { name: 'Security Lighting Installation',description: 'Motion-sensor and perimeter security lights installed and configured.',                                               duration: 90,  price: 350,  currency: 'GHS', category: 'Electrical Services' },
];

async function seedIfEmpty() {
  try {
    const serviceCount = await Service.countDocuments();
    const adminCount   = await Admin.countDocuments();

    if (serviceCount > 0 && adminCount > 0) {
      console.log(`[Seed] DB already seeded (${serviceCount} services, ${adminCount} admins) — skipping.`);
      return;
    }

    console.log('[Seed] Empty database detected — seeding now…');

    // Superadmin
    if (adminCount === 0) {
      await Admin.create({
        name:     'Joseph Amponsah',
        email:    'josephamponsah91@gmail.com',
        password: 'Admin1234!',
        role:     'superadmin',
      });
      console.log('[Seed] Superadmin created: josephamponsah91@gmail.com / Admin1234!');
    }

    // Services
    let created = 0;
    for (const svc of SERVICES) {
      const exists = await Service.findOne({ name: svc.name });
      if (!exists) {
        await Service.create(svc);
        created++;
      }
    }

    console.log(`[Seed] Done — ${created} services created.`);
  } catch (err) {
    // Non-fatal — log and continue, the server keeps running
    console.error('[Seed] Error during auto-seed:', err.message);
  }
}

module.exports = seedIfEmpty;
