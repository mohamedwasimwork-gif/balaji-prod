export interface Project {
  slug: string;
  title: string;
  category: string;
  date: string;
  image: string;
  client: string;
  location: string;
  overview: string;
  scope: string[];
  highlights: string[];
  status?: 'completed' | 'ongoing';
}

export const PROJECTS: Project[] = [
  {
    slug: 'weg-4-2mw-wind-turbine-tirunelveli',
    title: 'WEG 4.2 MW Landmark Project',
    category: 'Wind EPC – Turnkey',
    date: 'Dec 14, 2025',
    image: '/images/hero-bg.jpg',
    client: 'WEG Industries Pvt. Ltd',
    location: 'Vadalivilai, Tirunelveli District, Tamil Nadu',
    overview:
      'A landmark project involving the AGW 147 – 4.2 MW, one of India\'s largest onsite wind turbines. Balaji & Co delivered this project with full turnkey responsibility.',
    scope: [
      'Complete WTG foundation construction',
      'Land development and statutory approvals',
      'Site infrastructure and access development',
      'End-to-end civil execution support',
    ],
    highlights: [
      "One of India's largest onsite wind turbines",
      'Full turnkey execution',
      'Zero safety incidents',
      'Recognized milestone project in Tamil Nadu',
    ],
    status: 'completed',
  },
  {
    slug: 'regen-powertech-wind-foundations-south-india',
    title: 'Regen Powertech Wind Installations',
    category: 'Wind Power Foundations',
    date: 'Jul 21, 2025',
    image: '/images/project-regen.webp',
    client: 'Regen Powertech Pvt. Ltd',
    location: 'South India',
    overview:
      'Balaji & Co executed foundation installations for a large fleet of Regen wind turbines across South India, covering varied terrain and soil conditions.',
    scope: [
      'Construction of 168 WTG foundations',
      'Turbine rating: 1.5 MW per unit',
      'Excavation, reinforcement, concreting, and curing',
      'Site logistics and execution planning',
    ],
    highlights: [
      'Large-volume execution across two states',
      'Standardized quality across all sites',
      'Efficient material and manpower deployment',
      'Smooth coordination across multiple locations',
    ],
    status: 'completed',
  },
  {
    slug: 'gamesa-wind-projects-karnataka',
    title: 'Gamesa Wind Projects – Karnataka',
    category: 'Wind Power Foundations',
    date: 'Jul 3, 2025',
    image: '/images/project-gamesa.webp',
    client: 'Gamesa Wind Turbines Pvt. Ltd',
    location: 'Karnataka',
    overview:
      'This project involved complex foundation execution for multiple Gamesa turbine configurations across Karnataka, including eight-wall foundation designs.',
    scope: [
      'Construction of 30 units of 2.0 MW WTGs',
      'Execution of 71 eight-wall foundations',
      'Excavation, reinforcement, shuttering, and concreting',
      'Access roads and turbine movement pathways',
    ],
    highlights: [
      'Total execution of 101 WTG foundations',
      'Handled advanced foundation geometries',
      'Delivered across multiple locations',
      'Strong compliance with OEM specifications',
    ],
    status: 'completed',
  },
  {
    slug: 'renew-power-wind-projects-karnataka',
    title: 'ReNew Power Wind Developments',
    category: 'Wind Power Foundations',
    date: 'Jun 23, 2025',
    image: '/images/H2IlCMMmRklSFMpvMe1avxyrc8.webp',
    client: 'ReNew Power Pvt. Ltd',
    location: 'Karnataka',
    overview:
      'Balaji & Co executed large-scale wind turbine foundation works for ReNew Power across Karnataka, delivering complex civil execution with reliable quality and on-time completion.',
    scope: [
      'WTG foundation construction',
      'Crane pad and access road development',
      'Electrical infrastructure support',
      'Site logistics and coordination',
    ],
    highlights: [
      'Delivered across multiple wind farm sites',
      'Strict compliance with OEM requirements',
      'Zero safety incidents throughout execution',
      'On-time project completion',
    ],
    status: 'completed',
  },
  {
    slug: 'suzlon-wind-projects-tamil-nadu',
    title: 'Suzlon Wind Farm – Tamil Nadu',
    category: 'Wind Power Foundations',
    date: 'Mar 10, 2025',
    image: '/images/intro-foundations.jpg',
    client: 'Suzlon Energy Ltd',
    location: 'Tirunelveli, Tamil Nadu',
    overview:
      'Balaji & Co executed civil foundation works for Suzlon S111 wind turbines across Tirunelveli district, delivering high-quality construction under challenging terrain conditions.',
    scope: [
      'Construction of 45 WTG foundations',
      'Turbine rating: 2.1 MW per unit',
      'Excavation, reinforcement, and concreting',
      'Internal roads and crane pad development',
    ],
    highlights: [
      'Completed ahead of schedule',
      'Complex terrain management',
      'Zero safety incidents',
      'Strong OEM compliance throughout',
    ],
    status: 'completed',
  },
  {
    slug: 'adani-solar-epc-rajasthan',
    title: 'Adani Wind EPC – Rajasthan',
    category: 'Wind EPC – Turnkey',
    date: 'Jan 18, 2025',
    image: '/images/intro-solar.jpg',
    client: 'Adani Green Energy Ltd',
    location: 'Jodhpur, Rajasthan',
    overview:
      'End-to-end wind EPC execution for a 50 MW wind power plant in Rajasthan, covering civil, structural, electrical, and commissioning works.',
    scope: [
      'Complete WTG foundation construction for 50 MW capacity',
      'DC and AC cabling works',
      'Inverter and transformer installation',
      'Grid connectivity and commissioning',
    ],
    highlights: [
      '50 MW capacity successfully commissioned',
      'Completed within budget and timeline',
      'Full turnkey delivery',
      'Meets international quality benchmarks',
    ],
    status: 'completed',
  },
  // NEW COMPLETED PROJECTS
  {
    slug: 'nordex-india-wind-projects-mulanur',
    title: 'Nordex Wind Projects – Mulanur',
    category: 'Wind Power Foundations',
    date: 'Nov 12, 2024',
    image: '/images/project-regen.webp',
    client: 'Nordex India Pvt. Ltd.',
    location: 'Mulanur, Tamil Nadu',
    overview:
      'Civil foundations for 3.0 MW WTG, including acquisition of land, approvals, crane pads and pre-assembly slabs for a total capacity of 300MW at Mulanur.',
    scope: [
      'Civil foundations for 3.0 MW WTGs',
      'Land acquisition and statutory approvals',
      'Crane pads and pre-assembly slabs construction',
      'Site development and infrastructure support',
    ],
    highlights: [
      'Total capacity of 300 MW',
      'Located in Mulanur, Tamil Nadu',
      'Acquisition of land and full regulatory approvals',
      'Completed to strict Nordex engineering specifications',
    ],
    status: 'completed',
  },
  {
    slug: 'tata-power-wind-karur',
    title: 'Tata Power Wind Project – Karur',
    category: 'Wind Power Foundations',
    date: 'Sep 25, 2024',
    image: '/images/hero-bg.jpg',
    client: 'Tata Power Company Ltd.',
    location: 'Karur, Tamil Nadu',
    overview:
      'Construction of 27 units of SGRE 3.6 MW foundations for a 201.6 MW project at Karur, Tamil Nadu.',
    scope: [
      'Construction of 27 units of SGRE 3.6 MW WTG foundations',
      'Full excavation, steel reinforcement and civil foundation works',
      'Strict quality checks and structural concrete pouring',
      'Site readiness and technical execution management',
    ],
    highlights: [
      'Total project capacity of 201.6 MW',
      'Supports high-capacity SGRE 3.6 MW wind turbines',
      'Located in the wind-energy hub of Karur, Tamil Nadu',
      'Delivered with exceptional quality and structural integrity',
    ],
    status: 'completed',
  },
  {
    slug: 'sprng-energy-wind-karur',
    title: 'Sprng Energy Wind Project – Karur',
    category: 'Wind Power Foundations',
    date: 'Aug 18, 2024',
    image: '/images/project-gamesa.webp',
    client: 'Sprng Energy Pvt. Ltd.',
    location: 'Karur, Tamil Nadu',
    overview:
      'Construction of 16 units of EN3.3 MW WTG foundations, including crane pads and boom assemblies, Roads at karur, tamilnadu.',
    scope: [
      'Construction of 16 units of EN3.3 MW WTG foundations',
      'Crane pads and boom assembly areas construction',
      'Access roads development for heavy machinery movement',
      'Civil works and foundation structural shuttering',
    ],
    highlights: [
      'Supports EN3.3 MW wind turbine rating',
      'Located in Karur, Tamil Nadu',
      'Includes vital transport road networks and boom assemblies',
      'Zero safety incidents throughout the execution lifecycle',
    ],
    status: 'completed',
  },
  // ONGOING PROJECTS
  {
    slug: 'jindal-renewables-koppal',
    title: 'Jindal Green Wind 1 Project',
    category: 'Wind Power Civil Works',
    date: 'Onboard - Yet to Complete',
    image: '/images/hero-bg.jpg',
    client: 'Jindal Green Wind 1 Pvt. Ltd.',
    location: 'Koppal District, Karnataka',
    overview:
      'Civil works for 48 WTG foundations and a Unit Substation for the Jindal Green Wind 1 Pvt. Ltd. project.',
    scope: [
      'Civil works for 48 WTG foundations',
      'Unit Substation civil construction',
      'Land leveling and subgrade preparation',
      'Reinforcement and foundation casting',
    ],
    highlights: [
      'Project Owner: Jindal Renewables',
      'Located in Koppal District, Karnataka',
      'Active civil works phase',
      'Adheres to modern wind farm engineering standards',
    ],
    status: 'ongoing',
  },
  {
    slug: 'tata-power-sjvn-bop-karur',
    title: 'Tata Power Renewable Energy Pvt. LTD 93.6 MW Wind Project (BOP)',
    category: 'Balance of Plant - BOP Work',
    date: 'Onboard - Yet to Complete',
    image: '/images/project-regen.webp',
    client: 'Tata Power Renewable Energy Ltd.',
    location: 'Karur, Tamil Nadu',
    overview:
      'BOP works for the 93.6 MW SJVN Wind Power Project in Karur, Tamil Nadu, including land for material movement and related activities, statutory approvals, and security services for WTG locations until commissioning.',
    scope: [
      'Balance of Plant (BOP) execution works',
      'Land procurement and facilitation for material movement',
      'Statutory and government regulatory approvals',
      'Security services for all WTG locations until official commissioning',
    ],
    highlights: [
      'Project capacity of 93.6 MW',
      'Partner: Tata Power Renewable Energy Ltd.',
      'Location: Karur, Tamil Nadu',
      'Ensuring continuous site security and logistics facilitation',
    ],
    status: 'ongoing',
  },
  {
    slug: 'tata-power-sjvn-wtg-palayam',
    title: 'Tata Power Renewable Energy Pvt.LTD 264.6 MW Wind Project (WTG)',
    category: 'Wind Power Foundations',
    date: 'Onboard - Yet to Complete',
    image: '/images/project-gamesa.webp',
    client: 'Tata Power Renewable Energy Ltd.',
    location: 'Palayam Site, Tamil Nadu',
    overview:
      'Construction of 42 nos. 3.15 MW Suzlon WTG foundations for the SJVN FDRE 264.6 MW project at Palayam site, Tamil Nadu.',
    scope: [
      'Construction of 42 nos. 3.15 MW Suzlon WTG foundations',
      'Excavation, reinforcement steel binding, shuttering and concreting',
      'Adherence to Suzlon technical and design guidelines',
      'Site preparation and crane hardstand coordination',
    ],
    highlights: [
      'Total capacity of 264.6 MW',
      'Utilizes advanced Suzlon 3.15 MW wind turbine generators',
      'Location: Palayam, Tamil Nadu',
      'Critical foundation construction phase in progress',
    ],
    status: 'ongoing',
  },
  {
    slug: 'sunsure-energy-bijapur',
    title: 'Sunsure 300 MW Wind Farm',
    category: 'Wind Power Foundations',
    date: 'Onboard - Yet to Complete',
    image: '/images/H2IlCMMmRklSFMpvMe1avxyrc8.webp',
    client: 'Sunsure Energy Ltd.',
    location: 'Korwar Village, Bijapur District, Karnataka',
    overview:
      'Construction of 80 nos. 3.15 MW Suzlon WTG foundations for the 300 MW project at Korwar village, Devar Hirpargi taluk, Bijapur district, Karnataka.',
    scope: [
      'Construction of 80 nos. 3.15 MW Suzlon WTG foundations',
      'High-volume foundation civil construction and reinforcement',
      'Subgrade stabilization and structural shuttering',
      'Logistics management for heavy material movement',
    ],
    highlights: [
      'Total capacity of 300 MW',
      'Location: Korwar Village, Devar Hirpargi Taluk, Bijapur District, Karnataka',
      'Features 80 massive Suzlon 3.15 MW WTG installations',
      'Undergoing active construction and material mobilization',
    ],
    status: 'ongoing',
  },
  {
    slug: 'heft-energy-karur',
    title: 'Heft Energy 148.4 MW Wind Project',
    category: 'Wind Power Foundations',
    date: 'Onboard - Yet to Complete',
    image: '/images/intro-foundations.jpg',
    client: 'Heft Energy Pvt. Ltd.',
    location: 'Karur District, Tamil Nadu',
    overview:
      'Construction of 28 nos. 5.3 MW Venwind WTG foundations for the 148.4 MW project in Karur district, Tamil Nadu.',
    scope: [
      'Construction of 28 nos. 5.3 MW Venwind WTG foundations',
      'Heavy civil engineering for 5.3 MW high-capacity wind turbines',
      'Foundation reinforcement steel fabrication and pouring',
      'Site preparation, soil testing and compaction',
    ],
    highlights: [
      'Total project capacity of 148.4 MW',
      'High-capacity 5.3 MW Venwind wind turbine platform',
      'Location: Karur District, Tamil Nadu',
      'Complex structural design execution in progress',
    ],
    status: 'ongoing',
  },
  {
    slug: 'tata-power-pss-karur',
    title: 'Tata Power (PSS)',
    category: 'Power System Substation (PSS)',
    date: 'Onboard - Yet to Complete',
    image: '/images/project-regen.webp',
    client: 'Tata Power Company Ltd.',
    location: 'Karur, Tamil Nadu',
    overview:
      'Civil works for Power System Substation (PSS), including the construction of the Operations and Maintenance (O&M) building, switchgear shed, approach roads, and boundary fencing in Karur, Tamil Nadu.',
    scope: [
      'Civil works for Power System Substation (PSS)',
      'Construction of Operations and Maintenance (O&M) building',
      'Construction of switchgear shed',
      'Construction of approach roads and pathways',
      'Installation of boundary fencing and security perimeter',
    ],
    highlights: [
      'Grid infrastructure execution support',
      'Located in the wind energy hub of Karur, Tamil Nadu',
      'Meets strict industrial utility safety standards',
      'O&M and security boundary infrastructure included',
    ],
    status: 'ongoing',
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
