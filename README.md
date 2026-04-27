# 🛡️ ShadowVault
### *Unbiased AI Decision — Open Innovation Track*

> *"Computer programs now make life-changing decisions about who gets a job, a bank loan, or even medical care. However, if these programs learn from flawed or unfair historical data, they will repeat and amplify those exact same discriminatory mistakes."*

ShadowVault is a full-stack **AI Fairness & Safety Platform** that gives organizations a clear, accessible way to **detect, explain, and fix bias in AI systems** — before it impacts real people.

What sets us apart: fairness auditing alone isn't enough. Bad actors can craft adversarial prompts to force an AI into producing discriminatory outputs on demand. ShadowVault solves **both** — auditing your data pipeline *and* protecting your AI at runtime.

---

## 🎯 Problem Statement

AI models automating high-stakes decisions (hiring, lending, healthcare) silently inherit historical biases — systematically disadvantaging protected groups at machine speed, with no visibility or accountability. Existing tools only address pre-deployment data; they ignore runtime manipulation.

**ShadowVault fills this gap with three layers:**

```
Layer 1 — Dataset Fairness Audit     →  Catch bias before the model is deployed
Layer 2 — Live Output Bias Scanning  →  Audit every AI reply for discrimination in real time  
Layer 3 — Prompt Security Engine     →  Block adversarial prompts that force biased outputs
```

---

## ✨ Features

| Feature | Description |
|---|---|
| ⚖️ **AI Fairness Auditor** | Upload CSV/JSON datasets, detect representation gaps & disparate impact, get fix recommendations |
| 🔎 **Inline Bias Audit** | "Audit Reply for Bias" button on every AI message — Gemini 2.0 Flash checks it instantly |
| 🛡️ **Dual-Layer Prompt Security** | Regex engine + NVIDIA Nemotron AI guard blocks injection, jailbreaks & code execution |
| 💬 **Secure AI Chat** | Gemini-powered chat with threat scanning on every input *and* every output |
| 📊 **Threat Detection Center** | Live risk gauge, scan activity chart, and forensics log |
| 🔴 **Red Teaming Module** | Simulate adversarial attack datasets to measure defense robustness |
| 🔐 **Google OAuth + JWT** | All routes are protected; sessions expire in 30 min |
| 🌓 **Dark / Light Mode** | Glassmorphism UI with full theme switching |

---

## ⚖️ Core — AI Fairness Auditor

### How It Works
1. Upload your dataset (CSV / JSON)
2. Enter the **Target Column** — what the model predicts (e.g. `approved`, `hired`)
3. Enter **Protected Attributes** — demographic columns (e.g. `gender, race, age`)
4. Click **Thorough Inspection**

### What Gets Measured

**Representation Bias** — calculates the group distribution imbalance ratio. If the majority group is **3× more frequent** than the minority, a `HIGH` flag is raised.

**Disparate Impact** — calculates the positive outcome rate per group. If `min_rate ÷ max_rate < 0.8`, a `CRITICAL` flag is raised — this is the internationally recognized **EEOC Four-Fifths Rule** used in employment law.

> *Example: 60% of white applicants approved for loans vs. 40% of Black applicants → DI = 0.67 → CRITICAL*

### Output
| | |
|---|---|
| **Bias Score Ring** | 0–100 animated gauge, color-coded SAFE / WARNING / CRITICAL |
| **Critical Flags** | Plain-English description of each detected issue and affected attribute |
| **Fix Recommendations** | Auto-generated: Oversampling, Adversarial Debiasing, or Threshold Adjustment |
| **AI Auditor's Insights** | Gemini 2.0 Flash generates a stakeholder-ready narrative + Fix Action Plan |

> **Note:** Bias is *detected* statistically (Pandas/NumPy — no AI). Bias is *explained* by **Gemini 2.0 Flash**.

---

## 🔎 Inline Bias Audit on AI Replies

Every AI reply in SecureChat has an **"Audit Reply for Bias"** button. One click sends the reply to **Gemini 2.0 Flash**, which returns:

