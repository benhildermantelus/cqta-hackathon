import React from "react";
import { ExperimentPlan } from "../types";
import { Play, ShieldAlert, Cpu, Layers, HelpCircle, Briefcase, Zap } from "lucide-react";

interface ExperimentPlanCardProps {
  plan: ExperimentPlan;
}

export const ExperimentPlanCard: React.FC<ExperimentPlanCardProps> = ({ plan }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm max-w-2xl">
      {/* Card Header */}
      <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 py-4 text-cyan-brand" />
          <span className="font-display font-semibold tracking-tight text-sm">EXPERIMENT PLAN</span>
        </div>
        <span className="text-[10px] font-mono bg-cyan-brand/20 text-cyan-brand px-2 py-0.5 rounded uppercase tracking-wider">
          {plan.environment}
        </span>
      </div>

      {/* Two-Way Translation Callout */}
      <div className="bg-slate-50 border-b border-slate-100 p-4">
        <div className="flex items-start gap-3">
          <div className="bg-cyan-brand/10 p-2 rounded-lg text-cyan-brand mt-0.5">
            <Zap className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-slate-800 uppercase tracking-wider">Two-Way Translator</span>
              <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.2 rounded font-mono">ACTIVE</span>
            </div>
            
            {plan.is_business_phrased ? (
              <div>
                <p className="text-xs text-slate-500 italic mb-2">
                  "Mapped your business-level objective to a technical chaos hypothesis."
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mt-2">
                  <div className="bg-white border border-slate-200 rounded p-2.5">
                    <div className="flex items-center gap-1.5 text-slate-500 font-semibold mb-1">
                      <Briefcase className="w-3 h-3 text-blue-500" />
                      <span>Business Objective</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed font-medium">
                      {plan.business_translation || "Protect checkout conversions and prevent revenue leakages."}
                    </p>
                  </div>
                  <div className="bg-white border border-slate-200 rounded p-2.5">
                    <div className="flex items-center gap-1.5 text-slate-500 font-semibold mb-1">
                      <Cpu className="w-3 h-3 text-cyan-brand" />
                      <span>Technical Translation</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      {plan.technical_translation || `Simulate database stress on the ${plan.target_service} to measure SLO compliance.`}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-xs text-slate-500 italic mb-2">
                  "Mapped your technical request to commercial business risks."
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mt-2">
                  <div className="bg-white border border-slate-200 rounded p-2.5">
                    <div className="flex items-center gap-1.5 text-slate-500 font-semibold mb-1">
                      <Cpu className="w-3 h-3 text-cyan-brand" />
                      <span>Technical Hypothesis</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed font-medium">
                      {plan.technical_translation || `Injecting ${plan.fault_type} under a load of ${plan.traffic_load} on ${plan.target_service}.`}
                    </p>
                  </div>
                  <div className="bg-white border border-slate-200 rounded p-2.5">
                    <div className="flex items-center gap-1.5 text-slate-500 font-semibold mb-1">
                      <Briefcase className="w-3 h-3 text-blue-500" />
                      <span>Commercial Translation</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      {plan.business_translation || `Validating purchase path conversion and customer abandonment risks under downstream network delays.`}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid of parsed parameters */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Target Service */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Target Service</label>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-2 rounded-lg">
            <Cpu className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-mono font-semibold text-slate-800">{plan.target_service}</span>
          </div>
        </div>

        {/* Traffic Load */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Traffic Load</label>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-2 rounded-lg">
            <Zap className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-mono font-semibold text-slate-800">{plan.traffic_load}</span>
          </div>
        </div>

        {/* Fault Type */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Fault / Chaos Type</label>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-2 rounded-lg">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-mono font-semibold text-slate-800">{plan.fault_type}</span>
          </div>
        </div>

        {/* SLO Target */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">SLO Focus</label>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-2 rounded-lg">
            <Play className="w-4 h-4 text-green-500 rotate-90" />
            <span className="text-xs font-mono font-semibold text-slate-800">{plan.slo_focus}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
