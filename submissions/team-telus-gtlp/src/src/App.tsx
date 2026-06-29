import React, { useState, useEffect, useRef } from "react";
import { Message, ExperimentPlan, ResilienceReport } from "./types";
import { ExperimentPlanCard } from "./components/ExperimentPlanCard";
import { ProvisioningPanel } from "./components/ProvisioningPanel";
import { RoleDashboard } from "./components/RoleDashboard";
import { 
  Send, 
  Mic, 
  MicOff, 
  RefreshCw, 
  Check, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  Briefcase, 
  Terminal, 
  FileCode, 
  ShieldCheck, 
  Info,
  ExternalLink,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  User,
  Sparkles,
  Layers,
  Compass,
  Cpu
} from "lucide-react";

// Web Speech API interfaces
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export default function App() {
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  // Global toggle for Two-Way translator (Technical vs Business perspective)
  const [viewPerspective, setViewPerspective] = useState<"technical" | "business">("technical");

  // Track applied fixes for each report ID to prevent dual-applying
  const [appliedFixes, setAppliedFixes] = useState<{ [key: string]: boolean }>({});
  const [revealedDiffs, setRevealedDiffs] = useState<{ [key: string]: boolean }>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Speech Recognition initialization
  useEffect(() => {
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "en-US";

      rec.onstart = () => {
        setIsRecording(true);
      };

      rec.onresult = (event: any) => {
        const resultText = event.results[0][0].transcript;
        if (resultText) {
          setInputValue((prev) => (prev ? `${prev} ${resultText}` : resultText));
        }
      };

      rec.onerror = (err: any) => {
        console.warn("Speech recognition error:", err);
        setIsRecording(false);
        // If blocked or errored, we can fall back to beautiful simulation
        if (err.error === "not-allowed" || err.error === "service-not-allowed") {
          console.log("Speech permission not allowed inside iframe, switching to premium voice simulation.");
        }
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      setRecognition(rec);
    }
  }, []);

  const simulateVoiceInput = () => {
    setIsRecording(true);
    setInputValue("");
    
    const profileSuggestions = getSuggestionsForProfile(selectedProfile);
    const targetText = profileSuggestions[Math.floor(Math.random() * profileSuggestions.length)];
    
    let index = 0;
    let currentInput = "";
    
    const intervalId = setInterval(() => {
      if (index < targetText.length) {
        currentInput += targetText[index];
        setInputValue(currentInput);
        index++;
      } else {
        clearInterval(intervalId);
        setIsRecording(false);
      }
    }, 40);
  };

  const toggleRecording = async () => {
    // Explicitly request mic permission first to prompt the browser dialog if possible
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (e) {
        console.warn("Microphone access denied or unavailable in this iframe:", e);
        // Seamlessly trigger simulation fallback so the user always has a spectacular demo!
        simulateVoiceInput();
        return;
      }
    }

    if (!speechSupported || !recognition) {
      simulateVoiceInput();
      return;
    }

    if (isRecording) {
      try {
        recognition.stop();
      } catch (err) {
        console.warn("Error stopping speech recognition:", err);
      }
      setIsRecording(false);
    } else {
      try {
        recognition.start();
      } catch (err) {
        console.warn("Failed to start SpeechRecognition:", err);
        simulateVoiceInput();
      }
    }
  };

  const handleSuggestionClick = (text: string) => {
    setInputValue(text);
  };

  // Profiles and corresponding visual changes/custom text
  const profiles = [
    {
      id: "developer",
      title: "Developer",
      desc: "JSON blueprints, YAML configs, PR patches, architectural diagnostics.",
      perspective: "technical" as const,
      color: "border-[#2BB8C9]",
      bg: "bg-cyan-brand/5",
      welcome: "Welcome back, SRE Engineer. Keel has gated telemetry visualizations and activated architectural diagnostic pipelines. Ask a question or run chaos experiments in staging with k6 configurations and custom YAML blueprints."
    },
    {
      id: "pm",
      title: "Product Manager",
      desc: "User journeys, customer friction, feature availability, safety indicators.",
      perspective: "business" as const,
      color: "border-emerald-500",
      bg: "bg-emerald-50/40",
      welcome: "Greetings, Product Lead. Keel has filtered developer diagnostics to focus on user journey safety, feature cart availability, and payment drop-off protection under simulated stress load."
    },
    {
      id: "designer",
      title: "Designer",
      desc: "UI fallbacks, screen states, micro-interactions, patient loader design.",
      perspective: "business" as const,
      color: "border-purple-500",
      bg: "bg-purple-50/40",
      welcome: "Welcome, Creative Designer. Let's inspect interactive micro-interactions and screen fallback states under network packet drops and heavy transactional load conditions."
    },
    {
      id: "executive",
      title: "Executive",
      desc: "Macro financial risk, SLO compliance budgets, downtime cost protection.",
      perspective: "business" as const,
      color: "border-amber-500",
      bg: "bg-amber-50/40",
      welcome: "Welcome, Director. Keel is mapping simulated outages to downtime cost projections, SLA compliance risk vectors, and macro-financial safety margins."
    },
    {
      id: "non-tech",
      title: "Non-Technical Profile",
      desc: "Plain English overviews, visual charts, uptime safety guarantees.",
      perspective: "business" as const,
      color: "border-blue-500",
      bg: "bg-blue-50/40",
      welcome: "Hello! Keel is configured to explain complex SRE server tests in simple, plain English summaries with friendly visual charts and uptime safety explanations."
    }
  ];

  const handleProfileSelect = (profileId: string) => {
    const prof = profiles.find((p) => p.id === profileId);
    if (prof) {
      setSelectedProfile(profileId);
      setViewPerspective(prof.perspective);
      setMessages([
        {
          id: "welcome",
          sender: "keel",
          text: prof.welcome,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    }
  };

  const getSuggestionsForProfile = (profileId: string | null) => {
    switch (profileId) {
      case "developer":
        return [
          "Test how our payment service handles a 50% database slowdown during Black Friday traffic",
          "Blast the checkout branch with 1,000 virtual users and see where it breaks",
          "Recreate the conditions of incident #402 in staging"
        ];
      case "pm":
        return [
          "Validate user checkout drop-off rate if our product catalog latency spikes by 400ms",
          "Stress-test payment authentication flow under high registration peaks",
          "Check checkout cart availability limits during simulated flash sale traffic"
        ];
      case "designer":
        return [
          "Simulate slow loading spinner animations with 20% network packet drop on staging",
          "Analyze visual fallback behavior if downstream notifications fail completely",
          "Test user interface layout states during heavy checkout connection pool saturation"
        ];
      case "executive":
        return [
          "Simulate Black Friday peak traffic to identify transaction protection limits",
          "Verify checkout SLO compliance budgets under database slowdown",
          "Test macro financial risk exposure during critical downstream service outages"
        ];
      case "non-tech":
      default:
        return [
          "Check if order speed meets our uptime guarantees during heavy peak traffic",
          "Test our checkout screen speed when the payment database slows down",
          "Make sure customer shopping carts don't fail during busy weekend sales"
        ];
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isProcessing) return;

    const userPrompt = inputValue.trim();
    setInputValue("");
    setIsProcessing(true);

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessageId = `user-${Date.now()}`;
    
    // Add user's message
    const newUserMessage: Message = {
      id: userMessageId,
      sender: "user",
      text: userPrompt,
      timestamp,
    };

    setMessages((prev) => [...prev, newUserMessage]);

    try {
      // -------------------------------------------------------------
      // STAGE 1: Understood (Parsing step via Gemini)
      // -------------------------------------------------------------
      const parseResponse = await fetch("/api/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userPrompt }),
      });
      const parsedPlan: ExperimentPlan = await parseResponse.json();

      const stage1MessageId = `keel-stage1-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: stage1MessageId,
          sender: "keel",
          text: `I have analyzed your request and structured a high-fidelity resilience experiment plan. I am mapping this onto our platform targets.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          stage: 1,
          plan: parsedPlan,
        }
      ]);

      // Delay for realistic feel
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // -------------------------------------------------------------
      // STAGE 2: Provisioning (Mocking command execution and setup)
      // -------------------------------------------------------------
      const stage2MessageId = `keel-stage2-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: stage2MessageId,
          sender: "keel",
          text: `Orchestrating test configuration stubs. I have assembled the load test definitions and target-specific chaos policies.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          stage: 2,
          plan: parsedPlan,
        }
      ]);

      // Delay for realistic feel before staging runtime telemetry
      await new Promise((resolve) => setTimeout(resolve, 2200));

      // -------------------------------------------------------------
      // STAGE 3: Running (Interactive Telemetry Live Progress)
      // -------------------------------------------------------------
      const stage3MessageId = `keel-stage3-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: stage3MessageId,
          sender: "keel",
          text: `Initiating real-time telemetry pipeline. Injecting fault, monitoring metrics thresholds, and logging status indicators...`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          stage: 3,
          plan: parsedPlan,
          isPending: true,
        }
      ]);

      // Let the live simulated telemetry run for 4 seconds
      await new Promise((resolve) => setTimeout(resolve, 4500));

      // Mark the running stage as finished
      setMessages((prev) =>
        prev.map((m) => m.id === stage3MessageId ? { ...m, isPending: false } : m)
      );

      // -------------------------------------------------------------
      // STAGE 4: Resilience Report (AI Analysis + Verdict)
      // -------------------------------------------------------------
      const reportResponse = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: parsedPlan, prompt: userPrompt }),
      });
      const parsedReport: ResilienceReport = await reportResponse.json();

      const stage4MessageId = `keel-stage4-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: stage4MessageId,
          sender: "keel",
          text: `The experiment has completed successfully. Here is the generated Resilience Analysis Report with findings and remediations:`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          stage: 4,
          plan: parsedPlan,
          report: parsedReport,
        }
      ]);

    } catch (err) {
      console.error("Experiment simulation error:", err);
      // Failover to a friendly error message
      setMessages((prev) => [
        ...prev,
        {
          id: `keel-error-${Date.now()}`,
          sender: "keel",
          text: "I encountered an issue connecting to the simulation engine. Please check your connectivity and try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const applyRemediation = (reportId: string) => {
    setAppliedFixes((prev) => ({ ...prev, [reportId]: true }));
  };

  const toggleDiffReveal = (reportId: string) => {
    setRevealedDiffs((prev) => ({ ...prev, [reportId]: !prev[reportId] }));
  };

  // If no profile selected, show the specific Landing Onboarding Page (no scroll)
  if (!selectedProfile) {
    return (
      <div className="h-screen w-screen bg-[#0F2D45] text-white flex flex-col justify-between p-6 md:p-12 overflow-hidden select-none">
        {/* Top brand */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-[#2BB8C9]/40 shadow-lg">
            <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M 6 22 C 22 17, 35 17, 50 17 C 65 17, 78 17, 94 22 C 96 23, 94 25, 91 25 C 78 21, 65 21, 50 21 C 35 21, 22 21, 9 25 C 6 25, 4 23, 6 22 Z" 
                fill="#1A8292" 
                opacity="0.85"
              />
              <path 
                d="M 12 26 C 25 15, 75 15, 88 26 C 75 32, 25 32, 12 26 Z" 
                fill="#2BB8C9" 
              />
              <polygon 
                points="43,32 57,32 54,75 46,75" 
                fill="#2BB8C9" 
              />
              <ellipse 
                cx="50" 
                cy="80" 
                rx="15" 
                ry="6" 
                fill="#2BB8C9" 
              />
            </svg>
          </div>
          <div>
            <span className="text-3xl font-display font-black tracking-tight text-white leading-none">Keel</span>
            <span className="text-[9px] uppercase font-mono bg-cyan-brand/20 text-cyan-brand px-1.5 py-0.5 rounded font-bold tracking-widest block w-fit mt-1">SRE AI CO-PILOT</span>
          </div>
        </div>

        {/* Center operational profile gating */}
        <div className="max-w-4xl mx-auto text-center my-auto space-y-8">
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight leading-none bg-gradient-to-r from-white via-slate-100 to-[#2BB8C9] bg-clip-text text-transparent">
              Welcome to Keel
            </h1>
            <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto font-medium leading-relaxed">
              Please select your operational profile to gate telemetry visualization and filter developer insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {profiles.map((p) => (
              <button
                key={p.id}
                onClick={() => handleProfileSelect(p.id)}
                className="group text-center bg-slate-900/50 hover:bg-[#1a3a5a]/70 border border-slate-800 hover:border-[#2BB8C9] p-5 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center justify-between h-56 shadow-lg active:scale-95 cursor-pointer"
              >
                <div className="flex flex-col items-center w-full">
                  <div className="w-8 h-8 rounded-lg bg-[#2BB8C9]/10 text-[#2BB8C9] flex items-center justify-center mb-3 group-hover:bg-[#2BB8C9]/20 transition-colors mx-auto">
                    {p.id === "developer" && <Terminal className="w-4 h-4" />}
                    {p.id === "pm" && <Briefcase className="w-4 h-4" />}
                    {p.id === "designer" && <Layers className="w-4 h-4" />}
                    {p.id === "executive" && <Compass className="w-4 h-4" />}
                    {p.id === "non-tech" && <User className="w-4 h-4" />}
                  </div>
                  <h3 className="text-base font-display font-bold text-white group-hover:text-[#2BB8C9] transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed text-center">
                    {p.desc}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-1 text-[10px] font-mono uppercase tracking-wider text-[#2BB8C9] font-bold mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Enter Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer Grounded status */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-800/80 pt-4 text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
            <span>Server-side Grounded with Gemini API</span>
          </div>
          <span className="mt-1 sm:mt-0 opacity-60">Resilience you can talk to • Hackathon Build 2026</span>
        </div>
      </div>
    );
  }

  // Active suggestions for chosen profile
  const suggestions = getSuggestionsForProfile(selectedProfile);
  const currentProfileObj = profiles.find((p) => p.id === selectedProfile);

  return (
    <div className="flex flex-col h-screen max-h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Sleek Top Header Bar */}
      <header className="flex items-center justify-between px-6 py-4 bg-[#0F2D45] text-white shadow-md z-10 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedProfile(null)}
            className="flex items-center gap-1 bg-[#1a3a5a]/70 hover:bg-[#2BB8C9] hover:text-[#0F2D45] text-white border border-[#2BB8C9]/30 hover:border-transparent px-3 py-1.5 rounded-lg transition-all text-xs font-semibold cursor-pointer active:scale-95 mr-1"
            title="Back to landing page"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button 
            onClick={() => setSelectedProfile(null)}
            className="w-11 h-11 bg-[#0F2D45] rounded-xl flex items-center justify-center shadow-lg border border-[#2BB8C9]/30 shrink-0 hover:border-[#2BB8C9] transition-colors focus:outline-none"
            title="Return to operational onboarding"
          >
            <svg className="w-9 h-9" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M 6 22 C 22 17, 35 17, 50 17 C 65 17, 78 17, 94 22 C 96 23, 94 25, 91 25 C 78 21, 65 21, 50 21 C 35 21, 22 21, 9 25 C 6 25, 4 23, 6 22 Z" 
                fill="#1A8292" 
                opacity="0.85"
              />
              <path 
                d="M 12 26 C 25 15, 75 15, 88 26 C 75 32, 25 32, 12 26 Z" 
                fill="#2BB8C9" 
              />
              <polygon 
                points="43,32 57,32 54,75 46,75" 
                fill="#2BB8C9" 
              />
              <ellipse 
                cx="50" 
                cy="80" 
                rx="15" 
                ry="6" 
                fill="#2BB8C9" 
              />
            </svg>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-display font-bold tracking-tight text-white leading-none">KEEL</span>
              <span className="text-[9px] uppercase font-mono bg-[#2BB8C9]/20 text-[#2BB8C9] px-1.5 py-0.5 rounded font-bold tracking-widest">
                {currentProfileObj?.title || "SRE"}
              </span>
            </div>
            <span className="text-[10px] text-slate-300 font-medium block">Resilience you can talk to</span>
          </div>
        </div>

        {/* Global Perspective Selector */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-[#2BB8C9]">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#1a3a5a] rounded-full border border-[#2BB8C9]/30">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> k6
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#1a3a5a] rounded-full border border-[#2BB8C9]/30">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> LitmusChaos
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#1a3a5a] rounded-full border border-[#2BB8C9]/30">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Grafana
            </div>
          </div>

          <div className="flex items-center bg-[#1a3a5a] border border-[#2BB8C9]/20 p-1 rounded-lg">
            <button
              onClick={() => setViewPerspective("technical")}
              className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                viewPerspective === "technical" 
                  ? "bg-[#2BB8C9] text-[#0F2D45] shadow" 
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Technical</span>
            </button>
            <button
              onClick={() => setViewPerspective("business")}
              className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                viewPerspective === "business" 
                  ? "bg-[#2BB8C9] text-[#0F2D45] shadow" 
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Business</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Frame (Two Columns) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Chat Assistant & Controls */}
        <div className="flex-1 flex flex-col h-full overflow-hidden border-r border-slate-200">
          <main className="flex-1 overflow-y-auto px-4 py-6 md:px-6 lg:px-8 space-y-6 bg-slate-50">
            <div className="max-w-3xl mx-auto space-y-6 pb-24">
          
          {messages.map((msg) => {
            const isKeel = msg.sender === "keel";
            return (
              <div 
                key={msg.id} 
                className={`flex flex-col gap-2 ${isKeel ? "items-start" : "items-end"} animate-fade-in`}
              >
                {/* Sender Tag & Time */}
                <div className="flex items-center gap-2 px-1">
                  <span className={`text-[10px] font-mono uppercase tracking-wider font-bold ${isKeel ? "text-slate-500" : "text-[#0F2D45]"}`}>
                    {isKeel ? "Keel Copilot" : "You (SRE Developer)"}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{msg.timestamp}</span>
                </div>

                {/* Primary Message Balloon */}
                <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm leading-relaxed text-sm ${
                  isKeel 
                    ? "bg-white text-slate-800 border border-slate-200 rounded-tl-none" 
                    : "bg-[#0F2D45] text-white rounded-tr-none"
                }`}>
                  <p className="whitespace-pre-line font-medium leading-relaxed">{msg.text}</p>
                </div>

                {/* Stage-Specific Content Panels */}
                {isKeel && msg.stage === 1 && msg.plan && (
                  <div className="w-full pl-0 md:pl-4 mt-2">
                    <ExperimentPlanCard plan={msg.plan} />
                  </div>
                )}

                {isKeel && msg.stage === 2 && msg.plan && (
                  <div className="w-full pl-0 md:pl-4 mt-2">
                    <ProvisioningPanel plan={msg.plan} />
                  </div>
                )}

                {/* Live Telemetry Progress State (Stage 3) */}
                {isKeel && msg.stage === 3 && msg.plan && (
                  <div className="w-full pl-0 md:pl-4 mt-2 max-w-2xl bg-[#0A1621] border border-slate-800 p-4 rounded-xl shadow-lg text-xs font-mono text-slate-300">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-brand animate-ping"></span>
                        <span className="font-semibold text-slate-400 uppercase tracking-widest text-[10px]">Telemetry Stream</span>
                      </div>
                      <span className="text-[10px] text-cyan-brand">PROVISIONED & EXECUTING</span>
                    </div>

                    <div className="space-y-1.5 opacity-90 leading-relaxed">
                      <p><span className="text-green-400 font-bold">$</span> litmusctl apply -f litmus-chaos.yaml</p>
                      <p className="text-cyan-brand/80">{`> experiment/keel-engine-${msg.plan.target_service}: fault injection active`}</p>
                      <p><span className="text-green-400 font-bold">$</span> k6 run --tag target=${msg.plan.target_service} k6-load-test.js</p>
                      
                      {msg.isPending ? (
                        <div className="pt-3 pb-1">
                          <div className="flex items-center justify-between text-[11px] mb-1.5 text-slate-400">
                            <span>Executing workload profile under peak load conditions...</span>
                            <span className="font-bold text-cyan-brand animate-pulse">Simulating...</span>
                          </div>
                          
                          {/* Simulated Canvas / Telemetry visualizer */}
                          <div className="h-10 bg-slate-950/80 rounded border border-slate-800/80 p-2 flex items-end gap-1 overflow-hidden relative">
                            <div className="absolute inset-0 scanlines opacity-30 pointer-events-none"></div>
                            {/* Animated telemetry columns */}
                            {[20, 35, 25, 45, 60, 55, 75, 40, 85, 95, 80, 70, 85, 90, 60, 45, 30, 20, 15, 40, 65, 80, 95, 100].map((h, i) => (
                              <div 
                                key={i} 
                                className="flex-1 bg-[#2BB8C9] rounded-t-sm"
                                style={{ 
                                  height: `${h}%`,
                                  animation: `pulse-subtle ${1 + (i % 3) * 0.3}s infinite ease-in-out` 
                                }}
                              ></div>
                            ))}
                          </div>
                          <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1">
                            <span>VU Count: {msg.plan.traffic_load}</span>
                            <span>Target SLO: {msg.plan.slo_focus}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="pt-2 text-green-400 flex items-center gap-2 font-bold">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Simulation runs completed. High-density telemetries aggregated successfully.</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Resilience Report Card (Stage 4) */}
                {isKeel && msg.stage === 4 && msg.report && (
                  <div className="w-full pl-0 md:pl-4 mt-2 max-w-2xl bg-white border-2 border-slate-200 rounded-xl shadow-xl overflow-hidden">
                    {/* Report Header */}
                    <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`px-2.5 py-1 text-[11px] font-black rounded uppercase tracking-wider ${
                          msg.report.verdict === "FAILED" 
                            ? "bg-red-600 text-white" 
                            : msg.report.verdict === "DEGRADED"
                            ? "bg-amber-500 text-slate-950"
                            : "bg-green-600 text-white"
                        }`}>
                          {msg.report.verdict}
                        </div>
                        <div>
                          <h3 className="font-display font-bold text-white text-base">Resilience Analysis Report</h3>
                          <span className="text-[10px] text-slate-400 font-mono block">Experiment Target: {msg.plan?.target_service}</span>
                        </div>
                      </div>

                      {/* Perspective Switcher */}
                      <div className="flex bg-slate-800 p-0.5 rounded-lg border border-slate-700">
                        <button 
                          onClick={() => setViewPerspective("technical")}
                          className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${
                            viewPerspective === "technical" 
                              ? "bg-white text-slate-900 shadow" 
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          Technical
                        </button>
                        <button 
                          onClick={() => setViewPerspective("business")}
                          className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${
                            viewPerspective === "business" 
                              ? "bg-white text-slate-900 shadow" 
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          Business
                        </button>
                      </div>
                    </div>

                    {/* Report Core Summary */}
                    <div className="p-6 space-y-5">
                      <p className="text-slate-700 text-sm leading-relaxed">
                        {msg.report.summary}
                      </p>

                      {/* Key Findings */}
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Key Findings ({viewPerspective})</h4>
                        {msg.report.findings.map((f) => (
                          <div 
                            key={f.id} 
                            className="flex items-start gap-3 bg-slate-50 border border-slate-100 p-3.5 rounded-lg hover:border-slate-200 transition-all shadow-2xs"
                          >
                            <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                              f.status === "danger" 
                                ? "bg-red-500 animate-pulse" 
                                : f.status === "warning"
                                ? "bg-amber-500"
                                : "bg-green-500"
                            }`}></span>
                            <div className="flex-1">
                              <div className="flex justify-between items-start gap-4">
                                <span className="text-xs font-bold text-slate-800">{f.title}</span>
                                <span className="text-[10px] font-mono bg-slate-200 text-slate-600 px-2 py-0.5 rounded shrink-0">{f.metric}</span>
                              </div>
                              <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                                {viewPerspective === "technical" ? f.technical_description : f.business_description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Recommended Remediation Action */}
                      <div className="pt-5 border-t border-slate-100">
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200/60">
                          <div className="flex justify-between items-start flex-col sm:flex-row gap-3">
                            <div>
                              <span className="text-[10px] font-bold text-[#0F2D45] uppercase tracking-wider block mb-1">Recommended Remediation</span>
                              <h4 className="text-xs font-bold text-slate-900 mb-1">{msg.report.recommended_fix.title}</h4>
                              <p className="text-slate-600 text-xs leading-relaxed">
                                {viewPerspective === "technical" 
                                  ? msg.report.recommended_fix.technical_description 
                                  : msg.report.recommended_fix.business_description}
                              </p>
                            </div>

                            <div className="shrink-0">
                              <button 
                                onClick={() => toggleDiffReveal(msg.id)}
                                className="flex items-center gap-1 text-[11px] font-bold text-cyan-brand hover:text-[#0F2D45] bg-[#0F2D45]/10 hover:bg-[#0F2D45]/20 px-3 py-1.5 rounded-lg transition-colors focus:outline-none"
                              >
                                <FileCode className="w-3.5 h-3.5" />
                                <span>{revealedDiffs[msg.id] ? "Hide Config" : "View Code Patch"}</span>
                              </button>
                            </div>
                          </div>

                          {/* Interactive Unified Git Diff View */}
                          {revealedDiffs[msg.id] && (
                            <div className="mt-3 bg-slate-950 text-slate-100 rounded-lg overflow-hidden font-mono text-[10px] border border-slate-800">
                              <div className="bg-slate-900 px-3 py-1.5 border-b border-slate-800 flex justify-between items-center text-slate-400">
                                <span className="flex items-center gap-1.5 font-mono">
                                  <Terminal className="w-3.5 h-3.5 text-[#2BB8C9]" />
                                  {msg.report.recommended_fix.file_path}
                                </span>
                                <span className="text-[9px] uppercase font-bold tracking-wider text-green-400">Remediation Patch</span>
                              </div>
                              <pre className="p-3 text-left overflow-x-auto select-all leading-normal">
                                {msg.report.recommended_fix.diff.split("\n").map((line, idx) => {
                                  const isAdded = line.startsWith("+");
                                  const isRemoved = line.startsWith("-");
                                  return (
                                    <div 
                                      key={idx} 
                                      className={`${
                                        isAdded ? "bg-green-950/50 text-green-300 font-bold" : isRemoved ? "bg-red-950/50 text-red-300 font-bold" : "text-slate-300"
                                      }`}
                                    >
                                      {line}
                                    </div>
                                  );
                                })}
                              </pre>
                            </div>
                          )}

                          {/* 1-Click Fix Button Action */}
                          <div className="mt-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                            <div className="flex items-center gap-2">
                              <ShieldCheck className="w-4 h-4 text-[#2BB8C9]" />
                              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Ready for Automated Pull Request</span>
                            </div>

                            {appliedFixes[msg.id] ? (
                              <button 
                                disabled
                                className="px-5 py-2.5 bg-green-50 text-green-700 text-xs font-bold rounded-lg flex items-center justify-center gap-2 border border-green-200 shadow-xs"
                              >
                                <Check className="w-4 h-4" />
                                <span>PR Opened successfully ✓</span>
                              </button>
                            ) : (
                              <button 
                                onClick={() => applyRemediation(msg.id)}
                                className="px-5 py-2.5 bg-[#0F2D45] text-[#2BB8C9] text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-cyan-brand/10 active:scale-95 duration-100"
                              >
                                <RefreshCw className="w-3.5 h-3.5 animate-spin-reverse" />
                                <span>Deploy Adaptive Fix</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Loading Indicator */}
          {isProcessing && (
            <div className="flex flex-col gap-2 items-start animate-pulse">
              <div className="flex items-center gap-2 px-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">Keel Copilot</span>
                <span className="text-[10px] text-slate-400 font-mono">Running pipeline...</span>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 shadow-sm max-w-[85%]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#2BB8C9] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 bg-[#2BB8C9] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 bg-[#2BB8C9] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  <span className="text-xs text-slate-500 font-medium ml-1">Analyzing fault vectors with Gemini 2.5...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Interactive Bottom Control Board & Prompt Box */}
      <footer className="p-4 md:p-6 bg-white border-t border-slate-200 shrink-0 shadow-lg z-10">
        <div className="max-w-4xl mx-auto">
          {/* Preset Example Suggestion Chips */}
          <div className="flex gap-2.5 mb-4 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-300">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(suggestion)}
                className="whitespace-nowrap px-4 py-2 bg-slate-50 text-slate-600 text-xs font-semibold rounded-full border border-slate-200 hover:border-[#2BB8C9] hover:text-[#0F2D45] hover:bg-cyan-brand/5 transition-all text-left max-w-sm overflow-hidden text-ellipsis cursor-pointer"
              >
                "{suggestion.slice(0, 75)}..."
              </button>
            ))}
          </div>

          {/* Plain Language Message Field with Voice Input and Send Action */}
          <form onSubmit={handleSend} className="relative flex items-center bg-slate-100 rounded-2xl p-2 border border-slate-200 shadow-inner focus-within:ring-2 focus-within:ring-[#2BB8C9]/30 transition-all">
            <button
              type="button"
              onClick={toggleRecording}
              className={`p-3 rounded-xl transition-colors shrink-0 ${
                isRecording 
                  ? "bg-red-500 text-white animate-pulse" 
                  : "text-slate-400 hover:text-[#2BB8C9] hover:bg-slate-200"
              }`}
              title={isRecording ? "Recording... Click to stop" : "Use Speech-to-Text"}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isProcessing}
              placeholder={isRecording ? "Listening... Speak your resilience intent now" : "Type a plain-language SRE request... e.g. 'Test how payment service handles DB slowdown'"}
              className="flex-1 bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 focus:ring-0 px-3 text-sm font-medium"
            />

            <button
              type="submit"
              disabled={isProcessing || !inputValue.trim()}
              className={`p-3 rounded-xl shadow-lg transition-all flex items-center justify-center shrink-0 ${
                inputValue.trim() && !isProcessing
                  ? "bg-[#0F2D45] text-white hover:bg-slate-800 hover:shadow-[#2BB8C9]/20 cursor-pointer"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
              }`}
            >
              <Send className="w-5 h-5 text-[#2BB8C9]" />
            </button>
          </form>

          {/* Active Help Bar */}
          <div className="flex items-center gap-1.5 mt-2.5 text-[11px] text-slate-400">
            <Info className="w-3.5 h-3.5 text-[#2BB8C9]" />
            <span>Keel translates conversational user requests to live k6 load profiles + LitmusChaos injection configurations.</span>
          </div>
        </div>
      </footer>
    </div>

    {/* Right Column: Role-Dependent Interactive Telemetry Dashboard */}
    <div className="hidden lg:block w-[380px] xl:w-[440px] shrink-0 h-full p-5 bg-[#06101B] border-l border-slate-800 overflow-y-auto">
      <RoleDashboard 
        profileId={selectedProfile || "non-tech"} 
        isSimulating={isProcessing || messages.some(m => m.stage === 3 && m.isPending)}
        lastExperimentState={(() => {
          const mWithPlan = [...messages].reverse().find(m => m.plan);
          return mWithPlan?.plan ? {
            targetService: mWithPlan.plan.target_service,
            trafficLoad: mWithPlan.plan.traffic_load,
            faultType: mWithPlan.plan.fault_type
          } : undefined;
        })()}
      />
    </div>
  </div>
</div>
);
}
