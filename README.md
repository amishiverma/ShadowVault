# 🛡️ ShadowVault

### *Unbiased AI Decision — Open Innovation Track*

> **"Computer programs now make life-changing decisions about who gets a job, a bank loan, or even medical care. However, if these programs learn from flawed or unfair historical data, they will repeat and amplify those exact same discriminatory mistakes."**

ShadowVault is a full-stack **AI Fairness & Safety Platform** built under the **Unbiased AI Decision** open innovation challenge. Our mission is to give organizations a clear, accessible tool to thoroughly inspect datasets and AI models for hidden unfairness or discrimination — and to **measure, flag, and fix harmful bias before these systems impact real people**.

What makes ShadowVault uniquely powerful is that fairness auditing alone is not enough. AI systems can also be manipulated through malicious prompts into producing discriminatory or harmful outputs on demand. ShadowVault solves both problems: it audits your data **and** protects your AI from being weaponized — making it the only platform that delivers **end-to-end AI accountability**.

---

## 🎯 Problem Statement

**[Unbiased AI Decision] — Open Innovation**

Organizations increasingly deploy AI models to automate high-stakes decisions across hiring, lending, healthcare triage, and more. These systems inherit the biases baked into historical training data, causing them to:

- **Systematically disadvantage** protected groups (gender, race, age) in automated outcomes
- **Amplify historical discrimination** at machine speed and scale
- **Operate as black boxes** — organizations have no visibility into whether their model is being fair
- **Be silently manipulated** — bad actors can craft prompts that force AI systems to produce biased, harmful, or discriminatory content on demand

There is no single platform today that audits both the **data pipeline** (upstream bias) and the **runtime behavior** (downstream manipulation) of an AI system. ShadowVault fills this gap.

---

## 🌟 Our Solution

ShadowVault provides a **unified AI accountability dashboard** with three layers of protection:

```
Layer 1 — Data Fairness Auditor
   Detect representation bias & disparate impact in training datasets
   before the model is ever deployed.
         ↓
Layer 2 — Secure AI Chat with Output Monitoring
   Every AI interaction is scanned for discriminatory outputs in real time.
   AI replies can be individually audited for bias on demand.
         ↓
Layer 3 — Dual-Layer Prompt Security Engine (Our Unique Edge)
   Prevent adversarial actors from using prompt injection and jailbreaks
   to force the AI into producing harmful or biased content.
```

---

## ✨ Key Features

| Feature | Description |
|---|---|
| ⚖️ **AI Fairness Auditor** | Upload any dataset (CSV/JSON), detect representation gaps & disparate impact, get actionable fix recommendations |
| 🔎 **Inline Bias Audit** | Click "Audit Reply for Bias" on any AI message — Gemini analyzes it for discriminatory language instantly |
| 🛡️ **Dual-Layer Prompt Security** | Regex + NVIDIA Nemotron AI guard blocks prompt injection, jailbreaks & code execution attacks |
| 💬 **Secure AI Chat** | Gemini 2.0 Flash chatbot with threat scanning on every input **and** every output |
| 📊 **Threat Detection Center** | Live risk gauge, scan activity chart, and forensics log for all analyzed payloads |
| 🔴 **Red Teaming Module** | Simulate known attack datasets against your defenses to measure robustness |
| 🔐 **Google OAuth + JWT** | Enterprise-grade authentication; all endpoints are protected |
| 🌓 **Dark / Light Mode** | Full theme switching with premium glassmorphism UI |

---

## 🏗️ Architecture

```
ShadowVault/
├── backend/                   # Python FastAPI server
│   ├── main.py                # Core API: threat engine, chat, auth & bias endpoints
│   ├── auth.py                # Google OAuth token verification + JWT issuance
│   ├── bias_auditor.py        # Dataset bias & disparate-impact analysis engine
│   ├── models.py              # SQLAlchemy User model (SQLite)
│   ├── requirements.txt       # Python dependencies
│   └── .env.example           # Environment variable template
│
└── frontend/                  # React 19 + Vite SPA
    └── src/
        ├── pages/
        │   ├── Login.jsx          # Google OAuth login with 3D globe
        │   ├── Dashboard.jsx      # Home with AI entry point
        │   ├── BiasAuditor.jsx    # ⭐ Core: AI fairness & dataset bias auditor
        │   ├── SecureChat.jsx     # ⭐ Core: Protected Gemini chat + inline bias audit
        │   ├── ThreatDetection.jsx   # Live threat scanner + forensics log
        │   ├── RedTeaming.jsx     # Attack simulation runner
        │   ├── DefensePolicies.jsx   # Security policy documentation
        │   └── PayloadAnalytics.jsx  # Payload statistics view
        ├── components/
        │   ├── ProtectedRoute.jsx    # JWT-gated route wrapper
        │   ├── Globe.jsx             # Three.js animated globe on login
        │   └── AntigravityCursor.jsx # Custom animated cursor
        └── layouts/
            └── MainLayout.jsx     # Sidebar + topbar shell
```

