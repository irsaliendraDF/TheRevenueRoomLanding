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
    date: 'Sept 8',
    title: 'Clarity Kickoff',
    tagline: 'Define your revenue goals and audit your current sales reality.',
    body: 'We start by mapping exactly where you are today: what you are selling, to whom, and how those conversations are actually going. No sugarcoating. You will audit your last 30 days of sales activity and identify the biggest gaps between effort and revenue.',
    outcome: 'Walk away with: A clear revenue target, an honest pipeline audit, and the 3 highest-leverage gaps to fix first.',
  },
  {
    num: '02',
    week: 2,
    date: 'Sept 15',
    title: 'Know Your Waters',
    tagline: 'Build your Ideal Customer Profile and qualification framework.',
    body: 'Most founders sell to anyone who will listen. This week you build a razor-sharp ICP backed by real data, then design a qualification framework so you never waste another hour on a bad-fit prospect.',
    outcome: 'Walk away with: A validated ICP document and a qualification scorecard you can use on every single call.',
  },
  {
    num: '03',
    week: 3,
    date: 'Sept 22',
    title: 'Pipeline Master Builder',
    tagline: 'Design a pipeline that shows you exactly where every deal stands.',
    body: 'We build your actual pipeline stages from first touch to closed-won, define the exit criteria for each stage, and set up the tracking system so nothing falls through the cracks again.',
    outcome: 'Walk away with: A fully mapped pipeline with stage definitions, exit criteria, and a weekly review rhythm.',
  },
  {
    num: '04',
    week: 4,
    date: 'Sept 29',
    title: 'The Engine Room',
    tagline: 'Configure your CRM as a revenue engine, not a data graveyard.',
    body: 'Your CRM should work for you, not the other way around. This week we configure it properly: custom fields that matter, automations that save time, and views that show you exactly what to do next.',
    outcome: 'Walk away with: A configured CRM with automations, custom views, and a daily workflow you will actually use.',
  },
  {
    num: '05',
    week: 5,
    date: 'Oct 6',
    title: "Deal-Maker's Lab",
    tagline: 'Master discovery calls, objection handling, and closing frameworks.',
    body: 'The live role-play week. You will practice real discovery calls, handle the objections that have been killing your deals, and learn closing frameworks that feel natural, not salesy. Peers give live feedback.',
    outcome: 'Walk away with: A discovery call script, an objection playbook, and at least 3 recorded practice sessions with peer feedback.',
  },
  {
    num: '06',
    week: 6,
    date: 'Oct 13',
    title: 'Sales Science & Optimization',
    tagline: 'Read your numbers and build a system that improves itself.',
    body: 'We turn your pipeline into a dashboard: conversion rates by stage, average deal velocity, win/loss patterns. You learn to read the signals so you can optimize without guessing.',
    outcome: 'Walk away with: A live metrics dashboard and a monthly optimization checklist.',
  },
  {
    num: 'CAP',
    week: 7,
    date: 'Oct 20',
    title: 'Build Your Sales Engine',
    tagline: 'Present your complete Revenue Engine to the cohort and mentors.',
    body: 'Capstone week. You present your full Sales Engine: ICP, pipeline, CRM, frameworks, and metrics. Mentors and peers give final feedback. You leave with a complete, documented system you own forever.',
    outcome: 'Walk away with: Your complete Sales Engine playbook, mentor feedback, and a peer network that keeps you accountable.',
  },
]

