import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, Search, Users, Calendar, BarChart3, Shield, ArrowRight, CheckCircle, Star, ChevronRight, Zap, Globe, Award, TrendingUp, Building2, UserCheck, Clock, FileText } from "lucide-react";
import { useAuth } from "../App";

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  // If user is already logged in, redirect to their dashboard
  useEffect(() => {
    if (user) {
      if (user.role === "HR_MANAGER") {
        navigate("/layout/dashboard");
      } else {
        navigate("/applicantlayout/user/dashboard");
      }
    }
  }, [user, navigate]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const stats = [
    { value: "10,000+", label: "Active Jobs", icon: Briefcase },
    { value: "5,000+", label: "Companies Hiring", icon: Building2 },
    { value: "50,000+", label: "Candidates Placed", icon: UserCheck },
    { value: "98%", label: "Satisfaction Rate", icon: Star },
  ];

  const candidateFeatures = [
    { icon: Search, title: "Smart Job Search", desc: "Find roles that match your skills with our intelligent search and filtering system." },
    { icon: FileText, title: "One-Click Apply", desc: "Build your profile once and apply to hundreds of positions with a single click." },
    { icon: Clock, title: "Real-Time Tracking", desc: "Track every application from submission to offer with live status updates." },
    { icon: Calendar, title: "Interview Scheduler", desc: "Manage and prepare for interviews with our integrated scheduling tools." },
  ];

  const employerFeatures = [
    { icon: Users, title: "Talent Pipeline", desc: "Build and manage a pipeline of qualified candidates for current and future roles." },
    { icon: BarChart3, title: "Analytics Dashboard", desc: "Get real-time insights into your recruitment funnel and hiring metrics." },
    { icon: Shield, title: "Secure & Compliant", desc: "Enterprise-grade security with full compliance for candidate data protection." },
    { icon: Zap, title: "Fast Hiring", desc: "Reduce time-to-hire by 60% with automated workflows and smart screening." },
  ];

  const testimonials = [
    { name: "Sarah Johnson", role: "Software Engineer", company: "TechCorp", text: "HireHub helped me land my dream job in just 2 weeks. The application tracking feature is a game-changer!", rating: 5 },
    { name: "Michael Chen", role: "HR Director", company: "InnovateCo", text: "We've reduced our hiring time by 50% since switching to HireHub. The analytics are incredibly insightful.", rating: 5 },
    { name: "Priya Patel", role: "Product Manager", company: "StartupXYZ", text: "The best recruitment platform I've used. Clean interface, powerful features, and excellent support.", rating: 5 },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* ═══════════════════════ NAVBAR ═══════════════════════ */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 leading-none tracking-tight">HireHub</h1>
                <p className="text-[10px] text-gray-500 font-medium">Recruitment System</p>
              </div>
            </div>

            {/* Nav Links (Desktop) */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">How It Works</a>
              <a href="#testimonials" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Testimonials</a>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/signin")}
                className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md shadow-blue-600/25 hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5"
              >
                Get Started Free
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════ HERO SECTION ═══════════════════════ */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/60"></div>
        <div className="absolute top-20 right-0 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl"></div>

        {/* Floating shapes */}
        <div className="absolute top-32 left-10 w-4 h-4 bg-blue-400 rounded-full opacity-60 animate-bounce" style={{ animationDelay: "0s", animationDuration: "3s" }}></div>
        <div className="absolute top-48 right-20 w-3 h-3 bg-indigo-400 rounded-full opacity-50 animate-bounce" style={{ animationDelay: "1s", animationDuration: "4s" }}></div>
        <div className="absolute bottom-32 left-1/4 w-5 h-5 bg-blue-300 rounded-full opacity-40 animate-bounce" style={{ animationDelay: "2s", animationDuration: "3.5s" }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full mb-6">
                <Zap className="h-3.5 w-3.5 text-blue-600" />
                <span className="text-xs font-semibold text-blue-700 tracking-wide">#1 RECRUITMENT PLATFORM</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
                Discover Your{" "}
                <span className="relative">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Next Great</span>
                </span>
                <br />
                Opportunity
              </h1>

              <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Connecting exceptional talent with the world's most innovative companies. Your career journey starts here.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => navigate("/signup")}
                  className="group px-8 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  Start Hiring Today
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate("/signin")}
                  className="px-8 py-3.5 text-base font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:text-blue-600 transition-all hover:-translate-y-0.5"
                >
                  Browse Jobs
                </button>
              </div>

              {/* Trust indicators */}
              <div className="mt-10 flex items-center gap-6 justify-center lg:justify-start">
                <div className="flex -space-x-2">
                  {["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500"].map((color, i) => (
                    <div key={i} className={`h-8 w-8 rounded-full ${color} border-2 border-white flex items-center justify-center text-white text-xs font-bold`}>
                      {["A", "S", "R", "K"][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 font-medium">Trusted by 50,000+ professionals</p>
                </div>
              </div>
            </div>

            {/* Right - Dashboard Preview Card */}
            <div className="hidden lg:block relative">
              <div className="relative">
                {/* Main card */}
                <div className="bg-white rounded-2xl shadow-2xl shadow-gray-200/60 border border-gray-100 p-6 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                  {/* Mini dashboard header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                        <Briefcase className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-bold text-gray-900 text-sm">HireHub Dashboard</span>
                    </div>
                    <div className="flex gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-red-400"></div>
                      <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                      <div className="h-3 w-3 rounded-full bg-green-400"></div>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    {[
                      { label: "Open Roles", value: "142", color: "text-blue-600", bg: "bg-blue-50" },
                      { label: "Applications", value: "1,847", color: "text-green-600", bg: "bg-green-50" },
                      { label: "Hired", value: "89", color: "text-purple-600", bg: "bg-purple-50" },
                    ].map((stat, i) => (
                      <div key={i} className={`${stat.bg} rounded-xl p-3 text-center`}>
                        <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                        <p className="text-[10px] text-gray-500 font-medium">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Job listing rows */}
                  {[
                    { title: "Senior React Developer", dept: "Engineering", status: "Active", statusColor: "bg-green-100 text-green-700" },
                    { title: "Product Designer", dept: "Design", status: "Active", statusColor: "bg-green-100 text-green-700" },
                    { title: "Data Scientist", dept: "Analytics", status: "Closed", statusColor: "bg-gray-100 text-gray-600" },
                  ].map((job, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-t border-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Briefcase className="h-3.5 w-3.5 text-gray-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{job.title}</p>
                          <p className="text-[10px] text-gray-400">{job.dept}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${job.statusColor}`}>{job.status}</span>
                    </div>
                  ))}
                </div>

                {/* Floating notification card */}
                <div className="absolute -bottom-4 -left-6 bg-white rounded-xl shadow-xl border border-gray-100 p-4 max-w-[200px] animate-pulse" style={{ animationDuration: "4s" }}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-6 w-6 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                    </div>
                    <span className="text-xs font-bold text-gray-900">New Hire!</span>
                  </div>
                  <p className="text-[10px] text-gray-500">Sarah accepted the Senior Developer offer.</p>
                </div>

                {/* Floating stats card */}
                <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-xl border border-gray-100 p-3 animate-pulse" style={{ animationDuration: "5s" }}>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-xs font-bold text-gray-900">+23%</p>
                      <p className="text-[9px] text-gray-400">Hire rate this month</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ STATISTICS ═══════════════════════ */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-white rounded-full"></div>
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-white rounded-full"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="text-center group">
                  <div className="h-12 w-12 bg-white/15 backdrop-blur rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-white/25 transition-colors">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-3xl sm:text-4xl font-extrabold text-white mb-1">{stat.value}</p>
                  <p className="text-sm text-blue-100 font-medium">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ FEATURES ═══════════════════════ */}
      <section id="features" className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full mb-4">
              <Globe className="h-3.5 w-3.5 text-blue-600" />
              <span className="text-xs font-semibold text-blue-700 tracking-wide">POWERFUL FEATURES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Everything You Need to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Hire Smarter</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Whether you're a candidate looking for your next role or an employer building a world-class team — we've got you covered.
            </p>
          </div>

          {/* For Candidates */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-10 w-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
                <Users className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">For Candidates</h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {candidateFeatures.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-100 hover:-translate-y-1 transition-all duration-300 group">
                    <div className="h-12 w-12 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl flex items-center justify-center mb-4 group-hover:from-emerald-100 group-hover:to-teal-100 transition-colors">
                      <Icon className="h-6 w-6 text-emerald-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">{feature.title}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* For Employers */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">For Employers</h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {employerFeatures.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-indigo-100 hover:-translate-y-1 transition-all duration-300 group">
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center mb-4 group-hover:from-blue-100 group-hover:to-indigo-100 transition-colors">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">{feature.title}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ HOW IT WORKS ═══════════════════════ */}
      <section id="how-it-works" className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full mb-4">
              <Award className="h-3.5 w-3.5 text-indigo-600" />
              <span className="text-xs font-semibold text-indigo-700 tracking-wide">SIMPLE PROCESS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Get Hired in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">3 Easy Steps</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our streamlined process gets you from registration to your dream job faster than ever.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-16 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-blue-200 via-indigo-300 to-blue-200"></div>

            {[
              { step: "01", title: "Create Your Profile", desc: "Sign up and build a comprehensive profile showcasing your skills, experience, and career goals.", icon: Users, color: "from-blue-500 to-blue-600" },
              { step: "02", title: "Discover Opportunities", desc: "Browse thousands of curated positions or let our smart matching algorithm find roles perfect for you.", icon: Search, color: "from-indigo-500 to-indigo-600" },
              { step: "03", title: "Get Hired", desc: "Apply with one click, track your applications in real-time, and land your ideal position.", icon: Award, color: "from-purple-500 to-purple-600" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="relative text-center group">
                  <div className={`h-16 w-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-white text-xs font-extrabold text-blue-600 border-2 border-blue-200 rounded-full h-7 w-7 flex items-center justify-center z-20">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ TESTIMONIALS ═══════════════════════ */}
      <section id="testimonials" className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow-50 border border-yellow-100 rounded-full mb-4">
              <Star className="h-3.5 w-3.5 text-yellow-600 fill-yellow-600" />
              <span className="text-xs font-semibold text-yellow-700 tracking-wide">TESTIMONIALS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Loved by{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Thousands</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hear from candidates and employers who transformed their hiring experience with HireHub.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed italic">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role} at {t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ CTA BANNER ═══════════════════════ */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
            Ready to Transform Your<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Hiring Experience?</span>
          </h2>
          <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of companies and candidates who trust HireHub for smarter, faster, and better recruitment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/signup")}
              className="group px-8 py-4 text-base font-semibold text-gray-900 bg-white rounded-xl hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              Get Started — It's Free
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate("/signin")}
              className="px-8 py-4 text-base font-semibold text-white border-2 border-white/30 rounded-xl hover:bg-white/10 hover:border-white/50 transition-all"
            >
              Sign In to Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ FOOTER ═══════════════════════ */}
      <footer className="bg-gray-900 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="h-9 w-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Briefcase className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">HireHub</h3>
              </div>
              <p className="text-sm leading-relaxed">
                The modern recruitment platform connecting exceptional talent with innovative companies worldwide.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">For Candidates</h4>
              <ul className="space-y-2.5 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Browse Jobs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Create Profile</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Career Resources</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Salary Guide</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">For Employers</h4>
              <ul className="space-y-2.5 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Post a Job</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Browse Candidates</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing Plans</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Enterprise Solutions</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Company</h4>
              <ul className="space-y-2.5 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm">&copy; {new Date().getFullYear()} HireHub. All rights reserved.</p>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
