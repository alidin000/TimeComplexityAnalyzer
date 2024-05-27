import re
import subprocess
import os

def ensure_directory_exists(path):
    if not os.path.exists(path):
        os.makedirs(path)

def instrument_cpp_function(user_function, call_template, num_inputs, size_array):
    function_name = re.search(r"\b(?:\w+\s+)+(\w+)\s*\(", user_function).group(1)
    cpp_prolog = """
#include <iostream>
#include <fstream>
#include <chrono>
#include <map>
#include <vector>
#include <cstdlib>
#include <ctime>
#include <algorithm>

class InstrumentedPrototype {
public:
    std::map<int, std::chrono::high_resolution_clock::time_point> lineInfoLastStart;
    std::map<int, long long> lineInfoTotal;

    InstrumentedPrototype() {
        // Constructor
    }

    std::chrono::high_resolution_clock::time_point getLastLineInfo(int lineNumber) {
        auto it = lineInfoLastStart.find(lineNumber);
        if (it != lineInfoLastStart.end()) {
            return it->second;
        } else if (lineNumber > 1) {
            return getLastLineInfo(lineNumber - 1);
        }
        return std::chrono::high_resolution_clock::now();
    }
    """

    cpp_epilog = f"""
    std::vector<int> generateInput(int size) {{
        std::vector<int> input(size);
        srand(time(0)); 

        for (int i = 0; i < size; ++i) {{
            input[i] = rand() % 1000;
        }}

        return input;
    }}

    void execute(int size) {{
        InstrumentedPrototype p;
        std::vector<int> input = generateInput(size);
        auto startTime = std::chrono::high_resolution_clock::now();
        {call_template.replace("$$size$$", "input")}
        auto endTime = std::chrono::high_resolution_clock::now();
        long long execTime = std::chrono::duration_cast<std::chrono::nanoseconds>(endTime - startTime).count();
        
        std::ofstream outFile("output_cpp_{size_array}.txt", std::ios_base::app);
        outFile << "size = " << size << "\\n";
        outFile << "Function execution time: " << execTime << " ns\\n";
        outFile << "{{";
        bool isFirst = true;
        for (auto it = p.lineInfoTotal.begin(); it != p.lineInfoTotal.end(); ++it) {{
            if (!isFirst) outFile << ", ";
            isFirst = false;
            outFile << it->first << "=" << it->second;
        }}
        outFile << "}}\\n";
        outFile.close();
    }}

    void run() {{
        for (int size = 1; size <= {num_inputs}; ++size) {{
            execute({size_array});
        }}
    }}
}};

int main() {{
    InstrumentedPrototype prototype;
    prototype.run();
    return 0;
}}
"""

    lines = user_function.strip().splitlines()
    instrumented_user_function = lines[0]
    last_line_index = len(lines) - 1
    for i, line in enumerate(lines[1:], start=2):
        trimmed_line = line.strip()
        if not trimmed_line or trimmed_line == '}' or i == last_line_index:
            if "return" in trimmed_line or trimmed_line == '}':
                instrumented_line = line
            else:
                instrumented_line = (
                    f"this->lineInfoLastStart[{i}] = std::chrono::high_resolution_clock::now();\n"
                    + line + f"\nthis->lineInfoTotal[{i}] += std::chrono::duration_cast<std::chrono::nanoseconds>(std::chrono::high_resolution_clock::now() - this->getLastLineInfo({i})).count();"
                )
        else:
            instrumented_line = (
                f"this->lineInfoLastStart[{i}] = std::chrono::high_resolution_clock::now();\n"
                + line + "\n"
                + f"this->lineInfoTotal[{i}] += std::chrono::duration_cast<std::chrono::nanoseconds>(std::chrono::high_resolution_clock::now() - this->getLastLineInfo({i})).count();"
            )
        instrumented_user_function += "\n" + instrumented_line

    full_cpp_code = cpp_prolog + instrumented_user_function + cpp_epilog
    return full_cpp_code

def write_and_compile_cpp(cpp_code):
    cpp_file_dir = os.path.dirname(__file__)
    cpp_file_path = os.path.join(cpp_file_dir, "InstrumentedPrototype.cpp")

    with open(cpp_file_path, "w") as cpp_file:
        cpp_file.write(cpp_code)
    
    subprocess.run(["g++", "-std=c++14", cpp_file_path, "-o", os.path.join(cpp_file_dir, "InstrumentedPrototype")], check=True)

def run_cpp_program():
    cpp_file_dir = os.path.dirname(__file__)
    command = [os.path.join(cpp_file_dir, "InstrumentedPrototype")]
    subprocess.run(command, check=True)

# Example usage
# test_cases = [
#     {
#         "user_function": """
# void sumArray(std::vector<int>& arr) {
#     int sum = 0;
#     for (int i = 0; i < arr.size(); ++i) {
#         sum += arr[i];
#     }
# }
# """,
#         "call_template": "p.sumArray($$size$$);"
#     },
#     {
#         "user_function": """
# void findMax(std::vector<int>& arr) {
#     if (arr.empty()) return;
#     int max_val = arr[0];
#     for (int i = 1; i < arr.size(); ++i) {
#         if (arr[i] > max_val) {
#             max_val = arr[i];
#         }
#     }
# }
# """,
#         "call_template": "p.findMax($$size$$);"
#     },
#     {
#         "user_function": """
# void reverseArray(std::vector<int>& arr) {
#     int n = arr.size();
#     for (int i = 0; i < n / 2; ++i) {
#         std::swap(arr[i], arr[n - i - 1]);
#     }
# }
# """,
#         "call_template": "p.reverseArray($$size$$);"
#     },
#     {
#         "user_function": """
# void sortArray(std::vector<int>& arr) {
#     std::sort(arr.begin(), arr.end());
# }
# """,
#         "call_template": "p.sortArray($$size$$);"
#     },
#     {
#         "user_function": """
# void isSorted(std::vector<int>& arr) {
#     for (int i = 1; i < arr.size(); ++i) {
#         if (arr[i] < arr[i - 1]) {
#             return;
#         }
#     }
# }
# """,
#         "call_template": "p.isSorted($$size$$);"
#     }
# ]

# # Running all test cases
# num_inputs = 50
# size_array = [50, 100, 1000]

# for test in test_cases:
#     user_function = test["user_function"]
#     call_template = test["call_template"]
    
#     cpp_code = instrument_cpp_function(user_function, call_template, num_inputs, size_array)
#     write_and_compile_cpp(cpp_code)
#     run_cpp_program()
