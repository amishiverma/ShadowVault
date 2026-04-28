import pandas as pd
from bias_auditor import analyze_dataset_bias
data = {
    'ai_response': [
        "Hello there", "Hi", "Greetings", "Good morning", "Hey",
        "Yo", "What's up", "Howdy", "Salutations", "Welcome",
        "Hello", "Hi again", "Good evening", "Good afternoon", "Sup"
    ]
}
df = pd.DataFrame(data)
print("dtype:", df['ai_response'].dtype)
print("nunique:", df['ai_response'].nunique())
is_cat = df['ai_response'].dtype == 'object' or df['ai_response'].nunique() < 10
print("is_categorical:", is_cat)