---

## ⚖️ Core Feature 1 — AI Fairness Auditor

> *"Build a clear, accessible solution to thoroughly inspect datasets and software models for hidden unfairness or discrimination. Provide organizations with an easy way to measure, flag, and fix harmful bias before their systems impact real people."*
> — Problem Statement Objective

The AI Fairness Auditor (`/bias`) is the heart of ShadowVault. It gives any organization — technical or not — a straightforward way to audit their AI training data and understand the results.

### How to Use

1. **Upload your dataset** — accepts CSV or JSON files
2. **Enter the Target Column** — the outcome the model predicts (e.g., `approved`, `hired`, `diagnosis`)
3. **List Protected Attributes** — comma-separated demographic columns (e.g., `gender, race, age`)
4. Click **Thorough Inspection**

### What Gets Measured

#### 📊 Representation Bias
Measures whether protected groups appear proportionally in the training data.

- Calculates the distribution of each group within each protected attribute
- Computes an **imbalance ratio** = majority group frequency ÷ minority group frequency
- If the ratio exceeds **3×**, a `HIGH` severity flag is raised
- *Example: A dataset with 80% male / 20% female applicants has an imbalance ratio of 4.0 — the model never truly learns from the underrepresented group.*

#### ⚖️ Disparate Impact (The Four-Fifths Rule)
Measures whether different demographic groups receive different positive outcome rates.

- For each protected attribute, calculates the positive outcome rate per group
- Computes: **Disparate Impact = min_group_rate ÷ max_group_rate**
- If DI < **0.8**, a `CRITICAL` flag is raised — this is the internationally recognized "four-fifths rule" used in EEOC employment law
- *Example: If 60% of white applicants are approved for loans but only 40% of Black applicants are, DI = 0.67 → CRITICAL bias detected.*

### Audit Report Output

| Output | Description |
|---|---|
| **Overall Bias Score** (0–100) | Animated ring gauge, color-coded by severity |
| **Status Badge** | `SAFE` / `WARNING` / `CRITICAL` |
| **Critical Flags** | List of detected issues with the affected attribute and a plain-English description |
| **Fix Recommendations** | Actionable mitigation strategies auto-generated per flag type |

### Fix Recommendations Generated

| Flag Type | Recommended Action |
|---|---|
| `REPRESENTATION` | **Oversampling / Data Collection** — collect more data from underrepresented groups to balance the training set |
| `DISPARATE_IMPACT` | **Adversarial Debiasing** — penalize the model during training for relying on protected attributes; **Threshold Adjustment** — equalize decision thresholds across demographic groups |
| No issues found | **Continuous Monitoring** — no immediate bias; monitor outputs in production |

### 🤖 AI Auditor's Insights (Powered by Gemini)

After the statistical analysis completes, ShadowVault automatically calls **Gemini 2.0 Flash** as an AI Ethics Auditor. It receives the full bias report and generates a **stakeholder-friendly narrative** with:
- Summary of risks in plain language
- Why each detected bias is harmful
- A structured **Fix Action Plan** with headings and bullet points

This bridges the gap between raw statistical metrics and human-understandable accountability — perfect for boardrooms and compliance teams.

**API Endpoints:**
- `POST /api/audit/dataset` — statistical bias analysis (CSV/JSON upload)
- `POST /api/audit/explain` — Gemini narrative explanation of results
- `POST /api/audit/text` — single-text discrimination check

---

## 🔎 Core Feature 2 — Inline Bias Audit on AI Replies

Even after deployment, AI models can produce **biased or discriminatory language** in their responses. ShadowVault surfaces this risk directly inside the chat interface.

Every AI reply bubble in SecureChat includes an **"Audit Reply for Bias"** button. One click sends the reply to Gemini for analysis.

**What Gemini returns:**
```json
{
  "is_biased": true,
  "bias_type": "gender",
  "severity": "medium",
  "explanation": "The response uses gendered language that associates certain roles with specific genders..."
}
```

**What you see in the UI:**
- ✅ **No Bias Detected** (green) or ⚠️ **Bias Detected** (red)
- Bias type badge (gender / race / age / none)
- Color-coded severity badge (green → yellow → red)
- Full plain-language explanation
- Dismiss button

This means every AI interaction is accountable — users can verify that the model's outputs meet fairness standards in real time.

---

## 🛡️ What Makes ShadowVault Unique — The Security Layer

