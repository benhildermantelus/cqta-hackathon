import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize GoogleGenAI if the key is available
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("GoogleGenAI client initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI:", error);
  }
} else {
  console.warn("GEMINI_API_KEY environment variable is missing. Server will run with realistic fallback generation.");
}

app.use(express.json());

// Fallback Generators for robust demo operation (even without API keys or on model timeouts)
function getFallbackParse(prompt: string) {
  const lowercasePrompt = prompt.toLowerCase();
  
  let targetService = "payment-service";
  if (lowercasePrompt.includes("checkout")) targetService = "checkout-service";
  else if (lowercasePrompt.includes("auth") || lowercasePrompt.includes("login")) targetService = "auth-service";
  else if (lowercasePrompt.includes("recommend") || lowercasePrompt.includes("product")) targetService = "recommendation-service";
  else if (lowercasePrompt.includes("cart")) targetService = "cart-service";
  else if (lowercasePrompt.includes("api") || lowercasePrompt.includes("gateway")) targetService = "api-gateway";

  let trafficLoad = "1,000 virtual users (VU) ramp-up";
  if (lowercasePrompt.includes("black friday") || lowercasePrompt.includes("busiest")) {
    trafficLoad = "Simulated Black Friday load spike (5,000 VU)";
  } else if (lowercasePrompt.includes("blast") || lowercasePrompt.includes("stress")) {
    trafficLoad = "10,000 concurrent users stress-test";
  } else if (lowercasePrompt.includes("traffic") || lowercasePrompt.includes("user")) {
    const match = prompt.match(/\d+[\d,\s]*(virtual users|vu|users)/i);
    if (match) trafficLoad = match[0];
  }

  let faultType = "database latency +500ms";
  if (lowercasePrompt.includes("slowdown") || lowercasePrompt.includes("latency")) {
    const match = prompt.match(/\d+%/);
    const pct = match ? match[0] : "50%";
    faultType = `database latency slowdown (${pct})`;
  } else if (lowercasePrompt.includes("pod kill") || lowercasePrompt.includes("terminate")) {
    faultType = "pod termination (restart loop)";
  } else if (lowercasePrompt.includes("packet") || lowercasePrompt.includes("drop") || lowercasePrompt.includes("network")) {
    faultType = "20% network packet loss";
  } else if (lowercasePrompt.includes("incident")) {
    faultType = "memory leak simulation (95% heap consumption)";
  }

  let environment = "staging";
  if (lowercasePrompt.includes("prod") || lowercasePrompt.includes("production")) environment = "production";
  else if (lowercasePrompt.includes("dev")) environment = "development";

  let sloFocus = "p95 latency < 500ms, 0 dropped payments";
  if (lowercasePrompt.includes("checkout")) sloFocus = "checkout success rate > 99.99%, latency < 350ms";
  else if (lowercasePrompt.includes("break") || lowercasePrompt.includes("stress")) sloFocus = "http error rate < 1%, system recovery < 10s";

  const isBusinessPhrased = lowercasePrompt.includes("lose") || 
                             lowercasePrompt.includes("revenue") || 
                             lowercasePrompt.includes("customer") || 
                             lowercasePrompt.includes("sales") || 
                             lowercasePrompt.includes("busiest day") || 
                             lowercasePrompt.includes("busy");

  return {
    target_service: targetService,
    traffic_load: trafficLoad,
    fault_type: faultType,
    environment: environment,
    slo_focus: sloFocus,
    is_business_phrased: isBusinessPhrased,
    original_phrasing_type: isBusinessPhrased ? "business" : "technical",
    business_translation: isBusinessPhrased 
      ? `Ensuring checkout revenue is safe during peak sales events by validating payment database speed.`
      : `Evaluating customer experience impact and financial risk if ${targetService} slows down by ${faultType}.`,
    technical_translation: isBusinessPhrased
      ? `Stress-testing the ${targetService} with a ${faultType} envelope under ${trafficLoad}.`
      : `Executing k6 workload with ${trafficLoad} alongside ChaosMesh fault '${faultType}' on ${targetService}.`
  };
}

function getFallbackReport(plan: any) {
  const service = plan.target_service || "payment-service";
  const fault = plan.fault_type || "database latency +500ms";
  
  const isFailed = fault.includes("kill") || fault.includes("termination") || fault.includes("95%") || Math.random() > 0.5;
  const verdict = isFailed ? "FAILED" : "DEGRADED";

  return {
    verdict: verdict,
    summary: `During the stress test, injecting ${fault} into the ${service} caused substantial degradation. The system failed to sustain our standard SLO of ${plan.slo_focus || "p95 latency < 500ms"}.`,
    findings: [
      {
        id: "finding-1",
        title: `${service} latency spiked to 1,240ms`,
        technical_description: `Under ${plan.traffic_load}, injecting ${fault} triggered severe connection pool starvation. p95 latency peaked at 1.24s (SLO is 500ms).`,
        business_description: `Customers experienced severe delays during checkout, leading to a 14% cart abandonment rate and an estimated $8,400 in potential revenue loss.`,
        metric: "p95 Latency: 1,240ms",
        status: "danger"
      },
      {
        id: "finding-2",
        title: "Downstream notifications failed with timeouts",
        technical_description: `The notification-service experienced read timeouts after 1000ms. High resource contention on the shared database prevented event consumption.`,
        business_description: `Order confirmation emails were delayed by up to 20 minutes, leading to an increase in duplicate checkout clicks and customer support requests.`,
        metric: "Error Rate: 12.8%",
        status: "warning"
      }
    ],
    recommended_fix: {
      title: "Increase Database Timeout & Connection Pool Size",
      technical_description: "Scale the connection pool size from 10 to 30 in the DB configuration, and raise db_timeout_ms to 3000ms to gracefully absorb transactional database slow paths during peak sales events.",
      business_description: "Ensure that customers can complete checkout without seeing failures during high traffic spikes, protecting up to $15,000 in hourly revenue.",
      file_path: `config/${service}-deployment.yaml`,
      diff: `--- config/${service}-deployment.yaml
+++ config/${service}-deployment.yaml
@@ -12,4 +12,4 @@
   db_pool_size: 10
-  db_timeout_ms: 1000
+  db_timeout_ms: 3000
   retry_limit: 2
+  retry_backoff_ms: 150`
    }
  };
}

