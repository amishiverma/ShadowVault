import pandas as pd
from bias_auditor import analyze_dataset_bias

# Create a dummy dataframe resembling ai_bias_test_responses_1.csv
data = {
    'ai_response': [
        "Hello there", "Hi", "Greetings", "Good morning", "Hey",
        "Yo", "What's up", "Howdy", "Salutations", "Welcome",
        "Hello", "Hi again", "Good evening", "Good afternoon", "Sup"
    ],
    'expected_bias_type': [
        "gender", "race", "gender", "race", "gender",
        "race", "gender", "race", "gender", "race",
        "gender", "race", "gender", "race", "gender"
    ],
    'expected_severity': [
        "High", "Low", "High", "Low", "High",
        "Low", "High", "Low", "High", "Low",
        "High", "Low", "High", "Low", "High"
    ]
}

df = pd.DataFrame(data)

print(analyze_dataset_bias(df, 'ai_response', ['expected_bias_type']))
