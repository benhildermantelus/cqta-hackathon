import React, { useState } from "react";
import { ExperimentPlan } from "../types";
import { Terminal, Code, Copy, Check, ChevronDown, ChevronUp } from "lucide-react";

interface ProvisioningPanelProps {
  plan: ExperimentPlan;
}

export const ProvisioningPanel: React.FC<ProvisioningPanelProps> = ({ plan }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<"k6" | "yaml">("k6");
  const [copied, setCopied] = useState(false);

  // Parse numerical users or fallback to 1000
  const numericUsersMatch = plan.traffic_load.match(/\d+/);
  const vusCount = numericUsersMatch ? parseInt(numericUsersMatch[0]) : 1000;

  const k6Script = `import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: ${Math.round(vusCount * 0.5)} }, // Warmup ramp
    { duration: '30s', target: ${vusCount} }, // Target peak load
    { duration: '15s', target: 0 }, // Cool down
  ],
  thresholds: {
    'http_req_failed': ['rate<0.01'], // Fail rate must be < 1%
    'http_req_duration': ['p95<500'], // 95% of reqs must complete < 500ms
  },
};

export default function () {
  // Target: ${plan.target_service} on ${plan.environment}
  const url = 'http://${plan.target_service}.${plan.environment}.svc.cluster.local/health';
  const res = http.get(url);
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'SLO target verification': (r) => r.timings.duration < 500,
  });
  
  sleep(1);
}`;

  const chaosYaml = `apiVersion: litmuschaos.io/v1alpha1
kind: ChaosEngine
metadata:
  name: keel-engine-${plan.target_service}
  namespace: ${plan.environment}
spec:
  engineState: 'active'
  appinfo:
    appns: '${plan.environment}'
    applabel: 'app=${plan.target_service}'
    appkind: 'deployment'
  chaosServiceAccount: litmus-admin
  experiments:
    - name: ${plan.fault_type.toLowerCase().includes("kill") ? "pod-delete" : "pod-network-latency"}
      spec:
        components:
          env:
            - name: TOTAL_CHAOS_DURATION
              value: '45'
            - name: LATENCY
              value: '${plan.fault_type.toLowerCase().includes("50%") ? "500" : "300"}'
            - name: TARGET_SERVICE
              value: '${plan.target_service}'`;

  const codeToCopy = activeTab === "k6" ? k6Script : chaosYaml;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 text-slate-100 rounded-xl overflow-hidden border border-slate-800 shadow-lg max-w-2xl font-mono text-xs">
      {/* Header Panel */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors focus:outline-none"
      >
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-brand animate-pulse" />
          <span className="font-display font-medium text-slate-300">
            Provisioning Orchestration Plan ({isOpen ? "Active" : "Collapsed"})
          </span>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>

      {isOpen && (
        <div className="border-t border-slate-800">
          {/* Subheader / Tabs */}
          <div className="bg-slate-950 px-4 py-2 flex items-center justify-between border-b border-slate-800">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("k6")}
                className={`px-2.5 py-1 rounded transition-colors text-[11px] font-semibold ${
                  activeTab === "k6" 
                    ? "bg-slate-800 text-cyan-brand border border-slate-700" 
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                k6-load-test.js
              </button>
              <button
                onClick={() => setActiveTab("yaml")}
                className={`px-2.5 py-1 rounded transition-colors text-[11px] font-semibold ${
                  activeTab === "yaml" 
                    ? "bg-slate-800 text-cyan-brand border border-slate-700" 
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                litmus-chaos.yaml
              </button>
            </div>
            
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1.5 px-2 py-1 rounded text-[11px] text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-green-400 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Code display with line numbers */}
          <div className="p-4 bg-slate-950 overflow-x-auto max-h-72">
            <pre className="text-slate-300 select-all leading-relaxed whitespace-pre font-mono">
              {codeToCopy.split("\n").map((line, idx) => (
                <div key={idx} className="flex hover:bg-slate-900/40">
                  <span className="w-8 text-right pr-3 select-none text-slate-600 font-mono text-[10px]">{idx + 1}</span>
                  <span className="flex-1">{line}</span>
                </div>
              ))}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
