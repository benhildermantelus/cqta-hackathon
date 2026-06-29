import React, { useState, useEffect } from "react";
import { 
  Terminal, 
  Briefcase, 
  Layers, 
  Compass, 
  User, 
  Activity, 
  Cpu, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Clock, 
  AlertTriangle,
  Zap,
  TrendingDown,
  RefreshCw,
  Gauge
} from "lucide-react";

interface RoleDashboardProps {
  profileId: string;
  isSimulating: boolean;
  lastExperimentState?: {
    targetService: string;
    trafficLoad: string;
    faultType: string;
  };
}

export const RoleDashboard: React.FC<RoleDashboardProps> = ({ 
  profileId, 
  isSimulating,
  lastExperimentState 
}) => {
  const [simulationTick, setSimulationTick] = useState(0);

  // Animate dashboard values when a simulation is active
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSimulating) {
      interval = setInterval(() => {
        setSimulationTick((prev) => (prev + 1) % 100);
      }, 150);
    } else {
      setSimulationTick(0);
    }
    return () => clearInterval(interval);
  }, [isSimulating]);

  // Dynamic noise generator for metrics
  const getSimValue = (base: number, maxVariance: number, isBad = false) => {
    if (!isSimulating) return base;
    const shift = isBad 
      ? Math.sin(simulationTick * 0.4) * maxVariance + (maxVariance * 0.8) // climb high if simulating bad chaos
      : Math.cos(simulationTick * 0.4) * maxVariance - (maxVariance * 0.3); // decline/stabilize
    return Number((base + shift).toFixed(1));
  };

  // Render role-specific insights, KPIs, and custom designed graphs
  switch (profileId) {
    case "developer":
      return (
        <div className="bg-[#0A1621] text-slate-100 rounded-2xl border border-slate-800 p-5 space-y-6 h-full flex flex-col justify-between overflow-y-auto font-sans select-none relative">
          {/* Futuristic background grid lines */}
          <div className="absolute inset-0 scanlines opacity-5 pointer-events-none rounded-2xl"></div>
          
          <div className="space-y-5 relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-cyan-brand" />
                <div>
                  <h3 className="font-display font-bold text-sm tracking-wide text-white uppercase">SRE Developer Telemetry</h3>
                  <span className="text-[10px] text-slate-400 font-mono block">Node: cluster-us-east-prod</span>
                </div>
              </div>
              <span className="text-[9px] bg-cyan-brand/20 text-cyan-brand border border-cyan-brand/30 px-2 py-0.5 rounded font-mono font-bold animate-pulse">
                {isSimulating ? "SIMULATING FAULT..." : "METRICS OK"}
              </span>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#0F2D45]/40 border border-slate-800/80 rounded-xl p-3">
                <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider block mb-1">p95 Latency</span>
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-xl font-mono font-bold tracking-tight ${isSimulating ? "text-red-400" : "text-green-400"}`}>
                    {getSimValue(180, 560, true)} ms
                  </span>
                  {isSimulating && <TrendingUp className="w-3.5 h-3.5 text-red-400 animate-bounce" />}
                </div>
                <span className="text-[8px] text-slate-500 font-mono">SLO: &lt; 500ms</span>
              </div>

              <div className="bg-[#0F2D45]/40 border border-slate-800/80 rounded-xl p-3">
                <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider block mb-1">CPU Load</span>
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-xl font-mono font-bold tracking-tight ${isSimulating ? "text-amber-400" : "text-slate-200"}`}>
                    {getSimValue(38.4, 45, true)}%
                  </span>
                  {isSimulating && <Activity className="w-3.5 h-3.5 text-amber-400 animate-pulse" />}
                </div>
                <span className="text-[8px] text-slate-500 font-mono">Cluster Limit: 90%</span>
              </div>

              <div className="bg-[#0F2D45]/40 border border-slate-800/80 rounded-xl p-3">
                <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider block mb-1">HTTP Errors</span>
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-xl font-mono font-bold tracking-tight ${isSimulating ? "text-red-500" : "text-green-400"}`}>
                    {getSimValue(0.04, 12.4, true)}%
                  </span>
                </div>
                <span className="text-[8px] text-slate-500 font-mono">Acceptable: &lt; 1%</span>
              </div>

              <div className="bg-[#0F2D45]/40 border border-slate-800/80 rounded-xl p-3">
                <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider block mb-1">DB Connection Pool</span>
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-xl font-mono font-bold tracking-tight ${isSimulating ? "text-red-400" : "text-slate-200"}`}>
                    {isSimulating ? `${Math.min(80, Math.floor(getSimValue(45, 40, true)))}/80` : "12/80"}
                  </span>
                </div>
                <span className="text-[8px] text-slate-500 font-mono">Saturated threshold: 75</span>
              </div>
            </div>

            {/* Micro-Telemetry Stream Grid / Graph */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>p95 LATENCY METRIC TREND (60s)</span>
                <span className="text-[#2BB8C9]">Interval: 1s</span>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 h-32 flex flex-col justify-end relative overflow-hidden">
                <div className="absolute top-2 left-2 text-[8px] text-slate-600 font-mono">y-axis: ms</div>
                
                {/* SVG Live Rendered Graph */}
                <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="gradient-dev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2BB8C9" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#2BB8C9" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {isSimulating ? (
                    <>
                      {/* Chaotic latency curve */}
                      <path 
                        d="M0,35 Q15,32 30,10 T60,5 T90,2 T100,28 L100,40 L0,40 Z" 
                        fill="url(#gradient-dev)"
                      />
                      <path 
                        d="M0,35 Q15,32 30,10 T60,5 T90,2 T100,28" 
                        stroke="#ef4444" 
                        strokeWidth="1.5" 
                        fill="none"
                        className="animate-pulse-subtle"
                      />
                    </>
                  ) : (
                    <>
                      {/* Steady normal line */}
                      <path 
                        d="M0,32 Q15,31 30,30 T60,32 T90,31 T100,32 L100,40 L0,40 Z" 
                        fill="url(#gradient-dev)"
                      />
                      <path 
                        d="M0,32 Q15,31 30,30 T60,32 T90,31 T100,32" 
                        stroke="#2BB8C9" 
                        strokeWidth="1.2" 
                        fill="none"
                      />
                    </>
                  )}
                </svg>
                
                {/* Threshold warning line */}
                <div className="absolute top-[40%] left-0 right-0 h-px bg-red-500/40 border-dashed border-t border-red-500/20 flex items-center justify-end pr-2 pointer-events-none">
                  <span className="text-[7px] text-red-400 font-mono uppercase bg-slate-950/90 px-1 rounded">SLO Limit (500ms)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 border-t border-slate-800 pt-3 relative z-10">
            <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider block">Diagnostics Console</span>
            <div className="bg-slate-950 rounded p-2.5 font-mono text-[9px] text-slate-400 leading-normal space-y-1">
              <p className="text-cyan-brand/80">{`$ kubectl describe svc/${lastExperimentState?.targetService || "payment-service"}`}</p>
              <p className="text-slate-500">Service IP: 10.96.124.52</p>
              <p className="text-slate-500">Port Ingress: 3000 mapped to containerPort: 3000</p>
              <p className="text-slate-500">Ready Replicas: 3/3 target pods active</p>
            </div>
          </div>
        </div>
      );

    case "pm":
      return (
        <div className="bg-white text-slate-800 rounded-2xl border border-slate-200 p-5 space-y-6 h-full flex flex-col justify-between overflow-y-auto select-none">
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="font-display font-bold text-sm tracking-wide text-slate-900 uppercase">Product Metrics Dashboard</h3>
                  <span className="text-[10px] text-slate-500 font-mono block">Scope: Checkout Flow & Conversions</span>
                </div>
              </div>
              <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-mono font-bold">
                {isSimulating ? "FRICTION DETECTED" : "HEALTHY"}
              </span>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider block mb-1">Conversion Rate</span>
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-xl font-mono font-bold tracking-tight ${isSimulating ? "text-red-600" : "text-emerald-600"}`}>
                    {getSimValue(98.6, -15.4, true)}%
                  </span>
                  {isSimulating && <TrendingDown className="w-3.5 h-3.5 text-red-500 animate-bounce" />}
                </div>
                <span className="text-[8px] text-slate-400 font-mono">Target: &gt; 97.5%</span>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider block mb-1">Friction Index</span>
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-xl font-mono font-bold tracking-tight ${isSimulating ? "text-amber-600" : "text-slate-600"}`}>
                    {getSimValue(1.2, 5.8, true)}/10
                  </span>
                </div>
                <span className="text-[8px] text-slate-400 font-mono">Tolerance threshold: 3.0</span>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider block mb-1">Cart Abandonment</span>
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-xl font-mono font-bold tracking-tight ${isSimulating ? "text-red-500" : "text-slate-600"}`}>
                    {getSimValue(14.2, 28, true)}%
                  </span>
                </div>
                <span className="text-[8px] text-slate-400 font-mono">Normal Baseline: 15%</span>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider block mb-1">Checkout Sessions</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-mono font-bold tracking-tight text-slate-800">
                    {isSimulating ? "5,240 VU" : "1,140 VU"}
                  </span>
                </div>
                <span className="text-[8px] text-slate-400 font-mono">Active peak load</span>
              </div>
            </div>

            {/* Funnel Dropoff Graph */}
            <div className="space-y-2">
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Interactive Checkout Retention Funnel</span>
              <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl space-y-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-semibold text-slate-700">
                    <span>1. Cart Created</span>
                    <span>100%</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full w-full"></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-semibold text-slate-700">
                    <span>2. Shipping Filled</span>
                    <span>{isSimulating ? "88%" : "96%"}</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                      style={{ width: isSimulating ? "88%" : "96%" }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-semibold text-slate-700">
                    <span>3. Payment Submitted</span>
                    <span className={isSimulating ? "text-red-500 font-bold" : ""}>
                      {isSimulating ? "62% (Severe Leak)" : "94%"}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${isSimulating ? "bg-red-500" : "bg-emerald-500"}`}
                      style={{ width: isSimulating ? "62%" : "94%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 flex gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-[10px] uppercase">PM Recommendation</span>
              <p className="mt-0.5 text-[11px] leading-relaxed">
                {isSimulating 
                  ? "Slowing DB response limits checkout conversion. Open a PR with the 'Deploy Adaptive Fix' button to protect the payment flow and secure up to $15,000 in revenue."
                  : "Uptime and checkout speed indicators are within commercial tolerances."}
              </p>
            </div>
          </div>
        </div>
      );

    case "designer":
      return (
        <div className="bg-white text-slate-800 rounded-2xl border border-slate-200 p-5 space-y-6 h-full flex flex-col justify-between overflow-y-auto select-none">
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-600" />
                <div>
                  <h3 className="font-display font-bold text-sm tracking-wide text-slate-900 uppercase">UX & Micro-Interactions</h3>
                  <span className="text-[10px] text-slate-500 font-mono block">Fidelity: Interactive State Fallbacks</span>
                </div>
              </div>
              <span className="text-[9px] bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded font-mono font-bold">
                {isSimulating ? "UI BLOCKED" : "SMOOTH"}
              </span>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider block mb-1">Frame Render Time</span>
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-xl font-mono font-bold tracking-tight ${isSimulating ? "text-amber-600" : "text-purple-600"}`}>
                    {getSimValue(16.4, 45, true)} ms
                  </span>
                </div>
                <span className="text-[8px] text-slate-400 font-mono">Limit: 16.7ms (60fps)</span>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider block mb-1">Cumulative Shift (CLS)</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-mono font-bold tracking-tight text-slate-800">0.02</span>
                </div>
                <span className="text-[8px] text-slate-400 font-mono">Excellent: &lt; 0.1</span>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider block mb-1">Interaction delay (FID)</span>
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-xl font-mono font-bold tracking-tight ${isSimulating ? "text-red-500" : "text-slate-700"}`}>
                    {getSimValue(45, 320, true)} ms
                  </span>
                </div>
                <span className="text-[8px] text-slate-400 font-mono">Standard: &lt; 100ms</span>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider block mb-1">Fallback load rate</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-mono font-bold tracking-tight text-slate-800">
                    {isSimulating ? "28%" : "0%"}
                  </span>
                </div>
                <span className="text-[8px] text-slate-400 font-mono">Triggered spinner states</span>
              </div>
            </div>

            {/* Graphic Loader simulation container */}
            <div className="space-y-2">
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Simulated Patient Loader Performance</span>
              <div className="bg-slate-900 text-white p-4 rounded-xl flex items-center justify-between border border-slate-800 shadow-inner">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full border-2 border-[#2BB8C9] border-t-transparent ${isSimulating ? "animate-spin" : "opacity-40"}`}></div>
                  <div>
                    <span className="text-xs font-bold block">{isSimulating ? "Database Timeout Buffer Active" : "Direct API Stream Path"}</span>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      {isSimulating ? "Displaying custom SVG fallback" : "Seamless direct frame render"}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-[#2BB8C9] font-mono font-bold uppercase">
                  {isSimulating ? "DELAY COMPENSATING" : "OK"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-xs text-purple-950">
            <span className="font-bold block text-[10px] uppercase">UX Design Recommendation</span>
            <p className="mt-0.5 text-[11px] leading-relaxed">
              If the database latency rises over 500ms, the system falls back to a custom spinner to prevent white-screen freeze. Implementing an adaptive connection pool protects visual transitions and ensures micro-interaction smoothness.
            </p>
          </div>
        </div>
      );

    case "executive":
      return (
        <div className="bg-white text-slate-800 rounded-2xl border border-slate-200 p-5 space-y-6 h-full flex flex-col justify-between overflow-y-auto select-none">
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-amber-600" />
                <div>
                  <h3 className="font-display font-bold text-sm tracking-wide text-slate-900 uppercase">Executive SLA & Financials</h3>
                  <span className="text-[10px] text-slate-500 font-mono block">Downtime protection & revenue security</span>
                </div>
              </div>
              <span className="text-[9px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded font-mono font-bold">
                {isSimulating ? "REVENUE AT RISK" : "SLA BUDGET SECURE"}
              </span>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider block mb-1">Prevented Outage Cost</span>
                <div className="flex items-baseline gap-1 text-emerald-600 font-bold">
                  <DollarSign className="w-4 h-4 shrink-0" />
                  <span className="text-xl font-mono tracking-tight">$42,500</span>
                </div>
                <span className="text-[8px] text-slate-400 font-mono">This month total</span>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider block mb-1">SLA Budget</span>
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-xl font-mono font-bold tracking-tight ${isSimulating ? "text-amber-600" : "text-emerald-600"}`}>
                    {getSimValue(99.99, -1.2, true)}%
                  </span>
                </div>
                <span className="text-[8px] text-slate-400 font-mono">Target: 99.9%</span>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider block mb-1">Hourly Revenue Risk</span>
                <div className="flex items-baseline gap-1 font-bold text-slate-800">
                  <DollarSign className="w-4 h-4 shrink-0 text-amber-600" />
                  <span className={`text-xl font-mono tracking-tight ${isSimulating ? "text-red-600" : "text-slate-700"}`}>
                    {isSimulating ? "15,400" : "0"}
                  </span>
                </div>
                <span className="text-[8px] text-slate-400 font-mono">Peak Black Friday simulated</span>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider block mb-1">Safe Transactions</span>
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-xl font-mono font-bold tracking-tight ${isSimulating ? "text-amber-600" : "text-emerald-600"}`}>
                    {isSimulating ? "87.4%" : "100%"}
                  </span>
                </div>
                <span className="text-[8px] text-slate-400 font-mono">Target: 100%</span>
              </div>
            </div>

            {/* Executive Risk Graph */}
            <div className="space-y-2">
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">SLA COMPLIANCE PROBABILITY TREND</span>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl relative overflow-hidden h-24 flex flex-col justify-end">
                <div className="absolute top-2 left-2 text-[8px] text-slate-500 font-mono">y-axis: Compliance confidence</div>
                <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="gradient-exec" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {isSimulating ? (
                    <>
                      <path d="M0,2 Q20,1 40,15 T80,35 T100,32 L100,40 L0,40 Z" fill="url(#gradient-exec)" />
                      <path d="M0,2 Q20,1 40,15 T80,35 T100,32" stroke="#f59e0b" strokeWidth="1.5" fill="none" />
                    </>
                  ) : (
                    <>
                      <path d="M0,2 Q20,1 40,1 T80,2 T100,1 L100,40 L0,40 Z" fill="url(#gradient-exec)" opacity="0.3" />
                      <path d="M0,2 Q20,1 40,1 T80,2 T100,1" stroke="#10b981" strokeWidth="1.5" fill="none" />
                    </>
                  )}
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-700">
            <span className="font-bold block text-[10px] uppercase">Financial Remediator Impact</span>
            <p className="mt-0.5 text-[11px] leading-relaxed">
              Applying the connection and timeout fixes avoids transaction timeouts and protects customer retention budgets, eliminating up to $15,000 in hourly downtime exposure.
            </p>
          </div>
        </div>
      );

    case "non-tech":
    default:
      return (
        <div className="bg-white text-slate-800 rounded-2xl border border-slate-200 p-5 space-y-6 h-full flex flex-col justify-between overflow-y-auto select-none">
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="font-display font-bold text-sm tracking-wide text-slate-900 uppercase">Uptime & Customer Speed</h3>
                  <span className="text-[10px] text-slate-500 font-mono block">Simplified plain-English review</span>
                </div>
              </div>
              <span className="text-[9px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-mono font-bold">
                {isSimulating ? "Slowing Down" : "All Fast & Good"}
              </span>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider block mb-1">Customer Uptime</span>
                <div className="flex items-baseline gap-1.5 text-blue-600 font-bold">
                  <span className="text-xl font-mono tracking-tight">100%</span>
                </div>
                <span className="text-[8px] text-slate-400 font-mono">No complete crash occurred</span>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider block mb-1">Success Rate</span>
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-xl font-mono font-bold tracking-tight ${isSimulating ? "text-amber-600" : "text-green-600"}`}>
                    {isSimulating ? "88.2%" : "99.9%"}
                  </span>
                </div>
                <span className="text-[8px] text-slate-400 font-mono">Our customer promise limit: 99%</span>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider block mb-1">Customer Speed</span>
                <div className="flex items-baseline gap-1.5 font-bold">
                  <span className={`text-xl font-mono tracking-tight ${isSimulating ? "text-red-500" : "text-slate-700"}`}>
                    {isSimulating ? "Slowing down" : "Super Fast"}
                  </span>
                </div>
                <span className="text-[8px] text-slate-400 font-mono">Database request duration</span>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider block mb-1">Uptime Safety</span>
                <div className="flex items-baseline gap-1.5 font-bold">
                  <span className={`text-xl font-mono tracking-tight ${isSimulating ? "text-amber-500" : "text-green-600"}`}>
                    {isSimulating ? "Fair" : "Excellent"}
                  </span>
                </div>
                <span className="text-[8px] text-slate-400 font-mono">System safety cushion</span>
              </div>
            </div>

            {/* Interactive Speed Indicator Gauge */}
            <div className="space-y-2">
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Speedometer Gauge</span>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center">
                <div className="relative w-32 h-16 overflow-hidden flex items-end justify-center">
                  {/* Half circle */}
                  <div className="absolute inset-0 rounded-t-full border-t-8 border-r-8 border-l-8 border-slate-200"></div>
                  {/* Gauge fill */}
                  <div className={`absolute inset-0 rounded-t-full border-t-8 border-r-8 border-l-8 transition-all duration-500 origin-bottom ${
                    isSimulating ? "border-amber-500 rotate-45" : "border-green-500 -rotate-45"
                  }`}></div>
                  
                  <span className="text-xs font-bold text-slate-700 relative z-10 pb-1">
                    {isSimulating ? "620ms Delay" : "Fast Speed"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-950">
            <span className="font-bold block text-[10px] uppercase">Safety Guarantee</span>
            <p className="mt-0.5 text-[11px] leading-relaxed">
              We test system resilience to ensure your shopping cart never fails. Under pressure, Keel helps devs add automatic recovery protection so customer checkouts run smoothly.
            </p>
          </div>
        </div>
      );
  }
};
