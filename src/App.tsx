import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import confetti from 'canvas-confetti'

/* ============================================================
   THE REVENUE ROOM - Landing Page
   ============================================================ */

// --- Data ---
const modules = [
  {
    num: '01',
    week: 1,
    date: 'Sept 14',
    title: 'Clarity Kickoff',
    tagline: 'Get an honest baseline on where your sales actually stand, and build a pitch that earns attention.',
    body: 'We start with the truth: what you are selling, who you are selling it to, and how those conversations are really going. No sugarcoating. You capture a Day 1 baseline and a Revenue Index score that everything else gets measured against, then build and record the 60-second pitch you will use for the rest of the program.',
    outcome: 'Walk away with: A Day 1 baseline, your Revenue Index score, a recorded 60-second pitch, and a personal goal matrix for the seven weeks.',
  },
  {
    num: '02',
    week: 2,
    date: 'Sept 21',
    title: 'Know Your Waters',
    tagline: 'Sharpen your ICP, learn to qualify, and build a target list that is genuinely validated.',
    body: 'Most founders sell to anyone who will listen. This week you audit your last three sales conversations for the pattern, sharpen your ICP and buyer persona, segment accounts as Whale, Dolphin or Fish, map the stakeholders inside them, and learn BANT qualification so you stop losing hours to people who were never going to buy.',
    outcome: 'Walk away with: A validated ICP and buyer persona, a 10-account target list that clears the validation bar, and a 40-account watch list.',
  },
  {
    num: '03',
    week: 3,
    date: 'Sept 28',
    title: 'The Engine Room',
    tagline: 'Build the system: pipeline stages, pipeline math, and a tracker you will actually keep current.',
    body: 'Build the car before you try to drive it. You design your pipeline stages from first touch to closed-won with verifiable exit criteria, run the math on coverage so you know how much has to be in the funnel to hit your number, then stand up the right-sized tool. Most founders start with a structured tracker and graduate to a CRM when the volume demands it.',
    outcome: 'Walk away with: Pipeline stages with exit criteria, your own pipeline math and coverage ratio, and a live tracker or CRM with your targets loaded.',
  },
  {
    num: '04',
    week: 4,
    date: 'Oct 5',
    title: 'First Contact',
    tagline: 'Now learn to drive it: outreach that earns replies and discovery that uncovers real need.',
    body: 'The system is built, so this is the week the real conversations start. You choose your methodology from BANT, SPIN, MEDDPICC and Challenger, write outreach on the Problem-Value-CTA framework, design a follow-up sequence that does not depend on you remembering, and use AI to prospect at scale without losing your own voice.',
    outcome: 'Walk away with: A discovery script built on BANT and SPIN, a three-touch outreach sequence sent to a 20-account wave, and an AI-assisted prospecting system.',
  },
  {
    num: '05',
    week: 5,
    date: 'Oct 12',
    title: "Deal-Maker's Lab",
    tagline: 'Handle objections without freezing, read the buying signals, and ask for the close.',
    body: 'The live practice week. You run real discovery calls, work your top five objections through the A.R.Q. framework in Objection Island, play the Wrong Audience Game to find the true buyer among five personas, and practice closing in a way that feels natural rather than pushy. Peers give live feedback.',
    outcome: 'Walk away with: An objection playbook for your top 5 objections, a closing approach you can actually run, and real reps with peer feedback.',
  },
  {
    num: '06',
    week: 6,
    date: 'Oct 19',
    title: 'Sales Math & Optimization',
    tagline: 'Read your numbers the way a sales leader does, and know exactly what to fix next.',
    body: 'We turn your pipeline into a dashboard: conversion by stage, deal velocity, CAC, LTV and coverage. You retake the Revenue Index against your Week 1 baseline to see precisely what moved, run your first optimization experiment, and work through whether the numbers say you are ready for a first sales hire.',
    outcome: 'Walk away with: A live KPI dashboard, a forecast you can defend, your Revenue Index before-and-after, and an honest read on your first sales hire.',
  },
  {
    num: '07',
    week: 7,
    date: 'Oct 26',
    title: 'Sales Plan Review',
    tagline: 'Present your sales plan the way a real business reviews its numbers, and defend it under real questions.',
    body: "Review week. You compile everything into your Sales Engine Playbook and bring it into a live sales plan review: a concise deck of 10 slides or fewer covering your top targets, what each one is worth, where it stands, the activities moving it, and your plan for next quarter. This is not a scripted read-through. Irene and Chris question you on every slide, so you prepare and dry-run beforehand and walk in ready, not caught off guard by the easy questions. Think of it as presenting to your boss's boss: how you make the quarter look reflects on you, so it is in your interest as the founder or manager to have the answers tight before you are in the room. It is not sequential, it is a dialogue. We pick apart the weak spots in your plan together, which is exactly what sharpens you as a salesperson, and you walk out knowing more than when you walked in.",
    outcome: 'Walk away with: Your complete Sales Engine playbook, a rehearsed sales plan review you can defend under real questions, mentor feedback, and a peer network that keeps you accountable.',
  },
]

