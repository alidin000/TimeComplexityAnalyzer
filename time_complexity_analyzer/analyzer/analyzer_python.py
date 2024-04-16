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
class Prototype:
    def __init__(self):
        self.line_info_total = {}
"""

        python_epilog = """
    def generate_input(self, size):
        return [random.randint(0, 1000) for _ in range(size)]

    def run(self, number_of_inputs):
        output_file = os.path.join(os.path.dirname(__file__), "output_python.txt")
        with open(output_file, "w") as pw:
            for size in range(1, number_of_inputs):
                input_array = self.generate_input(size)
                start_time = time.time()
                self.bubble_sort(input_array)
                end_time = time.time()
                exec_time = (end_time - start_time) * 1e9

                pw.write(f"size = {size}\\n")
                pw.write(f"Function execution time: {exec_time} ns\\n")
                for line_num, count in self.line_info_total.items():
                    pw.write(f"Line {line_num}: {count} swaps\\n")
"""

        instrumented_code = python_prolog
        lines = self.user_code.strip().split("\n")
        for i, line in enumerate(lines):
            if line[-1] == ':':
                instrumented_code += f"    {line}\n"
                continue
            indent ='    ' + re.match(r"\s*", lines[i+1 if line[-1]==':' else i]).group(0)
            instrumented_code += f"{indent}self.line_info_total[{i}] = 0\n"
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
def bubble_sort(self,array):
    for i in range(len(array)):
        for j in range(i + 1, len(array)):
            if array[i] > array[j]:
                array[i], array[j] = array[j], array[i]
""",number_of_inputs=50
)

instrumented_code.run()