const founderFaqs = [
  { q: 'Who is this for?', a: 'Technical founders and solo B2B operators who have a product people want but no repeatable system for turning conversations into revenue. If you are doing your own sales and it feels like guessing, this is for you.' },
  { q: 'What if I have zero sales experience?', a: 'Perfect. The program is designed for founders who never trained in sales. We build from first principles, not jargon.' },
  { q: 'How much time per week?', a: 'Plan for 4-5 hours: a 90-minute live session plus exercises, peer pods, and CRM setup work. Most founders say the structure actually saves them time because they stop context-switching.' },
  { q: 'Is this live or self-paced?', a: 'Live. One 90-minute session per week with your cohort plus async community support. Recordings are available if you miss a session, but the value is in the live interaction.' },
  { q: 'What is the cohort size?', a: '10 founders maximum. Small enough for personalized feedback, large enough for diverse perspectives and accountability.' },
  { q: 'Do I need a CRM already?', a: 'No. We help you choose and configure one during Week 4. If you already have one, we will audit and optimize it.' },
  { q: 'What CRM do you recommend?', a: 'We are CRM-agnostic. The frameworks work with HubSpot, Pipedrive, Close, Attio, or even a well-structured spreadsheet. We help you pick based on your stage and budget.' },
  { q: 'What happens after the 7 weeks?', a: 'You keep lifetime access to the Slack community, monthly alumni calls, and all playbook updates. Many alumni also join future cohorts as peer mentors.' },
  { q: 'What is the investment?', a: 'Founding Cohort pricing is $2,400. That includes all 7 live sessions, mentorship, community access, templates, and lifetime playbook updates.' },
  { q: 'What is the refund policy?', a: 'If you complete all 7 sessions, do the work, and genuinely feel you did not get value, we will refund you in full. No hoops. We guarantee the deliverables.' },
]

const sponsorFaqs = [
  { q: 'What does sponsoring a cohort mean?', a: 'You fund seats for founders in your ecosystem. They get the full Revenue Room experience at no cost, and you get brand visibility, impact metrics, and first access to high-potential founders.' },
  { q: 'How many seats can we sponsor?', a: 'Anywhere from 2 to the full cohort of 10. Most partners sponsor 3-5 seats per cohort.' },
  { q: 'What is the cost per seat?', a: 'Sponsor pricing is custom based on volume and partnership tier. Reach out and we will build a proposal within 48 hours.' },
  { q: 'What reporting do sponsors receive?', a: 'Aggregate cohort outcomes: pipeline built, deals closed, revenue generated. We also provide anonymized testimonials and case studies you can use in your own reporting.' },
  { q: 'Can we nominate founders from our portfolio?', a: 'Absolutely. Nominated founders still go through the application process to ensure fit, but they receive priority review.' },
  { q: 'Do you offer multi-cohort discounts?', a: 'Yes. Annual partnerships (3+ cohorts) receive preferred pricing and co-branding opportunities.' },
  { q: 'How do we get started?', a: 'Email irene@digitalflowconsulting.ca or click the Sponsor a Cohort button below. We will set up a 20-minute call to scope the partnership.' },
]

const mentors = [
  { name: 'Irene', role: 'Lead Instructor', type: 'photo' as const },
  { name: 'Marcus Reid', role: 'Guest - CRM & Ops', initials: 'MR', type: 'initials' as const },
  { name: 'Lena Holmes', role: 'Guest - Enterprise Sales', initials: 'LH', type: 'initials' as const },
  { name: 'Priya Venkat', role: 'Guest - Founder-Led GTM', initials: 'PV', type: 'initials' as const },
]

const outcomes = [
  { metric: '$87K', label: 'pipeline built in 7 weeks', quote: 'I went from guessing to forecasting. For the first time I can see where my next quarter is coming from.', name: 'Maya Kapoor', role: 'Founder, Trellis Analytics', initials: 'MK' },
  { metric: '3.4x', label: 'close rate improvement', quote: 'The qualification framework alone saved me 10 hours a week of wasted calls.', name: 'Devin Rourke', role: 'CEO, Rourke Dev', initials: 'DR' },
  { metric: '14 to 32', label: 'qualified leads in pipeline', quote: 'I finally have a system. Not a hack, not a trick. A system I can run every single week.', name: 'Sasha Chen', role: 'Founder, Canopy AI', initials: 'SC' },
  { metric: '$240K', label: 'closed within 90 days', quote: 'The cohort accountability was everything. I would not have built this alone.', name: 'Tomas Alvarez', role: 'Co-founder, BuildLayer', initials: 'TA' },
  { metric: '$5K to $22K', label: 'avg deal size increase', quote: 'I was underpricing because I could not articulate value. Week 5 fixed that permanently.', name: 'Jordan Park', role: 'Founder, SignalPath', initials: 'JP' },
  { metric: '9/10', label: 'would recommend to a founder', quote: 'Best investment I made this year. The ROI was obvious by week 3.', name: 'Emma Westbrook', role: 'CEO, Westbrook Studio', initials: 'EW' },
]

