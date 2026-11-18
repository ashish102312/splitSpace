import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Receipt, 
  Users, 
  BarChart3, 
  ShieldCheck, 
  Check, 
  ChevronRight, 
  Sparkles,
  ArrowUpRight,
  Clock,
  Layers,
  Cpu,
  Lock,
  Wallet,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Send,
  Star
} from 'lucide-react';

const Landing = () => {
  const [activePlan, setActivePlan] = useState('team');
  const [activeTab, setActiveTab] = useState(0);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    teamSize: '5-15 Members',
    useCase: 'Household & Roommates',
    notes: ''
  });

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setBookingSubmitted(true);
    setTimeout(() => {
      setBookingSubmitted(false);
      setBookingData({
        name: '',
        email: '',
        teamSize: '5-15 Members',
        useCase: 'Household & Roommates',
        notes: ''
      });
    }, 4000);
  };

  const featureTabs = [
    {
      title: 'Greedy Debt Simplification',
      subtitle: 'Minimum Net Transactions',
      description: 'Our quadratic settlement optimizer collapses multi-hop member debts into the absolute minimum number of cross-member transfers, eliminating endless back-and-forth bank wires.',
      metric: '78% fewer transfer transactions',
      tag: 'Optimized Settlement'
    },
    {
      title: 'Instant 6-Char Group Codes',
      subtitle: 'Zero Friction Onboarding',
      description: 'Create dedicated expense spaces for housemates, multi-city group travel, or office teams and invite members in seconds with cryptographically unique alphanumeric keys.',
      metric: '< 5 second member join speed',
      tag: 'Instant Access'
    },
    {
      title: 'Categorized Personal Ledger',
      subtitle: 'Granular Cash Outflow Control',
      description: 'Track individual expenditures across 11 financial categories with payment method tags (UPI, Debit, Credit) and real-time monthly budget alerts.',
      metric: '100% categorical clarity',
      tag: 'Personal Finance'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-700 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* 1. UTILITY STRIP & NAVIGATION */}
      {/* Top Tier: Utility Strip */}
      <div className="w-full bg-white border-b border-slate-100 h-10 flex items-center">
        <div className="max-w-[1170px] w-full mx-auto px-6 flex justify-between items-center text-[11px] font-semibold tracking-wider uppercase text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              SplitSpace Microservices Live
            </span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="hidden sm:inline text-slate-600">Institutional Ledger Platform</span>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              to="/login" 
              className="text-[#1473E6] hover:text-[#0060A8] font-bold tracking-wider uppercase transition-colors"
            >
              Member Access
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Tier: Sticky Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
        <div className="max-w-[1170px] mx-auto px-6 h-20 flex justify-between items-center">
          
          {/* Logo & Brand Title */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[10px] bg-[#0060A8] flex items-center justify-center text-white font-extrabold text-xl shadow-sm">
              S
            </div>
            <div>
              <span className="text-xl font-bold uppercase tracking-tight text-[#0060A8]">
                Split<span className="text-emerald-600">Space</span>
              </span>
              <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest -mt-1">
                Institutional Financial
              </p>
            </div>
          </Link>

          {/* Centered Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
            <a href="#services" className="hover:text-[#1473E6] transition-colors">Services</a>
            <a href="#architecture" className="hover:text-[#1473E6] transition-colors">Architecture</a>
            <a href="#memberships" className="hover:text-[#1473E6] transition-colors">Memberships</a>
            <a href="#testimonials" className="hover:text-[#1473E6] transition-colors">Testimonials</a>
            <a href="#consultation" className="hover:text-[#1473E6] transition-colors">Contact</a>
          </nav>

          {/* Right CTA */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden sm:inline-block px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#0060A8] hover:text-[#1473E6] transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-6 py-2.5 bg-[#0066AE] hover:bg-[#0060A8] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
            >
              Open Account
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative h-[620px] bg-gradient-to-r from-[#0060A8] via-[#0066AE] to-[#0f4c81] overflow-hidden flex items-center">
        {/* Subtle patterned overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>

        {/* Diagonal Aquatic Light Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-400/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[#1473E6]/30 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-[1170px] w-full mx-auto px-6 relative z-10">
          <div className="max-w-2xl text-white space-y-6">
            
            {/* Pill Tag with Backdrop-blur */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Institutional Aquatic Financial Architecture</span>
            </div>

            {/* Large H2 with mixed weights */}
            <h1 className="text-4xl sm:text-5xl lg:text-[58px] tracking-tight leading-[1.1] font-bold uppercase">
              Frictionless Bill Splits <br />
              <span className="font-light italic text-emerald-200">Personal Cash Velocity</span>
            </h1>

            <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-xl">
              SplitSpace provides an institutional-grade multi-service ledger for roommates, traveling syndicates, and teams. Settle multi-party debt through deterministic greedy minimization.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/register"
                className="px-7 py-3.5 bg-white text-[#0060A8] hover:bg-emerald-50 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-4 h-4 text-emerald-600" />
              </Link>
              <Link
                to="/login"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-xs transition-all flex items-center gap-2"
              >
                <span>Demo Account</span>
                <ArrowUpRight className="w-4 h-4 text-white" />
              </Link>
            </div>

          </div>

          {/* Institutional Status Card (Bottom-Right corner) */}
          <div className="mt-8 lg:mt-0 lg:absolute lg:right-6 lg:bottom-12 bg-white rounded-[10px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.15)] border-l-4 border-l-[#1473E6] max-w-sm w-full">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#F1F5F8] flex items-center justify-center text-emerald-600 flex-shrink-0">
                <Clock className="w-6 h-6 text-[#1473E6]" />
              </div>
              <div>
                <p className="text-[14px] font-bold text-slate-900 leading-tight">Operating Window</p>
                <p className="text-[11px] text-[#6C6C6C] mt-0.5">24/7 Automated Settlement Microservice</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">All Clusters Online</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. SERVICES GRID */}
      <section id="services" className="py-20 bg-[#F1F5F8]">
        <div className="max-w-[1170px] mx-auto px-6">
          
          {/* Section Header with Institutional Underline */}
          <div className="mb-14">
            <h2 className="text-[24px] font-bold uppercase tracking-tight text-[#0060A8]">
              Institutional Services
            </h2>
            <div className="w-12 h-1 bg-[#1473E6] mt-1"></div>
            <p className="text-sm text-[#6C6C6C] mt-3 max-w-xl">
              Engineered financial modules tailored for group resource sharing and personal budget equilibrium.
            </p>
          </div>

          {/* 3-Column Grid (28px gap = gap-7) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            
            {/* Service 1 */}
            <div className="bg-white rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden group">
              <div className="h-[200px] bg-gradient-to-br from-blue-900 via-[#0060A8] to-emerald-800 p-8 flex flex-col justify-between text-white relative">
                <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center">
                  <Users className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">Shared Spaces</span>
                  <h3 className="text-xl font-bold uppercase mt-0.5">Multi-Party Ledger</h3>
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#0060A8] uppercase tracking-tight">
                    Group Debt Settlement
                  </h3>
                  <p className="text-sm text-[#6C6C6C] mt-2.5 leading-relaxed">
                    Create instant spaces with 6-character codes. Settle shared rent, grocery runs, trips, and communal purchases without spreadsheet friction.
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100">
                  <Link 
                    to="/register" 
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1473E6] hover:text-[#0060A8] group-hover:gap-3 transition-all"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Service 2 */}
            <div className="bg-white rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden group">
              <div className="h-[200px] bg-gradient-to-br from-emerald-800 via-teal-800 to-[#0060A8] p-8 flex flex-col justify-between text-white relative">
                <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center">
                  <Receipt className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">Cash Flow Tracking</span>
                  <h3 className="text-xl font-bold uppercase mt-0.5">Personal Outflow</h3>
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#0060A8] uppercase tracking-tight">
                    Personal Expense Matrix
                  </h3>
                  <p className="text-sm text-[#6C6C6C] mt-2.5 leading-relaxed">
                    Log and categorize everyday expenses across 11 key fiscal buckets. Filter by payment channels (UPI, Debit, Cards) with millisecond search.
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100">
                  <Link 
                    to="/register" 
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1473E6] hover:text-[#0060A8] group-hover:gap-3 transition-all"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Service 3 */}
            <div className="bg-white rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden group">
              <div className="h-[200px] bg-gradient-to-br from-slate-900 via-[#0060A8] to-blue-900 p-8 flex flex-col justify-between text-white relative">
                <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">Data Intelligence</span>
                  <h3 className="text-xl font-bold uppercase mt-0.5">Greedy Minimizer</h3>
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#0060A8] uppercase tracking-tight">
                    Financial Analytics
                  </h3>
                  <p className="text-sm text-[#6C6C6C] mt-2.5 leading-relaxed">
                    Gain visibility into monthly burn rate, category distribution percentages, and transaction velocity with deterministic statistical accuracy.
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100">
                  <Link 
                    to="/register" 
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1473E6] hover:text-[#0060A8] group-hover:gap-3 transition-all"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. GALLERY & FEATURED INFO (Split Layout) */}
      <section id="architecture" className="py-20 bg-white">
        <div className="max-w-[1170px] mx-auto px-6">
          
          <div className="mb-14">
            <h2 className="text-[24px] font-bold uppercase tracking-tight text-[#0060A8]">
              Institutional Architecture
            </h2>
            <div className="w-12 h-1 bg-[#1473E6] mt-1"></div>
            <p className="text-sm text-[#6C6C6C] mt-3 max-w-xl">
              Microservices-backed ledger designed for enterprise reliability and ultra-fast settlement.
            </p>
          </div>

          {/* Split Layout: Left Large Box (450px height) + Right Column (350px width) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Box (rounded-16px, 450px height) */}
            <div className="lg:col-span-8 relative h-[450px] rounded-[16px] bg-gradient-to-tr from-[#0060A8] via-[#0066AE] to-slate-900 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-8 md:p-12 flex flex-col justify-between text-white">
              
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-300 text-xs font-bold uppercase tracking-wider">
                  <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Microservice Node Matrix</span>
                </div>

                {/* Interactive tab selectors */}
                <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md p-1 rounded-xl">
                  {featureTabs.map((tab, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveTab(idx)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeTab === idx 
                          ? 'bg-emerald-600 text-white shadow-xs' 
                          : 'text-slate-200 hover:text-white'
                      }`}
                    >
                      0{idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div className="max-w-lg space-y-3">
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest">
                  {featureTabs[activeTab].tag}
                </span>
                <h3 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-white">
                  {featureTabs[activeTab].title}
                </h3>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {featureTabs[activeTab].description}
                </p>
              </div>

              {/* Floating Info Box at Bottom-Left */}
              <div className="bg-white/95 backdrop-blur-md rounded-[10px] p-4 text-slate-800 shadow-md max-w-sm border border-white/40">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#0060A8]">
                    Performance Standard
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700">Verified</span>
                </div>
                <p className="text-sm font-bold text-slate-900 mt-1">
                  {featureTabs[activeTab].metric}
                </p>
              </div>

            </div>

            {/* Right Column: 350px wide equivalent */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Stacked Value Prop Box with blue left-border (#1473E6) */}
              <div className="bg-[#F1F5F8] rounded-[10px] p-6 border-l-4 border-l-[#1473E6] shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0060A8]">
                  Zero Overhead Architecture
                </h4>
                <p className="text-sm font-bold text-slate-900 mt-2">
                  Isolated Backend Microservices
                </p>
                <p className="text-xs text-[#6C6C6C] mt-2 leading-relaxed">
                  Authentication, Group Spaces, and Expense Ledger run on dedicated services with API Gateway reverse proxy routing for strict process isolation.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Security Audit</span>
                  <span className="text-emerald-700 font-bold">100% Compliant</span>
                </div>
              </div>

              {/* Image / Graphic below Value Prop box */}
              <div className="rounded-[10px] bg-gradient-to-br from-emerald-900 via-teal-900 to-[#0060A8] p-6 text-white shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-emerald-300" />
                  </div>
                  <div>
                    <p className="text-sm font-bold uppercase">Encrypted Sessions</p>
                    <p className="text-[11px] text-emerald-200">JWT Token Security with Auto-Expiry</p>
                  </div>
                </div>
                <p className="text-xs text-slate-200 mt-3 leading-relaxed">
                  Member data is secured behind rigorous auth protocols. No private banking credentials stored.
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 5. PRICING & MEMBERSHIP TIERS */}
      <section id="memberships" className="py-20 bg-[#F1F5F8]">
        <div className="max-w-[1170px] mx-auto px-6">
          
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="text-[24px] font-bold uppercase tracking-tight text-[#0060A8]">
              Membership Tiers
            </h2>
            <div className="w-12 h-1 bg-[#1473E6] mt-1 mx-auto"></div>
            <p className="text-sm text-[#6C6C6C] mt-3">
              Clear, transparent membership options designed for individuals, shared houses, and travel squads.
            </p>
          </div>

          {/* 3 Membership Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            
            {/* Tier 1: Personal */}
            <div className="bg-white rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] border-t-4 border-t-[#1473E6] p-8 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#0060A8]">Personal Basic</span>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">₹0</span>
                  <span className="text-xs font-semibold text-[#6C6C6C]">/ forever</span>
                </div>
                <p className="text-xs text-[#6C6C6C] mt-2">
                  Complete personal expense tracking with real-time categorizations.
                </p>

                <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
                  <div className="flex items-center gap-2.5 text-xs text-slate-700">
                    <Check className="w-4 h-4 text-[#1473E6] flex-shrink-0" />
                    <span>Unlimited personal expense records</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-700">
                    <Check className="w-4 h-4 text-[#1473E6] flex-shrink-0" />
                    <span>11 financial category classifications</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-700">
                    <Check className="w-4 h-4 text-[#1473E6] flex-shrink-0" />
                    <span>Monthly outflow summary</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-700">
                    <Check className="w-4 h-4 text-[#1473E6] flex-shrink-0" />
                    <span>1 Active group space</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6">
                <Link
                  to="/register"
                  className="w-full py-3 bg-[#0066AE] hover:bg-[#0060A8] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-sm hover:shadow-md transition-all text-center block"
                >
                  Join Free
                </Link>
              </div>
            </div>

            {/* Tier 2: Team / Syndicate (POPULAR with Floating Badge) */}
            <div className="bg-white rounded-[10px] shadow-[0_4px_16px_rgba(0,96,168,0.12)] border-t-4 border-t-[#1473E6] p-8 flex flex-col justify-between relative hover:-translate-y-1 transition-all duration-300">
              
              {/* Floating Pill Badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                Recommended Tier
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#0060A8]">Syndicate Shared</span>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">₹299</span>
                  <span className="text-xs font-semibold text-[#6C6C6C]">/ month</span>
                </div>
                <p className="text-xs text-[#6C6C6C] mt-2">
                  Built for flatmates, frequent travel groups, and shared clubs.
                </p>

                <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
                  <div className="flex items-center gap-2.5 text-xs text-slate-700 font-semibold">
                    <Check className="w-4 h-4 text-[#1473E6] flex-shrink-0" />
                    <span>Unlimited group spaces</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-700">
                    <Check className="w-4 h-4 text-[#1473E6] flex-shrink-0" />
                    <span>Greedy debt minimization engine</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-700">
                    <Check className="w-4 h-4 text-[#1473E6] flex-shrink-0" />
                    <span>Instant settlement transfer marking</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-700">
                    <Check className="w-4 h-4 text-[#1473E6] flex-shrink-0" />
                    <span>Multi-channel ledger export</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6">
                <Link
                  to="/register"
                  className="w-full py-3 bg-[#0066AE] hover:bg-[#0060A8] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md hover:shadow-lg transition-all text-center block"
                >
                  Start 30-Day Trial
                </Link>
              </div>
            </div>

            {/* Tier 3: Enterprise */}
            <div className="bg-white rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] border-t-4 border-t-[#1473E6] p-8 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#0060A8]">Corporate Guild</span>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">₹999</span>
                  <span className="text-xs font-semibold text-[#6C6C6C]">/ month</span>
                </div>
                <p className="text-xs text-[#6C6C6C] mt-2">
                  Custom organization groups, multi-team ledgers, and audit exports.
                </p>

                <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
                  <div className="flex items-center gap-2.5 text-xs text-slate-700">
                    <Check className="w-4 h-4 text-[#1473E6] flex-shrink-0" />
                    <span>Unlimited organizational spaces</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-700">
                    <Check className="w-4 h-4 text-[#1473E6] flex-shrink-0" />
                    <span>Custom category tax rules</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-700">
                    <Check className="w-4 h-4 text-[#1473E6] flex-shrink-0" />
                    <span>Priority dedicated microservice cluster</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-700">
                    <Check className="w-4 h-4 text-[#1473E6] flex-shrink-0" />
                    <span>24/7 Concierge financial support</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6">
                <Link
                  to="/register"
                  className="w-full py-3 bg-[#0066AE] hover:bg-[#0060A8] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-sm hover:shadow-md transition-all text-center block"
                >
                  Contact Guild Team
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. TESTIMONIALS GRID (Solid #0060A8 Background, 2x2 White Cards) */}
      <section id="testimonials" className="py-20 bg-[#0060A8] text-white">
        <div className="max-w-[1170px] mx-auto px-6">
          
          <div className="mb-14">
            <h2 className="text-[24px] font-bold uppercase tracking-tight text-white">
              Institutional Trust
            </h2>
            <div className="w-12 h-1 bg-[#1473E6] mt-1"></div>
            <p className="text-sm text-blue-100 mt-3 max-w-xl">
              Endorsed by household leaders, syndicate travel organizers, and financial analysts.
            </p>
          </div>

          {/* 2x2 Grid of 4 White Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Card 1 */}
            <div className="bg-white rounded-[10px] p-8 shadow-[0_1px_3px_rgba(0,0,0,0.1)] text-slate-800 flex flex-col justify-between">
              <div>
                {/* 5-star rating in #1473E6 */}
                <div className="flex items-center gap-1 text-[#1473E6] mb-3">
                  <Star className="w-4 h-4 fill-[#1473E6]" />
                  <Star className="w-4 h-4 fill-[#1473E6]" />
                  <Star className="w-4 h-4 fill-[#1473E6]" />
                  <Star className="w-4 h-4 fill-[#1473E6]" />
                  <Star className="w-4 h-4 fill-[#1473E6]" />
                </div>
                <p className="text-sm italic text-black leading-relaxed">
                  "SplitSpace eliminated every single awkward calculation in our 5-person apartment. The debt simplifier collapsed 14 pending payments down to 3 quick transfers."
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100">
                <p className="text-xs font-bold text-[#0060A8] uppercase tracking-wider">
                  Devendra Roy
                </p>
                <p className="text-[11px] text-[#6C6C6C]">Shared Flat Coordinator, Bangalore</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-[10px] p-8 shadow-[0_1px_3px_rgba(0,0,0,0.1)] text-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-[#1473E6] mb-3">
                  <Star className="w-4 h-4 fill-[#1473E6]" />
                  <Star className="w-4 h-4 fill-[#1473E6]" />
                  <Star className="w-4 h-4 fill-[#1473E6]" />
                  <Star className="w-4 h-4 fill-[#1473E6]" />
                  <Star className="w-4 h-4 fill-[#1473E6]" />
                </div>
                <p className="text-sm italic text-black leading-relaxed">
                  "The microservices architecture is noticeable. Pages render instantly, invite codes work without registration delays, and personal expenses stay neatly isolated."
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100">
                <p className="text-xs font-bold text-[#0060A8] uppercase tracking-wider">
                  Rohan Malhotra
                </p>
                <p className="text-[11px] text-[#6C6C6C]">Systems Engineer & Group Traveler</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-[10px] p-8 shadow-[0_1px_3px_rgba(0,0,0,0.1)] text-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-[#1473E6] mb-3">
                  <Star className="w-4 h-4 fill-[#1473E6]" />
                  <Star className="w-4 h-4 fill-[#1473E6]" />
                  <Star className="w-4 h-4 fill-[#1473E6]" />
                  <Star className="w-4 h-4 fill-[#1473E6]" />
                  <Star className="w-4 h-4 fill-[#1473E6]" />
                </div>
                <p className="text-sm italic text-black leading-relaxed">
                  "Finally, an expense app that doesn't feel like a toy. The clean corporate aquatic styling and crisp categories give me complete visibility into my spending."
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100">
                <p className="text-xs font-bold text-[#0060A8] uppercase tracking-wider">
                  Priya Swaminathan
                </p>
                <p className="text-[11px] text-[#6C6C6C]">Financial Auditor</p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-[10px] p-8 shadow-[0_1px_3px_rgba(0,0,0,0.1)] text-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-[#1473E6] mb-3">
                  <Star className="w-4 h-4 fill-[#1473E6]" />
                  <Star className="w-4 h-4 fill-[#1473E6]" />
                  <Star className="w-4 h-4 fill-[#1473E6]" />
                  <Star className="w-4 h-4 fill-[#1473E6]" />
                  <Star className="w-4 h-4 fill-[#1473E6]" />
                </div>
                <p className="text-sm italic text-black leading-relaxed">
                  "Our Goa trip with 9 people would have taken days to reconcile. With SplitSpace, everyone keyed in their receipts, and the balance sheet settled within minutes."
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100">
                <p className="text-xs font-bold text-[#0060A8] uppercase tracking-wider">
                  Tanmay Joshi
                </p>
                <p className="text-[11px] text-[#6C6C6C]">Product Strategist</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 7. BOOKING & CONSULTATION FORM (Two-Column on White) */}
      <section id="consultation" className="py-20 bg-white">
        <div className="max-w-[1170px] mx-auto px-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Title with #1473E6 underline and contact metadata */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <h2 className="text-[24px] font-bold uppercase tracking-tight text-[#0060A8]">
                  Guild Consultation
                </h2>
                <div className="w-12 h-1 bg-[#1473E6] mt-1"></div>
              </div>

              <p className="text-sm text-[#6C6C6C] leading-relaxed">
                Need customized group spaces for large co-living communities, commercial team expense budgets, or enterprise microservice deployment? Schedule a review with our architecture team.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-3 text-xs text-slate-700">
                  <div className="w-8 h-8 rounded-lg bg-[#F1F5F8] text-[#1473E6] flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Institutional Email</span>
                    <span className="font-semibold text-slate-800">institutional@splitspace.io</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-700">
                  <div className="w-8 h-8 rounded-lg bg-[#F1F5F8] text-[#1473E6] flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Desk Support</span>
                    <span className="font-semibold text-slate-800">+91 (80) 4122-9080</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-700">
                  <div className="w-8 h-8 rounded-lg bg-[#F1F5F8] text-[#1473E6] flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Headquarters</span>
                    <span className="font-semibold text-slate-800">Koramangala Financial District, Bengaluru</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Form with inputs (10px radius, #F1F5F8 bg, no borders) */}
            <div className="lg:col-span-7 bg-white p-8 rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] border border-slate-100">
              
              {bookingSubmitted ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Inquiry Dispatched</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Our institutional onboarding team will review your group specifications and reach out within 2 business hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6C6C6C] mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Alex Morgan"
                        value={bookingData.name}
                        onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-[#F1F5F8] rounded-[10px] text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#1473E6]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6C6C6C] mb-1.5">
                        Work Email
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="alex@organization.com"
                        value={bookingData.email}
                        onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-[#F1F5F8] rounded-[10px] text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#1473E6]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6C6C6C] mb-1.5">
                        Space Size
                      </label>
                      <select
                        value={bookingData.teamSize}
                        onChange={(e) => setBookingData({ ...bookingData, teamSize: e.target.value })}
                        className="w-full px-4 py-3 bg-[#F1F5F8] rounded-[10px] text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#1473E6]"
                      >
                        <option value="2-4 Members">2-4 Members</option>
                        <option value="5-15 Members">5-15 Members</option>
                        <option value="15-50 Members">15-50 Members</option>
                        <option value="50+ Enterprise">50+ Enterprise Guild</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6C6C6C] mb-1.5">
                        Primary Use Case
                      </label>
                      <select
                        value={bookingData.useCase}
                        onChange={(e) => setBookingData({ ...bookingData, useCase: e.target.value })}
                        className="w-full px-4 py-3 bg-[#F1F5F8] rounded-[10px] text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#1473E6]"
                      >
                        <option value="Household & Roommates">Household & Roommates</option>
                        <option value="Travel Syndicate">Travel Syndicate</option>
                        <option value="Departmental Budget">Departmental Budget</option>
                        <option value="Personal Ledger">Personal Ledger</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6C6C6C] mb-1.5">
                      Requirements & Integration Notes
                    </label>
                    <textarea
                      rows="3"
                      placeholder="Specify approximate monthly volume, multi-currency needs, etc."
                      value={bookingData.notes}
                      onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                      className="w-full px-4 py-3 bg-[#F1F5F8] rounded-[10px] text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#1473E6]"
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-[#0066AE] hover:bg-[#0060A8] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Submit Guild Inquiry</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </form>
              )}

            </div>

          </div>

        </div>
      </section>

      {/* 8. FOOTER (Deep Navy #031120, 4-Column Layout, #9CA3AF Text) */}
      <footer className="bg-[#031120] text-[#9CA3AF] pt-16 pb-8 border-t border-white/10">
        <div className="max-w-[1170px] mx-auto px-6">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12">
            
            {/* Column 1: Brand / Logo */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[8px] bg-[#0060A8] flex items-center justify-center text-white font-extrabold text-sm">
                  S
                </div>
                <span className="text-lg font-bold uppercase tracking-tight text-white">
                  Split<span className="text-emerald-400">Space</span>
                </span>
              </div>
              <p className="text-xs leading-relaxed text-[#9CA3AF]">
                Institutional-grade financial infrastructure engineered for multi-member expense sharing and accurate debt minimization.
              </p>
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Microservices</span>
              </div>
            </div>

            {/* Column 2: Site Map */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
                Platform Map
              </h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#services" className="hover:text-white transition-colors">Group Settlement</a></li>
                <li><a href="#architecture" className="hover:text-white transition-colors">System Architecture</a></li>
                <li><a href="#memberships" className="hover:text-white transition-colors">Membership Tiers</a></li>
                <li><a href="#testimonials" className="hover:text-white transition-colors">Testimonial Reviews</a></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Member Sign In</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Register Account</Link></li>
              </ul>
            </div>

            {/* Column 3: Contact Info */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
                Institutional Contact
              </h4>
              <ul className="space-y-2 text-xs">
                <li className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#1473E6]" />
                  <span>support@splitspace.io</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#1473E6]" />
                  <span>+91 (80) 4122-9080</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#1473E6]" />
                  <span>Koramangala, Bengaluru</span>
                </li>
              </ul>
            </div>

            {/* Column 4: Social / Verification */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
                Network Links
              </h4>
              <p className="text-xs text-[#9CA3AF] mb-3">
                Connect with our engineering status page and active GitHub repository.
              </p>
              <div className="flex items-center gap-3">
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-colors"
                >
                  GitHub
                </a>
                <a 
                  href="#services" 
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-colors"
                >
                  Status
                </a>
              </div>
            </div>

          </div>

          {/* Bottom Strip: Copyright & Legal */}
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9CA3AF]">
            <div>
              &copy; {new Date().getFullYear()} SplitSpace Technologies Inc. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <a href="#services" className="hover:text-white transition-colors">Privacy Protocol</a>
              <a href="#services" className="hover:text-white transition-colors">Terms of Governance</a>
              <a href="#services" className="hover:text-white transition-colors">Security Disclosure</a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default Landing;
