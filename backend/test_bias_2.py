import pandas as pd
from bias_auditor import analyze_dataset_bias

data = {'ai_response': ["Hello", "Hi"], 'expected_bias_type': ["A", "B"]}
df = pd.DataFrame(data)

# Let's read the code from bias_auditor.py directly
import sys
with open('bias_auditor.py', 'r') as f:
    code = f.read()
    
# Let's just run analyze_dataset_bias and trace inside
import traceback
print(analyze_dataset_bias(df, 'ai_response', ['expected_bias_type']))