function App() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [weekFilter, setWeekFilter] = useState('all')
  const [openModules, setOpenModules] = useState<string[]>([])
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
      const colors = ['#FFA74F', '#3e4d34', '#ffc474', '#c9943a', '#5e734e']
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
      const weekNum = filter === 'cap' ? 7 : parseInt(filter)
      const matched = modules.filter(m => m.week === weekNum).map(m => m.num)
      setOpenModules(matched)
    }
  }

  const filteredModules = weekFilter === 'all'
    ? modules
    : modules.filter(m => {
        if (weekFilter === 'cap') return m.week === 7
        return m.week === parseInt(weekFilter)
      })

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* Announcement Bar */}
      <div className="announcement-bar">
        <div className="announcement-bar-track">
          <span className="announcement-bar-item">APPLY NOW to the Beta Cohort - Limited to 10 founders</span>
          <span className="announcement-bar-item">Beta Cohort starts Sept 8, 2026</span>
          <span className="announcement-bar-item">Applications closing soon - Apply today</span>
          <span className="announcement-bar-item">APPLY NOW to the Beta Cohort - Limited to 10 founders</span>
          <span className="announcement-bar-item">Beta Cohort starts Sept 8, 2026</span>
          <span className="announcement-bar-item">Applications closing soon - Apply today</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`nav ${isScrolled ? 'is-scrolled' : ''}`}>
        <div className="nav-inner">
          <a href="#" className="nav-logo" onClick={() => scrollTo('hero')}>
            <img src="/digitalflow-logo.png" alt="DigitalFlow" style={{ height: 32 }} />
            <span className="nav-logo-text">The Revenue Room</span>
          </a>
          <ul className="nav-links">
            <li><a href="#curriculum" onClick={(e) => { e.preventDefault(); scrollTo('curriculum') }}>Program</a></li>
            {/* Hidden until content is ready
            <li><a href="#outcomes" onClick={(e) => { e.preventDefault(); scrollTo('outcomes') }}>Outcomes</a></li>
            <li><a href="#mentors" onClick={(e) => { e.preventDefault(); scrollTo('mentors') }}>Mentors</a></li>
            <li><a href="#community" onClick={(e) => { e.preventDefault(); scrollTo('community') }}>Community</a></li>
            <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollTo('about') }}>About</a></li>
            */}
            <li><a href="#faq" onClick={(e) => { e.preventDefault(); scrollTo('faq') }}>FAQ</a></li>
          </ul>
          <a href="#apply" className="nav-cta" onClick={(e) => { e.preventDefault(); scrollTo('apply') }}>Apply to Beta Cohort &rarr;</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero" id="hero">
        <div className="hero-blobs">
          <div className="hero-blob hero-blob--gold"></div>
          <div className="hero-blob hero-blob--forest"></div>
        </div>
        <div className="hero-orbit">
          <svg width="600" height="600" viewBox="0 0 600 600" fill="none" style={{ opacity: 0.15 }}>
            <circle cx="300" cy="300" r="200" stroke="#3e4d34" strokeWidth="1" strokeDasharray="8 6" />
            <circle cx="300" cy="300" r="260" stroke="#c9943a" strokeWidth="1" strokeDasharray="4 8" />
            <circle cx="300" cy="100" r="4" fill="#3e4d34" />
            <circle cx="500" cy="300" r="3" fill="#c9943a" />
            <circle cx="180" cy="480" r="3" fill="#3e4d34" />
          </svg>
        </div>
        <div className="hero-content container">
          <div className="hero-meta">
            <span className="hero-meta-dot"></span>
            Beta Cohort &middot; 10 seats remaining
          </div>
          <h1 className="hero-title">The Revenue Room</h1>
          <p className="hero-tagline">
            A 7-week community accelerator where technical founders stop winging it and build a real sales system, together, from the ground up.
          </p>
          <div className="hero-buttons">
            <a href="#apply" className="btn-primary" onClick={(e) => { e.preventDefault(); scrollTo('apply') }}>Apply to Beta Cohort &rarr;</a>
            <a href="#program" className="btn-ghost" onClick={(e) => { e.preventDefault(); scrollTo('program') }}>See the Curriculum</a>
          </div>
          <div className="hero-pills">
            <span className="hero-pill"><span className="hero-pill-icon">&#x1F3AF;</span> B2B Founders</span>
            <span className="hero-pill"><span className="hero-pill-icon">&#x1F527;</span> Technical Operators</span>
            <span className="hero-pill"><span className="hero-pill-icon">&#x1F680;</span> Solo GTM Leaders</span>
            <span className="hero-pill"><span className="hero-pill-icon">&#x1F4A1;</span> First-Time Sellers</span>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-value">$2.4M</div>
              <div className="hero-stat-label">Pipeline Built</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">10</div>
              <div className="hero-stat-label">Founders / Cohort</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">7 wk</div>
              <div className="hero-stat-label">Live Program</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">87%</div>
              <div className="hero-stat-label">Closed a Deal</div>
            </div>
          </div>
          <p className="hero-caption">Intentionally capped at 10 founders per cohort for maximum accountability and personalized feedback.</p>
        </div>
      </section>

      {/* Problem Headline */}
      <section className="problem-headline container">
        <p className="kicker">The Real Problem Nobody Talks About</p>
        <h2>You Don't Have a Sales Problem. You Have a System Problem.</h2>
        <p>And until you fix the system, no amount of "better pitching" is going to change your close rate.</p>
      </section>

      {/* Problem Prose */}
      <div className="problem-prose">
        <p>
          Let me ask you something uncomfortable: <strong>how many real conversations did you have last month that didn't close?</strong>
        </p>
        <p>
          Not cold leads. Not spam replies. Real conversations with people who seemed interested, asked questions, maybe even said "send me something" or "let's circle back next quarter."
        </p>
        <p>
          If you're like most technical founders I work with, the answer is somewhere between 3 and 8. Each one representing $5K-$15K in potential revenue. That's $50K just sitting on the table. Not because your product isn't good. Not because you can't communicate value. But because you have no system for what happens after "that sounds interesting."
        </p>
        <p>
          You're doing your own sales. You're winging every conversation. And the results reflect it.
        </p>
      </div>

      {/* Pain Grid */}
      <section className="container section-pad-sm">
        <div className="pain-grid">
          <div className="pain-card">
            <div className="pain-card-icon">&#x25CF;</div>
            <p>Conversations that feel great but never convert into signed contracts or next steps.</p>
          </div>
          <div className="pain-card">
            <div className="pain-card-icon">&#x25CF;</div>
            <p>"Send us something" follow-ups that disappear into the void and never get a reply.</p>
          </div>
          <div className="pain-card">
            <div className="pain-card-icon">&#x25CF;</div>
            <p>A CRM you opened once, entered three contacts into, and abandoned by week two.</p>
          </div>
          <div className="pain-card">
            <div className="pain-card-icon">&#x25CF;</div>
            <p>No qualification framework, so you spend hours on calls with people who were never going to buy.</p>
          </div>
          <div className="pain-card">
            <div className="pain-card-icon">&#x25CF;</div>
            <p>Doing your own sales, winging it every single time, and hoping something sticks.</p>
          </div>
          <div className="pain-card">
            <div className="pain-card-icon">&#x25CF;</div>
            <p>Pouring money into more leads while your existing process leaks revenue at every stage.</p>
          </div>
        </div>

        {/* Pull Quote */}
        <div className="pull-quote">
          <span className="pull-quote-mark">&ldquo;</span>
          <p>If your process can't convert the conversations you're already having, more leads won't save you.</p>
        </div>

        {/* Section Divider */}
        <div className="section-divider">
          <span>There's a better way</span>
        </div>
      </section>

      {/* Rapport / Bio */}
      <section className="rapport" id="about">
        <div className="container">
          <div className="rapport-grid">
            <div className="rapport-photo">
              <img src="/irene.jpg" alt="Irene, Founder of DigitalFlow Consulting" />
            </div>
            <div className="rapport-text">
              <p className="rapport-role">Founder &middot; DigitalFlow Consulting</p>
              <h2 className="rapport-name">Hi, I'm Irene.</h2>
              <p>
                I've spent the last 4 years helping B2B founders build sales systems that actually work. Not theory. Not "frameworks" you'll never implement. Real, operational systems that turn conversations into contracts.
              </p>
              <p>
                I've watched brilliant technical founders leave hundreds of thousands on the table because nobody ever showed them how to build a repeatable process. They could build incredible products. They could explain the value. But they had no system for capturing demand and moving it forward.
              </p>
              <p>
                The Revenue Room is what I wish existed when I started. A small, focused cohort where you build your entire sales engine in 7 weeks, with mentors who've done it, and peers who are doing it alongside you.
              </p>
              <div className="rapport-badges">
                <span className="rapport-badge">&#x2B50; 30 Under 30 Innovator &middot; Atlantic Business Magazine</span>
                <span className="rapport-badge">&#x2B50; One to Watch 2025 &middot; Digital Nova Scotia</span>
              </div>
              <div className="rapport-mentors">
                <p className="rapport-mentors-label">Mentor at</p>
                <div className="rapport-mentor-logos">
                  <span>Volta</span>
                  <span>Startup Yard</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution / Method */}
      <section className="solution" id="program">
        <div className="container">
          <div className="solution-prose">
            <p className="eyebrow">The insight that changes everything</p>
            <h2>Conversation and System Need to Work Together</h2>
            <p>
              Most sales advice focuses on one or the other: either "get better at talking to people" or "set up this tool." Neither works alone. A great conversation with no system behind it produces a good feeling and no revenue. A perfect CRM with bad conversations produces clean data about deals you never close.
            </p>
            <p>
              The Revenue Room teaches both simultaneously because that's how revenue actually works: the conversation generates the signal, and the system captures, tracks, and amplifies it.
            </p>
          </div>
          <div className="method-box">
            <p className="method-box-label">The Revenue Engine Method&trade;</p>
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
        <div className="container">
          <h2>Because this isn't really about closing rates.</h2>
          <p className="meaning-sub">It's about being able to build a business without the constant anxiety of not knowing where your next dollar is coming from.</p>
          <div className="meaning-bullets">
            <div className="meaning-bullet">
              <span className="meaning-bullet-icon">&darr;</span>
              <p>Knowing exactly which conversations are worth your time and which ones aren't</p>
            </div>
            <div className="meaning-bullet">
              <span className="meaning-bullet-icon">&darr;</span>
              <p>Having a clear view of your pipeline so you can plan months ahead, not days</p>
            </div>
            <div className="meaning-bullet">
              <span className="meaning-bullet-icon">&darr;</span>
              <p>Waking up on Monday knowing exactly who to talk to and what to say</p>
            </div>
            <div className="meaning-bullet">
              <span className="meaning-bullet-icon">&darr;</span>
              <p>Building something that compounds instead of resetting to zero every month</p>
            </div>
          </div>
          <p className="meaning-close">
            <strong>That's what a system gives you.</strong> Not just more deals. Peace of mind. Predictability. The confidence that comes from knowing your revenue isn't random.
          </p>
        </div>
      </section>

      {/* Offer Reveal */}
      <section className="offer-reveal">
        <div className="container">
          <p className="eyebrow">Introducing</p>
          <h2>The Revenue Room</h2>
          <p>A 7-week community accelerator that gives technical founders a complete, operational sales system, built live, with peers and mentors, from first conversation to closed deal.</p>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="container section-pad-sm">
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-card-icon">&#x25CF;</div>
            <div>
              <h4>Know exactly who to sell to</h4>
              <p>A validated ICP and qualification framework so you never waste another call on a bad fit.</p>
            </div>
          </div>
          <div className="benefit-card">
            <div className="benefit-card-icon">&#x25CF;</div>
            <div>
              <h4>Structured pipeline</h4>
              <p>Clear stages, exit criteria, and a weekly rhythm that ensures nothing falls through the cracks.</p>
            </div>
          </div>
          <div className="benefit-card">
            <div className="benefit-card-icon">&#x25CF;</div>
            <div>
              <h4>CRM as growth engine</h4>
              <p>Properly configured with automations, custom views, and workflows you will actually use daily.</p>
            </div>
          </div>
          <div className="benefit-card">
            <div className="benefit-card-icon">&#x25CF;</div>
            <div>
              <h4>Sales conversation framework</h4>
              <p>Discovery scripts, objection playbooks, and closing techniques that feel natural, not pushy.</p>
            </div>
          </div>
          <div className="benefit-card">
            <div className="benefit-card-icon">&#x25CF;</div>
            <div>
              <h4>See your real numbers</h4>
              <p>A metrics dashboard that shows conversion rates, velocity, and exactly where to optimize next.</p>
            </div>
          </div>
          <div className="benefit-card">
            <div className="benefit-card-icon">&#x25CF;</div>
            <div>
              <h4>Complete Sales Engine playbook</h4>
              <p>Everything documented, templated, and ready to run on repeat, forever.</p>
            </div>
          </div>
        </div>
        <div className="benefits-closer">
          <p>"This isn't a course. It's a build sprint. You leave with a working system, not a certificate."</p>
          <a href="#apply" className="btn-primary" onClick={(e) => { e.preventDefault(); scrollTo('apply') }}>Apply to Beta Cohort &rarr;</a>
        </div>
      </section>

      {/* Outcomes */}
      <section className="outcomes" id="outcomes">
        <div className="container">
          <p className="eyebrow text-center">Cohort 01 &middot; Real numbers from real founders</p>
          <h2 className="text-center" style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 700 }}>What founders walked out with.</h2>
          <div className="outcomes-grid">
            {outcomes.map((o, i) => (
              <div className="outcome-card" key={i}>
                <div className="outcome-metric">{o.metric}</div>
                <div className="outcome-metric-label">{o.label}</div>
                <p className="outcome-quote">"{o.quote}"</p>
                <div className="outcome-author">
                  <div className="outcome-avatar">{o.initials}</div>
                  <div className="outcome-author-info">
                    <div className="outcome-author-name">{o.name}</div>
                    <div className="outcome-author-role">{o.role}</div>
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
          <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 700, marginBottom: 32 }}>7 weeks. One system. Zero fluff.</h2>
          <div className="modules-filters">
            {['all', '1', '2', '3', '4', '5', '6', 'cap'].map(f => (
              <button
                key={f}
                className={`modules-filter-btn ${weekFilter === f ? 'active' : ''}`}
                onClick={() => handleWeekFilter(f)}
              >
                {f === 'all' ? 'All' : f === 'cap' ? 'Capstone' : `Wk ${f}`}
              </button>
            ))}
          </div>
          {filteredModules.map(m => (
            <div className="module-card" key={m.num}>
              <div className="module-card-header" onClick={() => toggleModule(m.num)}>
                <span className="module-number">{m.num}</span>
                <div className="module-meta">
                  <div className="module-week">Week {m.week === 7 ? 'Capstone' : m.week} &middot; {m.date}</div>
                  <div className="module-title">{m.title}</div>
                  <div className="module-tagline">{m.tagline}</div>
                </div>
                <span className={`module-toggle ${openModules.includes(m.num) ? 'open' : ''}`}>+</span>
              </div>
              <div className={`module-body ${openModules.includes(m.num) ? 'open' : ''}`}>
                <p>{m.body}</p>
                <p className="module-outcome">{m.outcome}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mentors - hidden until content ready */}
      <section className="mentors" id="mentors" style={{ display: 'none' }}>
        <div className="container">
          <p className="eyebrow text-center">Your Mentors</p>
          <h2 className="text-center" style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 700 }}>People who've built what you're building.</h2>
          <div className="mentors-grid">
            {mentors.map((m, i) => (
              <div className="mentor-card" key={i}>
                <div className={`mentor-avatar ${m.type === 'photo' ? 'mentor-avatar--photo' : 'mentor-avatar--initials'}`}>
                  {m.type === 'photo' ? 'Photo' : m.initials}
                </div>
                <div className="mentor-name">{m.name}</div>
                <div className="mentor-role">{m.role}</div>
              </div>
            ))}
          </div>
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
              <p>You're matched with 2-3 peers for weekly check-ins. Share wins, troubleshoot blockers, and hold each other to commitments. The pod is where the real accountability happens.</p>
            </div>
            <div className="community-card">
              <h4>Slack Community</h4>
              <p>Async support between sessions. Post a call recording for feedback, share a win, ask a question about your CRM setup. Active alumni keep the channel rich long after your cohort ends.</p>
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
              <h4>Apply</h4>
              <p>~5 min</p>
            </div>
            <div className="timeline-step">
              <div className="timeline-step-dot">2</div>
              <h4>Fit Call</h4>
              <p>~48 hrs</p>
            </div>
            <div className="timeline-step">
              <div className="timeline-step-dot">3</div>
              <h4>Accept &amp; Enroll</h4>
              <p>~24 hrs</p>
            </div>
            <div className="timeline-step">
              <div className="timeline-step-dot">4</div>
              <h4>Onboard</h4>
              <p>~1 wk</p>
            </div>
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section className="guarantee">
        <div className="container">
          <div className="guarantee-box">
            <span className="guarantee-badge">The Revenue Room Guarantee</span>
            <div className="guarantee-icon">&#x1F6E1;&#xFE0F;</div>
            <h3>We guarantee the value. You bring the commitment.</h3>
            <p>Complete all 7 sessions, do the exercises, build your system, and if you genuinely feel you didn't get the value we promised, we'll refund you in full. No hoops. No fine print games.</p>
            <div className="guarantee-tags">
              <span className="guarantee-tag">Qualified ICP</span>
              <span className="guarantee-tag">Structured pipeline</span>
              <span className="guarantee-tag">Configured CRM</span>
              <span className="guarantee-tag">Discovery call framework</span>
              <span className="guarantee-tag">Objection playbook</span>
              <span className="guarantee-tag">Metrics dashboard</span>
            </div>
            <p className="guarantee-fine">These are the deliverables we guarantee. If you do the work and don't walk away with all six, you get your money back.</p>
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
            <button className={`faq-tab ${faqTab === 'sponsors' ? 'active' : ''}`} onClick={() => setFaqTab('sponsors')}>For Program Leads</button>
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
          <h2>Your Revenue Engine won't build itself. But you don't have to build it alone.</h2>
          <p className="closing-cta-sub" style={{ marginTop: 0, marginBottom: 32 }}>5-minute application &middot; 48-hour response &middot; No spam, ever.</p>

          {formSubmitted ? (
            <div className="form-success">
              <div className="form-success-icon">&#x2713;</div>
              <h3>Application received!</h3>
              <p>Thanks for applying to the Beta Cohort. We'll review your application and get back to you within 48 hours.</p>
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
                {formLoading ? 'Submitting...' : 'Apply to Beta Cohort →'}
              </button>
              {formError && <p className="form-error">{formError}</p>}
            </form>
          )}
        </div>
      </section>

      {/* Contact Modal */}
      {showContact && (
        <div className="modal-overlay" onClick={() => setShowContact(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowContact(false)}>&times;</button>
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
          <div className="footer-grid" style={{ gridTemplateColumns: '2fr 1fr 1fr' }}>
            <div className="footer-brand">
              <img src="/digitalflow-logo.png" alt="DigitalFlow Consulting" style={{ height: 36, marginBottom: 12 }} />
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 12 }}>The Revenue Room</p>
              <p>A 7-week community accelerator for technical founders building their first real sales system. By DigitalFlow Consulting.</p>
            </div>
            <div className="footer-col">
              <h5>Program</h5>
              <ul>
                <li><a href="#curriculum" onClick={(e) => { e.preventDefault(); scrollTo('curriculum') }}>Curriculum</a></li>
                <li><a href="#outcomes" onClick={(e) => { e.preventDefault(); scrollTo('outcomes') }}>Outcomes</a></li>
                <li><a href="#faq" onClick={(e) => { e.preventDefault(); scrollTo('faq') }}>FAQ</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h5>Company</h5>
              <ul>
                <li><a href="https://digitalflowconsulting.ca" target="_blank" rel="noopener noreferrer">DigitalFlow Consulting</a></li>
                <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollTo('about') }}>About Irene</a></li>
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
