import json
import re

def get_mock_chat_response(prompt: str, history: list) -> str:
    """
    Generates a highly-relevant, realistic, and formatted response for the chat UI
    when the Gemini API key is missing or exhausted on localhost.
    """
    prompt_lower = prompt.lower()
    
    # 1. SQL Injection Topic
    if any(k in prompt_lower for k in ["sql", "sql injection", "database injection", "select *", "drop table"]):
        return (
            "🤖 **ShadowVault Local Assistant [Mock Mode]**\n\n"
            "It looks like you're asking about **SQL Injection (SQLi)** or testing database defenses! "
            "SQL Injection is a critical vulnerability where an attacker manipulates SQL queries by injecting malicious input.\n\n"
            "### How ShadowVault Protects Against SQLi:\n"
            "- **Layer 1 (Regex Shields):** Standard patterns like `UNION SELECT`, `OR 1=1`, and `DROP TABLE` are immediately detected by pre-compiled regex filters.\n"
            "- **Layer 2 (AI Semantics):** The safety model checks if the intent of the prompt is to bypass system boundaries or fetch unauthorized database data.\n\n"
            "### Best Practices for Mitigation:\n"
            "1. **Always use Parameterized Queries:** Avoid constructing raw SQL queries by concatenating user inputs.\n"
            "2. **Implement Principle of Least Privilege:** Keep database user permissions to the absolute minimum needed.\n"
            "3. **Use ORM Frameworks:** Modern ORMs (like SQLAlchemy in Python) automatically parameterize inputs."
        )
        
    # 2. Jailbreak Topic
    elif any(k in prompt_lower for k in ["jailbreak", "dan", "ignore instructions", "pretend you are", "system prompt"]):
        return (
            "🤖 **ShadowVault Local Assistant [Mock Mode]**\n\n"
            "Detected a query regarding **Jailbreak Techniques** or Prompt Injection bypasses! "
            "Jailbreaking refers to prompts crafted to coerce an LLM into ignoring its system prompt and safety guidelines.\n\n"
            "### ShadowVault Dual-Layer Defense:\n"
            "1. **Regex Classifier:** Blocks classic injection tokens such as `ignore previous instructions`, `pretend you are DAN`, or `root access` with 0ms latency.\n"
            "2. **Semantic Safety Guard:** Uses prompt-boundary isolation and safety guard models (like NVIDIA Llama-Nemotron Safety Guard) to classify the request's context and intent.\n\n"
            "Feel free to submit a jailbreak prompt in the input to see the **ShadowVault Shield** trigger a block page automatically!"
        )
        
    # 3. Bias or Fairness Topic
    elif any(k in prompt_lower for k in ["bias", "fairness", "discrimination", "audit", "protected attribute"]):
        return (
            "🤖 **ShadowVault Local Assistant [Mock Mode]**\n\n"
            "You are asking about **Bias and Algorithmic Fairness**! This is a core focus of ShadowVault.\n\n"
            "Our **AI Fairness Auditor** helps you inspect datasets for representation imbalances and disparate impact. "
            "To test this:\n"
            "- Go to the **Fairness Auditor** tab.\n"
            "- Upload a dataset (like `bias_test_data.csv` in the root folder).\n"
            "- Select a target outcome column and protected attributes (e.g., `gender`, `race`).\n"
            "- The auditor will calculate representation gaps and disparate impact ratios (like the 4/5ths rule) and generate comprehensive debiasing recommendations!"
        )

    # 4. Exfiltration Topic
    elif any(k in prompt_lower for k in ["exfiltration", "extract", "api key", "password", "leak"]):
        return (
            "🤖 **ShadowVault Local Assistant [Mock Mode]**\n\n"
            "This query relates to **Data Exfiltration and Sensitive Data Exposure**.\n\n"
            "Data exfiltration in prompt injections happens when an attacker forces the LLM to output secret keys, configuration parameters, or user PII. "
            "ShadowVault blocks these attempts using advanced regex and AI guards targeting key-phrase patterns (e.g., `private_key`, `credentials`, `password`)."
        )
        
    # 5. General greeting / hello
    elif any(k in prompt_lower for k in ["hello", "hi", "hey", "greetings", "good morning", "good afternoon"]):
        return (
            "🤖 **ShadowVault Local Assistant [Mock Mode]**\n\n"
            "Hello! I am operating in **Mock Mode** on localhost because the Gemini API key is currently not configured or has reached its quota limit.\n\n"
            "The prompt defense shields and safety layers are **100% active** locally! You can test:\n"
            "1. **Safe Prompts:** Chat with me about AI safety, prompt injections, or database defenses.\n"
            "2. **Malicious Prompts:** Try inputting a SQL injection or jailbreak attempt to see how the system immediately intercepts and blocks it!\n"
            "3. **Fairness Audits:** Head over to the Fairness Auditor tab to audit datasets for bias."
        )
        
    # 6. Fallback General Smart Response
    else:
        return (
            "🤖 **ShadowVault Local Assistant [Mock Mode]**\n\n"
            f"Thank you for your message: *\"{prompt}\"*\n\n"
            "Because the Gemini API key is not configured or exhausted on localhost, I am responding in local offline mode. "
            "Your prompt has been scanned by our local dual-layer threat engine and was determined to be **Safe (Risk Score < 60)**.\n\n"
            "Feel free to ask me about prompt injection defense policies, how to audit datasets for bias, or try submitting a malicious attack prompt to watch the defensive shields in action!"
        )