const founderFaqs = [
  { q: 'Who is this for?', a: 'B2B founders and high-ticket service businesses doing their own sales, roughly pre-revenue through $250K ARR. If you have customer conversations happening but no repeatable system for turning them into revenue, this is built for you.' },
  { q: 'What if I have zero sales experience?', a: 'That is exactly who this is built for. Sales is a skill with its own tools and techniques, and most founders were never taught them. We build from first principles, including a plain-language glossary of the terms you are expected to already know, so nobody has to nod along to words like pipeline, qualification, or forecast. Most founders in the Revenue Room are technical or domain experts with no formal sales training.' },
  { q: 'How much time per week?', a: 'Plan for 2.5 to 3 hours: a 90-minute live session plus homework, peer check-ins, and CRM setup work. Most founders say the structure actually saves them time because they stop context-switching on sales.' },
  { q: 'Is this live or self-paced?', a: 'Fully live and virtual. One 90-minute session per week over Zoom with your cohort, plus your worksheets, readings, and submissions inside the Revenue Room learning platform. Recordings are available if you miss a session, but the real value is in the live interaction.' },
  { q: 'What is the beta cohort size?', a: 'Capped at 8 founders for the beta. It is deliberately small so Irene and Chris can work directly with every founder. Small enough for real feedback, real practice, and real accountability.' },
  { q: 'Do I need a CRM already?', a: 'No, and you may not need one yet. In Week 3 we right-size the tool to where you actually are: most early founders start with a structured tracker for the accounts they are really working and graduate to a CRM when the volume demands it. If you already have one, we will audit and configure it properly. We are CRM-agnostic. The frameworks work with HubSpot, Pipedrive, Close, Attio, or a well-built spreadsheet.' },
  { q: 'What happens after I submit interest?', a: 'Submitting interest is not a commitment. First, we send you a short pre-qualification assessment so we can understand where you are. Next, you book a review call with the team. If the Revenue Room is the right fit, we walk through the ways founders fund a seat. If it is not the right fit right now, no worries, we will check in with you before every cohort to see if the timing and qualification are right.' },
  { q: 'How does pricing work?', a: 'The Revenue Room is a paid program, and there is more than one way to cover a seat. Most founders fund it themselves out of their operating or growth budget. Others have it covered by an accelerator, an incubator, an ecosystem or corporate sponsor, an investor, or a provincial training grant. On your review call we work through which route fits you. Pricing is shared on that call.' },
  { q: 'What happens after the 7 weeks?', a: 'You keep your complete Sales Engine Playbook forever, along with the sales plan review format you can run every quarter and all future playbook updates. Your Revenue Index diagnostic gives you a before-and-after snapshot of your progress.' },
  { q: 'What is the refund policy?', a: 'A full refund is available through the end of Week 1 if the program is not the right fit. After Week 1, all seats are non-refundable. What you build here only works if you build it, and we ask for your full commitment once you are past that first week. It also lets us offer the seat to another founder while the cohort is still early.' },
  { q: 'What do I walk away with?', a: 'A complete, documented sales architecture: a validated ICP and target list, a pipeline with exit criteria and coverage math, a configured CRM or tracker, outreach and follow-up sequences, a discovery script built on BANT and SPIN, an objection playbook, a closing approach, a KPI dashboard, and a Sales Engine Playbook you present in your Week 7 sales plan review.' },
]

const sponsorFaqs = [
  { q: 'What does sponsoring a cohort mean?', a: 'You fund seats for founders in your ecosystem. They get the full Revenue Room experience, and you get measurable outcomes: pipeline created, deals closed, revenue generated. Plus brand visibility and first access to high-potential founders building real sales systems.' },
  { q: 'We are a university or college. Can we sponsor our startups?', a: 'Yes, and it is one of our favourite routes. If you run an entrepreneurship centre, an incubator, or a startup studio inside a post-secondary institution, you can sponsor a block of seats for the founders in your programs. We coordinate with your program lead on nominations and report back on cohort outcomes.' },
  { q: 'What are the sponsorship tiers?', a: 'Three tiers: Community/Partner at $1,500 per seat (for smaller incubators and mission-aligned orgs), Standard at $1,950 per seat (for mid-sized accelerators and economic development agencies), and Enterprise at $2,500+ per seat (for large corporates, banks, and national programs). Beta cohort sponsors receive a 50% discount at $750 per seat.' },
  { q: 'How many seats can we sponsor?', a: 'Minimum 3 seats per partner for the beta cohort. Most partners sponsor 3-5 seats. Volume discounts of 10% apply for 10+ seats from one sponsor, and multi-cohort commitments (3+ cohorts per year) receive 15% off.' },
  { q: 'What reporting do sponsors receive?', a: 'Standard tier and above includes a cohort performance report with aggregated, anonymized outcomes, founder progress snapshots, and a quarterly state-of-the-cohort briefing. Enterprise tier adds co-branded materials and custom reporting tied to your KPIs.' },
  { q: 'Can we nominate founders from our portfolio?', a: 'Absolutely. Nominated founders still go through the application process to ensure fit, but they receive priority review. We coordinate the fit interview with your program lead.' },
  { q: 'What does the founder experience include?', a: 'Every sponsored founder gets: 7 live modules, cohort sessions, worksheets and homework with direct feedback, a Revenue Index diagnostic taken at the start and again at the end, the full library of templates and SOPs in the Revenue Room platform, a certificate of completion, and a Week 7 sales plan review of their Sales Engine Playbook.' },
  { q: 'How do we get started?', a: 'Email irene@digitalflowconsulting.ca with your program name, founder count, and target cohort. We will send back a 1-page sponsor brief within 48 hours and set up a 20-minute scoping call.' },
]

const expectedOutcomes = [
  { week: 'Week 1', title: 'Clarity on where you stand', before: 'Guessing why deals stall', after: 'A Day 1 baseline and a clear diagnosis of the gaps to close' },
  { week: 'Week 2', title: 'Know exactly who to target', before: 'Selling to anyone who will listen', after: 'A validated ICP and your 10 highest-value targets' },
  { week: 'Week 3', title: 'A pipeline you can run', before: 'Deals floating in your head with no way to forecast', after: 'Pipeline stages, exit criteria, coverage math, and a live tracker' },
  { week: 'Week 4', title: 'Real conversations, on purpose', before: 'Sporadic outreach and improvised first calls', after: 'A discovery script, a follow-up sequence, and a 20-account wave in motion' },
  { week: 'Week 5', title: 'Conversations that close', before: 'Winging every call and freezing at objections', after: 'An objection playbook and a closing approach you have practiced' },
  { week: 'Week 6-7', title: 'A system that compounds', before: 'No way to tell what is working or why', after: 'KPI dashboard and a complete Sales Engine Playbook you own forever' },
]

