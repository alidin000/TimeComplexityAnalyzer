# check this logic for indentation
# import os

# def list_directory_contents(dir_path, indent_level=0):
#     for item in os.listdir(dir_path):
#         item_path = os.path.join(dir_path, item)
#         print("  " * indent_level + "|-- " + item)
#         if os.path.isdir(item_path):
#             list_directory_contents(item_path, indent_level + 1)

# project_directory = 'path/to/your/project'
# print(project_directory)
# list_directory_contents(project_directory)



import os

class InstrumentedPythonCode:
    def __init__(self, call, user_code):
        self.line_info_total = {}
        self.call = call
        self.user_code = user_code

    def run(self):
        python_prolog = """
import time

class Prototype:
    def __init__(self):
        self.line_info_total = {}
"""

        python_epilog = """
    def run(self):
        p = Prototype()
        """ + self.call + """
        for line_num, total_time in self.line_info_total.items():
            print(f"Line {line_num}: {total_time} seconds")
"""

        instrumented_code = python_prolog
        lines = self.user_code.strip().split("\n")
        for i, line in enumerate(lines, start=1):
            instrumented_code += f"        self.line_info_total[{i}] = 0\n"
            instrumented_code += f"        start_time_{i} = time.time()\n"
            if ":" in line:
                instrumented_code += f"        {line}\n"
                instrumented_code += f"            "
            else:
                instrumented_code += f"        {line}\n"
            instrumented_code += (
                f"        self.line_info_total[{i}] += time.time() - start_time_{i}\n"
            )

        instrumented_code += python_epilog
        python_file = os.path.join(os.path.dirname(__file__), "python_prototype.py")
        with open(python_file, "w") as f:
            f.write(instrumented_code)

        # Execute the generated code
        exec(instrumented_code)


# Usage example
instrumented_code = InstrumentedPythonCode(
    "p.bubble_sort([3, 4, 5, 6])",
    """
def bubble_sort(array):
    for i in range(len(array)):
        for j in range(i + 1, len(array)):
            if array[i] > array[j]:
                array[i], array[j] = array[j], array[i]
""",
)

instrumented_code.run()
