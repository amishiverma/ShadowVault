import pandas as pd
import numpy as np
from typing import List, Dict, Any, Optional
import io

def analyze_dataset_bias(df: pd.DataFrame, target_column: str, protected_attributes: List[str]) -> Dict[str, Any]:
    """
    Analyzes a dataset for bias relative to a target outcome and protected attributes.
    """
    results = {
        "summary": {},
        "attributes": {},
        "overall_score": 0,
        "flags": []
    }

    if target_column not in df.columns:
        return {"error": f"Target column '{target_column}' not found in dataset."}

    # Identify if target is categorical or numerical
    is_categorical = df[target_column].dtype == 'object' or df[target_column].nunique() < 10
    
    total_samples = len(df)
    results["summary"]["total_samples"] = total_samples
    
    total_bias_score = 0
    
    for attr in protected_attributes:
        if attr not in df.columns:
            continue
            
        attr_results = {
            "distribution": df[attr].value_counts().to_dict(),
            "metrics": {}
        }
        
        # Calculate Representation Bias
        dist = df[attr].value_counts(normalize=True)
        max_rep = dist.max()
        min_rep = dist.min()
        imbalance_ratio = max_rep / min_rep if min_rep > 0 else 100
        
        attr_results["metrics"]["representation_imbalance"] = round(imbalance_ratio, 2)
        
        if imbalance_ratio > 3:
            results["flags"].append({
                "type": "REPRESENTATION",
                "attribute": attr,
                "severity": "HIGH",
                "message": f"Significant representation gap in '{attr}'. Majority group is {round(imbalance_ratio, 1)}x more frequent."
            })
            total_bias_score += 20

        # Calculate Outcome Bias (if target exists)
        if is_categorical:
            # For categorical outcomes (e.g., Approved/Denied)
            # We look at the 'positive' outcome rate for each group
            positive_outcome = df[target_column].value_counts().index[0] # Assume first is positive for now
            
            outcome_rates = {}
            groups = df[attr].unique()
            for group in groups:
                group_df = df[df[attr] == group]
                if len(group_df) > 0:
                    rate = (group_df[target_column] == positive_outcome).mean()
                    outcome_rates[str(group)] = round(float(rate), 3)
            
            attr_results["metrics"]["outcome_rates"] = outcome_rates
            
            # Disparate Impact
            if len(outcome_rates) > 1:
                rates = list(outcome_rates.values())
                di = min(rates) / max(rates) if max(rates) > 0 else 1.0
                attr_results["metrics"]["disparate_impact"] = round(di, 3)
                
                if di < 0.8: # The "four-fifths rule"
                    results["flags"].append({
                        "type": "DISPARATE_IMPACT",
                        "attribute": attr,
                        "severity": "CRITICAL",
                        "message": f"Evidence of systemic bias in '{attr}'. Disparate Impact ratio is {round(di, 2)} (threshold 0.8)."
                    })
                    total_bias_score += 40

        results["attributes"][attr] = attr_results

    results["overall_score"] = min(total_bias_score, 100)
    results["status"] = "CRITICAL" if results["overall_score"] > 50 else "WARNING" if results["overall_score"] > 20 else "SAFE"
    
    return results

def suggest_mitigation(bias_results: Dict[str, Any]) -> List[Dict[str, str]]:
    """
    Suggests ways to fix the detected bias.
    """
    suggestions = []
    for flag in bias_results.get("flags", []):
        if flag["type"] == "REPRESENTATION":
            suggestions.append({
                "attribute": flag["attribute"],
                "action": "Oversampling / Data Collection",
                "description": f"Collect more samples for the under-represented groups in '{flag['attribute']}' to balance the training set."
            })
        elif flag["type"] == "DISPARATE_IMPACT":
            suggestions.append({
                "attribute": flag["attribute"],
                "action": "Adversarial Debiasing",
                "description": f"Apply algorithmic debiasing during model training to penalize the model for relying on '{flag['attribute']}' for predictions."
            })
            suggestions.append({
                "attribute": flag["attribute"],
                "action": "Threshold Adjustment",
                "description": "Adjust decision thresholds for different demographic groups to ensure equalized odds."
            })
            
    if not suggestions:
        suggestions.append({
            "attribute": "All",
            "action": "Continuous Monitoring",
            "description": "No immediate critical bias detected. Continue monitoring model outputs in production."
        })
        
    return suggestions
