/**
 * Migration: populate servicesSection header + per-service features into the home page CMS record.
 * Run with: npx tsx src/scripts/migrate-home-services.ts
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import { PageContent } from '../models/PageContent.js';

const SERVICES_SECTION = {
  sectionLabel: 'Our Services',
  heading: 'What We Do',
  subtext: 'End-to-end project delivery across every phase of the renewable energy lifecycle.',
  linkText: 'Learn more about this service',
};

const SERVICES_ITEMS = [
  {
    order: '01',
    title: 'Wind Energy',
    description: 'Full EPC solutions covering foundations, crane pads, electrical works, and complete commissioning.',
    features: [
      'Site feasibility & wind resource assessment',
      'Civil, structural & electrical engineering',
      'WTG procurement & erection management',
      'Grid evacuation & substation works',
    ],
  },
  {
    order: '02',
    title: 'Solar Energy',
    description: 'End-to-end solar development including MMS structures, cabling, civil works, and commissioning.',
    features: [
      'Rooftop, ground-mount & floating solar',
      'Detailed engineering & BOM preparation',
      'Module & inverter procurement support',
      'Commissioning & grid synchronisation',
    ],
  },
];

async function run() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/balaji';
  await mongoose.connect(uri);
  console.log('Connected to', uri);

  const doc = await PageContent.findOne({ page: 'home' });
  if (!doc) {
    console.error('No home page document found. Run the main seed first.');
    process.exit(1);
  }

  const existing = (doc.data as Record<string, unknown>) || {};

  // Deep-merge: preserve all existing fields, set/overwrite services fields
  const updated = {
    ...existing,
    servicesSection: SERVICES_SECTION,
    services: SERVICES_ITEMS,
  };

  await PageContent.findOneAndUpdate(
    { page: 'home' },
    { $set: { data: updated } },
    { new: true }
  );

  console.log('✓ servicesSection and services (with features) saved to DB.');
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