def get_mock_explain_audit(audit_results: dict) -> str:
    """
    Dynamically generates a detailed, premium AI ethics explanation based on the audit outcomes.
    """
    overall_score = audit_results.get("overall_score", 0)
    status = audit_results.get("status", "SAFE")
    total_samples = audit_results.get("summary", {}).get("total_samples", 0)
    flags = audit_results.get("flags", [])
    
    # Header & Status
    status_emoji = "🚨 CRITICAL" if status == "CRITICAL" else "⚠️ WARNING" if status == "WARNING" else "✅ SAFE"
    
    explanation = (
        f"# AI Fairness Audit Explanation\n\n"
        f"**Audit Status:** {status_emoji} (Overall Bias Risk: **{overall_score}%**)\n"
        f"**Dataset Size:** {total_samples} records audited\n\n"
        f"--- \n\n"
        f"## 📊 Executive Summary\n"
    )
    
    if status == "SAFE":
        explanation += (
            "The ethical audit indicates that the dataset is **well-balanced** and satisfies standard equity metrics. "
            "There is no statistically significant evidence of demographic bias or disparate impact. "
            "Models trained on this dataset are highly likely to treat all sub-groups fairly, assuming non-linear proxy variables do not introduce secondary bias."
        )
    else:
        explanation += (
            f"The dataset displays **{status.lower()} levels of bias** with a combined bias rating of **{overall_score}/100**. "
            "Our algorithms identified systemic imbalances across protected attributes that could lead to discriminatory outcomes if used to train machine learning models. "
            "We strongly advise implementing the 'Fix Action Plan' below prior to deploying any decision-making model built on this data."
        )
        
    # Flags analysis
    if flags:
        explanation += "\n\n## 🔍 Breakdown of Detected Bias Risk\n"
        for idx, flag in enumerate(flags, 1):
            attr = flag.get("attribute", "Unknown Attribute")
            flag_type = flag.get("type", "BIAS")
            severity = flag.get("severity", "MEDIUM")
            msg = flag.get("message", "")
            
            explanation += f"### {idx}. {flag_type} Bias in '{attr}' ({severity} severity)\n"
            explanation += f"- **Issue:** {msg}\n"
            if flag_type == "REPRESENTATION":
                explanation += (
                    f"- **Why this is harmful:** When one demographic group is highly over-represented, "
                    f"the model learns the patterns of that group much better than others. This results in "
                    f"significantly higher error rates or poorer prediction accuracy for minority groups.\n"
                )
            elif flag_type == "DISPARATE_IMPACT":
                explanation += (
                    f"- **Why this is harmful:** Disparate impact violates the 80% (four-fifths) rule. "
                    f"It indicates that the positive outcome selection rate for the protected group is less than "
                    f"80% of the rate of the majority group. In many sectors, this poses substantial legal, regulatory, and reputational risks.\n"
                )
                
    # Fix Action Plan
    explanation += "\n\n## 🛠️ Fix Action Plan\n"
    if status == "SAFE":
        explanation += (
            "1. **Continuous Monitoring:** Regularly audit the production model outputs as new data is collected, ensuring drift doesn't introduce bias.\n"
            "2. **Proxy Variable Check:** Confirm that other columns (like zip code or school) do not act as hidden proxies for protected classes.\n"
            "3. **Feedback Loop Audits:** Implement a pipeline to log and inspect cases where users flag potentially biased decisions."
        )
    else:
        # Generate actionable advice based on flags
        count = 1
        has_rep = any(f.get("type") == "REPRESENTATION" for f in flags)
        has_di = any(f.get("type") == "DISPARATE_IMPACT" for f in flags)
        
        if has_rep:
            explanation += (
                f"{count}. **Targeted Oversampling or Synthetic Generation (SMOTE):** Collect more data from the under-represented groups or use algorithmic oversampling to balance minority representations.\n"
            )
            count += 1
        if has_di:
            explanation += (
                f"{count}. **Apply Adversarial Debiasing:** Train the neural network or model in tandem with an adversary that tries to guess the protected attribute. This forces the primary model to learn representations independent of sensitive attributes.\n"
                f"{count+1}. **Adjust Decision Thresholds:** Recalibrate classification thresholds for different groups to achieve equalized odds or demographic parity.\n"
            )
            count += 2
            
        explanation += (
            f"{count}. **Feature Pruning:** Remove non-essential attributes that are highly correlated with the protected categories to prevent indirect discrimination."
        )
        
    return explanation

