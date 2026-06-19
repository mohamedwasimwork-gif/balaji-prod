import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

import { User } from '../models/User.js';
import { PageContent } from '../models/PageContent.js';
import { ShowcaseProject } from '../models/ShowcaseProject.js';
import { Lead } from '../models/Lead.js';

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/balaji';
  await mongoose.connect(uri);
  console.log('Connected to', uri);

  // 1. Admin user
  const existing = await User.findOne({ email: 'rahul@balaji-co.com' });
  if (existing) {
    console.log('Admin user already exists, skipping.');
  } else {
    const seedPassword = process.env.SEED_ADMIN_PASSWORD;
    if (!seedPassword || seedPassword.length < 8) {
      console.error('Set SEED_ADMIN_PASSWORD env var (min 8 chars)');
      process.exit(1);
    }
    const hash = await bcrypt.hash(seedPassword, 12);
    await User.create({
      fullName: 'Rahul Admin',
      email: 'rahul@balaji-co.com',
      role: 'admin',
      isActive: true,
      passwordHash: hash,
    });
    console.log('Admin user created: rahul@balaji-co.com');
  }

  // 1b. Employee user
  const existingEmployee = await User.findOne({ email: 'employee@balaji-co.com' });
  if (existingEmployee) {
    console.log('Employee user already exists, skipping.');
  } else {
    const seedPassword = process.env.SEED_ADMIN_PASSWORD;
    if (!seedPassword || seedPassword.length < 8) {
      console.error('Set SEED_ADMIN_PASSWORD env var (min 8 chars)');
      process.exit(1);
    }
    const empHash = await bcrypt.hash(seedPassword, 12);
    await User.create({
      fullName: 'Employee Demo',
      email: 'employee@balaji-co.com',
      role: 'employee',
      isActive: true,
      passwordHash: empHash,
    });
    console.log('Employee user created: employee@balaji-co.com');
  }

  // 2. Page Content — aligned with framer.md
  const homeData = {
    hero: { headline: 'Powering India\'s Renewable Future', subheadline: 'We deliver reliable wind and solar EPC solutions with strong engineering, on-time execution, and proven expertise across large-scale renewable energy projects.', ctaText: 'Explore Solutions' },
    whoWeHelp: { sectionLabel: 'Who We Help', title: 'Complete Wind & Solar Services', description: 'We deliver reliable engineering, construction, and execution for utility-scale wind and solar projects.', ctaText: 'Explore Services' },
    services: [
      { order: '01', title: 'Wind Energy', description: 'Full EPC solutions covering foundations, crane pads, electrical works, and complete commissioning.' },
      { order: '02', title: 'Solar Energy', description: 'End-to-end solar development including MMS structures, cabling, civil works, and commissioning.' },
    ],
    keyProjects: { sectionLabel: 'Key Projects', heading: 'Proven Renewable Energy Projects', description: 'Delivering large-scale wind and solar projects with engineering precision and reliable execution.', ctaText: 'View All' },
    values: { sectionLabel: 'Our Values', heading: 'Foundation of Our Guiding Principles', sublabel: 'About Us', missionTitle: 'Our Core Mission', missionText: 'We build world-class infrastructure with strong professionalism, ethics, quality, and service to support renewable energy growth.', visionTitle: 'Vision for Tomorrow', visionText: 'We aim to shape a cleaner India through renewable energy leadership and valuable, future-focused sustainable power solutions.' },
    achievements: { sectionLabel: 'Our Achievements', heading: 'Reliable delivery backed by 2060 MW of completed projects.', summaryText: 'Our team focuses on quality, safety, and consistent project delivery. We support clients with clear communication, dependable timelines engineering standards across every wind and solar project.', ctaText: 'View All', stats: [{ value: '454 MW', label: 'Karnataka' }, { value: '112 MW', label: 'Andhra Pradesh' }, { value: '1302 MW', label: 'Tamilnadu' }, { value: '150 MW', label: 'Maharastra' }, { value: '32 MW', label: 'Madhya Pradesh' }] },
    about: { sectionLabel: 'About Us', title: 'Proven expertise powering large wind and solar developments.', paragraphs: ['Balaji & Co has been operating as civil contractors since 2005, with strong expertise in Wind Turbine Generator (WTG) construction across India. We have successfully delivered complex wind projects, building a solid track record in the renewable energy sector.', 'Today, we offer end-to-end services including land acquisition, approvals, foundations, power evacuation, 33kV lines, bay extensions, and pathway development. In 2021, we expanded into solar power projects, strengthening our position as a complete renewable energy service provider.'] },
    faqs: { sectionLabel: 'Help Center', heading: 'Frequently Asked Questions', description: 'Browse answers to frequently asked questions about Balaji & Co solutions.', items: [{ question: 'What services does Balaji & Co provide for wind and solar projects?', answer: 'We deliver complete EPC solutions including foundations, crane pads, electrical works, transmission lines, land development, logistics, and site surveys.' }, { question: 'Do you handle full turnkey execution?', answer: 'Yes. We manage everything from land preparation and approvals to civil works, electrical infrastructure, and final commissioning support.' }, { question: 'Which states do you operate in?', answer: 'We work across Tamil Nadu, Karnataka, Andhra Pradesh, Maharashtra, Madhya Pradesh, and have also executed international projects in Sri Lanka.' }, { question: 'What turbine capacities have you worked with?', answer: 'We have delivered foundations and EPC works for 1.25MW, 1.5MW, 2.0MW, 2.2MW, 3.3MW, and 4.2MW turbine platforms.' }, { question: 'How do you ensure quality and safety at project sites?', answer: 'We follow strict QA/QC procedures, use approved materials, perform regular inspections, and maintain zero-incident safety practices across all sites.' }] },
    certifications: { sectionLabel: 'Our Certifications', heading: 'Accreditations & Standards', description: 'Operating under global quality, environmental, and safety standards for reliable, sustainable project delivery.', items: [{ name: 'ISO 9001:2015', description: 'This standard pertains to our Quality Management System, ensuring excellence in our processes.' }, { name: 'ISO 14001:2015', description: 'This Environmental Management System standard reinforces our commitment to sustainable practices.' }, { name: 'OHSAS 18001:2007', description: 'This Safety Management System standard underscores our dedication to maintaining a safe work environment.' }] },
    cta: { headline: 'Build Your Renewable Energy Project', subtext: 'Partner with us for reliable wind and solar execution backed by strong engineering and experience.', ctaButton1: 'Contact Us', ctaButton2: 'Explore Solutions' },
    footer: { companyName: 'Balaji & Co.', companyDescription: 'Balaji & Co delivers reliable wind and solar infrastructure with strong engineering, multi-state execution experience, and end-to-end project support for large renewable developments.', address: '11/17, East Street, Shree Ranganarayanapuram, Therumanal, Tirunelveli, Tamil Nadu, 627106, India', email: 'hello@balajo-co.com', phone: '+91 9876543210', copyrightText: 'Balaji & Co. © All rights reserved 2025', creditLine: 'Made with ❤️ by Zerocodes.io' },
  };

  const solutionsData = {
    solutionsHero: { headline: 'End-to-End Solutions for Wind & Solar Projects', subheadline: 'We deliver complete engineering, civil, and electrical execution for utility-scale renewable projects, ensuring safe, reliable, and timely delivery across India.' },
    solutionsIntroServices: [
      { title: 'Site Selection', description: 'Conducting thorough technical assessments and detailed load flow studies to ensure safe, efficient, and compliant project planning outcomes.' },
      { title: 'Government Approvals', description: 'Facilitating project registration and obtaining all required approvals, including Minister NOC, until successful project commissioning.' },
      { title: 'Land Acquisition', description: 'Securing land with clear titles, including cleaning, soil testing, contour surveys, and preparation for construction activities onsite.' },
      { title: 'Civil Foundations', description: 'Developing civil foundations, crane pads, access pathways, and supporting infrastructure required for smooth turbine installation operations.' },
    ],
    coreServices: { sectionLabel: 'Core Services', heading: 'Building Reliable Wind and Solar Infrastructure', description: 'End-to-end solutions for safe, strong, and efficient renewable energy projects.', windSolutions: { title: 'Wind Solutions', description: 'Complete wind project development with strong foundations, electrical systems, and site execution.', points: ['Precision-engineered WTG foundations', 'Heavy-duty crane pad construction', 'HT line and DP yard works'] }, solarSolutions: { title: 'Solar Solutions', description: 'Quality solar installations delivering efficient generation and long-term project reliability.', points: ['Ground-mount structure installation', 'DC and AC electrical works', 'Inverter, SCADA, and monitoring setup'] } },
    impactStats: [{ value: '65%', label: 'Reduction in Electricity Costs' }, { value: '90%', label: 'Energy Independence Achieved' }],
    founderNote: { sectionLabel: "Founder's Note", quote: '"We are committed to delivering reliable renewable projects with trust and integrity. Our focus has always been strong engineering, timely execution, and long-term value creation for every client we serve across the renewable energy sector."', name: 'Balaji', designation: 'Founder & Director' },
    solutionsAchievements: { sectionLabel: 'Our Values', heading: 'Our achievements & strength', description: 'Complete wind and solar solutions delivered with strong engineering and dependable execution.', ctaText: 'Contact Us', items: [{ title: 'India\'s Largest Turbine', description: 'Delivered India\'s largest 4.2MW onsite wind turbine as a complete turnkey project for WEG Brazil.' }, { title: 'Large-Scale Orders', description: 'Successfully executed 300MW foundations, 110MW land acquisition, and 138MW WTG logistics for Sprng Energy.' }, { title: 'Proven Experience', description: 'Since 2005, executed over 2000MW of wind turbine foundations across multiple platforms in India.' }, { title: 'International Presence', description: 'First Indian developer to successfully execute wind turbine foundations in Sri Lanka with OEM Suzlon.' }, { title: 'Regulatory Leadership', description: 'First developer to manage liaisoning under Tamil Nadu CDB Rules 2019 for wind electric generators.' }] },
    solutionsWorkflow: { heading: 'How We Deliver Every Project', ctaText: 'Contact Us', steps: [{ order: '01', title: 'Survey', description: 'Site analysis ensures accurate planning and smooth project execution from start.' }, { order: '02', title: 'Engineering', description: 'Detailed designs optimize safety, strength, and performance for every project requirement.' }, { order: '03', title: 'Construction', description: 'Skilled teams execute civil and electrical works with strict quality standards.' }, { order: '04', title: 'Commissioning', description: 'Final testing verifies complete system readiness and long-term operational reliability.' }] },
    solutionsCTA: { headline: 'Build Your Renewable Energy Project', subtext: 'Partner with us for reliable wind and solar execution backed by strong engineering and experience.', ctaButton1: 'Contact Us', ctaButton2: 'Learn About Us' },
  };

  const contactData = {
    contactHero: { sectionLabel: 'Contact Us', headline: "Let's Talk About Your Next Project", subheadline: 'Join over 100 companies using clean, affordable energy from Balaji & Co. Contact our team for a free assessment.' },
    contactInfoCards: [
      { title: 'Project Inquiries', email: 'hello@balaji-co.com', description: 'Considering your next renewable project with us? Contact us for detailed information about our solutions and financing options.' },
      { title: 'Customer Care', email: 'hello@balaji-co.com', description: 'Need assistance with your renewable system? Our dedicated support team provides 24/7 help for all your needs.' },
    ],
    contactFAQs: { sectionLabel: 'Help Center', heading: 'Frequently Asked Questions', description: 'Browse answers to frequently asked questions about Balaji & Co solutions.', items: [{ question: 'What services does Balaji & Co provide for wind and solar projects?', answer: 'We deliver complete EPC solutions including foundations, crane pads, electrical works, transmission lines, land development, logistics, and site surveys.' }, { question: 'Do you handle full turnkey execution?', answer: 'Yes. We manage everything from land preparation and approvals to civil works, electrical infrastructure, and final commissioning support.' }, { question: 'Which states do you operate in?', answer: 'We work across Tamil Nadu, Karnataka, Andhra Pradesh, Maharashtra, Madhya Pradesh, and have also executed international projects in Sri Lanka.' }, { question: 'What turbine capacities have you worked with?', answer: 'We have delivered foundations and EPC works for 1.25MW, 1.5MW, 2.0MW, 2.2MW, 3.3MW, and 4.2MW turbine platforms.' }, { question: 'How do you ensure quality and safety at project sites?', answer: 'We follow strict QA/QC procedures, use approved materials, perform regular inspections, and maintain zero-incident safety practices across all sites.' }] },
    contactCTA: { prefixLabel: 'Solutions', headline: 'Build Your Renewable Energy Project', subtext: 'Partner with us for reliable wind and solar execution backed by strong engineering and experience.', ctaButton1: 'Contact Us', ctaButton2: 'Learn About Us' },
  };

  for (const { page, data } of [
    { page: 'home', data: homeData },
    { page: 'solutions', data: solutionsData },
    { page: 'contact', data: contactData },
  ]) {
    await PageContent.findOneAndUpdate(
      { page },
      { $set: { page, data } },
      { upsert: true }
    );
  }
  console.log('✅ PageContent seeded (home, solutions, contact) — aligned with framer.md');

  // 3. Showcase Projects — actual Framer projects
  const showcaseSamples = [
    {
      title: 'WEG 4.2 MW Landmark Project', slug: 'weg-4-2mw-wind-turbine-tirunelveli',
      client: 'WEG Industries Pvt. Ltd', location: 'Vadalivilai, Tirunelveli District, Tamil Nadu',
      category: 'Wind EPC – Turnkey', projectDate: new Date('2025-12-14'),
      overview: 'A landmark project involving the AGW 147 – 4.2 MW, one of India\'s largest onsite wind turbines. Balaji & Co delivered this project with full turnkey responsibility.',
      scopeOfWork: ['Complete WTG foundation construction', 'Land development and statutory approvals', 'Site infrastructure and access development', 'End-to-end civil execution support'],
      keyHighlights: ['One of India\'s largest onsite wind turbines', 'Full turnkey execution', 'Zero safety incidents', 'Recognized milestone project in Tamil Nadu'],
      status: 'published' as const, isFeatured: true, order: 1,
    },
    {
      title: 'Regen Powertech Wind Installations', slug: 'regen-powertech-wind-foundations-south-india',
      client: 'Regen Powertech', location: 'Tamil Nadu & Karnataka',
      category: 'Wind Power Foundations', projectDate: new Date('2025-07-21'),
      overview: 'Balaji & Co executed foundation installations for a large fleet of Regen wind turbines across South India, covering varied terrain and soil conditions.',
      scopeOfWork: ['Construction of 168 WTG foundations', 'Turbine rating: 1.5 MW per unit', 'Excavation, reinforcement, concreting, and curing', 'Site logistics and execution planning'],
      keyHighlights: ['Large-volume execution across two states', 'Standardized quality across all sites', 'Efficient material and manpower deployment', 'Smooth coordination across multiple locations'],
      status: 'published' as const, isFeatured: true, order: 2,
    },
    {
      title: 'Gamesa Wind Projects – Karnataka', slug: 'gamesa-wind-projects-karnataka',
      client: 'Gamesa Renewable Pvt. Ltd', location: 'Karnataka',
      category: 'Wind Power Foundations', projectDate: new Date('2025-07-03'),
      overview: 'This project involved complex foundation execution for multiple Gamesa turbine configurations across Karnataka, including eight-wall foundation designs.',
      scopeOfWork: ['Construction of 30 units of 2.0 MW WTGs at Ron, Gadag', 'Execution of 71 eight-wall foundations', 'Excavation, reinforcement, shuttering, and concreting', 'Access roads and turbine movement pathways'],
      keyHighlights: ['Total execution of 101 WTG foundations', 'Handled advanced foundation geometries', 'Delivered across multiple locations', 'Strong compliance with OEM specifications'],
      status: 'published' as const, isFeatured: true, order: 3,
    },
    {
      title: 'ReNew Power Wind Developments', slug: 'renew-power-wind-projects-karnataka',
      client: 'ReNew Power', location: 'Karnataka',
      category: 'Wind Power Foundations', projectDate: new Date('2025-06-23'),
      overview: '',
      scopeOfWork: [], keyHighlights: [],
      status: 'draft' as const, isFeatured: false, order: 4,
    },
  ];

  for (const sample of showcaseSamples) {
    await ShowcaseProject.findOneAndUpdate(
      { slug: sample.slug },
      { $set: sample },
      { upsert: true }
    );
  }
  console.log('✅ ShowcaseProjects seeded (4 Framer projects)');

  // 4. Sample Leads
  const existingLeads = await Lead.countDocuments();
  if (existingLeads === 0) {
    const sampleLeads = [
      { name: 'Vikram Sharma', email: 'vikram@example.com', phone: '+91 99887 76655', service: 'Wind Power EPC', message: 'We are looking for a wind farm EPC contractor for our 30MW project in Rajasthan.', formName: 'framer-contact', source: 'framer' as const, status: 'new' as const },
      { name: 'Priya Nair', email: 'priya.nair@solarcorp.in', phone: '+91 98765 11223', service: 'Solar Power EPC', message: 'Interested in a 50MW solar park installation in Karnataka. Please share your proposal.', formName: 'framer-contact', source: 'framer' as const, status: 'new' as const },
      { name: 'Rajesh Kumar', email: 'rajesh.k@energyindia.com', phone: '+91 87654 33221', service: 'Hybrid Solutions', message: 'Need a consultation for a hybrid wind-solar project. Can we schedule a call?', formName: 'framer-contact', source: 'framer' as const, status: 'contacted' as const, isContacted: true, contactedAt: new Date() },
      { name: 'Anita Desai', email: 'anita@greenpower.co', phone: '+91 77889 44556', service: 'Wind Power EPC', message: 'Looking for O&M services for existing wind turbines in Gujarat.', formName: 'framer-contact', source: 'framer' as const, status: 'contacted' as const, isContacted: true, contactedAt: new Date(), notes: 'Scheduled site visit for next week.' },
      { name: 'Suresh Patel', email: 'suresh@industrialgroup.in', phone: '+91 99001 22334', service: 'Solar Power EPC', message: 'We want to install rooftop solar for our factory in Pune. 500kW capacity.', formName: 'framer-contact', source: 'framer' as const, status: 'closed' as const, isContacted: true, contactedAt: new Date(Date.now() - 7 * 86400000), notes: 'Project awarded. Contract signed.' },
    ];
    await Lead.insertMany(sampleLeads);
    console.log('✅ Leads seeded (5 samples)');
  } else {
    console.log(`Leads already exist (${existingLeads}), skipping.`);
  }

  await mongoose.disconnect();
}

seed().catch(console.error);