> *Other bias auditing tools stop at the data. ShadowVault also protects the live AI from being manipulated into producing biased content on demand.*

An adversary with access to an AI system can bypass ethical training by crafting malicious prompts — **jailbreaks, prompt injections, and system overrides** — to force the model to produce discriminatory, harmful, or dangerous content. This completely negates any fairness work done on the training data.

ShadowVault's **dual-layer prompt security engine** is our answer to this threat, making us uniquely positioned as a **complete AI accountability platform** — not just a pre-deployment auditing tool.

### Layer 1 — Regex Pattern Engine (Instant, Offline)

Scans every prompt against a library of known attack patterns across 5 categories:

| Attack Category | Examples Detected | Severity |
|---|---|---|
| `sql_injection` | `DROP TABLE`, `UNION SELECT`, `1=1` | 30 |
| `jailbreak` | "Ignore previous instructions", DAN, "developer mode", "act as if you have no restrictions" | 35 |
| `system_override` | "Reveal your system prompt", `sudo`, "admin mode", "output your configuration" | 25 |
| `data_exfiltration` | `curl`, `wget`, "send data to", "api_key", "password", "private key" | 20 |
| `code_execution` | `exec()`, `eval()`, `<script>`, `os.system`, `rm -rf` | 40 |

Also detects **obfuscation bypass attempts** — strips special characters from prompts and checks for compact attack strings like `ignoreallpreviousinstructions`.

Dynamic severity: each additional pattern match adds 40% more severity, ensuring multi-vector attacks score higher.

### Layer 2 — NVIDIA Nemotron AI Safety Guard (Semantic, LLM-based)

When configured, every prompt is also evaluated by **`nvidia/llama-3.1-nemotron-safety-guard-8b-v3`** via NVIDIA NIM:

- Detects **semantic threats** that evade regex (indirect jailbreaks, manipulative framing, subtle coercion)
- Returns safety categories: violence, hate speech, criminal activity, self-harm, harassment, manipulation, illegal activity, etc.
- A dynamic severity is calculated: **base 45 + 12 per category + obfuscation entropy penalty + length penalty**
- Responses are **LRU-cached** to prevent redundant API calls for identical prompts

### Combined Risk Score & Actions

| Score | Threat Level | Action |
|---|---|---|
| 0–5 | `none` | ✅ Allow — forward to AI |
| 6–24 | `low` | ⚠️ Allow with note |
| 25–59 | `medium` | 🔶 Flag |
| 60–84 | `high` | 🚫 Block |
| 85–100 | `critical` | 🛑 Block immediately |

**Critically, the output of the AI is also scanned** — even if a prompt passes, if Gemini's reply scores >30, it is suppressed and the user sees: *"Warning: The AI generated an unsafe response. Content blocked for security."*

---

## 💬 Feature 3 — Secure AI Chat

The `/secure-chat` page is a **Gemini 2.0 Flash** powered conversational AI that runs every message through the full defense pipeline.

### Message Flow

```
User sends message
      ↓
Dual-Layer Threat Scan (Regex + NVIDIA Nemotron)
      ↓
  risk_score > 30?
  YES → Block. Show threat card: level badge, score, attack vectors detected
  NO  → Send to Gemini 2.0 Flash with full conversation history
      ↓
    Gemini replies
      ↓
  Output Validation — reply scanned by threat engine
  risk_score > 30? → Suppress reply ("AI generated an unsafe response")
  Safe?            → Display reply + Safety Rating + "Audit Reply for Bias" button
```

### UI Features
- 🟢 **Live status pill** — "Shields Active" → "Scanning..." → "Safe — Executed with Gemini" / "Threat Blocked"
- 🛑 **Threat Alert Cards** for blocked messages with risk score, level badge, and detected vectors
- 📎 **File attachment support** — attach `.pdf`, `.csv`, or plain text; content is extracted and appended to the prompt (PDFs capped at 10 pages)
- 🕐 **Typing indicator** with animated dots
- 🔒 **Safety rating** shown on every AI reply ("🛡️ Safety Rating: 12/100 (Safe)")
- 🔎 **"Audit Reply for Bias"** button on every AI message (see Feature 2)

---

## 📊 Feature 4 — Threat Detection Center

The `/detect` page is a security operations dashboard for analyzing arbitrary text payloads in real time.

### Components

**Payload Input** — Paste any text, click "Analyze Vector". Shows "NVIDIA Nemotron AI Scanning..." during analysis.

**Threat Overview Gauge** — Animated SVG semicircle fills from 0 to the current risk score. Color gradient green → yellow → red. Displays the numeric score and threat level label.

