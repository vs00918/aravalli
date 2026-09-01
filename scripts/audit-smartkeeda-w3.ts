import fs from 'fs';

const reg = JSON.parse(fs.readFileSync('./data/banking-ca-registry.json', 'utf8'));
const augTopics = Object.values(reg.topics).filter((t: any) => t.chronologicalMonth === '2026-08');

console.log('Total Existing August Topics:', augTopics.length);

const candidateItems = [
  { id: 1, title: 'Poshan Tracker App 2.0 (MoWCD) & Protocol for Malnutrition' },
  { id: 2, title: 'SEZ Exports FY26: ₹16.36 Lakh Crore (Gujarat #1)' },
  { id: 3, title: 'Supreme Court 10-km Buffer Zone for Notified Wetlands & Glaw Lake (101st Ramsar Site)' },
  { id: 4, title: 'Ladakh 1st High-Altitude Wildlife Safari (SHAN Society)' },
  { id: 5, title: 'National Scholarship Portal (NSP)-DBT for Agriculture Students (ICAR-IARI)' },
  { id: 6, title: 'NABL (QCI) Accreditation Scheme for Mobile Food Testing Labs' },
  { id: 7, title: 'Gramin Gyan Setu App (Gandhinagar Libraries)' },
  { id: 8, title: 'India Optel Ltd (IOL) Launches Indigenous GARUD Binoculars' },
  { id: 9, title: 'FSSAI Draft Thresholds for High Added Fat, Sugar & Salt (HFSS) in School Foods' },
  { id: 10, title: 'Asia 1st Desert-Themed Drive-Through Night Safari (Juna Deesa, Banaskantha)' },
  { id: 11, title: 'Revamped India Code Portal (Multilingual AI Legal Gateway)' },
  { id: 12, title: '80th Independence Day: 150 Years of Vande Mataram & PM 13th Address' },
  { id: 13, title: 'RSVC-AMRIT Platform (NABARD + Office of PSA for Rural Tech)' },
  { id: 14, title: 'Parichha Weir (Jhansi, Betwa River) Designated World Heritage Irrigation Structure (WHIS)' },
  { id: 15, title: 'Sprite Tejas Express (1st Commercial Brand Named Train)' },
  { id: 16, title: 'Jal Jeevan Mission (JJM) 7-Year Milestone: 82% Coverage & JJM 2.0 to 2028 (₹8.69 Lakh Cr)' },
  { id: 17, title: 'CYBER KUSHTI 2026 Hackathon (NIELIT + CERT-In)' },
  { id: 18, title: 'MIDHANI Secures GE Aerospace S400 Metallic Material Lab Approval' },
  { id: 19, title: 'National Framework & Operational Guidelines for ITDAs & ITDPs (MoTA + NITI Aayog)' },
  { id: 20, title: 'MoI&B Removes 12-Minute-Per-Hour TV Advertisement Cap' },
  { id: 21, title: 'Shakti ki Sapt Dhara: 7-Point Development Framework for Viksit Bharat@2047' },
  { id: 22, title: 'Vibrant Civil Defence Network & Civil Defence Volunteer Force' },
  { id: 23, title: 'ASI Delists 18 Protected Monuments (AMASR Act Section 35)' },
  { id: 24, title: 'Census 2027: 40-Question Household Schedule & 1st Independent India Caste Survey' },
  { id: 25, title: 'RSSDI Diabetes Rural Outreach Portal & VISHWAS Video Library' },
  { id: 26, title: 'India 1st Guide to Grasslands & Open Natural Ecosystems (ONEs) at UNCCD COP17' },
  { id: 27, title: 'Suryapath Tiranga Global Flag Relay (54 Indian Missions)' },
  { id: 28, title: 'India Peacock Diplomacy: 5 Peacocks Donated to UN Office at Geneva (UNOG)' },
  { id: 29, title: 'Lebanon Abolishes Death Penalty (1st Arab Country)' },
  { id: 30, title: '1st India-Israel Hackathon on Restorative Healthcare (Jerusalem)' },
  { id: 31, title: 'RBI Draft Guidelines: On-Tap Licensing of Urban Cooperative Banks (UCBs)' }, // DUP with existing
  { id: 32, title: 'Indian Bank Unified MSME Portal & ₹500 Cr Credit Outreach' },
  { id: 33, title: 'Repco Bank Pays ₹22.90 Cr Dividend to Government (30% Dividend)' }, // DUP/Corroboration with REPCO
  { id: 34, title: 'EXIM Bank Replaces RBI for Export Credit Interest Subvention (EPM)' }, // DUP with existing
  { id: 35, title: 'MoSPI Adopts Producer Price Index (PPI) & Double Deflation Method for GDP' }, // DUP with existing
  { id: 36, title: 'CPI Inflation July 2026 on Base 2024=100 (4.45% YoY)' }, // DUP with existing
  { id: 37, title: 'SEBI Consultation Paper: Mandatory Colour-Coded Credit Risk-o-Meter for Debt Securities' },
  { id: 38, title: 'CBDT FAST-DS 2026: Foreign Assets of Small Taxpayers Disclosure Scheme' },
  { id: 39, title: 'RBI Fortnightly Data: Bank Deposits Grow 15.4% (Highest Since 2016) & FCNR(B) $36.7B' },
  { id: 40, title: 'Windfall Tax on Petrol Cut to Zero (Diesel ₹24/L, ATF ₹19.5/L)' },
  { id: 41, title: 'RBI Penalises IndusInd Bank (₹59.20 Lakh) & 3 NBFCs (Synthetic Securitisation)' },
  { id: 42, title: 'SEBI Draft Settlement Regulations 2026: Fast-Track Route for Cases up to ₹10 Lakh' }, // DUP with existing
  { id: 43, title: 'IMF World Economic Outlook: Government Debt-to-GDP Projections 2026 (Japan #1 204.4%, India $3.46T #8)' },
  { id: 44, title: 'SEBI Incident Reporting Portal (FSB FIRE Format) & Cyber Suraksha Portal' },
  { id: 45, title: 'YES BANK YES Essence Credit Card for Salaried Women' },
  { id: 46, title: 'Qatar Post + India Post Launch PosTransfer Powered by UPI' },
  { id: 47, title: 'Exercise Udara Shakti 2026 (IAF & RMAF Malaysia)' },
  { id: 48, title: 'CSL Delivers MS Maria (2nd HS EcoFreighter MPV to Germany)' },
  { id: 49, title: 'INS Sudarshini Lokayan 2026 (Ponta Delgada, Azores, Portugal)' },
  { id: 50, title: 'MoD ₹1,577 Cr Contracts for Loiter Munitions with TASL & NIBE' },
  { id: 51, title: 'Divyastra Mk3 Indigenous Jet-Powered Loitering Munition (Kawa UAV)' },
  { id: 52, title: 'Exercise MAITREE-XV (India-Thailand Joint Military Exercise, Surat Thani)' },
  { id: 53, title: 'Sinquefield Cup 2026 (Praggnanandhaa Defeats Sindarov)' },
  { id: 54, title: 'MoYA&S Suspends Recognition of Table Tennis Federation of India (TTFI)' },
  { id: 55, title: 'Iga Swiatek Wins Canadian Open 2026 (Career Sweep of 5 North American WTA Titles)' },
  { id: 56, title: 'Magnus Carlsen Wins Esports World Cup 2026 Chess Title Back-to-Back' },
  { id: 57, title: 'Commonwealth Fencing Championships 2026: India Wins Maiden Title & Wilkinson Sword Trophy (35 Medals)' },
  { id: 58, title: 'ITU Generation Connect Youth Envoys 2026-2030 (3 Sanchar Mitras Selected)' },
  { id: 59, title: 'Damascus Court Sentences Bashar al-Assad to Death in Absentia' },
  { id: 60, title: 'Guinness World Record Skydive with National Flags (Benghazi, Libya)' },
  { id: 61, title: 'NASA Invites ISRO to Artemis Moon Base Programme' },
  { id: 62, title: 'IN-SPACe & Allied Orbits: India 1st Commercial Earth Observation (EO) Constellation (12 Satellites)' },
  { id: 63, title: 'Vyoma.AI (L&T) Secures ₹10,000-15,000 Cr Nvidia B300 AI Factory from Together AI' },
  { id: 64, title: 'IISc SPIRE Lab Releases SraVaani Open-Source 65-Language ASR Speech AI Model' },
  { id: 65, title: 'SUPARCO (Pakistan) Names 1st Lunar Rover Jinnah-1 (China Chang’e-8 Mission)' },
  { id: 66, title: 'SpaceX Sets 38-Minute Record Between Dual Falcon 9 Orbital Launches' },
  { id: 67, title: 'Aheesa Digital VIHAAN SoC Silicon Success (MeitY DLI Scheme)' },
  { id: 68, title: 'Dr. Bhooma V.G. Appointed VC of AIPSI Mauritius' },
  { id: 69, title: 'Former CJI D.Y. Chandrachud Appointed Arbitrator in Russia-Ukraine Oschadbank Dispute' },
  { id: 70, title: 'N. Chandrasekaran to Step Down as Tata Sons Chairman in Feb 2027' },
  { id: 71, title: 'Hakainde Hichilema Re-elected President of Zambia (2nd 5-Year Term)' },
  { id: 72, title: 'Shabnam Sinha Appointed Chairperson of Airtel Payments Bank' },
  { id: 73, title: 'Sarvottam Jeevan Raksha Padak Conferred on 12 Silkyara Tunnel Rat Miners' },
  { id: 74, title: 'Dr. M.S. Swaminathan Award for Environment Protection 2026 (P. Pechiyammal & Govindhammal)' },
  { id: 75, title: 'GeM 10th Foundation Day & GeM 2.0 Announcement (UP #1 State Buyer)' }, // DUP/Corroboration
  { id: 76, title: 'Gaj Gaurav Awards 2026 on World Elephant Day (Visakhapatnam)' },
  { id: 77, title: 'Dr. Padma Gurmet Conferred UT Ladakh State Award for Sowa-Rigpa' },
  { id: 78, title: 'Sangeet Natak Akademi Fellowships & Awards (7 Fellows & 115 Artists)' },
  { id: 79, title: 'MHA Gallantry & Service Medals for 80th Independence Day (1,057 Personnel)' },
  { id: 80, title: 'National Anubhav Awards 2026 (DoPPW & Pension Mitra Handbook)' },
  { id: 81, title: 'PMIS Industry Awards (Mahindra & Mahindra Overall Champion)' },
  { id: 82, title: 'General Dhiraj Seth Conferred Honorary Rank of General of Nepali Army' },
  { id: 83, title: 'PM E-DRIVE Scheme Extended to March 2028 (Outlay Raised to ₹11,900 Cr)' },
  { id: 84, title: 'PM Vishwakarma Scheme: 100 Artisans Invited as Special Guests for Independence Day' },
  { id: 85, title: 'PM-RKVY & Krishonnati Yojana: ₹605.71 Cr Allocated to Rajasthan & Telangana' },
  { id: 86, title: 'Karnataka Sandhya Kiran Cashless Healthcare Scheme for Pensioners (₹5 Lakh Cover)' },
  { id: 87, title: 'CBDC-Based DBT under PMGKAY Launched in Chandigarh and Dadra & Nagar Haveli' },
  { id: 88, title: 'AB-PMJAY Launched in West Bengal (36th State/UT to Adopt)' },
  { id: 89, title: 'Karnataka Vidyarthi Sahayahasta Scheme (7.5% Internal Rural Reservation)' },
  { id: 90, title: 'Randstad Employer Brand Research 2026 (Google #1 Employer Brand in India)' },
  { id: 91, title: 'MoSPI PLFS Quarterly Bulletin April-June 2026 (UR 5.4%, Youth UR 15.9%)' },
  { id: 92, title: 'NITI Aayog Identifies 4 High-Potential Sectors for Global Manufacturing Hub' },
  { id: 93, title: 'NITI Aayog Report on Regulatory Regime in Professional Services' },
  { id: 94, title: 'White House Report "The Great Transshipment Scam" (Peter Navarro)' },
  { id: 95, title: 'National Co-operative Development Corporation (NCDC) Amendment Bill 2026' }, // DUP with existing
  { id: 96, title: 'Tribunals Reforms Bill 2026 Passed by Parliament (National Tribunals Commission)' },
  { id: 97, title: 'Mineral Exchange Rules 2026 & Electronic Mineral Trading Exchange (IBM)' },
  { id: 98, title: 'Taxation and Other Laws (Amendment) Bill 2026: Enabling Provision for UPI / Digital Payment Charges' },
  { id: 99, title: 'MoSPI Signs MoUs with IDEAS & ISI Kolkata for GDP Nowcasting' },
  { id: 100, title: 'MSME & DPIIT MoU for Bharat GI Commercialisation & ONDC Onboarding' },
  { id: 101, title: 'Airtel Business & ITI Ltd Strategic Collaboration for Enterprise Telecom' },
  { id: 102, title: 'DIBD (MeitY) & NITI Aayog SoI for BHASHINI Voice AI Integration' },
  { id: 103, title: 'PCIM&H & IPC Renew One Herb One Standard MoU for 3 Years' },
  { id: 104, title: 'India & SACU Sign Terms of Reference for Preferential Trade Agreement (PTA)' },
  { id: 105, title: 'MCX & NISM Establish MCX-NISM Centre for Commodity Markets' },
  { id: 106, title: 'BHEL & Hystar AS (Norway) Partner for PEM Electrolyser Manufacturing' },
  { id: 107, title: 'DGPC (Bhutan) & JSW Neo Energy 920 MW Punatsangchhu-III Hydro Project SHA' },
  { id: 108, title: 'Andhra Pradesh & CSIR-NGRI ₹140 Cr Lithium & Gallium Exploration in Kadapa' },
  { id: 109, title: 'NIIMH & SEMIRI (Kerala) MoU for AYUSH Manuscript Digitisation' },
  { id: 110, title: 'ISMA & ICAR-ISRI Establish Advanced Sugarcane Seed Production Centre (Lucknow)' },
  { id: 111, title: 'Tata Power & IIT Bombay Master Research Agreement (MRA)' },
  { id: 112, title: 'Reliance Industries & Rolls-Royce Partner for AMCA Mk2 Combat Jet Engine' }
];

