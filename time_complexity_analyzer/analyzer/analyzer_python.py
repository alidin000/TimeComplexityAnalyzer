def instrument_python_code(call, user_code):
    python_prolog = """
import time

class Prototype:
    def __init__(self):
        self.line_info_last_start = {}
        self.line_info_total = {}

"""

    python_epilog = """
    def run(self):
        """ + call + """
        with open("output.txt", "w") as f:
            for line, total_time in self.line_info_total.items():
                f.write(f"{line}: {total_time}\\n")
"""

    return (python_prolog +
            '\n'.join(
                f"self.line_info_last_start[{i+1}] = time.time();" +
                x +
                f"self.line_info_total[{i+1}] = self.line_info_total.get({i+1}, 0) + (time.time() - self.line_info_last_start.get({i+1}, 0));" for i, x in enumerate(user_code.splitlines())) +
            python_epilog)


# Usage example
python_code = instrument_python_code("p.bubble_sort([3, 4, 5, 6])", """
def bubble_sort(array):
    for i in range(len(array)):
        for j in range(i + 1, len(array)):
            if array[i] > array[j]:
                array[i], array[j] = array[j], array[i]
""")

with open("prototype.py", "w") as py_file:
    py_file.write(python_code)

# Python script to use the generated Python code
python_script = """
import prototype

# Instantiate the prototype
p = prototype.Prototype()

# Run the prototype
p.run()
"""

with open("use_prototype.py", "w") as py_script_file:
    py_script_file.write(python_script)
