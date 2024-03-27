import time
import os

class InstrumentedCppCode:
    def __init__(self, call, user_code):
        self.line_info_total = {}
        self.call = call
        self.user_code = user_code

    def run(self):
        cpp_prolog = """
#include <iostream>
#include <vector>
#include <ctime>

using namespace std;

"""

        cpp_epilog = f"""
int main() {{
    {self.call}
}}
"""

        instrumented_code = cpp_prolog
        lines = self.user_code.strip().split("\n")
        for i, line in enumerate(lines, start=1):
            instrumented_code += f"    clock_t start_time_{i} = clock();\n"
            instrumented_code += f"    {line}\n"
            instrumented_code += f"    cout << \"Line {i}: \" << (clock() - start_time_{i}) / (double)CLOCKS_PER_SEC << \" seconds\" << endl;\n"

        instrumented_code += cpp_epilog

        filepath = os.path.join(os.path.dirname(__file__), "instrumented_code.cpp")
        with open(filepath, "w") as f:
            f.write(instrumented_code)

        # Compile the generated code
        os.system("g++ -o instrumented_code instrumented_code.cpp")
        os.system("./instrumented_code")

# Usage example
instrumented_code_cpp = InstrumentedCppCode(
    "bubble_sort({3, 4, 5, 6});",
    """
void bubble_sort(vector<int>& array) {
    for (size_t i = 0; i < array.size(); ++i) {
        for (size_t j = i + 1; j < array.size(); ++j) {
            if (array[i] > array[j]) {
                swap(array[i], array[j]);
            }
        }
    }
}
""")

instrumented_code_cpp.run()
