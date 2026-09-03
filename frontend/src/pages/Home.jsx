import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../features/themeSlice";
import { useUser, UserButton } from "@clerk/react";
import {
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Users,
  Shield,
  Zap,
  BarChart3,
  Moon,
  Sun,
  ChevronDown,
  Check,
  Star,
  Layers,
  Kanban,
  Clock,
  MessageSquare,
  Flame,
  ArrowUpRight,
  FolderKanban,
  Boxes,
} from "lucide-react";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useSelector((state) => state.theme);
  const { user, isLoaded } = useUser();

  // Interactive Demo state
  const [activeTab, setActiveTab] = useState("kanban");
  const [openFaq, setOpenFaq] = useState(null);
  const [completedDemoTasks, setCompletedDemoTasks] = useState({
    task1: false,
    task2: true,
    task3: false,
  });

  const toggleDemoTask = (id) => {
    setCompletedDemoTasks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const faqs = [
    {
      q: "What is Flowio and who is it built for?",
      a: "Flowio is a modern, ultra-fast project management system designed for agile engineering teams, product managers, designers, and fast-growing startups who want seamless task tracking without bloat.",
    },
    {
      q: "Can I use Flowio for free?",
      a: "Yes! The Free Starter plan includes unlimited projects, up to 5 team members, Kanban boards, and real-time task discussions with zero cost.",
    },
    {
      q: "How does workspace collaboration work?",
      a: "Each organization can create dedicated workspaces. Workspace admins can invite members, assign roles (Admin, Member, Viewer), and manage project access granularly.",
    },
    {
      q: "Is there dark mode support?",
      a: "Flowio features first-class native dark and light themes crafted with custom HSL palettes for maximum contrast and eye comfort during long sprint sessions.",
    },
    {
      q: "How does authentication work?",
      a: "We provide secure enterprise-grade authentication with Clerk, supporting Google, GitHub, email passwordless OTP, and custom SSO integrations.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 selection:bg-blue-500 selection:text-white transition-colors duration-300">
      {/* Background Decorative Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-tr from-blue-600/20 via-indigo-500/20 to-purple-600/20 blur-[130px] rounded-full" />
        <div className="absolute top-1/2 -left-48 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute top-2/3 -right-48 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      {/* STICKY NAVBAR */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-zinc-950/80 border-b border-slate-200/80 dark:border-zinc-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="size-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <Boxes className="size-5" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-950 dark:from-white dark:via-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent">
              Flowio
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-zinc-400">
            <a href="#features" className="hover:text-blue-600 dark:hover:text-white transition-colors">
              Features
            </a>
            <a href="#demo" className="hover:text-blue-600 dark:hover:text-white transition-colors">
              Live Demo
            </a>
            <a href="#workflow" className="hover:text-blue-600 dark:hover:text-white transition-colors">
              Workflow
            </a>
            <a href="#testimonials" className="hover:text-blue-600 dark:hover:text-white transition-colors">
              Testimonials
            </a>
            <a href="#pricing" className="hover:text-blue-600 dark:hover:text-white transition-colors">
              Pricing
            </a>
            <a href="#faq" className="hover:text-blue-600 dark:hover:text-white transition-colors">
              FAQ
            </a>
          </nav>

          {/* Actions & Auth */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={() => dispatch(toggleTheme())}
              aria-label="Toggle Theme"
              className="size-9 rounded-lg flex items-center justify-center border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 transition-colors shadow-sm"
            >
              {theme === "light" ? (
                <Moon className="size-4" />
              ) : (
                <Sun className="size-4 text-amber-400" />
              )}
            </button>

            {/* Auth CTA */}
            {isLoaded && user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="size-4" />
                </Link>
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  to="/sign-in"
                  className="px-3.5 py-1.5 sm:px-4 sm:py-2 text-sm font-medium rounded-lg text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/sign-in"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Get Started</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 pt-16 pb-20 sm:pt-24 sm:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-200 dark:border-blue-900/60 bg-blue-50/80 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-medium mb-8 backdrop-blur-sm animate-pulse">
            <Sparkles className="size-3.5 text-blue-600 dark:text-blue-400" />
            <span>Flowio 2.0 is live — Built for high-velocity teams</span>
            <ArrowRight className="size-3" />
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-950 dark:text-white max-w-4xl mx-auto leading-[1.15]">
            Plan effortlessly. <br className="hidden sm:inline" />
            Collaborate in sync. <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Ship on time.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            The all-in-one project management hub with fluid Kanban boards, team workspaces, real-time analytics, and task workflows tailored for modern builders.
          </p>

          {/* Hero Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate(user ? "/dashboard" : "/sign-in")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-base font-semibold rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 text-white shadow-xl shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{user ? "Open Workspace" : "Start Free Today"}</span>
              <ArrowRight className="size-4" />
            </button>
            <a
              href="#demo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold rounded-xl border border-slate-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800/80 text-slate-800 dark:text-zinc-200 transition-all shadow-sm"
            >
              <Kanban className="size-4 text-blue-500" />
              <span>Explore Interactive Demo</span>
            </a>
          </div>

          {/* Metrics Pill */}
          <div className="mt-12 pt-8 border-t border-slate-200/60 dark:border-zinc-800/60 max-w-3xl mx-auto grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">99.9%</p>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-0.5">Uptime SLA</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">45,000+</p>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-0.5">Tasks Delivered</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">3.4x</p>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-0.5">Sprint Velocity</p>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE WORKSPACE DEMO SECTION */}
      <section id="demo" className="relative z-10 py-16 bg-slate-100/70 dark:bg-zinc-900/40 border-y border-slate-200/80 dark:border-zinc-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2">
              Interactive Preview
            </h2>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-950 dark:text-white">
              Experience the Flowio workspace interface
            </h3>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-zinc-400 max-w-xl mx-auto">
              Test out the live interactive preview below. Switch views or toggle task completion status right inside this mockup.
            </p>

            {/* View Selector Tabs */}
            <div className="mt-6 inline-flex p-1 bg-slate-200/80 dark:bg-zinc-800 rounded-xl">
              <button
                onClick={() => setActiveTab("kanban")}
                className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                  activeTab === "kanban"
                    ? "bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Kanban className="size-4" />
                <span>Kanban Board</span>
              </button>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                  activeTab === "analytics"
                    ? "bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <BarChart3 className="size-4" />
                <span>Sprint Analytics</span>
              </button>
            </div>
          </div>

          {/* Interactive Window Mockup */}
          <div className="rounded-2xl border border-slate-300/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-2xl shadow-blue-500/5 overflow-hidden">
            {/* Window Topbar */}
            <div className="px-4 py-3 bg-slate-100 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-red-400 inline-block" />
                <span className="size-3 rounded-full bg-amber-400 inline-block" />
                <span className="size-3 rounded-full bg-emerald-400 inline-block" />
                <span className="ml-3 text-xs font-mono text-slate-500 dark:text-zinc-500 hidden sm:inline">
                  Flowio Workspace • Q3 Engineering Sprint
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
                <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Real-time connected</span>
              </div>
            </div>

            {/* Board Content */}
            {activeTab === "kanban" ? (
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Column 1: To Do */}
                <div className="bg-slate-50 dark:bg-zinc-950/60 p-4 rounded-xl border border-slate-200/80 dark:border-zinc-800/80">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-slate-400" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                        To Do
                      </h4>
                    </div>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">
                      1
                    </span>
                  </div>

                  <div className="p-3 bg-white dark:bg-zinc-900 rounded-lg border border-slate-200 dark:border-zinc-800 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                        FEATURE
                      </span>
                      <span className="text-[10px] text-slate-400">#FL-104</span>
                    </div>
                    <p className="text-sm font-semibold mt-2 text-slate-800 dark:text-zinc-200">
                      Integrate Webhook alerts for Slack
                    </p>
                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3 text-amber-500" /> Sep 12
                      </span>
                      <div className="size-6 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-[10px]">
                        AW
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2: In Progress */}
                <div className="bg-slate-50 dark:bg-zinc-950/60 p-4 rounded-xl border border-slate-200/80 dark:border-zinc-800/80">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-blue-500" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                        In Progress
                      </h4>
                    </div>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                      2
                    </span>
                  </div>

                  {/* Task Card 1 */}
                  <div
                    onClick={() => toggleDemoTask("task1")}
                    className="p-3 bg-white dark:bg-zinc-900 rounded-lg border border-slate-200 dark:border-zinc-800 shadow-sm cursor-pointer hover:border-blue-500 transition-colors mb-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                        HIGH PRIORITY
                      </span>
                      <CheckCircle2
                        className={`size-4 transition-colors ${
                          completedDemoTasks.task1 ? "text-emerald-500 fill-emerald-100 dark:fill-emerald-950" : "text-slate-300 dark:text-zinc-700"
                        }`}
                      />
                    </div>
                    <p className={`text-sm font-semibold mt-2 ${completedDemoTasks.task1 ? "line-through text-slate-400" : "text-slate-800 dark:text-zinc-200"}`}>
                      Refactor PostgreSQL task schema queries
                    </p>
                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="size-3" /> 4 comments
                      </span>
                      <div className="size-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px]">
                        SD
                      </div>
                    </div>
                  </div>

                  {/* Task Card 2 */}
                  <div
                    onClick={() => toggleDemoTask("task3")}
                    className="p-3 bg-white dark:bg-zinc-900 rounded-lg border border-slate-200 dark:border-zinc-800 shadow-sm cursor-pointer hover:border-blue-500 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                        DESIGN
                      </span>
                      <CheckCircle2
                        className={`size-4 transition-colors ${
                          completedDemoTasks.task3 ? "text-emerald-500 fill-emerald-100 dark:fill-emerald-950" : "text-slate-300 dark:text-zinc-700"
                        }`}
                      />
                    </div>
                    <p className={`text-sm font-semibold mt-2 ${completedDemoTasks.task3 ? "line-through text-slate-400" : "text-slate-800 dark:text-zinc-200"}`}>
                      Dark mode UI polish for mobile viewport
                    </p>
                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3 text-blue-500" /> In review
                      </span>
                      <div className="size-6 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-[10px]">
                        MR
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 3: Completed */}
                <div className="bg-slate-50 dark:bg-zinc-950/60 p-4 rounded-xl border border-slate-200/80 dark:border-zinc-800/80">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-emerald-500" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                        Done
                      </h4>
                    </div>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                      3
                    </span>
                  </div>

                  <div className="p-3 bg-white dark:bg-zinc-900 rounded-lg border border-slate-200 dark:border-zinc-800 shadow-sm opacity-80">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                        COMPLETED
                      </span>
                      <CheckCircle2 className="size-4 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
                    </div>
                    <p className="text-sm font-semibold mt-2 line-through text-slate-400 dark:text-zinc-500">
                      Configure Clerk multi-tenant organization keys
                    </p>
                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
                      <span>Shipped on Monday</span>
                      <div className="size-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                        JS
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Analytics View */
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
                    <span className="text-xs text-slate-500 dark:text-zinc-400">Sprint Completion</span>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">87%</p>
                    <div className="w-full bg-slate-200 dark:bg-zinc-800 h-2 rounded-full mt-2 overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[87%]" />
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
                    <span className="text-xs text-slate-500 dark:text-zinc-400">Velocity (Pts / Wk)</span>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">42 pts</p>
                    <p className="text-xs text-emerald-600 mt-2 font-medium">↑ +14% from last sprint</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
                    <span className="text-xs text-slate-500 dark:text-zinc-400">Avg Cycle Time</span>
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">1.8 Days</p>
                    <p className="text-xs text-slate-500 mt-2">From In-Progress to Shipped</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-semibold text-slate-900 dark:text-white">Burndown Progress</h5>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">14 tasks completed • 2 pending review</p>
                  </div>
                  <button
                    onClick={() => navigate(user ? "/dashboard" : "/sign-in")}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    Launch Full Analytics
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CORE FEATURES GRID */}
      <section id="features" className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2">
              Everything You Need
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
              Crafted for modern software teams who value speed and clarity
            </h3>
            <p className="mt-3 text-slate-600 dark:text-zinc-400">
              Flowio blends powerful project management primitives with an interface that gets out of your way.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:shadow-lg hover:border-blue-500/40 transition-all group">
              <div className="size-11 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Kanban className="size-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Fluid Kanban Boards
              </h4>
              <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                Organize work visually with customizable columns, priority flags, tag filters, and instantaneous drag-and-drop state updates.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:shadow-lg hover:border-indigo-500/40 transition-all group">
              <div className="size-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="size-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Team Workspaces
              </h4>
              <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                Isolate departments or clients with dedicated workspaces. Assign granular roles (Admin, Member) with full permission security.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:shadow-lg hover:border-violet-500/40 transition-all group">
              <div className="size-11 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 className="size-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Actionable Velocity Metrics
              </h4>
              <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                Stay on top of sprint timelines, burndown charts, cycle time, and workload distribution across all active contributors.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:shadow-lg hover:border-amber-500/40 transition-all group">
              <div className="size-11 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Flame className="size-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Priority & Deadline Tracking
              </h4>
              <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                Never drop the ball on critical deliverables with intelligent visual cues, automated due date reminders, and priority escalation.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:shadow-lg hover:border-emerald-500/40 transition-all group">
              <div className="size-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="size-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Blazing Fast Performance
              </h4>
              <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                Built on top of Vite and React 19 for instantaneous page loads, zero UI lag, and smooth real-time optimistic mutations.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:shadow-lg hover:border-cyan-500/40 transition-all group">
              <div className="size-11 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="size-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Enterprise Authentication
              </h4>
              <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                Secured by Clerk with multi-factor authentication, organization invites, session controls, and strict workspace isolation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3-STEP WORKFLOW */}
      <section id="workflow" className="relative z-10 py-20 bg-slate-100/60 dark:bg-zinc-900/30 border-y border-slate-200 dark:border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2">
              Simple 3-Step Setup
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white">
              From idea to shipment in minutes
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="relative p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800">
              <span className="text-4xl font-extrabold text-blue-600/20 dark:text-blue-400/20 font-mono">01</span>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-2 mb-2">
                Create Workspace
              </h4>
              <p className="text-sm text-slate-600 dark:text-zinc-400">
                Set up your company or project workspace. Invite teammates with one click and configure custom role access.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800">
              <span className="text-4xl font-extrabold text-indigo-600/20 dark:text-indigo-400/20 font-mono">02</span>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-2 mb-2">
                Structure Sprints & Tasks
              </h4>
              <p className="text-sm text-slate-600 dark:text-zinc-400">
                Break milestones into bite-sized tasks, assign owners, set priorities, and collaborate via in-task comment threads.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800">
              <span className="text-4xl font-extrabold text-violet-600/20 dark:text-violet-400/20 font-mono">03</span>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-2 mb-2">
                Track Velocity & Ship
              </h4>
              <p className="text-sm text-slate-600 dark:text-zinc-400">
                Monitor burndown charts, review pull request integrations, and celebrate shipping on target every cycle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section id="testimonials" className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2">
              Loved by Engineers & Leaders
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white">
              Trusted across engineering, product, and design
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="size-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 dark:text-zinc-300 text-sm leading-relaxed italic">
                  “Flowio cut our weekly sprint planning overhead by half. The Kanban UI is clean, responsive, and doesn't get bogged down by endless enterprise bloat.”
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center gap-3">
                <div className="size-9 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                  EW
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-slate-900 dark:text-white">Elena Walsh</h5>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">VP of Engineering at Prism</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="size-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 dark:text-zinc-300 text-sm leading-relaxed italic">
                  “The multi-workspace feature allows our agency to manage 15+ clients seamlessly. Each client has their own workspace with zero cross-contamination.”
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center gap-3">
                <div className="size-9 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                  ML
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-slate-900 dark:text-white">Marcus Lin</h5>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">Founder & CTO at NexusLab</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="size-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 dark:text-zinc-300 text-sm leading-relaxed italic">
                  “The sleek dark mode and snappy keyboard flow make using Flowio an absolute joy. It’s the first PM tool our developers actually love opening.”
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center gap-3">
                <div className="size-9 rounded-full bg-violet-600 text-white font-bold text-xs flex items-center justify-center">
                  SA
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-slate-900 dark:text-white">Sarah Al-Mansoor</h5>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">Staff Product Designer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="relative z-10 py-20 bg-slate-100/60 dark:bg-zinc-900/30 border-y border-slate-200 dark:border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2">
              Simple, Predictable Pricing
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white">
              Start free, scale with your team
            </h3>
            <p className="mt-3 text-slate-600 dark:text-zinc-400">
              No hidden fees. Upgrade or cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
            {/* Starter Plan */}
            <div className="p-8 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col justify-between">
              <div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Starter</h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">For freelancers and small teams</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white">$0</span>
                  <span className="text-xs text-slate-500 dark:text-zinc-400">/ forever free</span>
                </div>
                <ul className="mt-6 space-y-3 text-sm text-slate-600 dark:text-zinc-300">
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-500" /> Up to 5 team members
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-500" /> Unlimited projects & tasks
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-500" /> Standard Kanban board
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-500" /> Community support
                  </li>
                </ul>
              </div>
              <button
                onClick={() => navigate(user ? "/dashboard" : "/sign-in")}
                className="mt-8 w-full py-2.5 px-4 text-sm font-semibold rounded-xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700 text-slate-900 dark:text-white transition-colors"
              >
                {user ? "Go to Dashboard" : "Get Started Free"}
              </button>
            </div>

            {/* Pro Plan - Highlighted */}
            <div className="relative p-8 rounded-2xl border-2 border-blue-600 dark:border-blue-500 bg-white dark:bg-zinc-900 shadow-xl shadow-blue-500/10 flex flex-col justify-between">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-blue-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-sm">
                Most Popular
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Pro Team</h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">For growing teams and startups</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white">$12</span>
                  <span className="text-xs text-slate-500 dark:text-zinc-400">/ user / month</span>
                </div>
                <ul className="mt-6 space-y-3 text-sm text-slate-600 dark:text-zinc-300">
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-blue-500" /> Unlimited team members
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-blue-500" /> Multi-workspace support
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-blue-500" /> Advanced Sprint velocity charts
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-blue-500" /> Role-based access control
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-blue-500" /> Priority email & chat support
                  </li>
                </ul>
              </div>
              <button
                onClick={() => navigate(user ? "/dashboard" : "/sign-in")}
                className="mt-8 w-full py-2.5 px-4 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {user ? "Go to Dashboard" : "Start 14-Day Free Trial"}
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="p-8 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col justify-between">
              <div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Enterprise</h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">For larger scale organizations</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white">Custom</span>
                </div>
                <ul className="mt-6 space-y-3 text-sm text-slate-600 dark:text-zinc-300">
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-indigo-500" /> Custom SLA & dedicated support
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-indigo-500" /> SAML SSO & Directory Sync
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-indigo-500" /> Custom audit logging & export
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-indigo-500" /> Dedicated account manager
                  </li>
                </ul>
              </div>
              <a
                href="mailto:contact@flowio.dev"
                className="mt-8 w-full py-2.5 px-4 text-center text-sm font-semibold rounded-xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700 text-slate-900 dark:text-white transition-colors block"
              >
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="relative z-10 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2">
              Got Questions?
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-950 dark:text-white">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`size-4 text-slate-500 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-4 text-sm text-slate-600 dark:text-zinc-400 border-t border-slate-100 dark:border-zinc-800/60 pt-3 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION BANNER */}
      <section className="relative z-10 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-8 sm:p-12 text-center text-white overflow-hidden shadow-2xl shadow-blue-500/20">
            {/* Background Glow */}
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to streamline your team’s delivery?
            </h3>
            <p className="mt-4 text-blue-100 max-w-xl mx-auto text-base sm:text-lg">
              Join thousands of creators, engineers, and product managers delivering projects with Flowio today.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate(user ? "/dashboard" : "/sign-in")}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-blue-600 hover:bg-blue-50 font-bold text-sm sm:text-base shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                {user ? "Open Your Workspace" : "Get Started for Free"}
              </button>
              <Link
                to="/projects"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-white/30 hover:bg-white/10 font-semibold text-sm sm:text-base transition-colors"
              >
                View Live Projects
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 py-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {/* Brand Col */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="size-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                  <Boxes className="size-4" />
                </div>
                <span className="text-lg font-bold text-slate-900 dark:text-white">Flowio</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed max-w-xs">
                Modern full-stack project management platform. Designed for fast-paced engineering teams and creators.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>All systems operational</span>
              </div>
            </div>

            {/* Col 2 */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
                Product
              </h5>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-zinc-400">
                <li><a href="#features" className="hover:text-blue-600 dark:hover:text-white transition-colors">Kanban Boards</a></li>
                <li><a href="#features" className="hover:text-blue-600 dark:hover:text-white transition-colors">Sprint Analytics</a></li>
                <li><a href="#workflow" className="hover:text-blue-600 dark:hover:text-white transition-colors">Team Workspaces</a></li>
                <li><a href="#pricing" className="hover:text-blue-600 dark:hover:text-white transition-colors">Pricing Plans</a></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
                Resources
              </h5>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-zinc-400">
                <li><a href="#faq" className="hover:text-blue-600 dark:hover:text-white transition-colors">Help & FAQ</a></li>
                <li><a href="#demo" className="hover:text-blue-600 dark:hover:text-white transition-colors">Interactive Demo</a></li>
                <li><a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-blue-600 dark:hover:text-white transition-colors">GitHub Repository</a></li>
                <li><Link to="/sign-in" className="hover:text-blue-600 dark:hover:text-white transition-colors">Member Sign In</Link></li>
              </ul>
            </div>

            {/* Col 4 */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
                Legal & Security
              </h5>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-zinc-400">
                <li><span className="hover:text-blue-600 dark:hover:text-white cursor-pointer">Privacy Policy</span></li>
                <li><span className="hover:text-blue-600 dark:hover:text-white cursor-pointer">Terms of Service</span></li>
                <li><span className="hover:text-blue-600 dark:hover:text-white cursor-pointer">Security Overview</span></li>
                <li><span className="hover:text-blue-600 dark:hover:text-white cursor-pointer">GDPR Compliance</span></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-zinc-500 gap-4">
            <p>© {new Date().getFullYear()} Flowio. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#features" className="hover:underline">Features</a>
              <a href="#pricing" className="hover:underline">Pricing</a>
              <a href="#faq" className="hover:underline">FAQ</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