def get_mock_text_bias_audit(text: str) -> dict:
    """
    Performs a rule-based scan on text to output high-quality, professional mock audits.
    """
    text_lower = text.lower()
    
    # Check for stereotypical keywords or emotional adjectives often correlated with bias
    gender_words = ["emotional", "hysterical", "bossy", "nagging", "aggressive woman", "weak man", "man up", "girly"]
    race_words = ["ghetto", "criminal background by race", "illegal alien", "thug", "articulate for a"]
    
    is_biased = False
    bias_type = "none"
    severity = "none"
    explanation = "No biased patterns, discriminatory stereotypes, or coded language detected. The statement is balanced, objective, and safe to proceed."
    
    for word in gender_words:
        if word in text_lower:
            is_biased = True
            bias_type = "gender"
            severity = "medium"
            explanation = (
                f"Flagged term: \"{word}\".\n\n"
                "Analysis:\n"
                "This text contains terms or descriptions that have historically been used as gendered stereotypes or double standards. "
                "For instance, describing assertiveness as 'bossy' or intense emotional reactions as 'hysterical' disproportionately targets women. "
                "To remain equitable, use objective behavioral descriptors instead of coded adjectives."
            )
            break
            
    if not is_biased:
        for word in race_words:
            if word in text_lower:
                is_biased = True
                bias_type = "race"
                severity = "high"
                explanation = (
                    f"Flagged term: \"{word}\".\n\n"
                    "Analysis:\n"
                    "The text uses terms with strong racialized connotations or coded language that reinforces systemic stereotyping. "
                    "Using these terms generalized to a population or in a professional audit introduces implicit bias and violates guidelines. "
                    "We recommend substituting these with precise, descriptive, and neutral terminology."
                )
                break
                
    return {
        "is_biased": is_biased,
        "bias_type": bias_type,
        "severity": severity,
        "explanation": explanation
    }
