import os
import re
import subprocess

def run_instrumented_python_code(user_code, number_of_inputs=50):
    def extract_function_name(code):
        match = re.search(r"def (\w+)\(", code)
        if match:
            return match.group(1)
        else:
            raise ValueError("No function definition found in the provided code.")

    function_name = extract_function_name(user_code)

    python_prolog = """
import time
import random
import os
from collections import defaultdict

class Prototype:
    def __init__(self):
        self.line_info_total = defaultdict(int)
"""

    python_epilog = f"""
    def generate_input(self, size):
        return [random.randint(0, 1000) for _ in range(size)]

    def run(self):
        output_file = os.path.join(os.path.dirname(__file__), "output_python.txt")
        with open(output_file, "w") as pw:
            for size in range(1, {number_of_inputs} + 1): 
                input_array = self.generate_input(size)
                start_time = time.time()
                self.{function_name}(input_array)
                end_time = time.time()
                exec_time = (end_time - start_time) * 1e9

                pw.write(f"size = {{size}}\\n")
                pw.write(f"Function execution time: {{exec_time:.0f}} ns\\n")
                line_output = {{}}
                for line_num, count in sorted(self.line_info_total.items()):
                    line_output[line_num] = int(count * 1e9)  
                pw.write(f"{{line_output}}\\n")
"""

    instrumented_code = python_prolog
    lines = user_code.strip().split("\n")
    lines[0] = f"def {function_name}(self, " + lines[0].split("(", 1)[1]
    for i, line in enumerate(lines):
        stripped_line = line.strip()
        if i != 0:
            line = re.sub(r"\b{}\b".format(function_name), f"self.{function_name}", line)
        if line.endswith(':'):
            instrumented_code += f"    {line}\n"
            continue
        elif 'return' in stripped_line:
            instrumented_code += f"    {line}\n"
            continue
        indent = '    ' + re.match(r"\s*", lines[i+1] if line.endswith(':') else lines[i]).group(0)
        instrumented_code += f"{indent}start_time_{i} = time.time()\n"
        instrumented_code += f"    {line}\n"
        instrumented_code += (
            f"{indent}self.line_info_total[{i}] += time.time() - start_time_{i}\n"
        )

    instrumented_code += python_epilog
    instrumented_code += "p = Prototype()\n"
    instrumented_code += "p.run()\n"
    python_file = os.path.join(os.path.dirname(__file__),"python_Prototype.py")
    with open(python_file, "w") as f:
        f.write(instrumented_code)
    subprocess.run(['python', python_file], capture_output=True, text=True)

# # Example usage
# user_code = """
# def mergeSort(x):
#     if len(x) < 2:
#         return x
#     result = []
#     mid = int(len(x) / 2)
#     y = mergeSort(x[:mid])
#     z = mergeSort(x[mid:])
#     i = 0
#     j = 0
#     while i < len(y) and j < len(z):
#         if y[i] > z[j]:
#             result.append(z[j])
#             j += 1
#         else:
#             result.append(y[i])
#             i += 1
#     result += y[i:]
#     result += z[j:]
#     return result
# """

# run_instrumented_python_code(user_code, number_of_inputs=50)