// Endpoint 1: Parse the plain-text query into structured experiment plan
app.post("/api/parse", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Missing or invalid prompt in request body." });
  }

  if (!ai) {
    console.log("No Gemini API client, returning fallback parse result.");
    return res.json(getFallbackParse(prompt));
  }

  try {
    const systemInstruction = `You are Keel, an advanced SRE and Chaos Engineering co-pilot.
Your task is to parse a developer's plain-language request for resilience testing into a structured experiment plan.

The user's prompt might be phrased in highly technical terms (e.g. "Blast payment service with 500 users while dropping 20% of database packets") or in business/customer-oriented terms (e.g. "make sure checkout is fast on Black Friday even if the DB gets slow").

You must convert this request into a structured JSON object.
Do NOT output any markdown blocks, backticks, or prose. Return ONLY valid, parseable JSON that adheres to the following structure:

{
  "target_service": "Name of the target service or system components being tested (e.g. 'payment-service', 'checkout', 'gateway')",
  "traffic_load": "Description of the traffic load (e.g. '1,000 virtual users', '50% traffic spike', 'simulated Black Friday')",
  "fault_type": "The SRE fault/chaos injection type (e.g. 'database latency +400ms', 'pod kill', '20% network packet drop')",
  "environment": "Target environment (default to 'staging' if not mentioned)",
  "slo_focus": "The Service Level Objective / success criteria being measured (e.g. 'p95 latency < 500ms, 0 dropped payments')",
  "is_business_phrased": true/false (true if the user's input was focused on business outcomes/revenue/customers rather than purely SRE/chaos commands),
  "original_phrasing_type": "business" | "technical" | "mixed",
  "business_translation": "A translation of this experiment's goal into clear, plain-language business impact (e.g. 'Ensuring checkout revenue is safe during peak sales events by validating payment database speed').",
  "technical_translation": "A translation of this experiment's goal into SRE/technical commands (e.g. 'Stress-testing the checkout db replica with a 400ms latency envelope under a 1k user ramp-up')."
}

Make sure to populate all fields with realistic, intelligent SRE and business values based on the request.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Parse this user request for a chaos experiment: "${prompt}"`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
      }
    });

    const parsedJson = JSON.parse(response.text || "{}");
    return res.json(parsedJson);
  } catch (error) {
    console.error("Gemini parse failed, using fallback:", error);
    return res.json(getFallbackParse(prompt));
  }
});

// Endpoint 2: Generate a Resilience Report based on the experiment plan
app.post("/api/report", async (req, res) => {
  const { plan, prompt } = req.body;
  if (!plan) {
    return res.status(400).json({ error: "Missing plan object in request body." });
  }

  if (!ai) {
    console.log("No Gemini API client, returning fallback report.");
    return res.json(getFallbackReport(plan));
  }

  try {
    const systemInstruction = `You are Keel, an advanced SRE and Chaos Engineering co-pilot.
Generate a realistic "Resilience Report" based on the provided chaos experiment plan and original request.
The report must present the outcome of a simulated load test and fault injection experiment.
To make the demo interesting, usually simulate at least one interesting failure or degradation (DEGRADED or FAILED status) with specific technical findings, but make sure it has a positive path to resolution with a 1-click recommended fix.

You must return ONLY a JSON object. Do NOT wrap the JSON in markdown code blocks or backticks. Return valid parseable JSON.

The JSON schema must be:
{
  "verdict": "PASSED" | "DEGRADED" | "FAILED",
  "summary": "A 2-3 sentence clear, professional, plain-language summary of how the system behaved under stress.",
  "findings": [
    {
      "id": "finding-1",
      "title": "Short title of finding (e.g. 'p95 latency reached 620ms')",
      "technical_description": "Engineering detail containing specific SRE metrics, latency numbers, fault details, and affected services.",
      "business_description": "The exact same finding re-expressed in plain business terms, explaining customer impact, risk, or revenue exposure.",
      "metric": "Key metric label and value (e.g. 'p95 Latency: 620ms')",
      "status": "success" | "warning" | "danger"
    }
  ],
  "recommended_fix": {
    "title": "Title of the fix (e.g., 'Increase retry timeout and adjust connection pooling')",
    "technical_description": "Engineering explanation of the fix (e.g., 'Increase db_timeout_ms to 3000ms to absorb database spikes and raise retry limit to 3').",
    "business_description": "Business explanation of the fix (e.g., 'Secures transactions during heavy traffic spikes, preventing checkout dropouts and protecting up to $15,000 in hourly revenue').",
    "file_path": "The file being patched (e.g. 'config/payment-service.yaml')",
    "diff": "A clean git diff patching the configuration. Use actual unified diff format starting with --- and +++ lines. Keep it clean and short."
  }
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a resilience report based on this parsed experiment plan: ${JSON.stringify(plan)} and original request: "${prompt || ""}"`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
      }
    });

    const parsedJson = JSON.parse(response.text || "{}");
    return res.json(parsedJson);
  } catch (error) {
    console.error("Gemini report generation failed, using fallback:", error);
    return res.json(getFallbackReport(plan));
  }
});

// Express startup and Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