**Active Threats Panel** — Three threat cards that **flash** when the corresponding attack type is detected:
- 🔴 SQL Injection — shows live confidence score
- 🟡 System Override — shows live confidence score
- 🟢 Jailbreak & Semantic — covers both regex jailbreak and NVIDIA AI safety violations

**Scan Activity Trend Chart** — Recharts AreaChart plotting risk scores over the session. Gradient fill with interactive tooltips.

**Analysis Forensics Log** — Searchable table of all scans: Time, Threat Classification, System Action (Allowed / Flagged / Blocked), Risk Score. New entries animate in.

---

## 🔴 Feature 5 — Red Teaming Module

The `/redteam` page allows security teams to run **adversarial simulations** against the defense engine.

- **Run Jailbreak Datasets** — batch-runs known jailbreak payloads against the engine
- **Upload Custom CSV** — load a custom adversarial dataset for evaluation
- **Known Detection Rates panel** — Awesome Roleplay (94%), Developer Mode (88%), System Override (72%)

This lets teams measure how robust their defenses are before going to production.

---

## 🔐 Authentication

ShadowVault uses **Google OAuth 2.0** with JWT sessions:

1. User clicks Sign in with Google on the `/login` page
2. Google `idToken` is sent to `POST /auth/google`
3. Backend verifies with Google's tokeninfo API, creates/updates user in SQLite
4. A JWT is returned and stored in `localStorage` as `authToken`
5. All protected routes check for a valid JWT — unauthorized users are redirected to `/login`

JWT sessions expire in 30 minutes (configurable).

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+

### 1. Clone the Repository

```bash
git clone https://github.com/amishiverma/ShadowVault.git
cd ShadowVault
```

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Linux / Mac

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Fill in your API keys in .env

# Start the server
uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup

```bash
cd frontend
npm install

# Create env file
echo VITE_BACKEND_URL=http://localhost:8000 > .env

# Start dev server
npm run dev
```

App runs at `http://localhost:5173`

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

# JWT
SECRET_KEY=your_super_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Database
DATABASE_URL=sqlite:///./shadowvault_auth.db

# AI Keys
GEMINI_API_KEY=your_gemini_api_key       # Required: powers SecureChat & AI bias explanations
NVIDIA_API_KEY=your_nvidia_nim_api_key   # Optional: enables AI semantic safety guard
```

### Frontend (`frontend/.env`)

```env
VITE_BACKEND_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

> **Without NVIDIA key:** The system uses regex-only detection (still robust). Without Gemini key: SecureChat and AI bias narratives are unavailable.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 + Vite | SPA framework |
| React Router v7 | Client-side routing |
| `@react-oauth/google` | Google Sign-In |
| `@react-three/fiber` + `drei` | 3D globe on login page |
| Recharts | Scan activity area chart |
| Vanilla CSS | Custom dark/light theme system |

### Backend
| Technology | Purpose |
|---|---|
| FastAPI | REST API framework |
| SQLAlchemy + SQLite | User persistence |
| `google-auth` libraries | OAuth token verification |
| `python-jose` | JWT creation & validation |
| `google-genai` | Gemini 2.0 Flash integration |
| OpenAI SDK | NVIDIA NIM client |
| `pypdf` | PDF text extraction |
| Pandas + NumPy | Dataset bias statistical analysis |
| `fairlearn` / `scikit-learn` | ML fairness toolkit |

---

## 🔌 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/google` | Exchange Google idToken for JWT |
| `GET` | `/auth/user` | Get current authenticated user |
| `POST` | `/auth/logout` | Logout |
| `POST` | `/api/analyze` | Analyze prompt for security threats |
| `POST` | `/api/secure-chat` | Gemini chat with threat + output validation |
| `POST` | `/api/audit/dataset` | **Dataset fairness analysis** (CSV/JSON) |
| `POST` | `/api/audit/explain` | **Gemini narrative** explanation of audit results |
| `POST` | `/api/audit/text` | **Inline text bias check** on AI replies |
| `GET` | `/` | Health check |

---

## 💡 Why ShadowVault Stands Out

| Other Bias Auditing Tools | ShadowVault |
|---|---|
| Audit data before deployment | ✅ Audit data before deployment |
| No runtime protection | ✅ Scan every live AI interaction |
| No defense against adversarial prompts | ✅ Dual-layer prompt injection defense |
| Static reports only | ✅ On-demand per-reply bias audit inside chat |
| Technical output only | ✅ Gemini-generated stakeholder narrative + fix plan |

ShadowVault treats AI fairness as a **continuous, end-to-end responsibility** — not a one-time checkbox.

---

<div align="center">
  <p><strong>ShadowVault</strong> — Measure It. Flag It. Fix It.</p>
  <p><em>Unbiased AI Decision · Open Innovation Track</em></p>
</div>