const fundingPaths = {
  canada: {
    region: 'Building in Canada',
    title: 'Grants, Programs & Self-Funded',
    summary: 'A training grant, an accelerator or incubator, a university program, or an ecosystem sponsor. Many Canadian founders do not pay the full seat out of pocket.',
    intro: 'Canada has real funding infrastructure for founder development, and most founders here use some of it. On your review call we help you find the route that fits and give you the language to ask for it.',
    ways: [
      { h: 'Training grants', p: 'Workforce and skills-training grants can cover part or all of a seat. We point you to the ones you may qualify for, including WIPSI, ACOA, and REGI-style programs.' },
      { h: 'Accelerator or incubator', p: 'If you are in a program, it can sponsor your seat directly as founder development.' },
      { h: 'University or college program', p: 'Entrepreneurship centres and campus incubators can sponsor a block of seats for the founders in their programs.' },
      { h: 'Corporate or ecosystem sponsor', p: 'Ecosystem partners sponsor seats for founders in their network, often at the beta-cohort rate.' },
      { h: 'Self-funded', p: 'Plenty of founders simply cover the seat from their own growth budget, and that is a completely normal way in. Payment plans across the seven weeks are available.' },
    ],
    steps: [
      'Submit interest below',
      'Complete a short pre-qualification, including how you expect to fund the seat',
      'Review call with the team, where we map your funding options together',
      'Enroll in the next cohort block',
    ],
    selfPay: 'If no funded route fits right now, the self-pay option is straightforward and quoted privately on your review call.',
  },
  us: {
    region: 'Building in the United States',
    title: 'Founder-Funded & Investor-Backed',
    summary: 'Most US founders cover the seat from money they have already raised. Investors and PE firms back the decision, but the cheque usually comes from you.',
    intro: 'Here is the honest version: an investor writes the cheque to your company and expects you to go figure out revenue. So the seat almost always comes out of your own budget, and it is a small line against a shorter sales cycle and a better close rate.',
    ways: [
      { h: 'Self-Funded Sales Expense', p: 'You raised money to go build the business. Before the next round of ad spend or a first sales hire, put a few thousand of it into knowing how to sell. It is the cheapest lever you have.' },
      { h: 'Angel or venture backed', p: 'If you have angel or venture money in the bank, this comes out of the growth budget you already hold. It is a line item, not a raise.' },
      { h: 'Your investor or board', p: 'Some backers fund it directly as an investment in revenue-readiness, so the founder stops being the bottleneck for the company pipeline.' },
      { h: 'A private equity portfolio', p: 'A PE firm can put several portfolio companies through together when founder-led selling is the common weak spot across the portfolio.' },
      { h: 'Accelerator, university, or corporate sponsor', p: 'If you are inside a US program or have a corporate sponsor, they can cover the seat directly.' },
    ],
    steps: [
      'Submit interest below',
      'Complete a short pre-qualification, including how you expect to fund the seat',
      'Review call with the team, where we confirm fit and cover pricing',
      'Enroll in the next cohort block',
    ],
    selfPay: 'Pricing is shared on the review call, and payment plans across the seven weeks are available.',
  },
} as const