```json
{ "is_biased": true, "bias_type": "gender", "severity": "medium", "explanation": "..." }
```

The result card shows ✅ or ⚠️, a bias type badge, a color-coded severity badge, and a plain-language explanation — all inline, without leaving the chat.

---

## 🛡️ What Makes ShadowVault Unique — The Security Layer

> *Other bias tools stop at the data. ShadowVault also defends the live AI from being forced into biased outputs.*

### Layer 1 — Regex Pattern Engine (Instant, Offline)

| Attack Type | Severity Weight |
|---|---|
| Code Execution (`exec()`, `<script>`, `rm -rf`) | 40 |
| Jailbreak ("Ignore previous instructions", DAN, "developer mode") | 35 |
| SQL Injection (`DROP TABLE`, `UNION SELECT`) | 30 |
| System Override ("reveal your system prompt", `sudo`) | 25 |
| Data Exfiltration (`curl`, `wget`, "api_key", "password") | 20 |

Also strips special characters to catch obfuscation attacks (e.g. `ignoreallpreviousinstructions`).

### Layer 2 — NVIDIA Nemotron AI Safety Guard (Semantic)

`nvidia/llama-3.1-nemotron-safety-guard-8b-v3` catches semantic threats that bypass regex — indirect jailbreaks, manipulative framing, subtle coercion. Dynamic severity = base 45 + 12/category + obfuscation penalty. Results are LRU-cached.

### Combined Risk Scoring

| Score | Level | Action |
|---|---|---|
| 0–5 | `none` | ✅ Allow |
| 6–59 | `low / medium` | ⚠️ Flag |
| 60–84 | `high` | 🚫 Block |
| 85–100 | `critical` | 🛑 Block immediately |

**AI outputs are also scanned** — if Gemini's reply scores >30, it is suppressed before the user sees it.

---

## 🚀 Getting Started

### Backend
```bash
cd backend
python -m venv venv && venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env   # Add your GEMINI_API_KEY and optionally NVIDIA_API_KEY
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install && npm run dev   # Runs at http://localhost:5173
```

> **Keys needed:** `GEMINI_API_KEY` (required — chat & bias explanations), `NVIDIA_API_KEY` (optional — enables semantic AI safety guard). See `backend/.env.example` for the full list.

---

## 🛠️ Tech Stack

**Frontend:** React 19 + Vite, React Router v7, `@react-oauth/google`, Three.js (`@react-three/fiber`), Recharts, Vanilla CSS

**Backend:** FastAPI, SQLAlchemy (SQLite), `google-genai` (Gemini 2.0 Flash), OpenAI SDK (NVIDIA NIM), `pypdf`, Pandas + NumPy, `fairlearn` / `scikit-learn`, `python-jose` (JWT)

---

## 🔌 API Reference

| Endpoint | Description |
|---|---|
| `POST /auth/google` | Exchange Google idToken → JWT |
| `POST /api/secure-chat` | Gemini chat with full threat + output validation |
| `POST /api/analyze` | Analyze any prompt for security threats |
| `POST /api/audit/dataset` | Statistical fairness analysis of a dataset |
| `POST /api/audit/explain` | Gemini narrative explanation of audit results |
| `POST /api/audit/text` | Inline bias check on any text snippet |

---

## 💡 Why ShadowVault

| Other Bias Tools | ShadowVault |
|---|---|
| Pre-deployment data audit only | ✅ Pre-deployment + live runtime protection |
| No defense against adversarial prompts | ✅ Dual-layer prompt injection defense |
| Static technical reports | ✅ Gemini-generated stakeholder narrative + fix plan |
| Per-reply bias visibility: ❌ | ✅ On-demand inline bias audit on every AI message |

---

<div align="center">
  <strong>ShadowVault</strong> — Measure It. Flag It. Fix It.<br>
  <em>Unbiased AI Decision · Open Innovation Track</em>
</div>
