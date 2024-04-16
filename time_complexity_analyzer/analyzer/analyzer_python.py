import os
import re
import subprocess

class InstrumentedPythonCode:
    def __init__(self, user_code, number_of_inputs=50):
        self.line_info_total = {}
        self.user_code = user_code
        self.number_of_inputs = number_of_inputs

    def run(self):
        python_prolog = """
import time
import os
import random
from collections import defaultdict
class Prototype:
    def __init__(self):
        self.line_info_total = defaultdict(int)
"""

        python_epilog = """
    def generate_input(self, size):
        return [random.randint(0, 1000) for _ in range(size)]

    def run(self, number_of_inputs):
        output_file = os.path.join(os.path.dirname(__file__), "output_python.txt")
        with open(output_file, "w") as pw:
            for size in range(1, number_of_inputs + 1): 
                input_array = self.generate_input(size)
                start_time = time.time()
                self.mergeSort(input_array)
                end_time = time.time()
                exec_time = (end_time - start_time) * 1e9
                
                pw.write(f"size = {size}\\n")
                pw.write(f"Function execution time: {exec_time:.0f} ns\\n")
                line_output = {}
                for line_num, count in sorted(self.line_info_total.items()):
                    line_output[line_num] = int(count * 1e9)  
                pw.write(f"{line_output}\\n")
"""

        instrumented_code = python_prolog
        lines = self.user_code.strip().split("\n")
        for i, line in enumerate(lines):
            stripped_line = line.strip()
            if line[-1] == ':':
                instrumented_code += f"    {line}\n"
                continue
            elif 'return' in stripped_line:
                instrumented_code += f"    {line}\n"
                continue
            indent ='    ' + re.match(r"\s*", lines[i+1 if line[-1]==':' else i]).group(0)
            instrumented_code += f"{indent}start_time_{i} = time.time()\n"
            instrumented_code += f"    {line}\n"
            instrumented_code += (
                f"{indent}self.line_info_total[{i}] += time.time() - start_time_{i}\n"
            )

        instrumented_code += python_epilog
        instrumented_code += "p = Prototype()\n"
        instrumented_code += f"p.run({self.number_of_inputs})\n"
        python_file = os.path.join(os.path.dirname(__file__), "python_Prototype.py")
        with open(python_file, "w") as f:
            f.write(instrumented_code)
        subprocess.run(['python', python_file], capture_output=True, text=True)


instrumented_code = InstrumentedPythonCode("""
def mergeSort(self,x):
  if len(x) < 2:
      return x
  result = []
  mid = int(len(x) / 2)
  y = p.mergeSort(x[:mid])
  z = p.mergeSort(x[mid:])
  i = 0
  j = 0
  while i < len(y) and j < len(z):
      if y[i] > z[j]:
          result.append(z[j])
          j += 1
      else:
          result.append(y[i])
          i += 1
  result += y[i:]
  result += z[j:]
  return result
""",number_of_inputs=50
)

instrumented_code.run()