function App() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [weekFilter, setWeekFilter] = useState('1')
  const [openModules, setOpenModules] = useState<string[]>(['01'])
  const [faqTab, setFaqTab] = useState<'founders' | 'sponsors'>('founders')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    companyName: '',
    companyDescription: '',
    currentSales: '',
    biggestChallenge: '',
    revenueRange: '',
    howHeard: '',
  })
  const [formLoading, setFormLoading] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formError, setFormError] = useState('')
  const [showContact, setShowContact] = useState(false)
  const [fundingModal, setFundingModal] = useState<'canada' | 'us' | null>(null)
  const [contactData, setContactData] = useState({ firstName: '', lastName: '', email: '', message: '' })
  const [contactLoading, setContactLoading] = useState(false)
  const [contactSubmitted, setContactSubmitted] = useState(false)
  const [contactError, setContactError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name === 'companyDescription') {
      const wordCount = value.trim().split(/\s+/).filter(Boolean).length
      if (wordCount > 200) return
    }
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)
    setFormError('')
    const { error } = await supabase.from('applications').insert({
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      company_name: formData.companyName,
      company_description: formData.companyDescription,
      current_sales_approach: formData.currentSales,
      biggest_challenge: formData.biggestChallenge,
      monthly_revenue_range: formData.revenueRange,
      how_heard: formData.howHeard,
    })
    setFormLoading(false)
    if (error) {
      setFormError('Something went wrong. Please try again or email irene@digitalflowconsulting.ca directly.')
    } else {
      setFormSubmitted(true)
      const end = Date.now() + 3000
      const colors = ['#D19A34', '#0F5B54', '#E3B75B', '#17857C', '#9FE1CB']
      const frame = () => {
        confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0, y: 0.7 }, colors })
        confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1, y: 0.7 }, colors })
        if (Date.now() < end) requestAnimationFrame(frame)
      }
      frame()
      setTimeout(() => {
        confetti({ particleCount: 100, spread: 100, origin: { y: 0.6 }, colors })
      }, 300)
    }
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setContactLoading(true)
    setContactError('')
    const { error } = await supabase.from('contact_messages').insert({
      first_name: contactData.firstName,
      last_name: contactData.lastName,
      email: contactData.email,
      message: contactData.message,
    })
    setContactLoading(false)
    if (error) {
      setContactError('Something went wrong. Please try again.')
    } else {
      setContactSubmitted(true)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleModule = (num: string) => {
    setOpenModules(prev =>
      prev.includes(num) ? prev.filter(n => n !== num) : [...prev, num]
    )
  }

  const handleWeekFilter = (filter: string) => {
    setWeekFilter(filter)
    if (filter === 'all') {
      setOpenModules([])
    } else {
      const weekNum = parseInt(filter)
      const matched = modules.filter(m => m.week === weekNum).map(m => m.num)
      setOpenModules(matched)
    }
  }

  const filteredModules = weekFilter === 'all'
    ? modules
    : modules.filter(m => m.week === parseInt(weekFilter))

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* Announcement Bar */}
      <div className="announcement-bar">
        <div className="announcement-bar-track">
          <span className="announcement-bar-item">SUBMIT INTEREST in the Beta Cohort - Limited to 8 founders</span>
          <span className="announcement-bar-item">Beta Cohort starts Sept 14, 2026</span>
          <span className="announcement-bar-item">Spots are limited - Submit your interest today</span>
          <span className="announcement-bar-item">SUBMIT INTEREST in the Beta Cohort - Limited to 8 founders</span>
          <span className="announcement-bar-item">Beta Cohort starts Sept 14, 2026</span>
          <span className="announcement-bar-item">Spots are limited - Submit your interest today</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`nav ${isScrolled ? 'is-scrolled' : ''}`}>
        <div className="nav-inner">
          <a href="#" className="nav-logo" onClick={() => scrollTo('hero')}>
            <span className="nav-logo-text">The Revenue Room</span>
          </a>
          <ul className="nav-links">
            <li><a href="#curriculum" onClick={(e) => { e.preventDefault(); scrollTo('curriculum') }}>Program</a></li>
            <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollTo('about') }}>The Founders</a></li>
            {/* "Funding" deliberately removed from the nav (Chris, Jul 28): a funded founder reads it as
                "they are asking me for money" and it confuses the header. The section still lives on the page. */}
            {/* Hidden until content is ready
            <li><a href="#outcomes" onClick={(e) => { e.preventDefault(); scrollTo('outcomes') }}>Outcomes</a></li>
            <li><a href="#community" onClick={(e) => { e.preventDefault(); scrollTo('community') }}>Community</a></li>
            */}
            <li><a href="#faq" onClick={(e) => { e.preventDefault(); scrollTo('faq') }}>FAQ</a></li>
          </ul>
          <a href="#apply" className="nav-cta" onClick={(e) => { e.preventDefault(); scrollTo('apply') }}>Submit Interest &rarr;</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero" id="hero">
        <div className="hero-content container">
          <a href="#apply" className="hero-meta hero-meta-link" onClick={(e) => { e.preventDefault(); scrollTo('apply') }}>
            <span className="hero-meta-dot"></span>
            Beta Cohort &middot; Submit Interest
          </a>
          <h1 className="hero-title">The Revenue Room</h1>
          <p className="hero-tagline">
            A 7-week accelerator where B2B founders learn the craft of selling and build the architecture that turns conversations into repeatable revenue.
          </p>
          <div className="hero-buttons">
            <a href="#apply" className="btn-primary" onClick={(e) => { e.preventDefault(); scrollTo('apply') }}>Submit Interest &rarr;</a>
            <a href="#curriculum" className="btn-forest" onClick={(e) => { e.preventDefault(); scrollTo('curriculum') }}>See the Curriculum</a>
          </div>
          <div className="hero-pills">
            <span className="hero-pill"><span className="hero-pill-icon">&#x1F3AF;</span> B2B Founders</span>
            <span className="hero-pill"><span className="hero-pill-icon">&#x1F527;</span> Technical Founders</span>
            <span className="hero-pill"><span className="hero-pill-icon">&#x1F393;</span> Domain Expert Founders</span>
            <span className="hero-pill"><span className="hero-pill-icon">&#x1F4A1;</span> Founder-Led Sales</span>
          </div>
          <div className="hero-takeaways">
            <div className="hero-takeaway">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
              <strong>Validated ICP</strong>
              <span>Know who to target</span>
            </div>
            <div className="hero-takeaway">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
              <strong>Structured Pipeline</strong>
              <span>See where every deal stands</span>
            </div>
            <div className="hero-takeaway">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              <strong>Sales Playbook</strong>
              <span>Scripts and frameworks</span>
            </div>
            <div className="hero-takeaway">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
              <strong>Complete Sales Engine</strong>
              <span>A system you own forever</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Headline */}
      <section className="problem-headline container">
        <p className="kicker">The Real Problem Nobody Talks About</p>
        <h2>Selling Is a Skill.<br /><span style={{ color: 'var(--gold)' }}>Nobody Ever Taught You the Strategies and Systems.</span></h2>
        <p>Sales has its own tools, strategies, and systems. Most founders were never trained in any of them, so they build the product and then improvise the revenue.</p>
      </section>

      {/* Problem Prose */}
      <div className="problem-prose" style={{ textAlign: 'center' }}>
        <p>
          You built the thing. You got it in front of people. <strong>So why is the revenue still unpredictable?</strong>
        </p>
        <p>
          You are having real conversations. People are interested. They ask good questions. Some of them say "send me something" or "let's circle back next quarter." Then the quarter turns over and you are back at the top of the funnel, starting again.
        </p>
        <p>
          It is not that your product is weak or that you cannot explain its value. It is that nobody handed you the craft: how to qualify a real buyer, how to run a discovery call, how to read the room, how to structure a pipeline you can actually forecast from.
        </p>
        <p>
          Founders reach for a CRM and hope the tool fixes it. The tool is not the problem. A perfectly configured CRM does nothing for you if the conversations feeding it were never qualified. And the right strategy alone does nothing if there is no system holding it together. It is the right combination of tools, strategies, and systems that unlocks real success, and gives you a genuine strategic advantage over founders who are still winging it. That is exactly what the Revenue Room teaches.
        </p>
      </div>

      {/* Pain Grid */}
      <section className="container" style={{ paddingTop: 16, paddingBottom: 32 }}>
        <div className="pain-grid">
          <div className="pain-card">
            <div className="pain-card-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <p>Conversations that feel great but never convert into signed contracts or next steps.</p>
          </div>
          <div className="pain-card">
            <div className="pain-card-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            </div>
            <p>"Send us something" follow-ups that disappear into the void and never get a reply.</p>
          </div>
          <div className="pain-card">
            <div className="pain-card-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
            </div>
            <p>A CRM you opened once, entered three contacts into, and abandoned by week two.</p>
          </div>
          <div className="pain-card">
            <div className="pain-card-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <p>No qualification framework, so you spend hours on calls with people who were never going to buy.</p>
          </div>
          <div className="pain-card">
            <div className="pain-card-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22"/><path d="m18 2 4 4-4 4"/></svg>
            </div>
            <p>Doing your own sales, winging it every single time, and hoping something sticks.</p>
          </div>
          <div className="pain-card">
            <div className="pain-card-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
            <p>Pouring money into more leads while your existing process leaks revenue at every stage.</p>
          </div>
        </div>

        {/* Pull Quote */}
        <div className="pull-quote">
          <p>&ldquo;If your process can't convert the conversations you're already having, more leads won't save you.&rdquo;</p>
        </div>

        {/* Section Divider */}
        <div className="section-divider" style={{ paddingTop: 16 }}>
          <span>There's a better way</span>
        </div>
      </section>

      {/* Founders / Partnership (About) */}
      <section className="founders" id="about">
        <div className="container">
          <div className="founders-head">
            <p className="eyebrow">The Partnership</p>
            <h2>Two operators. One room.</h2>
            <p>
              The Revenue Room is a partnership between DigitalFlow and North Peak, built and taught by operators who have carried the quota in real B2B rooms, not career instructors.
            </p>
          </div>

          <div className="founders-grid">
            {/* Irene */}
            <div className="founder-card">
              <div className="founder-photo">
                <img src="/irene-headshot.jpg" alt="Irene, co-founder of The Revenue Room and founder of DigitalFlow Consulting" />
              </div>
              <div className="founder-body">
                <p className="founder-role">Co-founder &middot; <a href="https://www.digitalflowconsulting.ca" target="_blank" rel="noopener noreferrer">DigitalFlow Consulting</a></p>
                <h3 className="founder-name">Irene</h3>
                <p className="founder-oneliner">The revenue-systems operator who turns founder conversations into repeatable sales.</p>
                <div className="founder-bio">
                  <p>
                    For the last 7 years I've helped B2B founders build sales systems that actually work. Not theory, not frameworks you'll never open. Real, operational systems that turn conversations into contracts.
                  </p>
                  <p>
                    I've watched brilliant founders leave hundreds of thousands on the table because nobody ever showed them how to build a repeatable process. The Revenue Room is what I wish existed when I started.
                  </p>
                </div>
                <div className="founder-badges">
                  <span className="founder-badge">&#x1F680; Serial Entrepreneur</span>
                  <span className="founder-badge">&#x2B50; 30 Under 30 &middot; Atlantic Business Magazine</span>
                  <span className="founder-badge">&#x2B50; One to Watch 2025 &middot; Digital Nova Scotia</span>
                </div>
                <div className="founder-logos">
                  <p className="founder-logos-label">Mentor and Partner to:</p>
                  <div className="founder-logos-row">
                    <img src="/volta-logo.jpg" alt="Volta" className="mentor-logo" />
                    <img src="/cglcc-logo.png" alt="CGLCC" className="mentor-logo" />
                    <img src="/tribe-logo.png" alt="Tribe" className="mentor-logo" />
                    <img src="/onside-logo.webp" alt="Onside" className="mentor-logo" />
                    <img src="/movement51-logo.webp" alt="Movement51" className="mentor-logo" />
                  </div>
                </div>
              </div>
            </div>

            {/* Chris. NOTE: chris-headshot.jpg is currently a 133x136 thumbnail and is being
                upscaled hard in this 320px-tall slot. Swap in the full-resolution original when
                it turns up. Its own object-position because it is a square crop, not a wide one. */}
            <div className="founder-card">
              <div className="founder-photo founder-photo--chris">
                <img src="/chris-headshot.jpg" alt="Chris, co-founder of The Revenue Room and founder of North Peak" />
              </div>
              <div className="founder-body">
                <p className="founder-role">Co-founder &middot; North Peak</p>
                <h3 className="founder-name">Chris</h3>
                <p className="founder-oneliner">The go-to-market operator who helps founders turn growth into a repeatable business.</p>
                <div className="founder-bio">
                  <p>
                    For more than 25 years I've helped startups, scale-ups, and enterprise organizations build revenue, launch new markets, and close complex B2B deals. I've led commercial teams, built strategic partnerships, and scaled revenue engines across venture-backed companies and Fortune 50 organizations.
                  </p>
                  <p>
                    I've learned that founders don't need more theory. They need practical advice from someone who has carried the quota, built the team, and navigated the challenges of scaling a business. That's why we created The Revenue Room: a place for honest conversations, shared experiences, and actionable insights from operators who have been there.
                  </p>
                </div>
                <div className="founder-badges">
                  <span className="founder-badge">&#x1F680; 25+ Years Building &amp; Scaling B2B Revenue</span>
                  <span className="founder-badge">&#x2B50; Built and led commercial organizations from startup to Fortune 50</span>
                  <span className="founder-badge">&#x2B50; Negotiated strategic partnerships with global enterprise organizations</span></div><div className="founder-logos"><p className="founder-logos-label">Worked With:</p><div className="founder-logos-row"><img src="/fortune500-logo.png" alt="Fortune 500" className="mentor-logo" /></div></div>
              </div>
            </div>
          </div>

          {/* Partnership lockup — the two marks side by side in the middle */}
          <div className="partnership">
            <div className="partnership-lockup">
              {/* Kept deliberately understated (Chris, Jul 28): Canadian buyers look for the Canadian signal,
                  US buyers get confused by heavy patriotic framing. One quiet line, no flags. */}
              <p className="partnership-label">A Partnership</p>
              <div className="partnership-logos">
                {/* Leaf mark paired with a wordmark so it matches North Peak. Swap for an official horizontal DigitalFlow logo when available. */}
                <span className="df-wordmark">
                  <img src="/digitalflow-logo.png" alt="DigitalFlow" />
                  DigitalFlow
                </span>
                <span className="partnership-x">&times;</span>
                {/* TODO: replace this text wordmark with the real North Peak logo file (e.g. /northpeak-logo.png) */}
                <span className="northpeak-wordmark">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20 L9 8 L13 14 L16 9 L22 20 Z"/></svg>
                  North Peak
                </span>
              </div>
              <p className="partnership-caption">Working with founders across Canada and the United States</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution / Method */}
      <section className="solution" id="program">
        <div className="container">
          <div className="solution-prose">
            <p className="eyebrow">The insight that changes everything</p>
            <h2>Skill and Structure Have to Be Built Together</h2>
            <p>
              Most sales advice picks a side: either "get better at talking to people" or "set up this tool." Neither works alone. A great conversation with no structure behind it produces a good feeling and no revenue. A perfect CRM fed by unqualified conversations produces clean data about deals you were never going to close.
            </p>
            <p>
              The Revenue Room builds both at once, because that is how revenue actually works. The technique generates the signal. The architecture captures it, tracks it, and shows you where to improve.
            </p>
          </div>
          <div className="method-box">
            <p className="method-box-label">The Revenue Room Process</p>
            <div className="method-steps">
              <span className="method-step">Conversations that qualify correctly</span>
              <span className="method-arrow">&rarr;</span>
              <span className="method-step">A process that captures what happens</span>
              <span className="method-arrow">&rarr;</span>
              <span className="method-step">A system that shows you where to improve</span>
            </div>
          </div>
        </div>
      </section>

      {/* Meaning Section (Dark) */}
      <section className="meaning">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2>Because this isn't really about closing the next deal.</h2>
          <p className="meaning-sub" style={{ margin: '0 auto 40px' }}>It's about staying accountable to your business today, and to the team you'll build tomorrow, so you keep growing instead of resetting to zero. A repeatable, profitable sales engine is what stands up to the goals your board, your investors, and your own plan are holding you to.</p>
          <div className="meaning-bullets">
            <div className="meaning-bullet">
              <span className="meaning-bullet-icon">&rarr;</span>
              <p>Knowing exactly what you sold today, not just what's stuck in the pipeline</p>
            </div>
            <div className="meaning-bullet">
              <span className="meaning-bullet-icon">&rarr;</span>
              <p>A pipeline you can forecast from, so you can commit to a number and defend it</p>
            </div>
            <div className="meaning-bullet">
              <span className="meaning-bullet-icon">&rarr;</span>
              <p>Staying accountable to your business now, and to the team you'll build to carry it forward</p>
            </div>
            <div className="meaning-bullet">
              <span className="meaning-bullet-icon">&rarr;</span>
              <p>Building something that compounds quarter over quarter instead of resetting to zero</p>
            </div>
          </div>
          <p className="meaning-close" style={{ margin: '0 auto' }}>
            <span style={{ textDecoration: 'underline', textUnderlineOffset: '4px' }}>Sales isn't a quick turnaround. It's an investment in the sustainability of your business, and the insight you walk out with carries forward well beyond the next deal.</span>
          </p>
        </div>
      </section>

      {/* Offer Reveal */}
      <section className="offer-reveal" style={{ paddingBottom: 16 }}>
        <div className="container">
          <p className="eyebrow">Introducing</p>
          <h2>The Revenue Room</h2>
          <p>A 7-week accelerator that gives B2B founders the techniques and the operating architecture behind repeatable revenue, built live with peers and mentors, from first conversation to closed deal.</p>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="container" style={{ paddingTop: 16, paddingBottom: 48 }}>
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-card-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
            </div>
            <div>
              <h4>Know exactly who to sell to</h4>
              <p>A validated ICP and qualification framework so you never waste another call on a bad fit.</p>
            </div>
          </div>
          <div className="benefit-card">
            <div className="benefit-card-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
            </div>
            <div>
              <h4>Structured pipeline</h4>
              <p>Clear stages, exit criteria, and a weekly rhythm that ensures nothing falls through the cracks.</p>
            </div>
          </div>
          <div className="benefit-card">
            <div className="benefit-card-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
            </div>
            <div>
              <h4>CRM as growth engine</h4>
              <p>Properly configured with automations, custom views, and workflows you will actually use daily.</p>
            </div>
          </div>
          <div className="benefit-card">
            <div className="benefit-card-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <div>
              <h4>Sales conversation framework</h4>
              <p>Discovery scripts, objection playbooks, and closing techniques that feel natural, not pushy.</p>
            </div>
          </div>
          <div className="benefit-card">
            <div className="benefit-card-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
            <div>
              <h4>See your real numbers</h4>
              <p>A metrics dashboard that shows conversion rates, velocity, and exactly where to optimize next.</p>
            </div>
          </div>
          <div className="benefit-card">
            <div className="benefit-card-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
            </div>
            <div>
              <h4>Complete Sales Engine playbook</h4>
              <p>Everything documented, templated, and ready to run on repeat, forever.</p>
            </div>
          </div>
        </div>
        <div className="benefits-closer">
          <p>This isn't a course. It's business development architecture. You leave with a working system you built yourself, plus a certificate.</p>
          <a href="#apply" className="btn-primary" onClick={(e) => { e.preventDefault(); scrollTo('apply') }}>Submit Interest &rarr;</a>
        </div>
      </section>

      {/* Outcomes */}
      <section className="outcomes" id="outcomes">
        <div className="container">
          <p className="eyebrow text-center">What you walk away with</p>
          <h2 className="text-center" style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 700, marginBottom: 12 }}>7 weeks from now, this is the difference.</h2>
          <p className="text-center" style={{ color: 'var(--muted)', fontSize: 16, maxWidth: 640, margin: '0 auto 48px' }}>Here is exactly what changes.</p>
          <div className="outcomes-grid">
            {expectedOutcomes.map((o, i) => (
              <div className="outcome-card" key={i}>
                <div className="outcome-metric-label" style={{ marginBottom: 4 }}>{o.week}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--ink)', marginBottom: 16 }}>{o.title}</div>
                <div className="outcome-before-after">
                  <div className="outcome-ba-row">
                    <span className="outcome-ba-label outcome-ba-before">Before</span>
                    <p>{o.before}</p>
                  </div>
                  <div className="outcome-ba-row">
                    <span className="outcome-ba-label outcome-ba-after">After</span>
                    <p>{o.after}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules / Curriculum */}
      <section className="modules" id="curriculum">
        <div className="container">
          <p className="eyebrow">The Curriculum</p>
          <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 700, marginBottom: 32 }}>7 weeks. One architecture. Zero fluff.</h2>
          <div className="modules-filters">
            {['1', '2', '3', '4', '5', '6', '7', 'all'].map(f => (
              <button
                key={f}
                className={`modules-filter-btn ${weekFilter === f ? 'active' : ''}`}
                onClick={() => handleWeekFilter(f)}
              >
                {f === 'all' ? 'All' : `Wk ${f}`}
              </button>
            ))}
          </div>
          {filteredModules.map(m => (
            <div className="module-card" key={m.num}>
              <div className="module-card-header" onClick={() => toggleModule(m.num)}>
                <span className="module-number">{m.num}</span>
                <div className="module-meta">
                  <div className="module-week">Week {m.week} &middot; {m.date}</div>
                  <div className="module-title">{m.title}</div>
                  <div className="module-tagline">{m.tagline}</div>
                </div>
                <span className={`module-toggle ${openModules.includes(m.num) ? 'open' : ''}`}>+</span>
              </div>
              <div className={`module-body ${openModules.includes(m.num) ? 'open' : ''}`}>
                <p>{m.body}</p>
                <p className="module-outcome"><span className="module-outcome-highlight">Walk away with:</span> {m.outcome.replace('Walk away with: ', '')}</p>
              </div>
            </div>
          ))}
          <p style={{ textAlign: 'center', fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 15, color: 'var(--forest)', marginTop: 32, lineHeight: 1.6 }}>The beta cohort is intentionally capped at 8 founders, so every founder gets direct feedback on their own numbers.</p>
        </div>
      </section>

      {/* Funding Your Seat */}
      <section className="funding" id="funding">
        <div className="container">
          <div className="funding-head">
            <p className="eyebrow">Funding Your Seat</p>
            <h2>A selective, paid cohort. How you cover your seat depends on where you are building.</h2>
            <p>The funding routes are genuinely different on each side of the border. Choose your path to see exactly how it works.</p>
          </div>
          <div className="funding-grid">
            <button className="funding-card" onClick={() => setFundingModal('canada')}>
              <img className="funding-flag" src="/Flag-Canada.webp" alt="" aria-hidden="true" />
              <span className="funding-region">{fundingPaths.canada.region}</span>
              <h3>{fundingPaths.canada.title}</h3>
              <p>{fundingPaths.canada.summary}</p>
              <span className="funding-card-more">See how it works &rarr;</span>
            </button>
            <button className="funding-card" onClick={() => setFundingModal('us')}>
              <img className="funding-flag" src="/Flag-United-States-of-America.webp" alt="" aria-hidden="true" />
              <span className="funding-region">{fundingPaths.us.region}</span>
              <h3>{fundingPaths.us.title}</h3>
              <p>{fundingPaths.us.summary}</p>
              <span className="funding-card-more">See how it works &rarr;</span>
            </button>
          </div>
          <p className="funding-note-inline">Not sure which fits? Submit interest and we will help you find the right route on your review call.</p>
        </div>
      </section>

      {/* Community - hidden until content ready */}
      <section className="community" id="community" style={{ display: 'none' }}>
        <div className="container">
          <p className="eyebrow text-center">Beyond the Sessions</p>
          <h2 className="text-center" style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 700 }}>You're not doing this alone.</h2>
          <div className="community-grid">
            <div className="community-card">
              <h4>Accountability Pods</h4>
              <p>You're matched with 3-5 peers for weekly check-ins. Share wins, troubleshoot blockers, and hold each other to commitments. The pod is where the real accountability happens.</p>
            </div>
            <div className="community-card">
              <h4>Cohort Community</h4>
              <p>Async support between sessions. Post a call recording for feedback, share a win, ask a question about your CRM setup. Active alumni keep it rich long after your cohort ends.</p>
            </div>
            <div className="community-card">
              <h4>Live Role-Play</h4>
              <p>Practice real sales conversations with peers before you have them with prospects. Get candid feedback in a safe environment. This is where most founders say the biggest breakthroughs happen.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partners - hidden until confirmed partners */}
      <section className="partners" style={{ display: 'none' }}>
        <div className="container">
          <p className="eyebrow">Ecosystem Partners</p>
          <div className="partners-logos">
            <span>Volta</span>
            <span>Startup Yard</span>
            <span>Digital Nova Scotia</span>
            <span>Propel ICT</span>
            <span>Genesis Centre</span>
            <span>Communitech</span>
          </div>
          <div className="partner-sponsor">
            <p>Run an accelerator or incubator? Sponsor seats for your founders and give them a real sales system.</p>
            <a href="#apply" className="btn-primary" onClick={(e) => { e.preventDefault(); scrollTo('apply') }}>Sponsor a Cohort &rarr;</a>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="timeline">
        <div className="container">
          <p className="eyebrow text-center">How to Join</p>
          <h2 className="text-center" style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 700 }}>Four steps. Less than 10 minutes to start.</h2>
          <div className="timeline-steps">
            <div className="timeline-step">
              <div className="timeline-step-dot">1</div>
              <h4>Submit Interest</h4>
              <p>Now through August</p>
            </div>
            <div className="timeline-step">
              <div className="timeline-step-dot">2</div>
              <h4>Pre-Qualification</h4>
              <p>Short assessment, within 48 hrs</p>
            </div>
            <div className="timeline-step">
              <div className="timeline-step-dot">3</div>
              <h4>Review Call with the Team</h4>
              <p>If it's a fit, we cover pricing</p>
            </div>
            <div className="timeline-step">
              <div className="timeline-step-dot">4</div>
              <h4>Enroll &amp; Kickoff</h4>
              <p>Sept 14, 2026</p>
            </div>
          </div>
          <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--forest)', marginTop: 24, maxWidth: 620, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>Not a fit right now? No worries. We'll check in with you before every cohort to see if the timing and qualification are right, so you're never left wondering.</p>
        </div>
      </section>

      {/* Guarantee */}
      <section className="guarantee">
        <div className="container">
          <div className="guarantee-box">
            <span className="guarantee-badge">The Revenue Room Guarantee</span>
            <div className="guarantee-icon">&#x1F6E1;&#xFE0F;</div>
            <h3>We guarantee the value. You bring the commitment.</h3>
            <p>A full refund is available through the end of Week 1 if the program is not the right fit. No questions asked. After Week 1, all seats are non-refundable. What you build here only works if you build it, and we ask for your full commitment once you are past that first week.</p>
            <div className="guarantee-tags">
              <span className="guarantee-tag">Qualified ICP</span>
              <span className="guarantee-tag">Structured pipeline</span>
              <span className="guarantee-tag">Configured CRM</span>
              <span className="guarantee-tag">Discovery call framework</span>
              <span className="guarantee-tag">Objection playbook</span>
              <span className="guarantee-tag">Metrics dashboard</span>
            </div>
            <p className="guarantee-fine">These are the deliverables every founder walks away with. Accelerator-sponsored seats are subject to the sponsoring organization's terms.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq" id="faq">
        <div className="container">
          <p className="eyebrow text-center">Frequently Asked Questions</p>
          <h2 className="text-center" style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 700, marginBottom: 32 }}>Got questions? Good.</h2>
          <div className="faq-tabs">
            <button className={`faq-tab ${faqTab === 'founders' ? 'active' : ''}`} onClick={() => setFaqTab('founders')}>For Founders</button>
            <button className={`faq-tab ${faqTab === 'sponsors' ? 'active' : ''}`} onClick={() => setFaqTab('sponsors')}>For Program Sponsors</button>
          </div>
          <div className="faq-grid">
            {(faqTab === 'founders' ? founderFaqs : sponsorFaqs).map((item, i) => (
              <details className="faq-item" key={i}>
                <summary>{item.q}</summary>
                <div className="faq-item-body">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="closing-cta" id="apply">
        <div className="container">
          <h2>Your sales engine won't build itself. But you don't have to build it alone.</h2>
          <p className="closing-cta-sub" style={{ marginTop: 0, marginBottom: 8 }}>5-minute form &middot; 48-hour response</p>
          <p className="closing-cta-sub" style={{ marginTop: 0, marginBottom: 32, fontSize: 14, opacity: 0.9 }}>Submit your interest below. We'll send a short pre-qualification assessment, then book a review call with the team. If it's a fit, we'll walk through the ways founders cover a seat.</p>

          {formSubmitted ? (
            <div className="form-success">
              <div className="form-success-icon">&#x2713;</div>
              <h3>Interest received!</h3>
              <p>Thanks for your interest in the Beta Cohort. We'll review it and send you a short pre-qualification assessment within 48 hours, then book a review call with the team. Not a fit this round? No worries, we'll check in before each cohort.</p>
            </div>
          ) : (
            <form className="application-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First name *</label>
                  <input type="text" id="firstName" name="firstName" required value={formData.firstName} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last name *</label>
                  <input type="text" id="lastName" name="lastName" required value={formData.lastName} onChange={handleChange} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="companyName">Company name *</label>
                  <input type="text" id="companyName" name="companyName" required value={formData.companyName} onChange={handleChange} />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="companyDescription">Give a brief description of your company *</label>
                <textarea id="companyDescription" name="companyDescription" required rows={3} maxLength={1200} value={formData.companyDescription} onChange={handleChange} />
                <span className="form-hint">{formData.companyDescription.trim().split(/\s+/).filter(Boolean).length}/200 words max</span>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="currentSales">How are you currently handling sales? *</label>
                  <select id="currentSales" name="currentSales" required value={formData.currentSales} onChange={handleChange}>
                    <option value="">Select one...</option>
                    <option value="Doing it myself">Doing it myself</option>
                    <option value="Small team">Small team</option>
                    <option value="No process yet">No process yet</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="revenueRange">What's your current monthly revenue range? *</label>
                  <select id="revenueRange" name="revenueRange" required value={formData.revenueRange} onChange={handleChange}>
                    <option value="">Select one...</option>
                    <option value="Pre-revenue">Pre-revenue</option>
                    <option value="Under $5K">Under $5K</option>
                    <option value="$5K-$15K">$5K-$15K</option>
                    <option value="$15K-$50K">$15K-$50K</option>
                    <option value="$50K+">$50K+</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="biggestChallenge">What's your biggest sales challenge right now? *</label>
                <textarea id="biggestChallenge" name="biggestChallenge" required rows={2} value={formData.biggestChallenge} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label htmlFor="howHeard">How did you hear about us? *</label>
                <select id="howHeard" name="howHeard" required value={formData.howHeard} onChange={handleChange}>
                  <option value="">Select one...</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="TikTok">TikTok</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Referral">Referral</option>
                  <option value="Accelerator/Incubator">Accelerator/Incubator</option>
                  <option value="Podcast">Podcast</option>
                  <option value="Event">Event</option>
                  <option value="Advertisement">Advertisement</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <button type="submit" className="btn-primary form-submit" disabled={formLoading}>
                {formLoading ? 'Submitting...' : 'Submit Interest →'}
              </button>
              {formError && <p className="form-error">{formError}</p>}
            </form>
          )}
        </div>
      </section>

      {/* Funding Pathway Modal */}
      {fundingModal && (
        <div className="modal-overlay" onClick={() => setFundingModal(null)}>
          <div className="modal modal--funding funding-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setFundingModal(null)}>&times;</button>
            <p className="funding-modal-region">{fundingPaths[fundingModal].region}</p>
            <h3>{fundingPaths[fundingModal].title}</h3>
            <p className="funding-modal-intro">{fundingPaths[fundingModal].intro}</p>
            <div className="funding-ways">
              {fundingPaths[fundingModal].ways.map((w, i) => (
                <div className="funding-way" key={i}>
                  <span className="funding-way-icon">&#x2713;</span>
                  <div>
                    <h4>{w.h}</h4>
                    <p>{w.p}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="funding-steps">
              <p className="funding-steps-label">How to navigate it</p>
              <ol>
                {fundingPaths[fundingModal].steps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            </div>
            <p className="funding-selfpay">{fundingPaths[fundingModal].selfPay}</p>
            <div className="funding-ctas">
              <button className="btn-primary" onClick={() => { setFundingModal(null); scrollTo('apply') }}>Submit Interest &rarr;</button>
              <button className="btn-forest" onClick={() => { setFundingModal(null); setShowContact(true) }}>Contact Us Directly</button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContact && (
        <div className="modal-overlay" onClick={() => { setShowContact(false); setContactData({ firstName: '', lastName: '', email: '', message: '' }); setContactSubmitted(false); setContactError('') }}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => { setShowContact(false); setContactData({ firstName: '', lastName: '', email: '', message: '' }); setContactSubmitted(false); setContactError('') }}>&times;</button>
            {contactSubmitted ? (
              <div className="form-success" style={{ padding: '24px 0' }}>
                <div className="form-success-icon" style={{ background: 'var(--forest)', color: '#fff' }}>&#x2713;</div>
                <h3 style={{ color: 'var(--ink)' }}>Message sent!</h3>
                <p style={{ color: 'var(--ink-soft)' }}>We'll get back to you within 48 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Get in touch</h3>
                <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 24 }}>Have a question? We'll get back to you within 48 hours.</p>
                <div className="form-row">
                  <div className="form-group" style={{ marginBottom: 16 }}>
                    <label style={{ color: 'var(--ink)' }}>First name *</label>
                    <input type="text" required value={contactData.firstName} onChange={(e) => setContactData(prev => ({ ...prev, firstName: e.target.value }))} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 16 }}>
                    <label style={{ color: 'var(--ink)' }}>Last name *</label>
                    <input type="text" required value={contactData.lastName} onChange={(e) => setContactData(prev => ({ ...prev, lastName: e.target.value }))} />
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label style={{ color: 'var(--ink)' }}>Email *</label>
                  <input type="email" required value={contactData.email} onChange={(e) => setContactData(prev => ({ ...prev, email: e.target.value }))} />
                </div>
                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label style={{ color: 'var(--ink)' }}>Message *</label>
                  <textarea required rows={4} value={contactData.message} onChange={(e) => setContactData(prev => ({ ...prev, message: e.target.value }))} />
                </div>
                <button type="submit" className="btn-primary form-submit" style={{ borderRadius: 'var(--radius)' }} disabled={contactLoading}>
                  {contactLoading ? 'Sending...' : 'Send Message'}
                </button>
                {contactError && <p className="form-error">{contactError}</p>}
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <img src="/digitalflow-logo.png" alt="DigitalFlow Consulting" style={{ height: 36, marginBottom: 12 }} />
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 12 }}>The Revenue Room</p>
              <p>A 7-week accelerator for B2B founders building their first real sales system. A partnership of DigitalFlow &times; North Peak.</p>
            </div>
            <div className="footer-col">
              <h5>Program</h5>
              <ul>
                <li><a href="#curriculum" onClick={(e) => { e.preventDefault(); scrollTo('curriculum') }}>Curriculum</a></li>
                <li><a href="#funding" onClick={(e) => { e.preventDefault(); scrollTo('funding') }}>Funding</a></li>
                <li><a href="#outcomes" onClick={(e) => { e.preventDefault(); scrollTo('outcomes') }}>Outcomes</a></li>
                <li><a href="#faq" onClick={(e) => { e.preventDefault(); scrollTo('faq') }}>FAQ</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h5>Company</h5>
              <ul>
                <li><a href="https://digitalflowconsulting.ca" target="_blank" rel="noopener noreferrer">DigitalFlow Consulting</a></li>
                <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollTo('about') }}>The Founders</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setShowContact(true) }}>Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>&copy; 2026 DigitalFlow Consulting</span>
            <span>Halifax, NS</span>
          </div>
        </div>
      </footer>
    </>
  )
}

export default App
