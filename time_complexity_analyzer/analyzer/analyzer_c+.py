import platform
import subprocess
import os

def instrument_cpp_function(call, user_function):
    cpp_prolog = """
#include <iostream>
#include <fstream>
#include <chrono>
#include <map>
#include <vector>

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
    void execute() {{
        std::vector<int> array = {{3, 4, 5, 6, 0}};
        {call}
    }}

    void saveResults() {{
        std::ofstream outFile("output.txt");
        for (auto& pair : lineInfoTotal) {{
            outFile << "Line " << pair.first << ": " << pair.second << "ns\\n";
        }}
        outFile.close();
    }}
}};

int main() {{
    InstrumentedPrototype p;
    p.execute();
    p.saveResults();
    return 0;
}}
"""

    instrumented_lines = [cpp_prolog]
    lines = user_function.strip().split('\n')
    closing_brace_index = len(lines) - lines[::-1].index('}') - 1

    # Add function signature
    instrumented_lines.append(lines[0])

    for i, line in enumerate(lines[1:closing_brace_index], start=1):
        if line.strip() and line.strip() != "}":  # Instrument non-empty lines excluding the closing brace
            instrumented_line = f"""
            lineInfoLastStart[{i}] = std::chrono::high_resolution_clock::now();
            {line}
            lineInfoTotal[{i}] += std::chrono::duration_cast<std::chrono::nanoseconds>(std::chrono::high_resolution_clock::now() - getLastLineInfo({i})).count();"""
            instrumented_lines.append(instrumented_line)
        else:
            instrumented_lines.append(line)  # Add line as is for empty lines or other non-code lines

    # Add the closing brace for the function
    instrumented_lines.append('    ' + lines[closing_brace_index])

    instrumented_lines.append(cpp_epilog)

    instrumented_function = "\n".join(instrumented_lines)

    return instrumented_function

# Example usage
call = "mySortFunction(array);"
user_function = """
void mySortFunction(std::vector<int>& array) {
    for (size_t i = 0; i < array.size(); ++i) {
        for (size_t j = i + 1; j < array.size(); ++j) {
            if (array[i] > array[j]) {
                int temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
        }
    }
}
"""
instrumented_code = instrument_cpp_function(call, user_function)

# Determine the file paths
script_dir = os.path.dirname(os.path.realpath(__file__))
cpp_file_name = "InstrumentedPrototype"
cpp_file_path = os.path.join(script_dir, f"{cpp_file_name}.cpp")
executable_path = os.path.join(script_dir, cpp_file_name)

# Save the instrumented code
with open(cpp_file_path, "w") as cpp_file:
    cpp_file.write(instrumented_code)

# Compile the C++ code
compile_command = f"g++ -std=c++14 {cpp_file_path} -o {executable_path}"
subprocess.run(compile_command, shell=True)

# Adjust execution command based on the operating system
if platform.system() == "Windows":
    run_command = f"{executable_path}.exe"
else:
    run_command = f"./{executable_path}"

# Execute the compiled program
subprocess.run(run_command, shell=True)