console.log('=== DEDUPLICATION AUDIT AGAINST EXISTING AUGUST CANONICAL CORPUS ===');
const duplicates: any[] = [];
const netNew: any[] = [];

candidateItems.forEach(item => {
  const match = augTopics.find((t: any) => {
    const tTitle = t.title.toLowerCase();
    const cTitle = item.title.toLowerCase();
    // Keywords matching
    if (cTitle.includes('on-tap licensing') && tTitle.includes('on tap')) return true;
    if (cTitle.includes('export credit') && tTitle.includes('export credit') && tTitle.includes('exim')) return true;
    if (cTitle.includes('producer price index') && tTitle.includes('producer price index')) return true;
    if (cTitle.includes('cpi inflation') && tTitle.includes('cpi inflation')) return true;
    if (cTitle.includes('settlement regulations') && tTitle.includes('settlement regulations')) return true;
    if (cTitle.includes('ncdc') && tTitle.includes('ncdc')) return true;
    if (cTitle.includes('gem') && tTitle.includes('gem') && tTitle.includes('10th')) return true;
    if (cTitle.includes('repco') && tTitle.includes('repco')) return true;
    return false;
  });

  if (match) {
    duplicates.push({ item, matchedWith: (match as any).title, slug: (match as any).slug });
  } else {
    netNew.push(item);
  }
});

console.log(`Duplicates / Corroborations Found: ${duplicates.length}`);
duplicates.forEach(d => console.log(`  - [Item ${d.item.id}] "${d.item.title}" -> Matched: "${d.matchedWith}"`));
console.log(`\nNet New Topics: ${netNew.length}`);
