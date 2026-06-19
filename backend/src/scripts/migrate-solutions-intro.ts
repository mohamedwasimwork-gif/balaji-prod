import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import { PageContent } from '../models/PageContent.js';

const SIX_CARDS = [
  {
    title: 'Site Selection',
    description:
      'Conducting thorough technical assessments and detailed load flow studies to ensure safe, efficient, and compliant project planning outcomes.',
  },
  {
    title: 'Government Approvals',
    description:
      'Facilitating project registration and obtaining all required approvals, including Minister NOC, until successful project commissioning.',
  },
  {
    title: 'Land Acquisition',
    description:
      'Securing land with clear titles, including cleaning, soil testing, contour surveys, and preparation for construction activities onsite.',
  },
  {
    title: 'Civil Foundations',
    description:
      'Developing civil foundations, crane pads, access pathways, and supporting infrastructure required for smooth turbine installation operations.',
  },
  {
    title: 'Electrical Works',
    description:
      'Installing HT transmission lines, DP yards, bay extensions, and complete power evacuation systems to connect projects to the grid.',
  },
  {
    title: 'Commissioning & Handover',
    description:
      'Conducting final system testing, SCADA integration, performance verification, and structured handover for reliable long-term project operation.',
  },
];

async function migrate() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/balaji';
  await mongoose.connect(uri);
  console.log('Connected to', uri);

  const result = await PageContent.findOneAndUpdate(
    { page: 'solutions' },
    { $set: { 'data.solutionsIntroServices': SIX_CARDS } },
    { new: true }
  );

  if (!result) {
    console.error('solutions PageContent not found — run seed first');
    process.exit(1);
  }

  console.log(`✓ solutionsIntroServices updated to ${SIX_CARDS.length} cards`);
  await mongoose.disconnect();
}

migrate().catch((err) => { console.error(err); process.exit(1); });
